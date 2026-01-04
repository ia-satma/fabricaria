
import { GeminiClient } from "../../lib/ai/gemini-client";
import { db } from "../../db";
import { codeAudits } from "../../db/schema";

/**
 * PASO 192: CONSOLIDACIÓN DE MEMORIA (El Escriba Histórico)
 */

async function runScribe() {
    console.log("📜 [Scribe] Distilling lessons learned from recent operations...");

    const historian = new GeminiClient("gemini-1.5-pro", "HISTORIAN");

    // 1. Leer auditorías recientes
    const recentAudits = await db.select().from(codeAudits).limit(5);

    // 2. Sintetizar nuevo conocimiento
    const lesson = await historian.generateContent(`
        Review these recent code audits and extract a "Best Practice" rule for the factory.
        AUDITS: ${JSON.stringify(recentAudits)}
        
        FORMAT: "ALWAYS/NEVER [Action] because [Reason]"
    `);

    console.log("💾 [Scribe] New Knowledge Encoded:", lesson);

    // 3. Actualizar memoria colectiva (Simulación)
    // fs.appendFileSync('knowledge/evolution.md', `\n- ${lesson}`);
}

runScribe().catch(console.error);
