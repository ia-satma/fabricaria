
import fs from 'fs';
import path from 'path';

/**
 * RESOLUCIÓN DE CONFLICTOS OPTIMISTA (Step 147)
 * Objetivo: Bloquear el agente local si el Arquitecto está operando.
 */

const HANDOFF_PATH = path.join(process.cwd(), '.agent/handoff.json');

export function checkStateSemaphore(): { canExecute: boolean; reason?: string } {
    if (!fs.existsSync(HANDOFF_PATH)) return { canExecute: true };

    try {
        const data = JSON.parse(fs.readFileSync(HANDOFF_PATH, 'utf8'));
        const status = data.meta?.status;

        if (status === 'LOCKED_BY_ARCHITECT' || status === 'PROCESSING') {
            return {
                canExecute: false,
                reason: `🚨 [Swarm] AGENT LOCKED. State is currently owned by ARCHITECT (Status: ${status}).`
            };
        }

        if (status === 'COMPLETED') {
            console.log("✨ [Swarm] Task completed by external agent. Syncing files...");
            return { canExecute: true };
        }

        return { canExecute: true };
    } catch {
        return { canExecute: true };
    }
}

/**
 * Hook para inyectar en el punto de entrada de las acciones del agente
 */
export async function swarmGuard() {
    const check = checkStateSemaphore();
    if (!check.canExecute) {
        console.warn(check.reason);
        console.log("💤 [Swarm] Entering passive polling mode. Waiting for completion signal...");
        // En un entorno real, aquí el agente se detendría o entraría en bucle de espera
        throw new Error(check.reason);
    }
}
