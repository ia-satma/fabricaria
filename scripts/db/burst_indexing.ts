
import { db } from "../../db";
import { sql } from "drizzle-orm";

/**
 * PASO 198: INDEXACIÓN "BURST" EN NEON
 * Objetivo: Configurar la base de datos para ingestión masiva mediante auto-escalado.
 */
export async function enableBurstIndexing(tableName: string, columnName: string) {
    console.log(`🚀 [Neon-Burst] Phase 26: Triggering HNSW scaling for ${tableName}...`);

    // Forzamos al optimizador de Neon a escalar para el proceso de indexación
    await db.execute(sql`SET maintenance_work_mem = '4GB'`);

    // Crear índice HNSW (pesado pero rápido para RAG)
    await db.execute(sql`
        CREATE INDEX IF NOT EXISTS idx_${sql.raw(tableName)}_${sql.raw(columnName)}_hnsw 
        ON ${sql.raw(tableName)} 
        USING hnsw (${sql.raw(columnName)} vector_cosine_ops)
        WITH (m = 16, ef_construction = 64);
    `);

    console.log("✅ [Neon-Burst] HNSW Indexing complete. System will auto-scale down in 5m.");
}

export async function resetMaintenanceMemory() {
    await db.execute(sql`RESET maintenance_work_mem`);
    console.log("🧊 [Neon-Burst] Maintenance memory reset to defaults.");
}
