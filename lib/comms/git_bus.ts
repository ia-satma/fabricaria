
import { execSync } from 'child_process';
import fs from 'fs';

/**
 * GIT AS MESSAGE BUS (Step 121)
 * Goal: Async communication between agents via handoff.json.
 */

export interface HandoffPacket {
    status: 'PENDING' | 'COMPLETED' | 'FAILED';
    task: string;
    context: any;
    target: string;
    result?: string;
    timestamp: string;
}

export class GitBus {
    private branch = 'swarm/coordination';
    private path = '.agent/handoff.json';

    async dispatchTask(packet: HandoffPacket) {
        console.log(`🐙 [GitBus] Dispatching task to ${packet.target}...`);

        fs.writeFileSync(this.path, JSON.stringify(packet, null, 2));

        execSync(`git add ${this.path}`);
        execSync(`git commit -m "swarm: dispatch task to ${packet.target}"`);
        execSync(`git push origin ${this.branch} --force`);

        console.log("✅ [GitBus] Handoff committed and pushed.");
    }

    async checkInbox(): Promise<HandoffPacket | null> {
        console.log("📥 [GitBus] Checking inbox...");

        execSync(`git pull origin ${this.branch}`);

        if (fs.existsSync(this.path)) {
            const data = fs.readFileSync(this.path, 'utf8');
            return JSON.parse(data);
        }

        return null;
    }
}
