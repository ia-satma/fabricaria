
import { db } from "../../db";
import { tokenUsageLogs } from "../../db/schema";
import { sql } from "drizzle-orm";

/**
 * TABLERO DE CONTROL FINANCIERO (Step 123)
 * Goal: Unit Economics per Task/Session.
 */

export interface UnitEconomics {
    totalCost: number;
    tokensIn: number;
    tokensOut: number;
    efficiency: number; // Cost per 1k outputs
}

export class FinOpsManager {
    static async calculateTaskCost(agentType: string): Promise<UnitEconomics> {
        console.log(`📊 [FinOps] Calculating Unit Economics for ${agentType}...`);

        const results = await db.select({
            totalInput: sql<number>`sum(input_tokens)`,
            totalOutput: sql<number>`sum(output_tokens)`,
            totalCost: sql<number>`sum(cost_usd::numeric)`
        })
            .from(tokenUsageLogs)
            .where(sql`agent_type = ${agentType}`);

        const row = results[0];
        const cost = Number(row?.totalCost || 0);
        const outputs = Number(row?.totalOutput || 1);

        return {
            totalCost: cost,
            tokensIn: Number(row?.totalInput || 0),
            tokensOut: outputs,
            efficiency: (cost / outputs) * 1000
        };
    }

    static async reportTask(agentType: string) {
        const stats = await this.calculateTaskCost(agentType);
        console.log(`💰 [Unit-Economics] Tarea: ${agentType}`);
        console.log(`   - Costo Total: $${stats.totalCost.toFixed(4)}`);
        console.log(`   - Eficiencia: $${stats.efficiency.toFixed(6)} per 1k tokens`);
    }
}
