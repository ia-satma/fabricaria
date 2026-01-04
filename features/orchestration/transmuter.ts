
import { GeminiClient } from "../../lib/ai/gemini-client";

/**
 * TRANSMUTACIÓN DE ESTADO (Step 115)
 * Goal: Pro-Flash collaboration via JSON artifacts.
 */

export class Transmuter {
    private architect: GeminiClient;
    private builder: GeminiClient;

    constructor() {
        this.architect = new GeminiClient("gemini-1.5-pro", "ARCHITECT");
        this.builder = new GeminiClient("gemini-1.5-flash", "BUILDER");
    }

    async orchestrate(rawUserRequest: string) {
        console.log("🧠 [Transmuter] Phase 1: Deep Planning (Architect)...");

        const planningPrompt = `
Analiza la siguiente solicitud y genera un Plan de Implementación técnico detallado en formato JSON.
NO escribas código final todavía.
Estructura:
{
  "summary": "...",
  "files": [
    { "path": "...", "action": "CREATE|MODIFY", "description": "..." }
  ],
  "steps": ["..."]
}

SOLICITUD: ${rawUserRequest}
`;

        const planJson = await this.architect.generateContent(planningPrompt, { responseMimeType: "application/json" });

        console.log("⚡ [Transmuter] Phase 2: Transmutation (Serializing thought)...");
        // We bypass the thought_signature incompatibility by passing only the clean plan to the builder.

        console.log("👷 [Transmuter] Phase 3: Rapid Execution (Builder)...");
        const executionPrompt = `
Eres un Constructor de Software. Implementa el siguiente plan técnico de forma rápida y eficiente.
PLAN: ${planJson}
`;

        return await this.builder.generateContent(executionPrompt, { thinkingLevel: "LOW" });
    }
}
