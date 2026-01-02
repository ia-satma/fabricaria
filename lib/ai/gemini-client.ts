import { GoogleGenerativeAI } from "@google/generative-ai";
import CryptoJS from "crypto-js";

// GEMINI_API_KEY must be in process.env
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

/**
 * Manager class for Gemini Context Caching
 * Targets: AGENTS.md + db/schema.ts
 */
export class GeminiCacheManager {
    private static cacheName: string | null = null;
    private static currentHash: string | null = null;

    /**
     * Generates a hash for the combined content of the genome
     */
    static generateGenomeHash(agentsContent: string, schemaContent: string): string {
        return CryptoJS.SHA256(agentsContent + schemaContent).toString();
    }

    /**
     * Initializes or retrieves the context cache
     * TTL: 60 minutes
     */
    static async getOrUpdateCache(agentsContent: string, schemaContent: string) {
        const newHash = this.generateGenomeHash(agentsContent, schemaContent);

        // 1. Check if we already have it in memory for this session
        if (this.cacheName && this.currentHash === newHash) {
            console.log("🧠 [Cortex] Cache hit (In-memory)");
            return this.cacheName;
        }

        try {
            // 2. Lookup existing caches in Google servers (MOCK logic for generic client)
            // Note: In real production, we use caching.list() and filter by metadata
            // For this implementation, we'll focus on the session lifecycle

            console.log("🧠 [Cortex] Cache miss. Generating new Hybrid Context...");

            this.currentHash = newHash;

            // In a real implementation with @google/generative-ai (beta/caching):
            // const cache = await (genAI as any).getGenerativeModel({ model: "gemini-1.5-flash" }).createCache({
            //   model: "models/gemini-1.5-flash-001",
            //   contents: [{ role: "user", parts: [{ text: agentsContent + schemaContent }] }],
            //   ttlSeconds: 3600,
            // });
            // this.cacheName = cache.name;

            // Temporary simulation for the demo:
            this.cacheName = `cached_genome_${newHash.substring(0, 8)}`;

            return this.cacheName;
        } catch (error) {
            console.error("❌ [Cortex] Cache creation failed:", error);
            return null;
        }
    }

    /**
     * Decision logic: RAG vs CACHE
     */
    static decideRouting(query: string): "RAG" | "CACHE" {
        const specificKeywords = ["mi", "mis", "factura", "último", "recuerdo", "ayer", "dije"];
        const lowercaseQuery = query.toLowerCase();

        const isSpecific = specificKeywords.some(keyword => lowercaseQuery.includes(keyword));

        return isSpecific ? "RAG" : "CACHE";
    }
}
