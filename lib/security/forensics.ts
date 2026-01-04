
import { db } from "../../db";
import { auditTrail } from "../../db/schema";
import crypto from 'crypto';
import { sql } from "drizzle-orm";

/**
 * THE BLACK BOX (Step 88)
 * Goal: Immutable forensic logs with SHA256 chain.
 */

export async function logForensicAction(agentRole: string, thought: string, payload: any) {
    console.log(`🔒 [Forensic-Audit] Logging action for ${agentRole}...`);

    try {
        // 1. Get last hash
        const lastEntryQuery = sql`SELECT current_hash FROM audit_trail ORDER BY timestamp DESC LIMIT 1`;
        const lastEntry = await db.execute(lastEntryQuery);
        const prevHash = lastEntry.rows[0]?.current_hash || "GENESIS_BLOCK";

        // 2. Calculate current hash
        const timestamp = new Date().toISOString();
        const dataToHash = prevHash + JSON.stringify(payload) + thought + timestamp;
        const currentHash = crypto.createHash('sha256').update(dataToHash).digest('hex');

        // 3. Insert and lock the chain
        const insertQuery = sql`
            INSERT INTO audit_trail (prev_hash, action_payload, agent_thought, current_hash, timestamp)
            VALUES (${prevHash}, ${JSON.stringify(payload)}, ${thought}, ${currentHash}, ${timestamp})
        `;
        await db.execute(insertQuery);

        console.log(`✅ [Forensic-Audit] Action hashed and secured: ${currentHash.substring(0, 8)}...`);
        return currentHash;

    } catch (error) {
        console.error("❌ [Forensic-Audit] Audit failed:", error);
        throw error; // Critical failure if we can't audit
    }
}
