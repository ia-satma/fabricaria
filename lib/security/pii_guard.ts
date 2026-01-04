
/**
 * SANITIZACIÓN DE PII (Step 154)
 * Objetivo: Detectar y redactar datos sensibles antes de enviarlos al LLM o logs.
 */

export function redactPII(text: string): string {
    let sanitized = text;

    // 1. Email Pattern
    sanitized = sanitized.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '<REDACTED_EMAIL>');

    // 2. Credit Card Pattern (Simple)
    sanitized = sanitized.replace(/\b(?:\d[ -]*?){13,16}\b/g, '<REDACTED_CC>');

    // 3. API Keys (Hypothetical)
    sanitized = sanitized.replace(/sk-[a-zA-Z0-9]{32,}/g, '<REDACTED_API_KEY>');

    if (sanitized !== text) {
        console.warn("🕵️‍♂️ [PII-Guard] Sensitive data redacted from context.");
    }

    return sanitized;
}

export function piiGuardMiddleware(payload: any): any {
    const raw = JSON.stringify(payload);
    const sanitized = redactPII(raw);
    return JSON.parse(sanitized);
}
