
import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * PASO 381: EL AGENTE "MASTERMIND" DE CONTENIDO
 * Objetivo: Generar contenido estratégico y estructurado.
 */

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

export interface ContentPlan {
    topic: string;
    targetAudience: string;
    keyPoints: string[];
    tone: string;
    structure: string[];
}

export class MarketingMastermind {
    private systemPrompt = `
        Eres un Editor Jefe de Tecnología con 15 años de experiencia en Fabricaria.
        Tu misión es liderar la estrategia de contenido del proyecto "Soberanía de Fabricación Agéntica".
        
        RESTRICCIONES:
        - No uses clichés corporativos ("aprovechar", "sinergia", "en el mundo de hoy").
        - Usa datos duros y un tono industrial-cibernético premium.
        - Antes de escribir cualquier artículo, DEBES generar un esquema estructurado en JSON.
        - Todo el contenido debe alinearse con la ética AEGIS (Seguridad, Soberanía, Ética).
    `;

    async planContent(topic: string): Promise<ContentPlan> {
        const prompt = `
            Planifica un artículo estratégico sobre: "${topic}".
            Responde ÚNICAMENTE con un objeto JSON válido que siga esta interfaz:
            {
                "topic": string,
                "targetAudience": string,
                "keyPoints": string[],
                "tone": string,
                "structure": string[]
            }
        `;

        const result = await model.generateContent([this.systemPrompt, prompt]);
        const responseText = result.response.text();

        try {
            return JSON.parse(responseText.replace(/```json|```/g, "").trim());
        } catch (e) {
            console.error("Failed to parse ContentPlan JSON", responseText);
            throw new Error("Invalid Mastermind Planning Response");
        }
    }

    async writeArticle(plan: ContentPlan): Promise<string> {
        const prompt = `
            Basado en este plan, escribe el artículo final en Markdown:
            ${JSON.stringify(plan, null, 2)}
            
            Asegúrate de que la prosa sea afilada, profesional y convincente.
        `;

        const result = await model.generateContent([this.systemPrompt, prompt]);
        return result.response.text();
    }
}
