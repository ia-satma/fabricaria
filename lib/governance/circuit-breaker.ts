/**
 * GOVERNANCE MIDDLEWARE: Circuit Breaker
 * Manages financial risk (token limits) and operational stability (loop detection).
 */

export class BudgetExceededError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "BudgetExceededError";
    }
}

export class ActionLoopError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ActionLoopError";
    }
}

interface Assessment {
    tokenCount: number;
    actionHistory: Array<{ type: string; timestamp: number }>;
}

// In-memory store for session governance data. 
// In a distributed system, this should be Redis.
const sessionAssessments: Map<string, Assessment> = new Map();

// Hard limits tailored for cost control
const MAX_TOKENS_PER_SESSION = 4000; // ~ $0.01 - $0.05 depending on model
const MAX_ACTIONS_PER_MINUTE = 10;   // Prevent runaways

export class CircuitBreaker {

    /**
     * Resets or initializes the governance tracker for a session.
     */
    static resetSession(sessionId: string) {
        sessionAssessments.set(sessionId, {
            tokenCount: 0,
            actionHistory: []
        });
    }

    /**
     * Monitors accumulating costs.
     * Throws BudgetExceededError if threshold is crossed.
     */
    static checkBudget(sessionId: string, newTokens: number) {
        let assessment = sessionAssessments.get(sessionId);
        if (!assessment) {
            this.resetSession(sessionId);
            assessment = sessionAssessments.get(sessionId)!;
        }

        assessment.tokenCount += newTokens;

        // Financial Guard
        if (assessment.tokenCount > MAX_TOKENS_PER_SESSION) {
            console.error(`🚨 [Governor] HARD BREAK: Budget exceeded for session ${sessionId}. (${assessment.tokenCount}/${MAX_TOKENS_PER_SESSION})`);
            throw new BudgetExceededError(`Session budget exceeded limit of ${MAX_TOKENS_PER_SESSION} tokens.`);
        }

        return true;
    }

    /**
     * Monitors operational frequency to detect loops.
     * Throws ActionLoopError if fast-cycling is detected.
     */
    static checkActionLoop(sessionId: string, actionType: string) {
        let assessment = sessionAssessments.get(sessionId);
        if (!assessment) {
            this.resetSession(sessionId);
            assessment = sessionAssessments.get(sessionId)!;
        }

        const now = Date.now();

        // Add current action
        assessment.actionHistory.push({ type: actionType, timestamp: now });

        // Prune history older than 1 minute
        assessment.actionHistory = assessment.actionHistory.filter(a => now - a.timestamp < 60000);

        // Loop Guard
        if (assessment.actionHistory.length > MAX_ACTIONS_PER_MINUTE) {
            console.error(`🚨 [Governor] HARD BREAK: Action loop detected for session ${sessionId}. (> ${MAX_ACTIONS_PER_MINUTE} acts/min)`);
            throw new ActionLoopError("Rapid action loop detected. Execution halted for stability.");
        }

        return true;
    }
}
