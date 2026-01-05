
import fs from "fs";
import { HandoffSchema, type Handoff } from "@/schemas/handoff";

/**
 * PASO 330: EL "HANDOFF DE RETORNO" (Cierre del Ciclo)
 * Objetivo: Devolver el control al entorno original (ej. Replit) tras finalizar la tarea.
 */
export class SwarmOrchestrator {
    static async completeHandoff(sessionId: string, resultSummary: string) {
        console.log(`🔄 [Swarm-Orchestrator] Finishing task for session: ${sessionId}`);

        const handoffPath = "handoff.json";

        if (fs.existsSync(handoffPath)) {
            const data = JSON.parse(fs.readFileSync(handoffPath, "utf-8"));
            const handoff = HandoffSchema.parse(data);

            if (handoff.meta.sessionId === sessionId) {
                const completedHandoff: Handoff = {
                    ...handoff,
                    meta: {
                        ...handoff.meta,
                        status: "COMPLETED"
                    },
                    intent: {
                        ...handoff.intent,
                        summary: `COMPLETED: ${resultSummary}`
                    }
                };

                fs.writeFileSync(handoffPath, JSON.stringify(completedHandoff, null, 2));
                console.log("✅ [Swarm-Orchestrator] Handoff set to COMPLETED. Ready for git push.");

                // En un entorno real:
                // execSync("git add handoff.json && git commit -m 'feat: Task completed by Architect' && git push");
            }
        }
    }
}
