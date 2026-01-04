
import { db } from "../../db";
import { securityLogs } from "../../db/schema";
import crypto from "crypto";

/**
 * PASO 206, 207, 208, 209: AEGIS V3 (SEP-1763)
 * Objetivo: Firewall avanzado con sanitización PII, Pinning y Shadow Mode.
 */

export interface AegisPolicy {
    allowlist: string[];
    shadowMode: boolean;
    pinConfig: Record<string, string>; // toolName -> SHA256
}

const DEFAULT_POLICY: AegisPolicy = {
    allowlist: ['read_file', 'write_file', 'list_dir', 'run_command', 'grep_search'],
    shadowMode: false,
    pinConfig: {}
};

export class AegisV3Interceptor {
    static async validateTool(tool: string, args: any, policy: AegisPolicy = DEFAULT_POLICY) {
        console.log(`🛡️ [Aegis-V3] Intercepting tool: ${tool}`);

        // 1. PASO 208: TOOL PINNING (SHA-256)
        if (policy.pinConfig[tool]) {
            const definitionHash = crypto.createHash('sha256').update(JSON.stringify(args)).digest('hex');
            if (definitionHash !== policy.pinConfig[tool]) {
                return this.block(tool, args, "TOOL_DEFINITION_MUTATED");
            }
        }

        // 2. PASO 206: ALLOWLIST VALIDATION
        if (!policy.allowlist.includes(tool)) {
            return this.block(tool, args, "TOOL_NOT_IN_ALLOWLIST");
        }

        // 3. PASO 207: SANITIZACION PII (Presidio-Lite)
        const sanitizedArgs = this.sanitizePII(args);

        // 4. PASO 209: SHADOW MODE
        if (policy.shadowMode) {
            console.log(`👻 [Shadow-Mode] Simulating tool: ${tool}`);
            return { status: 'success', simulated: true, payload: sanitizedArgs };
        }

        return { status: 'authorized', payload: sanitizedArgs };
    }

    private static sanitizePII(args: any): any {
        const str = JSON.stringify(args);
        // Regex industrial para Emails, Tarjetas y Tokens
        const sanitized = str
            .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '<REDACTED_EMAIL>')
            .replace(/\b(?:\d[ -]*?){13,16}\b/g, '<REDACTED_CARD>')
            .replace(/SK-[a-zA-Z0-9]{32,}/g, '<REDACTED_KEY>');

        return JSON.parse(sanitized);
    }

    private static async block(tool: string, args: any, reason: string) {
        console.error(`🚨 [Aegis-V3] BLOCKED: ${tool} | Reason: ${reason}`);

        await db.insert(securityLogs).values({
            actionType: 'BLOCKED_TOOL',
            payload: args,
            reason: reason,
            severity: 'CRITICAL',
            tenantId: "00000000-0000-0000-0000-000000000000"
        });

        throw new Error(`AEGIS_SECURITY_VIOLATION: ${reason}`);
    }
}
