
import { logForensicAction } from "./forensics";
import crypto from 'crypto';

/**
 * THE HANDBRAKE (Step 105)
 * Goal: Contextual Human-in-the-Loop for high-risk tools.
 */

const SENSITIVE_TOOLS = ['send_email', 'execute_sql_write', 'deploy_production', 'delete_branch'];
const PENDING_APPROVALS: Record<string, { toolName: string, args: any, resolve: Function }> = {};

export async function withHITL(toolName: string, args: any, executeFn: Function) {
    if (!SENSITIVE_TOOLS.includes(toolName)) {
        return executeFn(args);
    }

    console.warn(`🛑 [HITL-Interception] Action '${toolName}' requires human approval.`);

    // 1. Generate Approval Token
    const token = crypto.randomBytes(4).toString('hex').toUpperCase();

    // 2. Log Forensic Action (Step 88)
    await logForensicAction("HITL_SENTINEL", `Waiting for approval on ${toolName}`, { toolName, args, token });

    // 3. Inform the user (In a real scenario, this would go through the UI/Scribe)
    console.info(`\n🚀 [APPROVAL REQUIRED]\nTool: ${toolName}\nArgs: ${JSON.stringify(args, null, 2)}\nToken de Aprobación: ${token}\n`);

    return new Promise((resolve) => {
        PENDING_APPROVALS[token] = {
            toolName, args, resolve: (approved: boolean) => {
                if (approved) {
                    console.log(`✅ [HITL] Approval granted for ${token}. Executing...`);
                    resolve(executeFn(args));
                } else {
                    console.error(`❌ [HITL] Approval denied for ${token}.`);
                    resolve(`Error: Human denied the action '${toolName}'.`);
                }
            }
        };
    });
}

/**
 * Tool for the agent to check if a token was approved (or for the user to inject)
 */
export function approveHITLAction(token: string, approved: boolean = true) {
    if (PENDING_APPROVALS[token]) {
        PENDING_APPROVALS[token].resolve(approved);
        delete PENDING_APPROVALS[token];
        return true;
    }
    return false;
}
