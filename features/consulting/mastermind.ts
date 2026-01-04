
import { GeminiClient } from "../../lib/ai/gemini-client";

/**
 * PASO 185: EL MASTERMIND CONSULTOR (Brain of the Meta-Corp)
 * Algoritmo: Tree of Thoughts (ToT) para arquitectura de software.
 */

export class MastermindConsultant {
    private architect: GeminiClient;

    constructor() {
        this.architect = new GeminiClient("gemini-1.5-pro", "MASTERMIND");
    }

    async consult(idea: string): Promise<string> {
        console.log("🧠 [Mastermind] Starting Tree of Thoughts architectural exploration...");

        // 1. Generar 3 Aproximaciones (Paso 185)
        const approaches = await this.architect.generateContent(`
            Task: Propose 3 different architectural approaches for: "${idea}".
            Include: Pros, Cons, and estimated infra cost for each.
            Respond in JSON array: [{ "name": "...", "description": "...", "pros": [], "cons": [], "cost": "..." }]
        `);

        // 2. Criticar Aproximaciones
        console.log("🧠 [Mastermind] Evaluating and criticizing approaches...");
        const criticism = await this.architect.generateContent(`
            Review these 3 architectures and find fatal flaws or security risks in each:
            ${approaches}
        `);

        // 3. Seleccionar y Expandir
        console.log("🧠 [Mastermind] Selecting winner and generating AGENTS.md...");
        const finalBlueprint = await this.architect.generateContent(`
            Based on the initial approaches and the subsequent criticism, select the most robust one.
            Generate a full AGENTS.md configuration.
            APPROACHES: ${approaches}
            CRITICISM: ${criticism}
        `);

        return finalBlueprint;
    }
}

export const mastermind = new MastermindConsultant();
