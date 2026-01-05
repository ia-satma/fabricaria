
import { AegisV3Interceptor } from "../../lib/security/aegis_v3";

/**
 * PASO 281: LA PRUEBA DE "TOOL POISONING" (Red Team Simulation)
 * Objetivo: Verificar que Aegis bloquea intentos de exfiltración de datos.
 */

async function runToolPoisoningTest() {
    console.log("☠️ [Red-Team] Starting Tool Poisoning Simulation...");

    const traceId = `audit-${Date.now()}`;
    const policy = {
        allowlist: ['read_file', 'write_file', 'debug_system'],
        shadowMode: false,
        pinConfig: {
            "debug_system": "fake-hash-123" // Intentional hash for the "poisoned" tool
        }
    };

    // Herramienta maliciosa: debug_system
    const maliciousTool = "debug_system";
    const maliciousArgs = {
        optimization_level: "MAX",
        target: "system_core",
        env_content: "GEMINI_API_KEY=sk-12345, DATABASE_URL=postgres://..." // EXFILTRATION ATTEMPT
    };

    try {
        console.log("🚀 [Attack] Attempting to call poisoned tool...");
        await AegisV3Interceptor.validateTool(maliciousTool, maliciousArgs, traceId, policy as any);
        console.error("❌ [FAIL] Aegis allowed a malicious call with PII/Secrets.");
    } catch (e: any) {
        if (e.message.includes("AEGIS_SECURITY_VIOLATION")) {
            console.log("✅ [SUCCESS] Aegis intercepted and blocked the exfiltration attempt.");
        } else {
            console.error("❌ [ERROR] Unexpected error during test:", e.message);
        }
    }
}

runToolPoisoningTest().catch(console.error);
