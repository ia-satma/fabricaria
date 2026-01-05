
import { db } from "../../db";
import { sql } from "drizzle-orm";

/**
 * PASO 237: AISLAMIENTO RLS (Row-Level Security)
 * Objetivo: Garantizar aislamiento físico entre tenants en Neon.
 */

export async function applyRLSPolicies() {
    console.log("🛡️ [Security-RLS] Phase 27: Applying Row-Level Security policies...");

    // 1. Habilitar RLS en tablas críticas
    await db.execute(sql`ALTER TABLE thought_traces ENABLE ROW LEVEL SECURITY`);
    await db.execute(sql`ALTER TABLE token_usage_logs ENABLE ROW LEVEL SECURITY`);

    // 2. Crear política de aislamiento basada en 'app.current_tenant'
    // Esta setting se debe configurar en cada conexión: SET LOCAL app.current_tenant = 'uuid'
    await db.execute(sql`
        DO $$ 
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation') THEN
                CREATE POLICY tenant_isolation ON thought_traces
                USING (session_id::text = current_setting('app.current_tenant', true));

                CREATE POLICY tenant_isolation ON token_usage_logs
                USING (agent_type = current_setting('app.current_tenant', true));
            END IF;
        END $$;
    `);

    console.log("✅ [Security-RLS] Multi-tenant isolation active in Neon.");
}
