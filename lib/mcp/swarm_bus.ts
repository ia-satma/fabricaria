
import fs from 'fs';
import path from 'path';

/**
 * PASO 204: BUS DE ENJAMBRE VÍA GIT (Handoff Protocol)
 */

export class SwarmHandoffBus {
    private handoffPath = path.join(process.cwd(), '.swarm/handoff.json');

    async sendRequest(targetAgent: string, task: string, context: any) {
        console.log(`🐙 [Swarm-Bus] Routing task to ${targetAgent}...`);

        const payload = {
            id: crypto.randomUUID(),
            status: 'BUFFERED',
            target: targetAgent,
            task,
            context,
            timestamp: new Date().toISOString()
        };

        if (!fs.existsSync('.swarm')) fs.mkdirSync('.swarm');
        fs.writeFileSync(this.handoffPath, JSON.stringify(payload, null, 2));

        console.log("📤 [Swarm-Bus] Payload buffered. Waiting for git-sync...");
    }

    async pollResponse(): Promise<any | null> {
        if (!fs.existsSync(this.handoffPath)) return null;
        const data = JSON.parse(fs.readFileSync(this.handoffPath, 'utf8'));

        if (data.status === 'COMPLETED') {
            console.log("📥 [Swarm-Bus] Task completion received!");
            return data.result;
        }
        return null;
    }
}

export const swarmBus = new SwarmHandoffBus();
