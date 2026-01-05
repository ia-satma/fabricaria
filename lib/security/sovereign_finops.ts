
import { db } from "../../db";
import { projectLedger, tokenUsageLogs } from "../../db/schema";
import { eq, sql, desc } from "drizzle-orm";

/**
 * PHASE 37: SOBERANÍA FINANCIERA (FinOps Autónomo)
 * PASO 271, 272, 273: Ledger, Arbitraje y Anomaly Detection.
 */

export class SovereignFinOps {
    private static BURN_RATE_LIMIT = 2.0; // $2.00 per 5 min

    /**
     * PASO 272: ARBITRAJE DE MODELOS EN TIEMPO REAL
     */
    static async routeModel(task: string, balance: number): Promise<string> {
        const difficulty = this.estimateDifficulty(task);

        if (balance < 0.50) {
            console.warn("📉 [Arbitrage] Critically low balance. Forcing Flash model.");
            return "gemini-1.5-flash";
        }

        if (difficulty === "COMPLEX") {
            return "gemini-1.5-pro";
        }

        return "gemini-1.5-flash";
    }

    /**
     * PASO 273: DETECCIÓN DE "QUEMA DE DINERO" (Kill Switch)
     */
    static async checkBurnRate(tenantId: string): Promise<boolean> {
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

        const recentExpenses = await db.select({
            total: sql<string>`SUM(CAST(${tokenUsageLogs.costUsd} AS DECIMAL))`
        })
            .from(tokenUsageLogs)
            .where(sql`${tokenUsageLogs.tenantId} = ${tenantId} AND ${tokenUsageLogs.createdAt} > ${fiveMinutesAgo}`);

        const burnAmount = Number(recentExpenses[0]?.total || 0);

        if (burnAmount > this.BURN_RATE_LIMIT) {
            console.error(`🚨 [FinOps] MONEY BURN DETECTED: $${burnAmount} in 5 min. TRIGGERING KILL SWITCH.`);
            return false;
        }

        return true;
    }

    /**
     * PASO 271: LA BILLETERA DEL PROYECTO (Deduct or Audit)
     */
    static async getProjectBalance(tenantId: string): Promise<number> {
        const ledger = await db.select()
            .from(projectLedger)
            .where(eq(projectLedger.tenantId, tenantId))
            .limit(1);

        if (!ledger[0]) {
            // Initialize if missing
            await db.insert(projectLedger).values({
                projectId: "global-project",
                tenantId: tenantId as any,
                creditBalance: "10.00"
            });
            return 10.00;
        }

        return Number(ledger[0].creditBalance);
    }

    private static estimateDifficulty(task: string): "SIMPLE" | "COMPLEX" {
        const complexKeywords = ["refactor", "architect", "security", "bridge", "protocol", "audit"];
        return complexKeywords.some(k => task.toLowerCase().includes(k)) ? "COMPLEX" : "SIMPLE";
    }
}
