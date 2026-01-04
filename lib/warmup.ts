
/**
 * MITIGACIÓN DE COLD STARTS (Step 139)
 * Objetivo: Minimizar la latencia de arranque mediante imports dinámicos y pings.
 */

export async function getHeavyModule(moduleName: 'playwright' | 'cheerio' | 'axios') {
    console.log(`🔥 [Warmup] Loading heavy module: ${moduleName}`);
    switch (moduleName) {
        case 'playwright': return await import('playwright');
        case 'cheerio': return await import('cheerio');
        case 'axios': return await import('axios');
    }
}

export function startKeepAlive() {
    if (process.env.NODE_ENV === 'production') {
        console.log("🚀 [Warmup] Starting Keep-Alive pinger (every 10m)...");
        setInterval(async () => {
            try {
                const response = await fetch(`http://${process.env.HOST || 'localhost'}:${process.env.PORT || 3000}/health`);
                console.log(`💓 [Warmup] Heartbeat: ${response.status}`);
            } catch (e) {
                console.warn("⚠️ [Warmup] Heartbeat failed.");
            }
        }, 10 * 60 * 1000);
    }
}
