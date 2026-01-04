
import crypto from 'crypto';

/**
 * PASO 172: VERIFICACIÓN DE FIRMAS (Integridad Cognitiva)
 * Objetivo: Firmar y verificar thought_signatures para evitar manipulación.
 */

const SECRET = process.env.TSIP_SECRET || 'neural-firewall-key-2026';

export function signThoughtSignature(token: string, sessionId: string): string {
    const hmac = crypto.createHmac('sha256', SECRET);
    hmac.update(token + sessionId);
    return hmac.digest('hex');
}

export function verifyThoughtSignature(token: string, signature: string, sessionId: string): boolean {
    const expected = signThoughtSignature(token, sessionId);
    const valid = crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));

    if (!valid) {
        console.error("🚨 [Thought-Signer] INTEGRITY BREACH: Thought signature is invalid or tampered!");
    }

    return valid;
}
