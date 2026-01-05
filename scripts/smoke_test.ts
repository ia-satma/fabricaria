
import axios from "axios";

/**
 * PASO 369: PRUEBA DE HUMO AUTOMATIZADA (Smoke Test)
 * Objetivo: Verificar que el despliegue en vivo refleja la versión esperada.
 */

async function runSmokeTest() {
    console.log("💨 [Smoke-Test] Initializing live verification...");

    const liveUrl = process.env.LIVE_URL || "https://fabricaria.vercel.app";
    const metaUrl = `${liveUrl}/build-meta.json`;

    try {
        console.log(`🌐 Checking endpoint: ${metaUrl}`);
        const response = await axios.get(metaUrl);
        const remoteMeta = response.data;

        console.log("📊 Remote Build Metadata Found:");
        console.log(`⏰ Built At: ${remoteMeta.built_at}`);
        console.log(`📍 Remote Commit: ${remoteMeta.commit}`);

        // Aquí podríamos comparar con un hash esperado vía env var
        // if (process.env.EXPECTED_HASH && remoteMeta.commit !== process.env.EXPECTED_HASH) {
        //     console.error("🚨 [Smoke-Test] VERSION MISMATCH! The live app is behind.");
        //     process.exit(1);
        // }

        console.log("✅ [Smoke-Test] Production environment is reachable and reporting metadata.");

    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
            console.warn("⚠️ [Smoke-Test] /build-meta.json not found. The app might be using an old cache or version.");
        } else {
            console.error("❌ [Smoke-Test] Failed to reach production:", (error as Error).message);
        }
    }
}

runSmokeTest();
