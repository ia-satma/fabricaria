
import { db } from "../db";
import { AegisV3Interceptor } from "../lib/security/aegis_v3";
import { GeminiClient } from "../lib/ai/gemini-client";
import { Chronicler } from "../lib/legacy/chronicler";

/**
 * PASO 291: EL SCRIPT "GÉNESIS" (Orquestador Maestro)
 * Objetivo: Despertar el enjambre y verificar integridad.
 */

async function genesis() {
    console.log("🌌 [Genesis] Initiating Swarm Awakening...");

    // 1. Verificar Bases de Datos
    try {
        await db.execute(sql`SELECT 1`);
        console.log("✅ [System] Neon Database synchronized.");
    } catch (e) {
        console.error("❌ [Critical] Neon Database connection failed!");
        process.exit(1);
    }

    // 2. Sellar documentación (PASO 296)
    console.log("✍️ [System] Compiling final operator manual...");
    await Chronicler.documentSystem();

    // 3. Despertar al Arquitecto
    console.log("🚀 [System] Waking up ARCHITECT-ALPHA...");
    const architect = new GeminiClient("gemini-1.5-pro", "ARCHITECT_ALPHA");

    const missionStatus = await architect.generateContent("STATUS_CHECK: Report system health and pending objectives.", {
        skipTSIP: true
    });

    console.log(`🤖 [Architect] ${missionStatus}`);
    console.log("🌟 [Genesis] FABRICAR.IA is now operational and autonomous.");
}

import { sql } from "drizzle-orm";

genesis().catch(console.error);
