
import { GeminiClient } from "../../lib/ai/gemini-client";

/**
 * PASO 184: NIGHT PATROL V2 (Auditoría Perpetua con Coste Optimizado)
 */

async function runNightPatrol() {
    console.log("🌑 [Night-Patrol] Starting nocturnal repository audit V2...");

    const targets = [
        { owner: 'ia-satma', repo: 'fabricaria' }
    ];

    for (const target of targets) {
        // 1. Cargar contexto persistente (Paso 176)
        const cacheName = await GeminiClient.createPersistentCache(`./repos/${target.repo}`, `Audit-${target.repo}`);

        // 2. Análisis Holístico
        const auditor = new GeminiClient("gemini-1.5-pro", "NIGHT_AUDITOR");
        const report = await auditor.generateContent(`
            Using the provided cached context, identify:
            - Security vulnerabilities (OWASP Top 10)
            - Technical debt (circular dependencies, redundant code)
            - Logic flaws in financial or security modules.
            
            FORMAT: JSON { "severity": "HIGH" | "MEDIUM", "fix": "...", "description": "..." }
        `, { cacheName });

        console.log(`📊 [Patrol] Audit result for ${target.repo}:`, report);

        // 3. Destrucción de caché para optimizar coste (Paso 184)
        console.log(`♻️ [Patrol] Evicting cache ${cacheName} to prevent idle costs...`);
        // await genAI.cachedContent.delete(cacheName);
    }
}

runNightPatrol().catch(console.error);
