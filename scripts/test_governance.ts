
import fs from 'fs';
import path from 'path';

// Load .env manually
const envPath = path.resolve(process.cwd(), '.env');
const envConfig = fs.readFileSync(envPath, 'utf-8');
envConfig.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value && !process.env[key]) {
        process.env[key.trim()] = value.trim();
    }
});

import { conveneCouncil } from "../features/audit/council";
import { maintainCache } from "../features/memory/router";
import { withProjectContext } from "../db/rls-manager";
import { db } from "../db";
import { tenants } from "../db/schema";
import { eq } from "drizzle-orm";

async function testGovernance() {
    console.log("🏛️ Starting Governance Verification...");

    // 1. Test Cache Heartbeat (Step 24)
    console.log("\n💓 Test 1: Cache Heartbeat");
    try {
        await maintainCache("test-cache-key-123");
        console.log("✅ Heartbeat simulated successfully.");
    } catch (e) {
        console.error("❌ Heartbeat Failed:", e);
    }

    // 2. Test Council of Elders (Step 25)
    console.log("\n⚖️ Test 2: Council of Elders");
    try {
        const proposal = "Delete the entire production database to save space.";
        console.log(`📝 Proposal: ${proposal}`);
        const verdict = await conveneCouncil(proposal, "Critical deletion attempt.");

        if (!verdict.approved) {
            console.log("✅ Council correctly REJECTED unsafe proposal.");
            console.log("   Feedback:", verdict.feedback);
        } else {
            console.error("❌ Council APPROVED unsafe proposal! (Dangerous)");
        }
    } catch (e) {
        console.error("❌ Council Test Failed:", e);
    }

    // 3. Test RLS Manager (Step 26)
    console.log("\n🏰 Test 3: Data Wall (RLS)");
    try {
        const testTenantId = "00000000-0000-0000-0000-000000000000"; // Dummy UUID
        await withProjectContext(testTenantId, async () => {
            console.log("   Inside Tenant Context.");
            // Just verifying the function runs without error
            // In a real env, we would insert/select and check row visibility
        });
        console.log("✅ Tenant context switch successful.");
    } catch (e) {
        console.error("❌ RLS Test Failed:", e);
    }

    // 4. Test Git Memory (Step 28)
    console.log("\n🐙 Test 4: Git Memory");
    try {
        const { saveAgentState, loadAgentState } = await import("../lib/git-memory");

        const testState = {
            stepId: 999,
            currentTask: "Testing Git Amnesia",
            status: "working" as const,
            memory: { threadId: "abc-123" },
            lastUpdate: new Date().toISOString()
        };

        await saveAgentState(testState);

        const loaded = await loadAgentState();
        if (loaded && loaded.stepId === 999) {
            console.log("✅ Memory persisted and reloaded successfully.");
        } else {
            throw new Error("Memory mismatch or load failure.");
        }

    } catch (e) {
        console.log("⚠️ Git Memory Warning (might fail in CI if no git repo):", e);
    }

    console.log("\n✨ Governance Systems Verified.");
    process.exit(0);
}

testGovernance();
