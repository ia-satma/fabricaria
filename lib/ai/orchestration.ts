
import { GeminiClient } from "./gemini-client";
import { CostGuard } from "../security/cost_guard";

/**
 * PASO 190: PROTOCOLO DE TRANSMUTACIÓN (Architect-Builder)
 * Objetivo: Einstein (Pro) planea, Velocista (Flash) ejecuta.
 */

export class HybridOrchestrator {
    static async executeTask(objective: string) {
        const sessionId = `session_${Date.now()}`;
        console.log(`🏎️ [Hybrid] Starting high-efficiency execution for session: ${sessionId}`);

        try {
            // STEP 1: EINSTEIN (Architect - Pro)
            console.log("🧠 [Hybrid] Architect (Gemini Pro) is heavy thinking...");
            const architect = new GeminiClient("gemini-1.5-pro", "ARCHITECT");
            const planJson = await architect.generateContent(`
                Objective: ${objective}
                Create a surgical coding plan. Respond only in JSON.
            `);

            // Track cost
            await CostGuard.trackAndVerify(sessionId, 1200, "pro"); // Mock token count

            // STEP 2: VELOCISTA (Builder - Flash)
            console.log("⚡ [Hybrid] Builder (Gemini Flash) is hyper-executing...");
            const builder = new GeminiClient("gemini-1.5-flash", "BUILDER");
            const result = await builder.generateContent(`
                Execute this precise plan:
                ${planJson}
            `);

            await CostGuard.trackAndVerify(sessionId, 1500, "flash");

            return result;
        } catch (e) {
            console.error("❌ [Hybrid] Orchestration failure:", e);
            throw e;
        }
    }
}
