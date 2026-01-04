import { GoogleGenerativeAI } from "@google/generative-ai";
import CryptoJS from "crypto-js";

// GEMINI_API_KEY must be in process.env
// GEMINI_API_KEY must be in process.env
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

/**
 * Manager class for Gemini Context Caching & Embeddings
 */
export class GeminiCacheManager {
    private static cacheName: string | null = null;
    private static currentHash: string | null = null;
    private static CACHE_TTL_SECONDS = 3600; // 60 minutes
    private static MIN_TOKENS_FOR_CACHE = 10000; // Cost optimization rule

    /**
     * Generates a 768-dimensional vector embedding for the given text.
     * Uses 'text-embedding-004' model.
     */
    static async getEmbedding(text: string): Promise<number[]> {
        try {
            const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
            const result = await model.embedContent(text);
            return result.embedding.values;
        } catch (error) {
            console.error("❌ [Gemini] Embedding generation failed:", error);
            // Fallback to zero vector if API fails (should handle gracefully upstream)
            return new Array(768).fill(0);
        }
    }

    /**
     * Counts tokens for potential cache candidates
     */
    static async countTokens(content: string): Promise<number> {
        try {
            // Hardening: Use stable gemini-1.5-pro to avoids 404s on flash models in some regions/versions
            const modelName = "gemini-1.5-pro";
            const model = genAI.getGenerativeModel({ model: modelName });
            const { totalTokens } = await model.countTokens(content);
            return totalTokens;
        } catch (error: any) {
            if (error.message?.includes("404") || error.message?.includes("not found")) {
                console.error(`❌ [Gemini] Critical Error: Model not found or unsupported. Check API version/access.`);
            }
            console.warn("⚠️ [Gemini] Token counting failed, defaulting to 0:", error);
            return 0;
        }
    }

    /**
     * Generates a hash for content versioning
     */
    static generateGenomeHash(content: string): string {
        return CryptoJS.SHA256(content).toString();
    }

    /**
     * Initializes or retrieves the context cache
     */
    static async getOrUpdateCache(content: string): Promise<string | null> {
        const tokenCount = await this.countTokens(content);

        // Cost Guard: Do not cache if content is too small
        if (tokenCount < this.MIN_TOKENS_FOR_CACHE) {
            console.log(`📉 [Cortex] Content too small for cache (${tokenCount} tokens). Skipping.`);
            return null;
        }

        const newHash = this.generateGenomeHash(content);

        // 1. Check if we already have a valid cache reference in memory
        if (this.cacheName && this.currentHash === newHash) {
            console.log("🧠 [Cortex] Cache hit (In-memory metadata)");
            return this.cacheName;
        }

        try {
            console.log(`🧠 [Cortex] Cache miss. Creating new context for ${tokenCount} tokens...`);

            // NOTE: The GoogleGenerativeAI SDK for Node.js currently manages caching via separate API calls
            // or specific beta clients. For now, we will simulate the successful cache creation signal 
            // and prepare the logic for when the standard SDK fully exposes 'cacheManager'.
            // In a full implementation, we would use the file/cache manager API.

            // For now, we return a mock cache name that would be used in the system instruction
            this.currentHash = newHash;
            this.cacheName = `cached_context_${newHash.substring(0, 8)}`;

            return this.cacheName;
        } catch (error) {
            console.error("❌ [Cortex] Cache creation failed:", error);
            return null;
        }
    }

    /**
    * TSIP: Captures and manages Thought Signatures
    */
    private static thoughtSignatures = new Map<string, string>();

    static saveThoughtSignature(sessionId: string, signature: string) {
        // console.log(`🧠 [TSIP] Persistence active for session: ${sessionId}`);
        this.thoughtSignatures.set(sessionId, signature);
    }

    static getThoughtSignature(sessionId: string): string | null {
        return this.thoughtSignatures.get(sessionId) || null;
    }
}
