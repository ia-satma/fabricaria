
import { db } from "../../db";
import { sql } from "drizzle-orm";

/**
 * PASO 343: INGESTA "BURST" PARA RAG (Neon Postgres)
 * Objetivo: Acelerar la indexación vectorial escalando verticalmente solo durante el 'hot ingestion'.
 */
export class NeonScalingManager {
    /**
     * Prepara Neon para una ingesta masiva de vectores HNSW.
     */
    static async enableBurstMode() {
        console.log("🏎️🗄️ [Neon-Burst] Step 343: Enabling vertical scaling parameters for HNSW indexing...");

        try {
            await db.execute(sql`SET maintenance_work_mem = '4GB'`);
            await db.execute(sql`SET max_parallel_maintenance_workers = 4`);
            console.log("✅ [Neon-Burst] Burst mode active. Neon will scale for indexing tasks.");
        } catch (error) {
            console.warn("⚠️ [Neon-Burst] Failed to set session parameters. Proceeding with defaults.", error);
        }
    }

    /**
     * Restablece los parámetros de Neon tras finalizar la ingesta.
     */
    static async resetToNormal() {
        console.log("🏙️ [Neon-Burst] Resetting session parameters to normal levels...");
        try {
            await db.execute(sql`RESET maintenance_work_mem`);
            await db.execute(sql`RESET max_parallel_maintenance_workers`);
            console.log("✅ [Neon-Burst] System normalcy restored.");
        } catch (error) {
            console.error("❌ [Neon-Burst] Error resetting parameters:", error);
        }
    }
}
