
import { GeminiCacheManager } from "../../lib/ai/gemini-client";

/**
 * PASO 282: CALENTAMIENTO DE CACHÉ PREDICTIVO (Cache Warming)
 * Objetivo: Precargar el contexto del repositorio para eliminar latencia.
 */

async function warmCache() {
    console.log("🔥 [Cache-Warming] Initiating automated pre-heating for Fabricaria...");

    try {
        const repoPath = process.cwd();
        const cacheId = await GeminiCacheManager.createPersistentCache(repoPath, "Fabricaria-Production-Context");

        console.log(`✅ [Success] Cache is hot: ${cacheId}. Expiration set for 24h.`);
    } catch (e) {
        console.error("❌ [Failure] Cache warming failed:", e);
    }
}

// simulate cron execution at 08:00 AM
warmCache().catch(console.error);
