
import { db } from "../../db";
import { securityLogs } from "../../db/schema";
import crypto from "crypto";

/**
 * PASO 188: EL ESCUDO AEGIS V2 (Standard SEP-1763)
 */

export const aegisInterceptor = {
    policies: {
        blockedCommands: ['rm -rf', 'DROP TABLE', 'TRUNCATE', 'DELETE FROM *', 'format', 'mkfs'],
        allowedDomains: ['github.com', 'google.com', 'neon.tech', 'replit.com'],
        piiPatterns: [
            /\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b/g, // Tarjetas
            /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, // Emails
            /\b(password|secret|key|token)\s*[:=]\s*["'][^"']+["']/gi // Secrets
        ]
    },

    async validateToolCall(toolName: string, args: any) {
        const argsStr = JSON.stringify(args);

        // PASO 329: Bloqueo Determinista (-32003)
        for (const cmd of this.policies.blockedCommands) {
            if (argsStr.toUpperCase().includes(cmd.toUpperCase())) {
                await this.logViolation(toolName, args, `DESTRUCTIVE_COMMAND_BLOCKED: ${cmd}`);
                const error = new Error(`🛡️ [Aegis] Security Error -32003: Operation '${cmd}' is forbidden.`);
                (error as any).code = -32003;
                throw error;
            }
        }

        // Sanitización Proactiva
        let sanitizedArgs = argsStr;
        for (const pattern of this.policies.piiPatterns) {
            sanitizedArgs = sanitizedArgs.replace(pattern, "<REDACTED>");
        }

        console.log(`🛡️ [Aegis] SEP-1763: Tool call '${toolName}' sanitized and approved.`);
        return JSON.parse(sanitizedArgs);
    },

    async logViolation(tool: string, args: any, reason: string) {
        console.error(`🚨 [Aegis] CRITICAL VIOLATION: ${reason}`);
        await db.insert(securityLogs).values({
            actionType: 'BLOCKED_TOOL',
            payload: args,
            reason: reason,
            severity: 'CRITICAL',
            tenantId: "SYSTEM"
        });
    }
};

import { AegisV3Interceptor } from "./aegis_v3";

export function withSEP1763Interceptor(client: any) {
    console.log("👮 [Aegis] Wrapping client with SEP-1763 compliance layer.");

    const originalCall = client.call_tool;
    if (originalCall) {
        client.call_tool = async (args: any) => {
            const traceId = crypto.randomUUID();
            await AegisV3Interceptor.validateTool(args.tool, args.arguments, traceId);
            return originalCall(args);
        };
    }

    return client;
}
