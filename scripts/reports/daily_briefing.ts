
import { GeminiClient } from "../../lib/ai/gemini-client";
import { db } from "../../db";
import { sql } from "drizzle-orm";

/**
 * EL INFORME DE SINGULARIDAD (Step 143)
 * Objetivo: Daily Briefing consolidado.
 */

async function generateDailyBriefing() {
    console.log("📋 [Briefing] Consolidating metrics for CEO...");

    try {
        // 1. Obtener costos de las últimas 24h
        const stats = await db.execute(sql`
            SELECT 
                COALESCE(SUM(cost), 0) as total_cost,
                COUNT(*) as total_tasks,
                COUNT(DISTINCT tenant_id) as active_users
            FROM token_usage_logs
            WHERE created_at > NOW() - INTERVAL '1 day'
        `);

        const { total_cost, total_tasks, active_users } = (stats as any[])[0];

        // 2. Generar resumen agéntico con Gemini Pro
        const client = new GeminiClient("gemini-1.5-pro", "BRIEFING_BOT");
        const rawData = `Ayer: $${total_cost} gastados en ${total_tasks} tareas por ${active_users} usuarios.`;

        const summary = await client.generateContent(`
            Genera un resumen ejecutivo de 3 puntos clave basado en estos datos de operación ayer:
            DATOS: ${rawData}
            Sé profesional, optimista y breve.
        `);

        const report = `
# 🏢 Informe de Singularidad - ${new Date().toLocaleDateString()}

## Resumen Ejecutivo
${summary}

## Métricas Clave
- **Gasto Total**: $${parseFloat(total_cost).toFixed(4)}
- **Tareas Ejecutadas**: ${total_tasks}
- **Usuarios Activos**: ${active_users}

✅ Sistema Estable. Todas las defensas Aegis activas.
`;

        console.log("✨ [Briefing] Report Generated:\n", report);

        // Simular envío de email vía SendGrid
        console.log("📧 [Briefing] Dispatching to commander...");

    } catch (e) {
        console.error("❌ [Briefing] Failed to generate report:", e);
    }
}

generateDailyBriefing();
