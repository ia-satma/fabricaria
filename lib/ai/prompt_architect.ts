
/**
 * PASO 322: ESTRATEGIA DE "PREFIJO COMPARTIDO" INMUTABLE
 * Objetivo: Maximizar hits de caché agrupando bloques estáticos.
 */
export class PromptArchitect {
    static buildSovereignPrompt(systemRules: string, documentation: string, currentTask: string, history: string): string {
        // Bloque CACHED (Estático)
        const cachedBlock = `
--- CACHED_CONTEXT_START ---
CONSTITUCIÓN DE AGENTES: 
${systemRules}

DOCUMENTACIÓN TÉCNICA:
${documentation}
--- CACHED_CONTEXT_END ---
        `.trim();

        // Bloque UNCACHED (Dinámico)
        const dynamicBlock = `
--- DYNAMIC_SESSION_START ---
HISTORIAL DE CONVERSACIÓN:
${history}

TAREA ACTUAL:
${currentTask}
--- DYNAMIC_SESSION_END ---
        `.trim();

        console.log("🧊 [Prompt-Architect] Step 322: Optimizing for Shared Prefix caching...");
        return `${cachedBlock}\n\n${dynamicBlock}`;
    }
}
