
import fs from "fs";
import { HandoffSchema, type Handoff } from "../../schemas/handoff";

/**
 * PASO 356, 359, 360: SWARM ORCHESTRATOR
 * Objetivo: Gestionar handoffs entre entornos con bloqueo optimista.
 */
export class SwarmOrchestrator {
    private static handoffPath = "handoff.json";

    /**
     * PASO 356: SOLICITUD DE HANDOFF (Desde Replit)
     */
    static async requestHelp(summary: string, context: any) {
        console.log("📝 [Swarm] Requesting help from Antigravity brain...");

        // PASO 360: BLOQUEO OPTIMISTA (Solo escribe si está IDLE o FAILED)
        if (fs.existsSync(this.handoffPath)) {
            const current = JSON.parse(fs.readFileSync(this.handoffPath, "utf-8"));
            if (current.meta.status !== "IDLE" && current.meta.status !== "FAILED") {
                console.warn("🚦 [Swarm] ABORT: Resource is locked by another agent.");
                return;
            }
        }

        const handoff: Handoff = {
            meta: {
                target_role: "ARCHITECT",
                status: "BUFFERED",
                sessionId: context.sessionId || "global"
            },
            intent: {
                summary,
                priority: "HIGH"
            },
            context: {
                files_focus: context.files || [],
                constraints: context.constraints || [],
                conversation_history: context.history
            }
        };

        fs.writeFileSync(this.handoffPath, JSON.stringify(handoff, null, 2));
        console.log("✅ [Swarm] Handoff BUFFERED. Signal sent via Git Nervous System.");
    }

    /**
     * PASO 359: EL "HANDOFF DE RETORNO" (Ciclo Completo)
     */
    static async completeHandoff(sessionId: string, resultSummary: string) {
        console.log(`🔄 [Swarm-Orchestrator] Finishing task for session: ${sessionId}`);

        if (fs.existsSync(this.handoffPath)) {
            const data = JSON.parse(fs.readFileSync(this.handoffPath, "utf-8"));
            const handoff = HandoffSchema.parse(data);

            // PASO 360: BLOQUEO OPTIMISTA (Solo el Arquitecto escribe durante IN_PROGRESS)
            if (handoff.meta.status !== "IN_PROGRESS") {
                console.error("🚦 [Swarm] Integrity Error: Attempted to complete a non-active handoff.");
                return;
            }

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

            fs.writeFileSync(this.handoffPath, JSON.stringify(completedHandoff, null, 2));
            console.log("✅ [Swarm-Orchestrator] Handoff set to COMPLETED.");
        }
    }
}
