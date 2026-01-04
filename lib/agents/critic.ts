
import { GeminiClient } from "../ai/gemini-client";

/**
 * THE CRITIC (Step 79)
 * Role: Hostile QA Auditor.
 * Goal: Score implementation and find vulnerabilities.
 */

export class CriticAgent {
    private client: GeminiClient;

    constructor() {
        // High reasoning needed for auditing
        this.client = new GeminiClient("gemini-1.5-pro", "Critic");
    }

    async audit(code: string, plan: any): Promise<{ score: number, feedback: string[] }> {
        console.log("🧐 [Critic] Auditing code implementation...");

        const systemPrompt = `
Eres un Auditor de Código hostil. Tu trabajo es encontrar vulnerabilidades, bugs o violaciones de estilo.
Revisa el código basándote en el PLAN original y las .agent/rules.

REGLAS DE REVISIÓN:
1. PII: ¿Hay secretos o llaves filtradas?
2. Estructura: ¿Cumple con FSD Lite?
3. Lógica: ¿Se resolvió el requerimiento del Arquitecto?

SALIDA ESPERADA (JSON):
{
  "score": number, // 1-10 (10 es perfecto)
  "feedback": ["string"] // Lista de errores o mejoras
}
`;

        const response = await this.client.generateContent(\`\${systemPrompt}\n\nPLAN: \${JSON.stringify(plan)}\n\nCÓDIGO:\n\${code}\`, {
            responseMimeType: "application/json"
        } as any);

        return JSON.parse(response);
    }
}
