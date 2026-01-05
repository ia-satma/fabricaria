
import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * PASO 389: PRUEBAS A/B DE COPYWRITING (Prompt Optimizer)
 * Objetivo: Mejorar la conversión mediante variaciones científicas del copy.
 */

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

export interface ABVariation {
    id: string;
    headline: string;
    subheadline: string;
    persona: string;
}

export class ABTestingEngine {
    async generateVariations(baseGoal: string): Promise<ABVariation[]> {
        const prompt = `
            Genera dos variaciones de copy para una landing page de: "${baseGoal}".
            Variación A: Tono "Vendedor Agresivo / Directo".
            Variación B: Tono "Consultor Empático / Basado en Valor".
            
            Responde en formato JSON:
            [
                { "id": "variation-a", "headline": "string", "subheadline": "string", "persona": "A" },
                { "id": "variation-b", "headline": "string", "subheadline": "string", "persona": "B" }
            ]
        `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        try {
            return JSON.parse(responseText.replace(/```json|```/g, "").trim());
        } catch (e) {
            console.error("Failed to parse ABVariations JSON", responseText);
            throw new Error("Invalid AB Testing Response");
        }
    }

    promoteWinner(stats: Record<string, number>): string {
        const winner = Object.keys(stats).reduce((a, b) => stats[a] > stats[b] ? a : b);
        console.log(`🏆 [AB-Test] Promoting Winner: ${winner} based on conversion metrics.`);
        return winner;
    }
}
