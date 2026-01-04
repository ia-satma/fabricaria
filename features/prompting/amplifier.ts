
import { GeminiClient } from "../../lib/ai/gemini-client";

/**
 * THE AMPLIFIER (Step 86)
 * Role: Prompt Genie.
 * Goal: Expand raw intent into technical specs.
 */

export class PromptAmplifier {
    private client: GeminiClient;

    constructor() {
        this.client = new GeminiClient("gemini-1.5-flash", "Prompter");
    }

    async amplify(rawPrompt: string): Promise<string> {
        console.log("🧠 [Mastermind] Generating PRD for:", rawPrompt.substring(0, 50));

        const systemPrompt = `
Eres el "Mastermind". Tu tarea es transformar una intención vaga en un PRD (Product Requirements Document) completo.
Debes reescribir la sección @Context de AGENTS.md.
Campos Obligatorios:
1. **Objetivo del Sprint**
2. **Entregables Técnicos**
3. **Puntos de Riesgo**
4. **Validación de Éxito**

Output: Markdown puro para AGENTS.md.
`;

        const amplified = await this.client.generateContent(`${systemPrompt}\n\nSOLICITUD: ${rawPrompt}`);
        return amplified;
    }
}
