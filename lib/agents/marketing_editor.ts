
import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * PASO 387: AUDITORÍA DE TONO Y SENTIMIENTO (El Editor Crítico)
 * Objetivo: Evaluar y mejorar el contenido para que sea más conversacional y humano.
 */

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

export interface EditorialReview {
    score: number;
    engagement: number;
    suggestions: string;
    revisedParagraphs?: Record<string, string>;
}

export class MarketingEditor {
    private systemPrompt = `
        Eres el Editor Crítico de Fabricaria.
        Tu trabajo es actuar como "Juez de Contenido".
        
        CRITERIOS DE EVALUACIÓN:
        1. Humanidad: ¿Suena a robot o a un experto apasionado?
        2. Enganche: ¿Atrapa desde el primer párrafo?
        3. Claridad Industrial: ¿Es preciso técnicamente pero accesible?
    `;

    async audit(content: string): Promise<EditorialReview> {
        const prompt = `
            Evalúa el siguiente texto del 1 al 10 en 'Humanidad' y 'Enganche'.
            Si alguno de los dos es < 8, sugiere mejoras o reescribe fragmentos débiles.
            
            Responde en formato JSON:
            {
                "score": number,
                "engagement": number,
                "suggestions": "string",
                "revisedParagraphs": { "original": "nuevo", ... }
            }
            
            TEXTO:
            ${content}
        `;

        const result = await model.generateContent([this.systemPrompt, prompt]);
        const responseText = result.response.text();

        try {
            return JSON.parse(responseText.replace(/```json|```/g, "").trim());
        } catch (e) {
            console.error("Failed to parse EditorialReview JSON", responseText);
            throw new Error("Invalid Editorial Audit Response");
        }
    }
}
