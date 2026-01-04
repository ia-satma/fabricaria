
import { GeminiClient } from "../ai/gemini-client";

/**
 * THE BUILDER (Step 78)
 * Role: Expert Developer.
 * Goal: Rapid execution of JSON plans.
 */

export class BuilderAgent {
    private client: GeminiClient;

    constructor() {
        this.client = new GeminiClient("gemini-1.5-flash", "Builder");
    }

    async execute(plan: any): Promise<void> {
        console.log("👷 [Builder] Executing implementation plan...");

        const systemPrompt = `
Eres un Desarrollador Experto y Eficiente. Recibes un PLAN JSON de un Arquitecto.
Tu única tarea es escribir el código necesario para cumplir ese plan.

REGLAS:
1. No inventes funcionalidades nuevas.
2. Sigue estrictamente .agent/rules.
3. Escribe archivos completos, no diffs.
4. Usa gemini-1.5-flash para maximizar velocidad y reducir costo.
`;

        await this.client.generateContent(\`\${systemPrompt}\n\nPLAN A EJECUTAR: \${JSON.stringify(plan)}\`, {
            thinkingLevel: "MINIMAL" // Fast execution
        } as any);
        
        console.log("✅ [Builder] Implementation complete.");
    }
}
