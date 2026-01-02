/**
 * SWARM PROTOCOL: Handoff State Schema
 * Defines the data structure transferred from the Brain (Central) to the Hand (Repl).
 */

export interface Intent {
    summary: string;
    files_focus?: string[];
    constraints?: string[];
}

export interface HandoffState {
    /** Unique Transaction ID for the Handoff */
    id: string;

    /** Timestamp of the handoff creation */
    timestamp: string;

    /** The role the new agent should assume */
    target_role: 'Architect' | 'Builder' | 'QA' | 'FullStack';

    /** The core mission/task intent */
    intent: Intent;

    /** Reference to the specific memory vector in Neon (Cold Memory) */
    memory_ref?: string;

    /** Optional: Pre-computed context cache ID (Hot Memory) if available */
    context_cache_id?: string;
}
