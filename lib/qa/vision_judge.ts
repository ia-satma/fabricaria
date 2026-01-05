
import { GeminiClient } from "../ai/gemini-client";

/**
 * PHASE 44: EL OJO DE LA PROVIDENCIA
 * PASO 315, 317: Juez Estético y Artefacto de Verificación.
 */

export interface VisualIssue {
    location: { x: number; y: number };
    issue: string;
    suggested_fix: string;
}

export interface VerificationArtifact {
    status: "PASS" | "FAIL";
    discrepancies: VisualIssue[];
    vibeScore: number;
}

export class VisionJudge {
    static async evaluateUI(screenshot: Buffer): Promise<VerificationArtifact> {
        console.log("👁️ [Vision-Judge] Evaluating UI aesthetic and alignment...");

        const vision = new GeminiClient("gemini-1.5-flash", "VISUAL_QA");

        const prompt = `
            Actúa como un Diseñador UI Sénior y Auditor de Calidad.
            Analiza esta captura de pantalla de la interfaz "Fabricaria".
            
            REGLAS DE AUDITORÍA:
            1. Consistencia: ¿Usa los colores de la marca (Neon Cyan)?
            2. Alineación: ¿Hay elementos desalineados o pegados a los bordes?
            3. Vibe: ¿Se siente "Cyberpunk Corporativo" y "Premium"?
            
            Responde EXCLUSIVAMENTE con un JSON que siga esta estructura:
            {
              "status": "PASS" | "FAIL",
              "discrepancies": [{ "location": {"x": 0, "y": 0}, "issue": "string", "suggested_fix": "string" }],
              "vibeScore": 0-100
            }
            
            No incluyas explicaciones fuera del JSON.
        `;

        const response = await vision.visionAudit(screenshot, prompt);

        try {
            // Limpiar response si trae markdown fences
            const cleanJson = response.replace(/```json|```/g, "").trim();
            return JSON.parse(cleanJson);
        } catch (e) {
            console.error("❌ [Vision-Judge] Failed to parse judge response:", response);
            return { status: "FAIL", discrepancies: [], vibeScore: 0 };
        }
    }
}
