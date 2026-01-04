import { db } from "../db";
import { sql } from "drizzle-orm";

/**
 * VIAJE EN EL TIEMPO (Step 112)
 * Goal: Rollback agent state to a previous forensic block.
 */

export async function rollbackAgent(sessionId: string, targetBlockId: string) {
    console.log(`⌛ [Time-Travel] Reverting session ${sessionId} to block ${targetBlockId}...`);

    try {
        // 1. Verify block exists in audit_trail
        const blockQuery = sql`SELECT id FROM audit_trail WHERE id = ${targetBlockId} AND action_payload->>'session_id' = ${sessionId}`;
        const blockResult = await db.execute(blockQuery);

        if (blockResult.rows.length === 0) {
            throw new Error("Checkpoint not found or session mismatch.");
        }

        // 2. Erase the "future" blocks to restore the chain
        const cleanupQuery = sql`DELETE FROM audit_trail WHERE timestamp > (SELECT timestamp FROM audit_trail WHERE id = ${targetBlockId})`;
        await db.execute(cleanupQuery);

        console.log(`✅ [Time-Travel] Rollback successful. Chain secured at block ${targetBlockId.substring(0, 8)}.`);
        return true;

    } catch (error) {
        console.error("❌ [Time-Travel] Rollback failed:", error);
        return false;
    }
}

if (require.main === module) {
    const args = process.argv.slice(2);
    if (args.length < 2) {
        console.log("Usage: npx tsx rollback_agent.ts <session_id> <block_id>");
    } else {
        rollbackAgent(args[0], args[1]).catch(console.error);
    }
}
