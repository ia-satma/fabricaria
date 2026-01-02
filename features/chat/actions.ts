"use server";

import { recallMemories } from "@/features/memory/actions";
import { GeminiCacheManager } from "@/lib/ai/gemini-client";
import { readFileSync } from "fs";
import { join } from "path";

export async function processChatHybrid(query: string, tenantId: string, sessionId: string) {
    // 1. Semantic Routing Decision
    const route = GeminiCacheManager.decideRouting(query);

    // 2. TSIP: Dynamic Thinking Level logic
    const lastSignature = GeminiCacheManager.getThoughtSignature(sessionId);
    const thinkingLevel = lastSignature ? "MINIMAL" : "HIGH";

    console.log(`🤖 [Router] Path: ${route} | Thinking: ${thinkingLevel} | Session: ${sessionId}`);

    if (route === "RAG") {
        // Path: Cold Memory (Neon pgvector)
        const context = await recallMemories(query, tenantId);

        // In TSIP flow, we would pass the lastSignature to the model
        // const response = await genAI.generateContent({ ..., thoughtSignature: lastSignature });

        return {
            route: "RAG",
            thinkingLevel,
            content: context.length > 0
                ? `[RAG ACTIVE] [TSIP: ${thinkingLevel}] He recuperado ${context.length} fragmentos de tu memoria: "${context[0].content}"...`
                : `[RAG ACTIVE] [TSIP: ${thinkingLevel}] No encontré recuerdos específicos.`,
            memories: context,
            // Mock new signature for next turn
            thoughtSignature: "thought_sig_" + Math.random().toString(36).substring(7),
        };
    } else {
        // Path: Hot Memory (Gemini Cache)
        return {
            route: "CACHE",
            thinkingLevel,
            content: `[CACHE ACTIVE] [TSIP: ${thinkingLevel}] Utilizando el Córtex Híbrido. La continuidad cognitiva está garantizada.`,
            memories: [],
            thoughtSignature: "thought_sig_" + Math.random().toString(36).substring(7),
        };
    }
}

export async function saveThoughtSignatureAction(sessionId: string, signature: string) {
    GeminiCacheManager.saveThoughtSignature(sessionId, signature);
}
