"use server";

import { db } from "@/db";
import { agentMemories } from "@/db/schema";
import { sql } from "drizzle-orm";
import { z } from "zod";

const memorySchema = z.object({
    content: z.string().min(1, "El contenido no puede estar vacío"),
});

// Dummy embedding generator (Text to numeric vector of 1536 dimensions)
// In a production environment, this would call OpenAI's text-embedding-3-small or Gemini.
function generateDummyEmbedding(text: string): number[] {
    const vector = new Array(1536).fill(0);
    // Just a simple deterministic hash for testing
    for (let i = 0; i < text.length; i++) {
        const charCode = text.charCodeAt(i);
        vector[i % 1536] = (charCode / 255) - 0.5;
    }
    return vector;
}

export async function saveMemory(content: string, tenantId: string) {
    const validated = memorySchema.parse({ content });
    const embedding = generateDummyEmbedding(validated.content);

    return await db.transaction(async (tx) => {
        // AEGIS: Activate RLS context
        await tx.execute(sql`SELECT set_config('app.current_tenant_id', ${tenantId}, true)`);

        return await tx.insert(agentMemories).values({
            tenantId: tenantId,
            content: validated.content,
            // We use raw SQL to insert the vector since Drizzle might not have a native vector type yet
            embedding: sql`${JSON.stringify(embedding)}::vector`,
        }).returning();
    });
}

export async function recallMemories(query: string, tenantId: string) {
    const embedding = generateDummyEmbedding(query);

    return await db.transaction(async (tx) => {
        // AEGIS: Activate RLS context
        await tx.execute(sql`SELECT set_config('app.current_tenant_id', ${tenantId}, true)`);

        // Semantic search using Cosine Distance (<=>) against the HNSW index
        // Note: cosine_distance = 1 - cosine_similarity. Lower is better.
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
