
import fs from "fs";
import path from "path";
import { GeminiClient } from "../ai/gemini-client";

/**
 * PASO 266: EL BUCLE DE AUTO-EVOLUCIÓN (Sistemas Autoevolutivos)
 * Objetivo: Reescribir el System Prompt basado en fallos repetidos.
 */

export class EvolutionEngine {
    private static AGENTS_FILE = path.join(process.cwd(), "AGENTS.md");

    static async analyzeFailure(error: string, context: string) {
        console.log("🧬 [Evolution] Phase 33: Initiating self-correction analysis...");

        const architect = new GeminiClient("gemini-1.5-pro", "EVOLUTION_ARCHITECT");

        const prompt = `
            Eres el núcleo evolutivo de Fabricaria. 
            Un agente ha fallado con el siguiente error: "${error}"
            Contexto de la ejecución: ${context}
            
            Analiza si este fallo requiere una nueva REGLA GLOBAL para evitar que se repita.
            Si es así, escribe la regla en formato bullet point de Markdown.
            
            Responde EXCLUSIVAMENTE con la regla o "NONE" si no es necesaria.
        `;

        const newRule = await architect.generateContent(prompt, { skipTSIP: true });

        if (newRule.trim() !== "NONE") {
            await this.injectRule(newRule.trim());
        }
    }

    private static async injectRule(rule: string) {
        console.log(`📝 [Evolution] Injecting new evolutionary rule: ${rule}`);

        let content = "";
        if (fs.existsSync(this.AGENTS_FILE)) {
            content = fs.readFileSync(this.AGENTS_FILE, "utf8");
        }

        const sectionHeader = "## Evolutionary Rules (Self-Generated)";
        if (!content.includes(sectionHeader)) {
            content += `\n\n${sectionHeader}\n`;
        }

        content += `- ${rule} (Added: ${new Date().toISOString()})\n`;
        fs.writeFileSync(this.AGENTS_FILE, content);
    }
}
