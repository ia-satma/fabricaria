
import { db } from "../../db";
import { sql } from "drizzle-orm";

/**
 * FEEDBACK LOOP DEL USUARIO (Step 142)
 * Objetivo: RLHF Lite (Captura de señales de satisfacción).
 */

export async function recordFeedback(interactionId: string, score: 1 | -1, comment?: string) {
    console.log(`👍👎 [Feedback] Interaction ${interactionId}: ${score === 1 ? 'Positive' : 'Negative'}`);

    try {
        // En un sistema real, guardaríamos esto en una tabla de 'interactions_feedback'
        // Simulamos el almacenamiento
        await db.execute(sql`
            UPDATE token_usage_logs 
            SET metadata = jsonb_set(metadata, '{feedback}', ${JSON.stringify({ score, comment, at: new Date().toISOString() })})
            WHERE id::text = ${interactionId}
        `);

        console.log("✅ [Feedback] signal captured for optimization.");
    } catch (e) {
        console.error("❌ [Feedback] Failed to record signal:", e);
    }
}
