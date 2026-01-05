
"use server";

import { db } from "@/db";
import { tokenUsageLogs, auditTrail } from "@/db/schema";
import { sql, desc } from "drizzle-orm";
import { DashboardDataSchema } from "@/schemas/dashboard";

/**
 * PASO 311: IMPLEMENTACIÓN DE "SERVER ACTIONS" (Tubería Directa)
 * Objetivo: Reducir la superficie de error agéntica.
 */

export async function fetchDashboardMetrics() {
    console.log("🧠 [Server-Action] Fetching neuron-synchronized metrics...");

    try {
        // 1. Calcular gasto total (FinOps)
        const costResult = await db.select({
            total: sql<string>`SUM(CAST(cost_usd AS DECIMAL))`
        }).from(tokenUsageLogs);

        // 2. Contar acciones de auditoría (Seguridad)
        const auditCount = await db.select({
            count: sql<number>`count(*)`
        }).from(auditTrail);

        // 3. Estructurar data según el Contrato (Zod)
        const data = {
            metrics: [
                { label: "Gasto Total", value: `$${Number(costResult[0]?.total || 0).toFixed(2)}`, trend: "up" },
                { label: "Alertas Aegis", value: auditCount[0]?.count || 0, trend: "neutral" },
                { label: "Estado Swarm", value: "ACTIVO", trend: "neutral" }
            ],
            lastUpdate: new Date().toISOString()
        };

        // PASO 312: Validación del contrato antes de enviar
        return DashboardDataSchema.parse(data);
    } catch (e) {
        console.error("❌ [Server-Action] Data fetch failed:", e);
        throw new Error("DASHBOARD_FETCH_ERROR");
    }
}
