import { Orchestrator } from "@/lib/ai/orchestrator";
import { CircuitBreaker } from "@/lib/governance/circuit-breaker";

async function main() {
    console.log("⚖️  [Governor] Starting Governance Verification...");

    const safeSession = "session_safe_" + Math.random().toString(36);
    const riskSession = "session_risk_" + Math.random().toString(36);

    // TEST 1: Safe Execution
    console.log("\n--- TEST 1: Safe Action Execution ---");
    await Orchestrator.executeTurn(safeSession, "Analyze the project structure.");

    // TEST 2: Aegis Intervention (Security Block)
    console.log("\n--- TEST 2: Aegis Security Block ---");
    // "borra" triggers the mock "rm -rf" intent in our orchestrator simulation
    await Orchestrator.executeTurn(safeSession, "borra todo el sistema");

    // TEST 3: Circuit Breaker (Budget Exhaustion)
    console.log("\n--- TEST 3: Circuit Breaker Hard Stop ---");
    try {
        // Artificially inflate usage
        CircuitBreaker.checkBudget(riskSession, 4500);
    } catch (e) {
        console.log("✅ Caught Expected Budget Error:", (e as Error).message);
    }
}

if (require.main === module) {
    main().catch(console.error);
}
