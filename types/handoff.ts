
/**
 * SWARM HANDOFF TYPES (Step 61)
 * Protocol for transferring agents context via Git.
 */

export interface HandoffTicket {
    id: string;
    status: "STUCK" | "RESOLVED" | "DELEGATED";
    agent_source: string;
    target_skillset: string[];
    context: {
        error: string;
        last_attempt_log: string;
        critical_files: string[];
    };
    attempts: number;
    max_attempts: number;
    created_at: string;
}

export function createHandoffTicket(error: string, files: string[]): HandoffTicket {
    return {
        id: `ticket_${Date.now()}`,
        status: "STUCK",
        agent_source: "REPLIT_WORKER",
        target_skillset: ["ARCHITECT_ULTRA", "DEBUGGER_EXPERT"],
        context: {
            error,
            last_attempt_log: "Check git history for commit logs",
            critical_files: files
        },
        attempts: 1,
        max_attempts: 3,
        created_at: new Date().toISOString()
    };
}
