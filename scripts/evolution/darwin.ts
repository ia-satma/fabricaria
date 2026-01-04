
import { GeminiClient } from "../../lib/ai/gemini-client";
import fs from 'fs';
import path from 'path';

/**
 * EL PROTOCOLO DARWIN (Step 135)
 * Objetivo: Auto-evolución de reglas basadas en errores.
 */

async function evolveRules() {
    console.log("🧬 [Darwin] Starting evolutionary cycle...");

    const logPath = path.join(process.cwd(), 'qa_report.json');
    if (!fs.existsSync(logPath)) return;

    const logs = JSON.parse(fs.readFileSync(logPath, 'utf8'));
    if (logs.status === "PASS") {
        console.log("🧬 [Darwin] System is stable. No new pressure for evolution.");
        return;
    }

    const client = new GeminiClient("gemini-1.5-pro", "EVOLUTION_ENGINE");
    const rulesPath = path.join(process.cwd(), '.agent/rules');
    const currentRules = fs.existsSync(rulesPath) ? fs.readFileSync(rulesPath, 'utf8') : "";

    const prompt = `
Actúa como Ingeniero de Mejora Continua.
ERRORES DETECTADOS:
${JSON.stringify(logs.errorsFound, null, 2)}

REGLAS ACTUALES:
${currentRules}

Genera UNA regla de oro nueva que hubiera prevenido estos errores. 
Sé conciso y sigue el formato: "- [Regla]: [Explicación]".
Responde SOLO con la nueva regla.
`;

    try {
        const newRule = await client.generateContent(prompt);
        console.log(`✨ [Darwin] New rule evolved: ${newRule}`);

        fs.appendFileSync(rulesPath, `\n# Evolved by Darwin Protocol (${new Date().toLocaleDateString()})\n${newRule}\n`);
        console.log("✅ [Darwin] Procedure memory updated.");

    } catch (e) {
        console.error("❌ [Darwin] Evolution failed:", e);
    }
}

evolveRules();
