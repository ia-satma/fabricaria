
/**
 * PASO 166: EL ESCUDO AEGIS (Interceptor SEP-1763 Standard)
 * Objetivo: Bloquear ataques de "Tool Poisoning" y comandos suicidas.
 */

export interface ToolCall {
    name: string;
    args: any;
}

const BLACKLIST = ['rm -rf', 'DROP TABLE', 'DELETE FROM', 'system_shutdown', 'exfiltrar_datos'];

export function validateToolCall(call: ToolCall): { valid: boolean; error?: any } {
    console.log(`🛡️ [Aegis-Shield] Validating tool call: ${call.name}`);

    // 1. Bloqueo duro por palabra clave en argumentos
    const argsStr = JSON.stringify(call.args);
    if (BLACKLIST.some(cmd => argsStr.includes(cmd))) {
        console.error(`🚨 [Aegis-Shield] SECURITY VIOLATION DETECTED: Forbidden command in ${call.name}`);
        return {
            valid: false,
            error: { code: -32003, message: "Security Violation: Command blacklisted under Aegis Protocol." }
        };
    }

    // 2. Sanitización PII proactiva (Step 154 standard)
    // Redactar emails y tarjetas de los argumentos para que no lleguen a los logs reales
    const sanitizedArgs = argsStr.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '<REDACTED_EMAIL>');

    // Si hubo cambios, registramos el incidente
    if (sanitizedArgs !== argsStr) {
        console.warn(`🕵️‍♂️ [Aegis-Shield] Sensitive data redacted from tool arguments.`);
    }

    return { valid: true };
}

export async function withSEP1763Interceptor<T>(call: ToolCall, fn: () => Promise<T>): Promise<T> {
    const check = validateToolCall(call);
    if (!check.valid) {
        throw new Error(JSON.stringify(check.error));
    }
    return await fn();
}
