
import crypto from 'crypto';
import { z } from 'zod';

/**
 * PASO 351: DEFINICIÓN DEL SCHEMA ThoughtSignatureToken
 * Objetivo: Validar el token opaco de razonamiento antes de procesarlo.
 */
export const ThoughtSignatureSchema = z.string().regex(
    /^[a-zA-Z0-9\-_]+(\.[a-zA-Z0-9\-_]+)*$/,
    "Invalid TSIP Token format (Base64url expected)"
);

/**
 * PASO 354: CUSTODIA VERIFICABLE (Firmado HMAC Local)
 * Objetivo: Evitar ataques de repetición y garantizar integridad.
 */
const SECRET = process.env.TSIP_SECRET || 'neural-firewall-key-2026';

export function signThoughtSignature(token: string, sessionId: string): string {
    // Validamos el formato antes de firmar (PASO 351)
    ThoughtSignatureSchema.parse(token);

    const hmac = crypto.createHmac('sha256', SECRET);
    hmac.update(`${sessionId}:${token}`);
    return hmac.digest('hex');
}

export function verifyThoughtSignature(token: string, signature: string, sessionId: string): boolean {
    try {
        const expected = signThoughtSignature(token, sessionId);
        return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
    } catch (e) {
        console.error("🚨 [Thought-Signer] VALIDATION_FAILED:", e);
        return false;
    }
}
