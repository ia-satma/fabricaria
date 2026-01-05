
import fs from 'fs';
import path from 'path';
import { GeminiClient } from '../ai/gemini-client';

/**
 * PASO 202: LA MEMORIA DEL PROYECTO (AGENTS.md Dinámico)
 * Objetivo: Evolucionar el contexto del sistema basado en hitos.
 */
export class PromptOptimizer {
    private agentsPath = path.join(process.cwd(), 'AGENTS.md');

    async logAchievement(task: string, decision: string) {
        console.log(`📝 [Prompt-Optimizer] Recording achievement: ${task}`);

        const update = `\n- **Hito**: ${task}\n- **Decisión**: ${decision}\n- **Fecha**: ${new Date().toISOString()}\n`;

        fs.appendFileSync(this.agentsPath, update);
        console.log("✅ [Prompt-Optimizer] AGENTS.md updated.");
    }

    async logAntiPattern(failure: string, constraint: string) {
        console.log(`⚠️ [Prompt-Optimizer] Recording anti-pattern: ${failure}`);

        const update = `\n- **FALLO DETECTADO**: ${failure}\n- **NUEVA REGLA (CONSTRAIN)**: ${constraint}\n- **Fecha**: ${new Date().toISOString()}\n`;

        fs.appendFileSync(this.agentsPath, update);
        console.log("🚫 [Prompt-Optimizer] AGENTS.md updated with protective rule.");
    }

    async getOptimizedContext(): Promise<string> {
        if (!fs.existsSync(this.agentsPath)) return "";
        return fs.readFileSync(this.agentsPath, 'utf8');
    }
}

export const promptOptimizer = new PromptOptimizer();
