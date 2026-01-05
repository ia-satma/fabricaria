
import { db } from "../../db";
import { tokenUsageLogs } from "../../db/schema";
import { sql, eq, sum } from "drizzle-orm";

/**
 * PASO 270: GESTIÓN DE COSTOS "EFFORT-BASED" (FinOps)
 */

export class FinOpsMonitor {
    private static MAX_TASK_BUDGET = 2.0; // $2.00 USD limit per session

    static async auditSessionCost(tenantId: string): Promise<boolean> {
        console.log(`💸 [FinOps] Auditing budget for tenant: ${tenantId}`);

        const result = await db.select({
            totalCost: sum(sql`CAST(${tokenUsageLogs.costUsd} AS DECIMAL)`)
        })
            .from(tokenUsageLogs)
            .where(eq(tokenUsageLogs.tenantId, tenantId));

        const currentCost = Number(result[0]?.totalCost || 0);

        if (currentCost > this.MAX_TASK_BUDGET) {
            console.error(`🚨 [FinOps] Budget exceeded: $${currentCost}. Triggering Kill Switch.`);
            return false;
        }

        console.log(`✅ [FinOps] Current session cost: $${currentCost}. Within limits.`);
        return true;
    }
}
