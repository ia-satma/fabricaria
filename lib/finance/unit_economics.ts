
import { db } from "../../db";
import { tokenUsageLogs } from "../../db/schema";
import { sql } from "drizzle-orm";

/**
 * TABLERO DE CONTROL FINANCIERO & UNIT ECONOMICS (Step 123, 140)
 * Goal: Unit Economics per Task/Session + Usage Ledger.
 */

export interface UnitEconomics {
    totalCost: number;
    tokensIn: number;
    tokensOut: number;
    efficiency: number; // Cost per 1k outputs
}

export class FinOpsManager {
    /**
     * GESTIÓN FINANCIERA POR UNIDAD (Step 140)
     * Graba el uso de tokens y costo en el ledger por tenant.
     */
    static async recordUsage(tenantId: string, tokensInput: number, tokensOutput: number, metadata: any = {}) {
        const cost = (tokensInput * 0.00015 / 1000) + (tokensOutput * 0.0006 / 1000); // Prices for Gemini Flash
        console.log(`💰 [FinOps] Recording usage for ${tenantId}: $${cost.toFixed(6)}`);

        try {
            await db.execute(sql`
                INSERT INTO token_usage_logs (tenant_id, input_tokens, output_tokens, cost, metadata)
                VALUES (${tenantId}, ${tokensInput}, ${tokensOutput}, ${cost}, ${JSON.stringify(metadata)})
            `);
        } catch (e) {
            console.error("❌ [FinOps] Failed to record usage ledger:", e);
        }
    }

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
