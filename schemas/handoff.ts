
import { z } from "zod";

/**
 * PASO 326: EL PROTOCOLO DE "HANDOFF" (Schema HPS)
 * Objetivo: Serializar el estado del agente para transferencia entre entornos.
 */

export const HandoffSchema = z.object({
    meta: z.object({
        target_role: z.enum(["ARCHITECT", "BUILDER", "SENTINEL", "QA"]),
        status: z.enum(["BUFFERED", "IN_PROGRESS", "COMPLETED", "FAILED"]),
        sessionId: z.string()
    }),
    intent: z.object({
        summary: z.string(),
        priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"])
    }),
    context: z.object({
        files_focus: z.array(z.string()),
        constraints: z.array(z.string()),
        conversation_history: z.string().optional()
    })
});

export type Handoff = z.infer<typeof HandoffSchema>;
