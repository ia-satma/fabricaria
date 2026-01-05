
import { db } from "../../db";
import { sql } from "drizzle-orm";

/**
 * PASO 283: COMPACTACIÓN DE ÍNDICES EN NEON (Mantenimiento DB)
 * Objetivo: Optimizar la búsqueda vectorial (ANN) reindexando HNSW.
 */

export async function optimizeVectorIndexes() {
    console.log("🗜️ [DB-Ops] Optimizing HNSW indexes for agent memories...");

    try {
        // Ejecución concurrente para no bloquear escrituras
        await db.execute(sql`
            REINDEX INDEX CONCURRENTLY agent_memories_embedding_idx;
        `);

        await db.execute(sql`
            REINDEX INDEX CONCURRENTLY learned_patterns_embedding_idx;
        `);

        console.log("✅ [Success] All vector indexes compacted and optimized.");
    } catch (e) {
        console.warn("⚠️ [Warning] Concurrent reindex failed or not supported in this environment. Falling back to targeted VACUUM.");
        await db.execute(sql`VACUUM (ANALYZE) agent_memories;`);
        await db.execute(sql`VACUUM (ANALYZE) learned_patterns;`);
    }
}

if (require.main === module) {
    optimizeVectorIndexes().catch(console.error);
}
