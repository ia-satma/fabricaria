
import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * PASO 386: EL MOTOR DE REUTILIZACIÓN (Content Repurposing)
 * Objetivo: Maximizar el ROI transformando posts en formatos de redes sociales.
 */

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

export interface RepurposedContent {
    twitterThread: string[];
    linkedInPost: string;
    newsletterHook: string;
}

export class ContentRepurposer {
    private systemPrompt = `
        Eres un Estratega de Redes Sociales especializado en tecnología industrial.
        Tu objetivo es destilar artículos complejos en formatos virales de alta calidad.
    `;

    async repurpose(articleMarkdown: string): Promise<RepurposedContent> {
        const prompt = `
            Transforma este artículo en:
            1. Un hilo de Twitter/X (máximo 5 tweets).
            2. Un post de LinkedIn profesional y provocativo.
            3. Un asunto y hook para un correo electrónico.
            
            Responde en formato JSON:
            {
                "twitterThread": ["tweet1", "tweet2", ...],
                "linkedInPost": "string",
                "newsletterHook": "string"
            }
            
            ARTÍCULO:
            ${articleMarkdown}
        `;

        const result = await model.generateContent([this.systemPrompt, prompt]);
        const responseText = result.response.text();

        try {
            return JSON.parse(responseText.replace(/```json|```/g, "").trim());
        } catch (e) {
            console.error("Failed to parse RepurposedContent JSON", responseText);
            throw new Error("Invalid Repurposing Response");
        }
    }
}
