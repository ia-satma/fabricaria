/**
 * GOVERNANCE MIDDLEWARE: Aegis (Protocol 1763)
 * Provides deterministic security interception for agent actions.
 */

export class SecurityViolationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "SecurityViolationError";
    }
}

// Blocked patterns (Denylist)
const DANGEROUS_PATTERNS = [
    /rm\s+-rf/,            // Recursive delete
    /\/etc\/passwd/,       // System file access
    /mkfs/,                // Formatting
    /:(){ :\|:& };:/,      // Fork bomb
    /wget\s+http/,         // Insecure download (non-https)
    /curl\s+http/          // Insecure download
];

// Sensitive PII Patterns
const PII_PATTERNS = [
    /sk-[a-zA-Z0-9]{32,}/g, // Generic API Key lookalike
    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, // Email
];

export class Aegis {

    /**
     * Intercepts tool execution to validate arguments against the Denylist.
     */
    static validateToolCall(toolName: string, args: any): boolean {
        // We act on specific critical tools like 'exec' or 'write_file'
        // For simulation, we check generic string arguments found in the object.

        const jsonArgs = JSON.stringify(args);

        for (const pattern of DANGEROUS_PATTERNS) {
            if (pattern.test(jsonArgs)) {
                console.error(`🛡️ [Aegis] THREAT DETECTED: Action matched blocked pattern (${pattern}).`);
                throw new SecurityViolationError(`Action blocked by Aegis. Pattern matched: ${pattern}`);
            }
        }

        return true;
    }

    /**
     * Redacts sensitive information from text before logging or storing.
     */
    static sanitizeOutput(text: string): string {
        let cleanText = text;

        for (const pattern of PII_PATTERNS) {
            cleanText = cleanText.replace(pattern, "[REDACTED]");
        }

        return cleanText;
    }
}
