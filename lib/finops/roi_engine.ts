
import { db } from "../../db";
import { tokenUsageLogs } from "../../db/schema";
import { sql } from "drizzle-orm";

/**
 * PASO 292: EL TABLERO DE ROI EN TIEMPO REAL
 */

export class ROIEngine {
    static async calculateROI(taskId: string, perceivedValueUsd: number) {
        console.log(`💹 [ROI] Analyzing economic impact of task: ${taskId}`);

        const costResult = await db.select({
            total: sql<string>`SUM(CAST(${tokenUsageLogs.costUsd} AS DECIMAL))`
        })
            .from(tokenUsageLogs)
            .where(sql`metadata->>'taskId' = ${taskId}`);

        const actualCost = Number(costResult[0]?.total || 0);
        const roi = (perceivedValueUsd - actualCost) / actualCost;

        console.log(`📊 [ROI] Value: $${perceivedValueUsd} | Cost: $${actualCost} | ROI: ${(roi * 100).toFixed(2)}%`);

        return {
            profitable: roi > 0,
            roi,
            actualCost
        };
    }
}
