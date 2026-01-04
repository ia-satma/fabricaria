
import { db } from "../../db";
import { sql } from "drizzle-orm";

/**
 * RAG RECALL MONITOR (Step 63)
 * Measures "Ignorance Density" to detect when RAG retrieval is failing.
 */

export class RagRecallMonitor {
    private static missCount = 0;
    private static lastReset = Date.now();

    static async trackResponse(response: string) {
        const ignorancePatterns = [
            "no tengo información",
            "no mencionan el contexto",
            "no hay datos suficientes",
            "I don't have information",
            "context does not mention"
        ];

        const isMiss = ignorancePatterns.some(pattern =>
            response.toLowerCase().includes(pattern.toLowerCase())
        );

        if (isMiss) {
            this.missCount++;
            console.warn(`📊 [RAG-Recal] MISS DETECTED (${this.missCount} in current window).`);

            if (this.missCount > 5) {
                console.error("🚨 [RAG-Recall] CRITICAL IGNORANCE DETECTED. RAG is ineffective.");
                console.log("👉 Recommendation: Switch to Context Caching (Mnemosyne-Keeper).");
                // Trigger logic to promote session to HOT_CACHE
            }
        }

        // Reset window every hour
        if (Date.now() - this.lastReset > 3600000) {
            this.missCount = 0;
            this.lastReset = Date.now();
        }
    }
}
