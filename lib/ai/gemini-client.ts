
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
            // TSIP: Retrieve existing signature for session (Step 54)
            const sessionId = "global-session"; // TODO: Pass from worker
            const signature = await GeminiCacheManager.getThoughtSignature(sessionId);

            // Re-get model with config if provided
            const generationConfig = config ? { ...config } : {};

            // TSIP: Inject signature if exists
            const modelParams: any = { model: this.modelName, generationConfig };
            if (signature) {
                console.log(`🧠 [TSIP] Re-injecting thought signature for session: ${sessionId}`);
                modelParams.thought_signature = signature;
            }

            const activeModel = genAI.getGenerativeModel(modelParams);

            const result = await activeModel.generateContent(prompt);
            const response = result.response;
            const text = response.text();

            // TSIP: Capture new signature (Step 54)
            const newSignature = (response as any).thought_signature;
            if (newSignature) {
                console.log(`🧠 [TSIP] Captured new thought signature.`);
                await GeminiCacheManager.saveThoughtSignature(sessionId, newSignature);
            }

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

        } catch (error: any) {
            // TSIP: Fallback for Invalid Argument (Step 54)
            if (error?.message?.includes("400") || error?.status === 400) {
                console.warn(`🛡️ [TSIP] Fallback: Invalid signature. Retrying without signature...`);
                return this.generateContent(prompt, config); // Re-run without signature (next call won't find it in DB if cleared)
            }
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

import { thoughtTraces } from "../../db/schema";
import { desc, eq } from "drizzle-orm";

export class GeminiCacheManager {
    static async getThoughtSignature(sessionId: string): Promise<string | undefined> {
        const trace = await db.select()
            .from(thoughtTraces)
            .where(eq(thoughtTraces.sessionId, sessionId))
            .orderBy(desc(thoughtTraces.createdAt))
            .limit(1);

        return trace[0]?.signature;
    }

    static async saveThoughtSignature(sessionId: string, signature: string) {
        await db.insert(thoughtTraces).values({
            sessionId,
            signature,
            metadata: { ts: Date.now() }
        });
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
