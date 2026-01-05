
import { GeminiClient } from "../ai/gemini-client";
import { db } from "../../db";
import { auditTrail, tokenUsageLogs } from "../../db/schema";
import { sql, desc } from "drizzle-orm";

/**
 * PHASE 38: DIPLOMACIA CORPORATIVA
 * PASO 275: EL EMBAJADOR (Human Status Reports)
 */

export class Ambassador {
    static async generateDailyReport() {
        console.log("🤵 [Ambassador] Compiling professional status report...");

        // 1. Fetch technical achievement data
        const recentActions = await db.select()
            .from(auditTrail)
            .orderBy(desc(auditTrail.createdAt))
            .limit(20);

        // 2. Fetch financial data
        const financialData = await db.select({
            total: sql<string>`SUM(CAST(${tokenUsageLogs.costUsd} AS DECIMAL))`
        })
            .from(tokenUsageLogs)
            .where(sql`${tokenUsageLogs.createdAt} > NOW() - INTERVAL '24 hours'`);

        // 3. Summarize via Gemini (Diplomatic Tone)
        const reporter = new GeminiClient("gemini-1.5-flash", "AMBASSADOR");
        const prompt = `
            Actúa como el EMBAJADOR de Fabricaria para el CEO.
            Genera un RESUMEN EJECUTIVO (Markdown) basado en:
            Acciones Técnicas: ${JSON.stringify(recentActions)}
            Gasto 24h: $${financialData[0]?.total || 0}
            
            Usa secciones: "Logros Principales", "Eficiencia Operativa" y "Próximos Pasos".
            Tono: Profesional, ejecutivo, optimista.
        `;

        const report = await reporter.generateContent(prompt, { skipTSIP: true });
        console.log("✅ [Ambassador] Report generated successfully.");
        return report;
    }
}
