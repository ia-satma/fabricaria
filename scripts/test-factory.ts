import { FactoryService } from "@/lib/factory/service";
import { HandoffState } from "@/lib/swarm/schema";

// Note: This test requires REPLIT_SID env var to actually work against Replit API.
// Without it, it will fail or we can mock request library behaviour if needed.
// For now, we assume user might dry-run or just verify logic compilation.

async function main() {
    console.log("🏭 Starting Factory Verification...");

    const projectName = `Fabricaria-Client-${Math.random().toString(36).substring(7)}`;

    // Create Mock Handoff
    const handoff: HandoffState = {
        id: "tx_" + Math.random().toString(36).substring(7),
        timestamp: new Date().toISOString(),
        target_role: "Architect",
        intent: {
            summary: "Build a high-performance POS system for a retail client.",
            files_focus: ["lib/billing", "features/checkout"],
            constraints: ["ISO 27001 Compliance", "Latency < 100ms"]
        },
        memory_ref: "vec_55a2b...",
        context_cache_id: "cache_99x8z..."
    };

    try {
        console.log("🚀 Initiating Handoff Provisioning...");
        const result = await FactoryService.provisionProject(projectName, handoff);
        console.log("✅ Provisioning Result:", result);
    } catch (error) {
        console.error("❌ Provisioning Failed:", error);
    }
}

// Check if run directly
if (require.main === module) {
    main().catch(console.error);
}
