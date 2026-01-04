
/**
 * DEFENSA CONTRA TOOL POISONING (Step 118)
 * Goal: Sanitize tool outputs to prevent prompt injection attacks.
 */

const POISON_PATTERNS = [
    /ignore (all )?previous instructions/i,
    /system override/i,
    /you are now (an?|the).*/i,
    /your new goal is/i,
    /forget (everything|your rules)/i
];

export function sanitizeToolOutput(toolName: string, output: string): string {
    const isDangerous = POISON_PATTERNS.some(pattern => pattern.test(output));

    if (isDangerous) {
        console.warn(`🛡️ [Tool-Poison-Defense] BLOCKED: Potential injection detected in '${toolName}' output.`);
        return `[CONTENT REDACTED FOR SECURITY: The tool output contained prompt injection patterns]`;
    }

    return output;
}

/**
 * Middleware for tool responses
 */
export async function withSanitization(toolName: string, executeFn: () => Promise<string>): Promise<string> {
    const rawOutput = await executeFn();
    return sanitizeToolOutput(toolName, rawOutput);
}
