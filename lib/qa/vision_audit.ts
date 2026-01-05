
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

/**
 * PASO 248: ANÁLISIS DE DIFERENCIAL SEMÁNTICO (Gemini 3 Vision)
 * Objetivo: Juzgar el 'Vibe' y encontrar desviaciones visuales exactas.
 */

export interface VisionAuditResult {
    score: number; // 0-1 (LPIPS equivalent)
    diffs: string[];
    fixProposal?: {
        targetId: string;
        cssChanges: string;
    };
}

export class VisualAuditor {
    private model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    async audit(figmaPath: string, screenshotPath: string): Promise<VisionAuditResult> {
        console.log("👁️ [Visual-Auditor] Phase 29: Conducting Semantic Audit...");

        const figmaBase64 = fs.readFileSync(figmaPath, { encoding: 'base64' });
        const screenshotBase64 = fs.readFileSync(screenshotPath, { encoding: 'base64' });

        const prompt = `
            Eres un QA Visual experto en Pixel-Perfect y Aesthetics.
            Compara la imagen de REFERENCIA (Figma) con la CAPTURA REAL.
            
            1. Analiza márgenes, fuentes, colores y espaciado.
            2. Genera una lista de discrepancias semánticas.
            3. Si encuentras un error, propón un arreglo en Tailwind.
            
            Responde exclusivamente en este formato JSON:
            {
                "score": 0.95, 
                "diffs": ["El botón tiene 8px menos de padding superior", "La fuente no es Inter"],
                "fixProposal": { "targetId": "main-button", "cssChanges": "pt-4 font-inter" }
            }
        `;

        const result = await this.model.generateContent([
            prompt,
            { inlineData: { data: figmaBase64, mimeType: "image/png" } },
            { inlineData: { data: screenshotBase64, mimeType: "image/png" } }
        ]);

        try {
            const text = result.response.text();
            const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
            return JSON.parse(cleaned);
        } catch (e) {
            console.error("❌ [Visual-Auditor] Failed to parse vision results.", e);
            throw e;
        }
    }
}
