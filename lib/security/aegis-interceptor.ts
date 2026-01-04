
import { db } from "../../db";
import { securityLogs } from "../../db/schema";

/**
 * AEGIS PROTOCOL (Step 36)
 * Deterministic interceptor for destructive commands.
 */

const BLACKLIST = [
    /rm\s+(-r|R|f){1,}/i,      // Recursive deletion
    /DROP\s+TABLE/i,           // Table destruction
    /aws\s+s3\s+rb/i,          // S3 bucket removal
    /DELETE\s+FROM\s+\w+$/i,   // Unbounded deletion (safety)
    /truncate\s+table/i        // Table truncation
];

export async function validateAction(command: string, tenantId?: string) {
    for (const pattern of BLACKLIST) {
        if (pattern.test(command)) {
            console.error(`🛡️ [Aegis] BLOCKED: Destructive action detected: "${command}"`);

            // Log violation
            await db.insert(securityLogs).values({
                actionType: "BLOCKED_COMMAND",
                payload: { command },
                reason: `Pattern match: ${pattern.toString()}`,
                severity: "critical",
                tenantId: tenantId || null
            });

            throw new Error(`BLOQUEO AEGIS: Acción destructiva detectada. El comando viola las políticas de seguridad del sistema.`);
        }
    }

    console.log(`🛡️ [Aegis] Action validated: "${command.substring(0, 50)}..."`);
    return true;
}
