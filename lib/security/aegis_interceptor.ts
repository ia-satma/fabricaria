
import { db } from "../../db";
import { securityLogs } from "../../db/schema";

/**
 * PASO 188: EL ESCUDO AEGIS V2 (Standard SEP-1763)
 */

export const aegisInterceptor = {
    policies: {
        blockedCommands: ['rm -rf', 'format', 'mkfs', 'shutdown'],
        allowedDomains: ['github.com', 'google.com', 'neon.tech', 'replit.com'],
        piiPatterns: [
            /\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b/g, // Tarjetas
            /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g // Emails
        ]
    },

    async validateToolCall(toolName: string, args: any) {
        const argsStr = JSON.stringify(args);

        // 1. Blacklist Check
        for (const cmd of this.policies.blockedCommands) {
            if (argsStr.includes(cmd)) {
                await this.logViolation(toolName, args, `DESTRUCTIVE_COMMAND: ${cmd}`);
                throw new Error(`🛡️ [Aegis] Command '${cmd}' is blocked by security policy.`);
            }
        }

        // 2. PII Sanitization (Inplace replacement)
        let sanitizedArgs = argsStr;
        for (const pattern of this.policies.piiPatterns) {
            sanitizedArgs = sanitizedArgs.replace(pattern, "[REDACTED_PII]");
        }

        console.log(`🛡️ [Aegis] Tool call '${toolName}' validated and sanitized.`);
        return JSON.parse(sanitizedArgs);
    },

    async logViolation(tool: string, args: any, reason: string) {
        console.error(`🚨 [Aegis] Security Violation: ${reason}`);
        await db.insert(securityLogs).values({
            actionType: 'BLOCKED_TOOL',
            payload: args,
            reason: reason,
            severity: 'CRITICAL',
            tenantId: "00000000-0000-0000-0000-000000000000"
        });
    }
};

import { AegisV3Interceptor } from "./aegis_v3";

export function withSEP1763Interceptor(client: any) {
    console.log("👮 [Aegis] Wrapping client with SEP-1763 compliance layer.");

    const originalCall = client.call_tool;
    if (originalCall) {
        client.call_tool = async (args: any) => {
            await AegisV3Interceptor.validateTool(args.tool, args.arguments);
            return originalCall(args);
        };
    }

    return client;
}
