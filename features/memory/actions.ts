"use server";

import { db } from "@/db";
import { agentMemories } from "@/db/schema";
import { GeminiCacheManager } from "@/lib/ai/gemini-client";
import { sql } from "drizzle-orm";
import { z } from "zod";

const memorySchema = z.object({
    content: z.string().min(1, "El contenido no puede estar vacío"),
});

export async function saveMemory(content: string, tenantId: string) {
    const validated = memorySchema.parse({ content });

    // Generate real embedding (768 dimensions)
    const embedding = await GeminiCacheManager.getEmbedding(validated.content);

    return await db.transaction(async (tx) => {
        // AEGIS: Activate RLS context
        await tx.execute(sql`SELECT set_config('app.current_tenant_id', ${tenantId}, true)`);

        return await tx.insert(agentMemories).values({
            tenantId: tenantId,
            content: validated.content,
            // Insert vector using raw SQL
            embedding: sql`${JSON.stringify(embedding)}::vector`,
        }).returning();
    });
}

export async function recallMemories(query: string, tenantId: string) {
    // Generate query embedding
    const embedding = await GeminiCacheManager.getEmbedding(query);

    return await db.transaction(async (tx) => {
        // AEGIS: Activate RLS context
        await tx.execute(sql`SELECT set_config('app.current_tenant_id', ${tenantId}, true)`);

        // Semantic search using Cosine Distance (<=>)
        // We limit to top 5 relevant memories
        const results = await tx.execute(sql`
      SELECT id, content, created_at, 
      (embedding <=> ${JSON.stringify(embedding)}::vector) as distance
      FROM agent_memories
      ORDER BY distance ASC
      LIMIT 5
    `);

        return results.rows;
    });
}
