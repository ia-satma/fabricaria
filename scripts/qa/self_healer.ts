
import fs from 'fs';
import { GeminiClient } from '../../lib/ai/gemini-client';

/**
 * EL AGENTE DE AUTO-CURACIÓN (Step 132)
 * Objetivo: Analizar fallos de tests y proponer parches automáticos.
 */

export async function selfHeal(testError: string, sourceFile: string) {
    console.log(`🩹 [Self-Healer] Attempting to heal ${sourceFile}...`);

    const client = new GeminiClient("gemini-1.5-flash", "SELF_HEALER");
    const sourceContent = fs.readFileSync(sourceFile, 'utf8');

    const prompt = `
El siguiente archivo ha fallado en un test.
ERROR: ${testError}
ARCHIVO: ${sourceFile}
CONTENIDO:
${sourceContent}

Analiza el error y genera un parche exacto para corregir el problema.
Responde solo con el código corregido completo.
`;

    try {
        const correctedCode = await client.generateContent(prompt);
        fs.writeFileSync(sourceFile, correctedCode);
        console.log(`✅ [Self-Healer] Patch applied to ${sourceFile}. Rerunning tests...`);
        return true;
    } catch (e) {
        console.error("❌ [Self-Healer] Failed to generate patch:", e);
        return false;
    }
}
