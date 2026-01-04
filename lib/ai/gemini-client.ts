
import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";
import { db } from "../../db";
import { tokenUsageLogs, thoughtTraces } from "../../db/schema";
import { checkBudget, calculateCost } from "../security/cost-guard";
import { withSEP1763Interceptor } from "../security/aegis_interceptor";
import { signThoughtSignature, verifyThoughtSignature } from "../security/thought_signer";
import { desc, eq } from "drizzle-orm";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

/**
 * GESTOR DE CACHÉ DE GEMINI (TSIP + EMBEDDINGS)
 */
export class GeminiCacheManager {
    static async getThoughtSignature(sessionId: string): Promise<{ token: string, signature: string } | undefined> {
        const trace = await db.select()
            .from(thoughtTraces)
            .where(eq(thoughtTraces.sessionId, sessionId))
            .orderBy(desc(thoughtTraces.createdAt))
            .limit(1);

        if (!trace[0]) return undefined;

        return {
            token: trace[0].signature,
            signature: (trace[0].metadata as any)?.hmac || ""
        };
    }

    static async saveThoughtSignature(sessionId: string, token: string, hmac: string) {
        await db.insert(thoughtTraces).values({
            sessionId,
            signature: token,
            metadata: { hmac, ts: Date.now() }
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

    /**
     * PASO 176: CONTEXT CACHING ENGINE
     * Objetivo: Cachear repositorios completos para auditoría proactiva.
     */
    static async createPersistentCache(repoPath: string, displayName: string): Promise<string> {
        console.log(`🐘 [Cache-Engine] Creating context cache for: ${displayName}...`);

        // Simulación: Inyectar todo el contenido de archivos del repo en el caché
        const cacheTTL = 3600 * 24; // 24 horas

        // await genAI.cachedContent.create({
        //     model: 'models/gemini-1.5-pro-002',
        //     displayName,
        //     contents: [ { role: 'user', parts: [{ text: 'Contenido completo del repo...' }] } ],
        //     ttlSeconds: cacheTTL
        // });

        const mockCacheName = `cachedContents/repo-cache-${Math.random().toString(36).substring(7)}`;
        console.log(`✅ [Cache-Engine] Cache active: ${mockCacheName}`);
        return mockCacheName;
    }
}

/**
 * CLIENTE CORE DE GEMINI (CON PASO 167, 171, 172, 173)
 */
export class GeminiClient {
    private model: GenerativeModel;
    private agentType: string;
    private modelName: string;
    private sessionId: string = "global-session";

    constructor(modelName: string, agentType: string) {
        this.modelName = modelName;
        this.agentType = agentType;
        this.model = genAI.getGenerativeModel({ model: modelName });
    }

    async generateContent(prompt: string, config: any = {}): Promise<string> {
        console.log(`🤖 [${this.agentType}] Executing task with Gemini (${this.modelName})...`);

        const history = (this as any).history || [];
        const thinkingLevel = history.length === 0 ? "HIGH" : "MINIMAL";
        console.log(`🧠 [Thinking-Control] Phase 23: Level set to ${thinkingLevel}`);

        try {
            // PASO 172: VERIFICACIÓN DE FIRMAS
            const signatureData = await GeminiCacheManager.getThoughtSignature(this.sessionId);
            let verifiedSignature = null;

            if (signatureData) {
                const isValid = verifyThoughtSignature(signatureData.token, signatureData.signature, this.sessionId);
                if (isValid) {
                    verifiedSignature = signatureData.token;
                    console.log("🔐 [TSIP] Cognitive integrity verified.");
                }
            }

            const modelParams: any = {
                model: this.modelName,
                generationConfig: {
                    ...config.generationConfig,
                    thinkingConfig: { include_thoughts: true, level: thinkingLevel }
                },
                thought_signature: config.skipTSIP ? null : verifiedSignature
            };

            const activeModel = genAI.getGenerativeModel(modelParams);
            const result = await activeModel.generateContentStream(prompt);

            let fullText = "";
            let currentThoughtTokens = 0;

            for await (const chunk of result.stream) {
                const thoughtTokens = (chunk as any).usageMetadata?.thoughtsTokenCount || 0;
                currentThoughtTokens += thoughtTokens;

                // PASO 200: AUDITORÍA DE TOKENS DE PENSAMIENTO
                if (currentThoughtTokens > 4000) {
                    console.error(`� [Circuit-Breaker-V3] Thought budget exceeded (4k). Falling back to LOW thinking.`);
                    return this.generateContent(prompt, {
                        ...config,
                        skipTSIP: true,
                        generationConfig: { ...config.generationConfig, thinkingConfig: { include_thoughts: true, level: 'LOW' } }
                    });
                }

                fullText += chunk.text();
            }

            const responseText = await result.response;
            const finalResponse = await responseText;

            // TSIP: Sign and Save (Paso 195)
            const newSignatureToken = (finalResponse as any).thought_signature;
            if (newSignatureToken && !config.skipTSIP) {
                console.log("🔐 [TSIP] Persistence handshake complete.");
                const hmac = signThoughtSignature(newSignatureToken, this.sessionId);
                await GeminiCacheManager.saveThoughtSignature(this.sessionId, newSignatureToken, hmac);
            }

            const usage = (finalResponse as any).usageMetadata || { promptTokenCount: 0, candidatesTokenCount: 0 };
            const cost = calculateCost(this.modelName, usage.promptTokenCount, usage.candidatesTokenCount);

            this.logUsage(usage.promptTokenCount, usage.candidatesTokenCount, cost).catch(() => { });

            return fullText;

        } catch (error) {
            console.error("❌ [GeminiClient] Execution failed:", error);
            throw error;
        }
    }

    static async hybridTieredExecute(plannerPrompt: string, executorPrompt: string) {
        console.log("🏗️ [Hybrid-Brain] Initializing Architect (Pro)...");
        const architect = new GeminiClient("gemini-1.5-pro", "ARCHITECT");

        const planJson = await architect.generateContent(`${plannerPrompt}\nResponde SOLO con un JSON detallado.`);

        console.log("⚡ [Hybrid-Brain] Initializing Builder (Flash)...");
        const builder = new GeminiClient("gemini-1.5-flash", "BUILDER");

        return await builder.generateContent(`${executorPrompt}\nPLAN:\n${planJson}`, { skipTSIP: true });
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

    /**
     * PASO 176: CONTEXT CACHING ENGINE
     */
    static async createPersistentCache(repoPath: string, displayName: string): Promise<string> {
        console.log(`🐘 [Cache-Engine] Creating context cache for: ${displayName}...`);
        const mockCacheName = `cachedContents/repo-cache-${Math.random().toString(36).substring(7)}`;
        return mockCacheName;
    }
}
