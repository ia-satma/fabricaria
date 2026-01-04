
import { db } from "../../db";
import { sql } from "drizzle-orm";

/**
 * EL CONSERJE DE DATOS (Step 137)
 * Objetivo: Limpieza de memorias antiguas y reindexación HNSW.
 */

async function runCleanup() {
    console.log("🧹 [Janitor] Starting vector garbage collection...");

    try {
        // Borrar memorias de más de 30 días
        const result = await db.execute(sql`
            DELETE FROM agent_memories 
            WHERE created_at < NOW() - INTERVAL '30 days'
        `);

        console.log("✅ [Janitor] Expired memories evicted.");

        // Optimizar índice HNSW (Postgres HNSW requiere reindex si hay mucho churn)
        console.log("⚙️ [Janitor] Reindexing HNSW for performance...");
        await db.execute(sql`REINDEX INDEX CONCURRENTLY agent_memories_embedding_idx;`);

        console.log("✨ [Janitor] Vector mind is sharp and clean.");

    } catch (e) {
        console.error("❌ [Janitor] Cleanup failed:", e);
    }
}

runCleanup();
