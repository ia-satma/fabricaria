"use server";

import { recallMemories } from "@/features/memory/actions";
import { GeminiCacheManager } from "@/lib/ai/gemini-client";
import { SemanticRouter } from "@/lib/ai/router";
import { readFileSync } from "fs";
import { join } from "path";

export async function processChatHybrid(query: string, tenantId: string, sessionId: string) {
    // 1. Semantic Routing Decision
    const decision = SemanticRouter.routeQuery(query);
    const route = decision.route;

    // 2. TSIP: Dynamic Thinking Level logic (Simulated for protocol)
    const lastSignature = GeminiCacheManager.getThoughtSignature(sessionId);
    const thinkingLevel = lastSignature ? "MINIMAL" : "HIGH";

    console.log(`🤖 [Router] Decision: ${route} | Reason: ${decision.reason} | Session: ${sessionId}`);

    if (route === "RAG") {
        // Path: Cold Memory (Neon pgvector)
        console.log(`❄️ [Cold Memory] Querying Vector Database...`);
        const context = await recallMemories(query, tenantId);

        // In TSIP flow, we would pass the lastSignature to the model
        // For now, we return the context found

        const memoryText = context.map((m: any) => `[${m.created_at}] ${m.content}`).join("\n");

        return {
            route: "RAG",
            thinkingLevel,
            content: context.length > 0
                ? `[RAG ACTIVE] Encontré estos recuerdos relevantes:\n${memoryText}`
                : `[RAG ACTIVE] No encontré información específica sobre eso en tu memoria a largo plazo.`,
            memories: context,
            // Mock new signature for next turn
            thoughtSignature: "thought_sig_" + Math.random().toString(36).substring(7),
        };
    } else {
        // Path: Hot Memory (Gemini Cache)
        console.log(`🔥 [Hot Memory] Checking Context Cache...`);

        // Mock large context for demo purposes (would be actual conversation history)
        const mockGenome = "Contexto completo del sistema...";
        const cacheName = await GeminiCacheManager.getOrUpdateCache(mockGenome);

        return {
            route: "CACHE",
            thinkingLevel,
            content: `[CACHE ACTIVE] He activado mi Córtex Híbrido ${cacheName ? '(Cache: ' + cacheName + ')' : '(Cache Miss/Low-Volume)'}. Estoy listo para un análisis profundo.`,
            memories: [],
            thoughtSignature: "thought_sig_" + Math.random().toString(36).substring(7),
        };
    }
}

export async function saveThoughtSignatureAction(sessionId: string, signature: string) {
    GeminiCacheManager.saveThoughtSignature(sessionId, signature);
}
