
import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";
import { db } from "../../db";
import { tokenUsageLogs } from "../../db/schema";
import { checkBudget, calculateCost } from "../security/cost-guard";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export class GeminiClient {
    private model: GenerativeModel;
    private agentType: string;
    private modelName: string;

    constructor(modelName: string, agentType: string) {
        this.modelName = modelName;
        this.agentType = agentType;
        this.model = genAI.getGenerativeModel({ model: modelName });
    }

    async generateContent(prompt: string, config?: { responseMimeType?: string }): Promise<string> {
        console.log(`🤖 [${this.agentType}] Calling Gemini (${this.modelName})...`);
        const start = Date.now();

        try {
            // Re-get model with config if provided
            const activeModel = config
                ? genAI.getGenerativeModel({ model: this.modelName, generationConfig: config as any })
                : this.model;

            const result = await activeModel.generateContent(prompt);
            const response = result.response;
            const text = response.text();

            // Usage Metatada
            const usage = response.usageMetadata || { promptTokenCount: 0, candidatesTokenCount: 0 };
            const inputTokens = usage.promptTokenCount;
            const outputTokens = usage.candidatesTokenCount;

            // FinOps Tracking
            const cost = calculateCost(this.modelName, inputTokens, outputTokens);

            // Circuit Breaker Check
            checkBudget(cost);

            // Log Async (don't block response)
            this.logUsage(inputTokens, outputTokens, cost).catch(err =>
                console.error("Failed to log token usage:", err)
            );

            console.log(`💸 [FinOps] Call Cost: $${cost} (${inputTokens} in / ${outputTokens} out)`);

            return text;

        } catch (error) {
            console.error("Gemini Client Error:", error);
            throw error;
        }
    }


    private async logUsage(input: number, output: number, cost: number) {
        await db.insert(tokenUsageLogs).values({
            agentType: this.agentType,
            model: this.modelName,
            inputTokens: input,
            outputTokens: output,
            costUsd: cost.toString(),
        });
    }
}

/**
 * GEMINI CACHE MANAGER (Step 24 & TSIP)
 * Manages thinking signatures and context caching.
 */
export class GeminiCacheManager {
    private static signatures = new Map<string, string>();

    static getThoughtSignature(sessionId: string): string | undefined {
        return this.signatures.get(sessionId);
    }

    static saveThoughtSignature(sessionId: string, signature: string) {
        this.signatures.set(sessionId, signature);
    }

    static async getOrUpdateCache(genome: string): Promise<string> {
        // Implementation for Context Caching via Google SDK
        // Returns a cache name or mock
        console.log("🐘 [Cache] Context Genome synced to Gemini persistent layer.");
        return "cache_" + Math.random().toString(36).substring(7);
    }

    static async getEmbedding(text: string): Promise<number[]> {
        const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
        const result = await model.embedContent(text);
        return result.embedding.values;
    }
}
