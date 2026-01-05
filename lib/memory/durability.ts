
import { db } from "../../db";
import { fabricationQueue } from "../../db/schema";
import { eq } from "drizzle-orm";

/**
 * PASO 269: PERSISTENCIA "DURABLE" (Dormir y Despertar)
 * Objetivo: Guardar el estado completo de una tarea para reanudación posterior.
 */

export class DurabilityEngine {
    static async checkpointTask(jobId: string, state: any) {
        console.log(`💤 [Durability] Checkpointing task: ${jobId}`);

        await db.update(fabricationQueue)
            .set({
                handoffData: state,
                status: "CHECKPOINTED",
                updatedAt: new Date()
            })
            .where(eq(fabricationQueue.jobId, jobId));
    }

    static async rehydrateTask(jobId: string): Promise<any | null> {
        console.log(`⏰ [Durability] Rehydrating task: ${jobId}`);

        const task = await db.select()
            .from(fabricationQueue)
            .where(eq(fabricationQueue.jobId, jobId))
            .limit(1);

        if (!task[0]) return null;

        return task[0].handoffData;
    }
}
