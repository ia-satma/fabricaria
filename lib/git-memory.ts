
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import util from 'util';

const execAsync = util.promisify(exec);

/**
 * GIT MEMORY (Step 28)
 * Persists agent state to a Git repository to prevent amnesia.
 */

export interface AgentState {
    stepId: number;
    currentTask: string;
    status: 'working' | 'idle' | 'failed';
    memory: Record<string, any>;
    lastUpdate: string;
}

const MEMORY_FILE = path.resolve(process.cwd(), '.agent/memory.json');

export async function saveAgentState(state: AgentState): Promise<void> {
    try {
        // 1. Ensure directory exists
        const dir = path.dirname(MEMORY_FILE);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        // 2. Write State
        const payload = JSON.stringify(state, null, 2);
        fs.writeFileSync(MEMORY_FILE, payload);
        console.log(`🐙 [Git Memory] saved to ${MEMORY_FILE}`);

        // 3. Git Commit (Auto-WIP)
        // We avoid blocking too long, but we want persistence.
        await execAsync(`git add "${MEMORY_FILE}"`);
        await execAsync(`git commit -m "chore(agent): update memory state [${state.stepId}]" --no-verify`);
        console.log(`🐙 [Git Memory] Committed state to history.`);

    } catch (error) {
        console.error("❌ Failed to save Git Memory:", error);
    }
}

export async function loadAgentState(): Promise<AgentState | null> {
    try {
        if (!fs.existsSync(MEMORY_FILE)) return null;

        const content = fs.readFileSync(MEMORY_FILE, 'utf-8');
        return JSON.parse(content) as AgentState;
    } catch (error) {
        console.error("❌ Failed to load Git Memory:", error);
        return null;
    }
}
