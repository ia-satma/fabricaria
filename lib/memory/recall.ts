
import { db } from "../../db";
import { agentMemories } from "../../db/schema";
import { GeminiCacheManager } from "../ai/gemini-client";
import { sql } from "drizzle-orm";

/**
 * EPISODIC MEMORY RECALL (Step 75)
 * Retrieves similar past contexts using vector similarity.
 */

export async function recallSimilarContext(query: string, agentRole: string, limit: number = 5) {
    console.log(`🧠 [Memory-Recall] Searching for memories related to: "${query.substring(0, 50)}..."`);

    try {
        // 1. Generate embedding for the query
        const queryEmbedding = await GeminiCacheManager.getEmbedding(query);

        // 2. Search in agent_memories using vector similarity
        // Note: Drizzle-orm doesn't natively support pgvector operators in all dialects yet, 
        // so we use a raw SQL template for the cosine distance.
        const memoryQuery = sql`
            SELECT content, agent_role, created_at, (embedding <=> ${JSON.stringify(queryEmbedding)}::vector) as distance
            FROM agent_memories
            WHERE agent_role = ${agentRole}
            ORDER BY distance ASC
            LIMIT ${limit}
        `;

        const results = await db.execute(memoryQuery);

        const memories = results.rows.map((row: any) => ({
            content: row.content,
            role: row.agent_role,
            distance: row.distance
        }));

        console.log(`✅ [Memory-Recall] Found ${memories.length} relevant memories.`);
        return memories;

    } catch (error) {
        console.error("❌ [Memory-Recall] Retrieval failed:", error);
        return [];
    }
}

/**
 * Prompt Augmentation Hook
 */
export function formatMemoriesForPrompt(memories: any[]) {
    if (memories.length === 0) return "";

    return `
### RECUERDOS RELEVANTES (Memoria Episódica):
${memories.map((m, i) => `[Memoria ${i + 1}] (${m.role}): ${m.content}`).join("\n")}
--------------------------------------------------
`;
}
