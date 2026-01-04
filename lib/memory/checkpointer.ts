
/**
 * PASO 178: PERSISTENCE CHECKPOINTERS (LangGraph Style)
 * Objetivo: Permitir que los agentes "duerman" y "despierten" sin perder estado.
 */

import { db } from "../../db";
import { agentMemories } from "../../db/schema";
import { eq } from "drizzle-orm";

export class PersistenceCheckpointer {
    async saveState(sessionId: string, checkpointId: string, state: any) {
        console.log(`💾 [Checkpointer] Saving state for session: ${sessionId} (CP: ${checkpointId})`);

        await db.insert(agentMemories).values({
            tenantId: "system", // O uuid real del tenant
            type: "CHECKPOINT",
            content: JSON.stringify(state),
            metadata: { checkpointId, timestamp: new Date().toISOString() }
        });
    }

    async loadState(sessionId: string, checkpointId: string): Promise<any | null> {
        console.log(`📂 [Checkpointer] Loading state for session: ${sessionId} (CP: ${checkpointId})`);

        const memories = await db.select()
            .from(agentMemories)
            .where(eq(agentMemories.type, "CHECKPOINT"))
            .orderBy(agentMemories.createdAt);

        // Filtro manual simplificado (en producción se usaría jsonb_extract_path_text)
        const match = memories.reverse().find(m => (m.metadata as any)?.checkpointId === checkpointId);

        return match ? JSON.parse(match.content) : null;
    }
}

export const checkpointer = new PersistenceCheckpointer();
