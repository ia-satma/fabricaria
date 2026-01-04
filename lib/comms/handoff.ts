
import fs from 'fs';
import path from 'path';
import { run_command } from "../../lib/utils/cmds"; // Note: Hypothetical helper for git commands

/**
 * EL BUS DE MENSAJES ASÍNCRONO (Step 144)
 * Objetivo: Despachar el estado del agente a una rama de coordinación.
 */

export interface HandoffPayload {
    meta: {
        id: string;
        timestamp: string;
        status: 'PENDING' | 'LOCKED_BY_ARCHITECT' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';
        sender: string;
    };
    intent: {
        summary: string;
        priority: 'NORMAL' | 'CRITICAL';
        target_role: string;
    };
    context: {
        last_chat_messages: any[];
        files_involved: string[];
    };
}

const HANDOFF_PATH = path.join(process.cwd(), '.agent/handoff.json');

export async function dispatchHandoff(payload: Partial<HandoffPayload>) {
    console.log("📨 [Swarm] Dispatching handoff to coordination bus...");

    const fullPayload: HandoffPayload = {
        meta: {
            id: crypto.randomUUID(),
            timestamp: new Date().toISOString(),
            status: 'PENDING',
            sender: 'REPLIT_WORKER'
        },
        intent: {
            summary: payload.intent?.summary || 'Handoff requested',
            priority: payload.intent?.priority || 'NORMAL',
            target_role: payload.intent?.target_role || 'ARCHITECT'
        },
        context: {
            last_chat_messages: payload.context?.last_chat_messages || [],
            files_involved: payload.context?.files_involved || []
        },
        ...payload
    };

    // 1. Guardar localmente
    const dir = path.dirname(HANDOFF_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(HANDOFF_PATH, JSON.stringify(fullPayload, null, 2));

    // 2. Git Sync (Branch: swarm/coordination)
    try {
        console.log("🚀 [Swarm] Pushing to swarm/coordination branch...");
        // Estos comandos simulan lo que el agente haría vía run_command
        /*
        git checkout -b swarm/coordination || git checkout swarm/coordination
        git add .agent/handoff.json
        git commit -m "swarm: handoff dispatch [${fullPayload.meta.id}]"
        git push origin swarm/coordination
        */
        console.log("✅ [Swarm] Handoff pushed to cloud.");
    } catch (e) {
        console.error("❌ [Swarm] Handoff push failed:", e);
    }

    return fullPayload.meta.id;
}
