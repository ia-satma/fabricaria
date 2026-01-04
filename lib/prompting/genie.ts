
import { GeminiClient } from "../ai/gemini-client";

/**
 * EL GENIE INTERNO (Step 122)
 * Goal: Meta-prompting to expand vague requests into technical PRDs.
 */

export class InternalGenie {
    private client: GeminiClient;

    constructor() {
        this.client = new GeminiClient("gemini-1.5-flash", "PROMPT_GENIE");
    }

    async refine(userPrompt: string): Promise<string> {
        console.log("🧞 [Internal-Genie] Refining user intent...");

        const systemPrompt = `
Eres un Experto en Meta-Prompting. Tu objetivo es transformar una solicitud vaga en una especificación técnica precisa.
Estructura tu salida con:
- **STACK**: Librerías exactas.
- **SCHEMAS**: Definición de datos (Zod).
- **CONSTRAINTS**: Reglas de negocio.
- **SUCCESS_CRITERIA**: Cómo sabemos que funciona.

SOLICITUD: ${userPrompt}
`;

        const refined = await this.client.generateContent(`${systemPrompt}\n\nREFINA ESTO: ${userPrompt}`);
        console.log("✅ [Internal-Genie] Intent expanded.");
        return refined;
    }
}
