
import { GeminiClient } from "../ai/gemini-client";
import fs from "fs";
import path from "path";

/**
 * PHASE 39: LEGADO Y CONTINUIDAD
 * PASO 278: GENERACIÓN DE MANUAL DE OPERACIONES (Self-Documentation)
 */

export class Chronicler {
    static async documentSystem() {
        console.log("✍️ [Chronicler] Documenting system architecture for posterity...");

        const architect = new GeminiClient("gemini-1.5-pro", "CHRONICLER");

        // Scan main lib exports
        const libPath = path.join(process.cwd(), "lib");
        const files = fs.readdirSync(libPath, { recursive: true })
            .filter(f => typeof f === 'string' && f.endsWith(".ts")) as string[];

        const structure = files.join("\n");

        const prompt = `
            Eres el CRONISTA de Fabricaria.
            Basado en esta estructura de archivos:
            ${structure}
            
            Genera un Manual de Operaciones (ARCHITECTURE.md) detallado.
            Explica el propósito de cada sección (security, ai, factory, memory).
            Incluye una sección: "Protocolos de Emergencia".
        `;

        const markdown = await architect.generateContent(prompt, { skipTSIP: true });

        const docsDir = path.join(process.cwd(), "DOCS");
        if (!fs.existsSync(docsDir)) fs.mkdirSync(docsDir);

        fs.writeFileSync(path.join(docsDir, "ARCHITECTURE.md"), markdown);
        console.log("✅ [Chronicler] ARCHITECTURE.md updated.");
    }
}
