
import { GeminiClient } from "../ai/gemini-client";

/**
 * PASO 286: PIPELINES DE EJECUCIÓN PARALELA (Antigravity Mode)
 * Objetivo: Ejecutar múltiples tareas no dependientes en paralelo.
 */

export class AntigravityParallelOrchestrator {
    static async executeInParallel(tasks: { prompt: string, agentType: string }[]) {
        console.log(`🚦 [Antigravity-Parallel] Launching ${tasks.length} concurrent sub-agents...`);

        const startTime = Date.now();

        try {
            const results = await Promise.all(tasks.map(task => {
                const client = new GeminiClient("gemini-1.5-flash", task.agentType);
                return client.generateContent(task.prompt, {
                    skipTSIP: true,
                    generationConfig: { thinkingConfig: { include_thoughts: false } }
                });
            }));

            const duration = Date.now() - startTime;
            console.log(`🏎️ [Parallel-Success] All tasks completed in ${duration}ms (Reduced from serial ${duration * tasks.length}ms approx).`);

            return results;
        } catch (e) {
            console.error("❌ [Parallel-Failure] Error in parallel pipeline:", e);
            throw e;
        }
    }
}
