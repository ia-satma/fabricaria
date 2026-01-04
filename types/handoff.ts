
/**
 * SWARM HANDOFF TYPES (Step 61)
 * Protocol for transferring agents context via Git.
 */


export interface HandoffTicket {
    meta: {
        id: string;
        source: string;
        target: string;
    };
    state: {
        status: "BUFFERED" | "STUCK" | "RESOLVED";
        context_summary: string;
    };
    files_focus: string[];
    created_at: string;
}

export function createHandoffTicket(summary: string, files: string[]): HandoffTicket {
    return {
        meta: {
            id: `handoff_${Date.now()}`,
            source: "replit-worker-1",
            target: "architect"
        },
        state: {
            status: "BUFFERED",
            context_summary: summary
        },
        files_focus: files,
        created_at: new Date().toISOString()
    };
}
