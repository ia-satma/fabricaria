
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

/**
 * SWARM RETURN TRIP (Step 89)
 * Goal: Automate synchronization when a remote agent completes a task.
 */

async function watchHandoff() {
    console.log("👀 [Git-Watcher] Watching for TASK_COMPLETED signal...");

    const handoffPath = path.join(process.cwd(), '.agent/handoff.json');

    setInterval(async () => {
        try {
            // 1. Check for git updates (polling)
            console.log("🔄 [Git-Watcher] Polling remote for completion...");
            execSync('git fetch origin main');
            const diff = execSync('git diff main origin/main -- .agent/handoff.json').toString();

            if (diff.includes('"status": "COMPLETED"')) {
                console.log("🚀 [Git-Watcher] TASK_COMPLETED detected! Syncing project...");

                execSync('git pull origin main');

                // 2. Read handoff and trigger verification
                if (fs.existsSync(handoffPath)) {
                    const handoff = JSON.parse(fs.readFileSync(handoffPath, 'utf8'));
                    console.log(`🤝 [Git-Watcher] Handoff from ${handoff.source} accepted. Running tests...`);

                    try {
                        execSync('npm test', { stdio: 'inherit' });
                        console.log("✅ [Git-Watcher] All systems GREEN. Mission Accomplished.");
                    } catch (testError) {
                        console.error("❌ [Git-Watcher] Integration tests failed after handoff!");
                    }
                }
            }
        } catch (error) {
            // Silence expected noise during polling
        }
    }, 60000); // 1 minute interval
}

if (require.main === module) {
    watchHandoff().catch(console.error);
}
