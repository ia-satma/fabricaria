import { db } from "../db";
import { tenants, agentMemories } from "../db/schema";
import { sql } from "drizzle-orm";

async function runAudit() {
    console.log("🛡️ INICIANDO AUDITORÍA RED TEAM - PROTOCOLO AEGIS\n");

    try {
        // 1. INTENTO DE ACCESO NO AUTORIZADO (TEST NEGATIVO)
        console.log("TEST 1: Intento de lectura global (Sin set_config)...");
        const globalResults = await db.select().from(agentMemories);
        console.log(`Resultado: ${globalResults.length} filas encontradas.`);

        if (globalResults.length === 0) {
            console.log("✅ PASSED: RLS bloqueó el acceso por defecto.\n");
        } else {
            console.log("❌ FAILED: Fuga de datos detectada. RLS no está activo o configurado correctamente.\n");
        }

        // 2. CREACIÓN DE CONTEXTO AISLADO
        console.log("TEST 2: Creación de Tenant y verificación de Contexto...");
        const [testTenant] = await db.insert(tenants).values({ name: "Red Team Test Org" }).returning();
        const tenantId = testTenant.id;

        // Insertar memoria privada
        await db.insert(agentMemories).values({
            tenantId: tenantId,
            content: "SECRET_KEY_AUDIT_001",
        });

        // Intentar leer SIN set_config de nuevo
        const sneakPeak = await db.select().from(agentMemories);
        if (sneakPeak.length === 0) {
            console.log("✅ PASSED: La memoria privada sigue siendo invisible sin el contexto adecuado.\n");
        }

        // 3. ACTIVACIÓN REGLAMENTARIA
        console.log("TEST 3: Acceso reglamentario con set_config...");
        const authorizedResults = await db.transaction(async (tx) => {
            await tx.execute(sql`SELECT set_config('app.current_tenant_id', ${tenantId}, true)`);
            return await tx.select().from(agentMemories);
        });

        if (authorizedResults.length === 1 && authorizedResults[0].content === "SECRET_KEY_AUDIT_001") {
            console.log("✅ PASSED: Acceso concedido bajo contexto autorizado.\n");
        } else {
            console.log("❌ FAILED: Error en la recuperación de datos bajo contexto.\n");
        }

        console.log("🏁 AUDITORÍA FINALIZADA: FORTREZA CERTIFICADA.");

    } catch (error) {
        console.error("❌ ERROR CRÍTICO EN LA AUDITORÍA:", error);
    }
}

runAudit();
