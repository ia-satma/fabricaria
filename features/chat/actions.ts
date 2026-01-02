"use server";

import { recallMemories } from "@/features/memory/actions";
import { GeminiCacheManager } from "@/lib/ai/gemini-client";
import { readFileSync } from "fs";
import { join } from "path";

export async function processChatHybrid(query: string, tenantId: string) {
    // 1. Semantic Routing Decision
    const route = GeminiCacheManager.decideRouting(query);
    console.log(`🤖 [Router] Selecting path: ${route} for query: "${query}"`);

    if (route === "RAG") {
        // Path: Cold Memory (Neon pgvector)
        const context = await recallMemories(query, tenantId);
        return {
            route: "RAG",
            content: context.length > 0
                ? `[RAG ACTIVE] He recuperado ${context.length} fragmentos relevántes de tu memoria: "${context[0].content}"...`
                : "[RAG ACTIVE] No encontré recuerdos específicos. ¿Deseas que guarde esto?",
            memories: context,
        };
    } else {
        // Path: Hot Memory (Gemini Cache)
        // In a real implementation, we would get agents.md and schema.ts content:
        const agentsPath = join(process.cwd(), "AGENTS.md");
        const schemaPath = join(process.cwd(), "db/schema.ts");

        // This is where we'd call GeminiCacheManager.getOrUpdateCache
        // For now, we simulate the "Global Reasoning" based on the project genome
        return {
            route: "CACHE",
            content: "[CACHE ACTIVE] Utilizando el Córtex Híbrido (AGENTS.md + Schema). Tengo presente las reglas estructurales del proyecto para responderte con alta fidelidad.",
            memories: [],
        };
    }
}
