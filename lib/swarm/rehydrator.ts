
/**
 * PASO 328: REHIDRATACIÓN COGNITIVA
 * Objetivo: Cargar la memoria del agente anterior sin alucinaciones.
 */
export class CognitiveRehydrator {
    static rehydrate(handoff: any): string {
        console.log("🧠💉 [Rehydration] Injecting previous agent state into system prompt...");

        const history = handoff.context.conversation_history || "No prior history.";

        return `
--- INICIO TRANSCRIPCIÓN (SOLO CONTEXTO, NO RESPONDER) ---
CONTEXT_ID: ${handoff.meta.sessionId}
ROLE_FROM: WORKER
INTENT: ${handoff.intent.summary}
PRIORITY: ${handoff.intent.priority}

PRIOR_CONVERSATION:
${history}
--- FIN TRANSCRIPCIÓN ---

Ahora, como ${handoff.meta.target_role}, asume el control y resuelve la tarea siguiendo las restricciones:
${handoff.context.constraints.map((c: string) => `- ${c}`).join("\n")}
        `.trim();
    }
}
