"use server";

import { db } from "@/db";
import { agentMemories } from "@/db/schema";
import { GeminiCacheManager } from "@/lib/ai/gemini-client";
import { cosineDistance, desc, gt, sql } from "drizzle-orm";
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
            embedding: embedding, // Drizzle handles the array -> vector conversion now
        }).returning();
    });
}


export async function searchRelatedContext(userQueryEmbedding: number[], tenantId: string) {
    try {
        // Definimos la similitud usando sql raw para evitar errores de tipado en versiones nuevas de Drizzle
        // La fórmula es: 1 - cosineDistance(vector_col, query_vector)
        const similarity = sql<number>`1 - (${cosineDistance(
            agentMemories.embedding,
            userQueryEmbedding
        )})`;

        return await db.transaction(async (tx) => {
            // AEGIS: Activate RLS context
            await tx.execute(sql`SELECT set_config('app.current_tenant_id', ${tenantId}, true)`);

            const results = await tx
                .select({
                    id: agentMemories.id,
                    content: agentMemories.content,
                    createdAt: agentMemories.createdAt,
                    similarity: similarity,
                })
                .from(agentMemories)
                // Filtramos por umbral de similitud (ej. > 0.5) y ordenamos por relevancia
                .where(gt(similarity, 0.5))
                .orderBy(desc(similarity))
                .limit(5);

            return results;
        });

    } catch (error) {
        console.error("Error buscando contexto vectorial:", error);
        return [];
    }
}

// Keep the old function signature for compatibility if needed, or replace uses.
// For now, based on instructions, I am replacing the file content. 
// I will adapt the old recallMemories to use this new logic or just export searchRelatedContext 
// matching the user's requested signature.

export async function recallMemories(query: string, tenantId: string) {
    const embedding = await GeminiCacheManager.getEmbedding(query);
    // Adapt formatting to match old return style if possible
    return await searchRelatedContext(embedding, tenantId);
}
