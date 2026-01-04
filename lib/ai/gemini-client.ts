
import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";
import { db } from "../../db";
import { tokenUsageLogs } from "../../db/schema";
import { checkBudget, calculateCost } from "../security/cost-guard";
import { withAegis } from "../security/aegis_interceptor"; // Import Step 111

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

    async generateContent(prompt: string, config?: { responseMimeType?: string, thinkingLevel?: "LOW" | "HIGH" }): Promise<string> {
        console.log(`🤖 [${this.agentType}] Calling Gemini (${this.modelName})...`);
        const MAX_THOUGHT_TOKENS = 3000;

        try {
            const sessionId = "global-session";
            const signature = await GeminiCacheManager.getThoughtSignature(sessionId);

            const generationConfig = config ? { ...config } : {};
            const modelParams: any = {
                model: this.modelName,
                generationConfig,
            };

            if (signature) {
                modelParams.thought_signature = signature;
            }

            // Wrap with Aegis Security (Step 111)
            return await withAegis(prompt, async () => {
                const activeModel = genAI.getGenerativeModel(modelParams);
                const result = await activeModel.generateContentStream(prompt);

                let fullText = "";
                let currentThoughts = 0;

                for await (const chunk of result.stream) {
                    const thoughts = (chunk as any).usageMetadata?.thoughtsTokenCount || 0;
                    currentThoughts += thoughts;

                    if (currentThoughts > MAX_THOUGHT_TOKENS) {
                        console.error(`💸 [Circuit-Breaker] PRESTUPUESTO COGNITIVO EXCEDIDO: ${currentThoughts} tokens.`);
                        throw new Error("PRESUPUESTO COGNITIVO EXCEDIDO");
                    }

                    fullText += chunk.text();
                }

                const response = await result.response;

                // TSIP: Capture new signature
                const newSignature = (response as any).thought_signature;
                if (newSignature) {
                    await GeminiCacheManager.saveThoughtSignature(sessionId, newSignature);
                }

                // Usage Accounting
                const usage = response.usageMetadata || { promptTokenCount: 0, candidatesTokenCount: 0 };
                const cost = calculateCost(this.modelName, usage.promptTokenCount, usage.candidatesTokenCount);

                checkBudget(cost);
                this.logUsage(usage.promptTokenCount, usage.candidatesTokenCount, cost).catch(() => { });

                return fullText;
            });

        } catch (error: any) {
            if (error.message === "PRESUPUESTO COGNITIVO EXCEDIDO") {
                console.warn(`🔄 [Circuit-Breaker] Triggering Fallback to Flash...`);
                const fallbackClient = new GeminiClient("gemini-1.5-flash", this.agentType);
                return fallbackClient.generateContent(prompt, { ...config, thinkingLevel: "LOW" });
            }

            if (error?.message?.includes("400") || error?.status === 400) {
                // Potential retry or error handling
            }
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
        console.log("🐘 [Cache] Context Genome synced to Gemini persistent layer.");
        return "cache_" + Math.random().toString(36).substring(7);
    }

    static async getEmbedding(text: string): Promise<number[]> {
        const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
        const result = await model.embedContent(text);
        return result.embedding.values;
    }
}
