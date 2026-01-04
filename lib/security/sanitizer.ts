
/**
 * AEGIS DLP SANITIZER (Step 62)
 * Prevents PII (emails, keys, credit cards) from leaking in logs or AI responses.
 */

const PII_PATTERNS = {
    email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
    apiKey: /(sk|AIza|ghp|gho|ghu|ghs|ghr)_[a-zA-Z0-9]{20,}/g,
    creditCard: /\b(?:\d[ -]*?){13,16}\b/g,
    connectionString: /postgresql:\/\/([^:]+):([^@]+)@([^/]+)\/([^?]+)/g
};

export function sanitizeOutput(text: string): string {
    let sanitized = text;

    // Redact patterns
    sanitized = sanitized.replace(PII_PATTERNS.email, "<EMAIL_REDACTED>");
    sanitized = sanitized.replace(PII_PATTERNS.apiKey, "<API_KEY_REDACTED>");
    sanitized = sanitized.replace(PII_PATTERNS.creditCard, "<CC_REDACTED>");
    sanitized = sanitized.replace(PII_PATTERNS.connectionString, (match, user, pass, host, db) => {
        return `postgresql://<USER>:<PASS>@${host}/${db}`;
    });

    if (sanitized !== text) {
        console.log("🛡️ [Aegis-DLP] Sanitized sensitive data from output.");
    }

    return sanitized;
}
