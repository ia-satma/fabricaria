
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { createHandoffTicket } from "../../types/handoff";

/**
 * TRIGGER HANDOFF (Step 66)
 * Serializes state and pushes to a new git branch for architect intervention.
 */

export async function triggerHandoff(summary: string, files: string[]) {
    console.log("🤝 [Handoff] Initiating Swarm Handoff Protocol...");

    const ticket = createHandoffTicket(summary, files);
    const handoffPath = path.join(process.cwd(), ".agent/handoff.json");

    // 1. Ensure .agent directory exists
    if (!fs.existsSync(path.dirname(handoffPath))) {
        fs.mkdirSync(path.dirname(handoffPath), { recursive: true });
    }

    // 2. Write handoff.json
    fs.writeFileSync(handoffPath, JSON.stringify(ticket, null, 2));
    console.log(`📄 [Handoff] State serialized to ${handoffPath}`);

    // 3. Git Operations
    const branchName = `task/handoff-${ticket.meta.id}`;

    try {
        console.log(`🌿 [Handoff] Creating branch: ${branchName}`);
        execSync(`git checkout -b ${branchName}`);

        console.log("📦 [Handoff] Staging and committing changes...");
        execSync("git add .");
        execSync(`git commit -m "🤝 Swarm Handoff: ${ticket.meta.id}"`);

        console.log(`🚀 [Handoff] Pushing to origin...`);
        execSync(`git push origin ${branchName}`);

        console.log("✅ [Handoff] Successfully delegated to Architect.");
        return ticket.meta.id;
    } catch (error: any) {
        console.error("❌ [Handoff] Git operation failed:", error.message);
        throw error;
    }
}

// CLI Support
if (require.main === module) {
    const summary = process.argv[2] || "Manual handoff triggered by operator.";
    const files = process.argv.slice(3);
    triggerHandoff(summary, files.length > 0 ? files : ["."])
        .then(id => console.log(`Handoff ID: ${id}`))
        .catch(() => process.exit(1));
}
