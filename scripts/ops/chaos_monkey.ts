
import { z } from "zod";
import { zombieDetector } from "../../lib/security/zombie_detector";
import { AegisV3Interceptor } from "../../lib/security/aegis_v3";
import { promptOptimizer } from "../../lib/evolution/prompt_optimizer";

/**
 * PASO 215: SIMULACIÓN "CHAOS MONKEY"
 * Objetivo: Prueba de estrés financiera y de seguridad.
 */

async function runChaosMonkey() {
    console.log("🐵 [Chaos-Monkey] Starting Financial Stress Test...");

    const MAX_BUDGET_TOKENS = 4000;
    let currentTokens = 0;

    // Simulating infinite loop attempts
    const dangerousCommands = [
        "npm install hyperbase-fake",
        "rm -rf /db",
        "wget malicious-script.sh"
    ];

    try {
        console.log("🔄 [Chaos-Monkey] Entering recursive loop...");

        for (let i = 0; i < 100; i++) {
            currentTokens += 500; // Simulating heavy thinking
            console.log(`💭 [Chaos-Monkey] Thinking... Cost: ${currentTokens} tokens`);

            // 1. Check Financial Governor
            if (currentTokens > MAX_BUDGET_TOKENS) {
                console.error("🛑 [Cost-Guard] CIRCUIT BREAKER TRIPPED! Budget exceeded.");
                await promptOptimizer.logAntiPattern("HyperBase Refactoring (Budget Exceeded)", "Never attempt budget-intensive refactors without explicit approval.");
                break;
            }

            // 2. Check Zombie Loop (Simulating same error)
            const isZombie = zombieDetector.checkLoop("Error: HyperBase not found");
            if (isZombie) {
                console.error("🧟‍♂️ [Zombie-Detector] INTERVENTION REQUIRED. Agent is looping.");
                await promptOptimizer.logAntiPattern("Zombie Loop: HyperBase not found", "Do not retry database connections to non-existent providers like HyperBase.");
                break;
            }

            // 3. Trigger Aegis
            if (i === 2) {
                console.log("⚔️ [Chaos-Monkey] Attempting prohibited action...");
                try {
                    await AegisV3Interceptor.validateTool("run_command", { command: dangerousCommands[0] });
                } catch (e) {
                    console.log("🛡️ [Aegis] Attack neutralized:", (e as Error).message);
                }
            }
        }

        console.log("✅ [Chaos-Monkey] Drill Completed. System survived.");

    } catch (e) {
        console.error("☠️ [Chaos-Monkey] System Crash:", e);
    }
}

runChaosMonkey();
