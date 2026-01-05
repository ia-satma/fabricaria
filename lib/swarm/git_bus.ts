
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

/**
 * PASO 261: EL PUENTE GIT (Bus de Mensajes Asíncrono)
 */

export interface HandoffPacket {
    id: string;
    sourceAgent: string;
    targetRole: string;
    status: "BUFFERED" | "IN_PROGRESS" | "COMPLETED";
    context: {
        last_prompt: string;
        files: string[];
        error?: string;
    };
}

export class GitSwarmBus {
    private repoPath: string;

    constructor(repoPath: string = process.cwd()) {
        this.repoPath = repoPath;
    }

    async emitHandoff(packet: HandoffPacket) {
        console.log(`🌉 [Git-Bus] Emitting handoff packet: ${packet.id}`);

        const handoffPath = path.join(this.repoPath, ".swarm", `handoff_${packet.id}.json`);
        if (!fs.existsSync(path.dirname(handoffPath))) {
            fs.mkdirSync(path.dirname(handoffPath), { recursive: true });
        }

        fs.writeFileSync(handoffPath, JSON.stringify(packet, null, 2));

        try {
            // Push asíncrono para notificar al vigilante
            execSync(`git add .swarm/handoff_${packet.id}.json`, { cwd: this.repoPath });
            execSync(`git commit -m "SWARM_HANDOFF: ${packet.id} for ${packet.targetRole}"`, { cwd: this.repoPath });
            execSync(`git push origin swarm/coordination`, { cwd: this.repoPath });
            console.log("✅ [Git-Bus] Packet pushed to swarm/coordination branch.");
        } catch (e) {
            console.warn("⚠️ [Git-Bus] Failed to push to remote. Local buffer remains.", e);
        }
    }

    static async receiveHandoff(handoffId: string): Promise<HandoffPacket | null> {
        const handoffPath = path.join(process.cwd(), ".swarm", `handoff_${handoffId}.json`);
        if (!fs.existsSync(handoffPath)) return null;
        return JSON.parse(fs.readFileSync(handoffPath, 'utf8'));
    }
}
