
/**
 * AEGIS PII SANITIZER (Step 68)
 * Data Loss Prevention (DLP) for Agentic Context.
 */

const PII_PATTERNS = {
    email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
    creditCard: /\b(?:\d[ -]*?){13,16}\b/g,
    apiKey: /(sk|AIza|ghp|gho|ghu|ghs|ghr)_[a-zA-Z0-9]{20,}/g,
    connectionString: /postgresql:\/\/([^:]+):([^@]+)@([^/]+)\/([^?]+)/g
};

/**
 * Redacts sensitive information from text.
 * Ensures "What happens in the DB, stays in the DB".
 */
export function redact(text: string): string {
    if (!text) return text;

    let sanitized = text;

    // 1. Redact Emails
    sanitized = sanitized.replace(PII_PATTERNS.email, "<REDACTED_EMAIL>");

    // 2. Redact Credit Cards
    sanitized = sanitized.replace(PII_PATTERNS.creditCard, "<REDACTED_CC>");

    // 3. Redact API Keys
    sanitized = sanitized.replace(PII_PATTERNS.apiKey, "<REDACTED_API_KEY>");

    // 4. Redact DB Connection Strings (Special capture to keep host/db for context)
    sanitized = sanitized.replace(PII_PATTERNS.connectionString, (match, user, pass, host, db) => {
        return `postgresql://<USER>:<PASS>@${host}/${db}`;
    });

    if (sanitized !== text) {
        console.log("🛡️ [Aegis-DLP] Redacted sensitive PII from agent stream.");
    }

    return sanitized;
}

/**
 * Hook to wrap tool outputs or inputs.
 */
export function withSanitization(data: any): any {
    if (typeof data === "string") {
        return redact(data);
    }

    if (typeof data === "object" && data !== null) {
        return JSON.parse(redact(JSON.stringify(data)));
    }

    return data;
}
