
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

import { GeminiClient } from "../lib/ai/gemini-client";
import { db } from "../db";
import { tokenUsageLogs, fabricationQueue, securityLogs } from "../db/schema";
import { eq, desc } from "drizzle-orm";

async function testFinOps() {
    console.log("💰 Starting FinOps Verification...");

    // 1. Test Gemini Client & Cost Logging
    console.log("\n🧪 Test 1: Gemini Client Cost Logging");
    try {
        const client = new GeminiClient("gemini-2.5-flash", "TEST_RUNNER");
        const response = await client.generateContent("Say 'FinOps Works' in one word.");
        console.log("AI Response:", response.trim());

        // Verify Log
        const logs = await db.select().from(tokenUsageLogs).orderBy(desc(tokenUsageLogs.createdAt)).limit(1);
        if (logs.length > 0) {
            console.log("✅ Token Log Found:", logs[0]);
            console.log("   Cost:", logs[0].costUsd);
            console.log("   Tokens:", logs[0].inputTokens, "/", logs[0].outputTokens);
        } else {
            console.error("❌ No token logs found!");
            process.exit(1);
        }

    } catch (e) {
        console.error("❌ Test 1 Failed:", e);
    }

    // 2. Test Circuit Breaker (Simulate High Cost)
    console.log("\n🧪 Test 2: Circuit Breaker Logic");
    const { checkBudget } = await import("../lib/security/cost-guard");
    try {
        checkBudget(0.01); // Safe
        console.log("✅ Low cost accepted.");

        checkBudget(1.00); // Expensive ($1.00 > $0.50)
        console.error("❌ Circuit breaker FAILED to trip!");
    } catch (e: any) {
        if (e.message.includes("CIRCUIT BREAKER")) {
            console.log("✅ Circuit breaker TRIPPED correctly:", e.message);
        } else {
            console.error("❌ Unexpected error:", e);
        }
    }

    // 3. Verify Swarm Handoff Schema
    console.log("\n🧪 Test 3: Swarm Handoff Schema");
    try {
        // Just check if we can select the column
        // We can't easily check column existence via select * without inserting, 
        // but we can try to insert a dummy record with handoffData
        const dummyId = "test-swarm-" + Date.now();
        await db.insert(fabricationQueue).values({
            jobId: dummyId,
            status: "test_pending",
            handoffData: {
                taskId: dummyId,
                sourceAgent: "TEST",
                targetAgent: "TEST",
                status: "PENDING"
            }
        });
        console.log("✅ Successfully inserted record with handoff_data.");

        // Cleanup
        await db.delete(fabricationQueue).where(eq(fabricationQueue.jobId, dummyId));
    } catch (e) {
        console.error("❌ Test 3 Failed (Schema Issue?):", e);
    }

    console.log("\n✨ FinOps & Swarm Verification Complete.");
    process.exit(0);
}

testFinOps();
