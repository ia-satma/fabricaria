
/**
 * INTERFAZ DE RECUPERACIÓN DE DESASTRES (Step 141)
 * Objetivo: Kill Switch global para detener la IA instantáneamente.
 */

import fs from 'fs';
import path from 'path';

const CONFIG_PATH = path.join(process.cwd(), '.agent/kill-switch.json');

export function isAIEnabled(): boolean {
    if (!fs.existsSync(CONFIG_PATH)) {
        return true; // Default enabled
    }
    try {
        const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
        return config.enabled !== false;
    } catch {
        return true;
    }
}

export function setAIStatus(enabled: boolean) {
    const dir = path.dirname(CONFIG_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(CONFIG_PATH, JSON.stringify({ enabled, timestamp: new Date().toISOString() }));
    console.log(`🛑 [Kill-Switch] AI Global Status set to: ${enabled}`);
}

/**
 * Wrapper for LLM calls to ensure safety
 */
export async function withKillSwitch<T>(fn: () => Promise<T>): Promise<T> {
    if (!isAIEnabled()) {
        throw new Error("GLOBAL_AI_DISABLED: El servicio de IA ha sido desactivado por emergencia.");
    }
    return fn();
}
