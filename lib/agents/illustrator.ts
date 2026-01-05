
import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * PASO 383: GENERACIÓN DE ACTIVOS VISUALES
 * Objetivo: Crear imágenes únicas y consistentes para posts y landings.
 */

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

export class IllustratorAgent {
    private systemPrompt = `
        Eres el Director de Arte de Fabricaria.
        Tu estilo es "Cyber-Industrial Premium": Minimalista, futurista, con toques de cian neón sobre fondos oscuros y texturas de metal cepillado.
        
        TU TAREA:
        1. Recibir un título o tema de artículo.
        2. Generar un prompt altamente detallado para un generador de imágenes (DALL-E 3 / Midjourney).
        3. El prompt debe evocar soberanía técnica y precisión agéntica.
    `;

    async generateImagePrompt(contentTitle: string): Promise<string> {
        const prompt = `
            Genera un prompt de imagen para el artículo: "${contentTitle}".
            Asegúrate de incluir detalles sobre iluminación (edge lighting), composición (regla de tercios) y materiales (quantum glass, polished titanium).
            No incluyas texto en la imagen.
        `;

        const result = await model.generateContent([this.systemPrompt, prompt]);
        return result.response.text();
    }
}
