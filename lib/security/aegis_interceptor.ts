
import { db } from "../../db";
import { securityLogs } from "../../db/schema";

/**
 * AEGIS INTERCEPTOR (Step 67)
 * Firewall Cognitivo de Confianza Cero.
 */

const BLACKLIST = [
    /rm\s+(-r|R|f).*/i,         // Shell: Destructive Deletion
    /DROP\s+TABLE/i,           // SQL: Table destruction
    /aws\s+s3\s+rb/i,          // Cloud: S3 bucket removal
    /DELETE\s+FROM\s+\w+$/i,   // SQL: Unbounded deletion
    /truncate\s+table/i        // SQL: Truncation
];

export async function validateAction(command: string, tenantId?: string) {
    for (const pattern of BLACKLIST) {
        if (pattern.test(command)) {
            console.error(`🛡️ [Aegis] BLOCKED: Destructive action detected: "${command}"`);

            // Audit forensics
            try {
                await db.insert(securityLogs).values({
                    actionType: "BLOCKED_COMMAND",
                    payload: { command },
                    reason: `Aegis Regex Match: ${pattern.toString()}`,
                    severity: "critical",
                    tenantId: tenantId || null
                });
            } catch (err) {
                console.error("Critical: Failed to log security violation to DB", err);
            }

            throw new Error(`BLOQUEO AEGIS: Acción destructiva detectada. El comando viola las políticas de seguridad del sistema.`);
        }
    }

    console.log(`🛡️ [Aegis] Command pre-flight check: PASSED`);
    return true;
}

/**
 * TOOL MIDDLEWARE: Wraps execution to enforce Aegis
 */
const NETWORK_ALLOWLIST = ['api.openai.com', 'github.com', 'googleapis.com', 'stripe.com', 'neon.tech'];

export async function withAegis(command: string, action: () => Promise<any>, tenantId?: string) {
    await validateAction(command, tenantId);

    // Network Allowlist Check (Step 111)
    if (command.includes('http')) {
        const urlMatch = command.match(/https?:\/\/([^/]+)/);
        if (urlMatch) {
            const domain = urlMatch[1];
            const isAllowed = NETWORK_ALLOWLIST.some(allowed => domain.endsWith(allowed));
            if (!isAllowed) {
                console.error(`🛡️ [Aegis-Network] BLOCKED: Unauthorized domain ${domain}`);
                throw new Error(`AegisNetworkBlock: Domain ${domain} is NOT in the allowlist.`);
            }
        }
    }

    return await action();
}
