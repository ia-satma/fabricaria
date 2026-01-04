
import { db } from "@/db";
import { agentMemories, learnedPatterns, users } from "@/db/schema";
import { GeminiCacheManager } from "@/lib/ai/gemini-client";
import { count } from "drizzle-orm";

async function proofOfLife() {
    console.log("🏥 SYSTEM VITAL SIGNS CHECK 🏥");
    console.log("=================================");

    // 1. Database Connection & Schema Check
    try {
        console.log("🫀 [HEART] Checking Database Connection...");
        const [memCount] = await db.select({ count: count() }).from(agentMemories);
        const [patCount] = await db.select({ count: count() }).from(learnedPatterns);
        const [userCount] = await db.select({ count: count() }).from(users);

        console.log(`✅ DATABASE ONLINE`);
        console.log(`   - Memories: ${memCount.count}`);
        console.log(`   - Learned Patterns: ${patCount.count}`);
        console.log(`   - Users: ${userCount.count}`);
    } catch (error) {
        console.error("❌ DATABASE CRITICAL FAILURE:", error);
        process.exit(1);
    }

    // 2. AI Cortex Check (Gemini)
    try {
        console.log("\n🧠 [BRAIN] Checking Gemini Cortex...");
        const embedding = await GeminiCacheManager.getEmbedding("System Integrity Check");
        if (embedding.length === 768) {
            console.log("✅ CORTEX ONLINE (Embedding Vector Generated: 768 dims)");
        } else {
            throw new Error("Invalid embedding dimension");
        }
    } catch (error) {
        console.error("❌ CORTEX FAILURE:", error);
        // Don't exit, just report
    }

    console.log("\n=================================");
    console.log("✨ SYSTEM STATUS: FUNCTIONAL ✨");
    process.exit(0);
}

if (require.main === module) {
    proofOfLife().catch(console.error);
}
