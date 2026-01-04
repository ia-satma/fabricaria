
import { db } from "../db/index";
import { sql } from "drizzle-orm";

/**
 * AEGIS RLS ENFORCEMENT (Step 54)
 * Activa Row Level Security en el kernel de Postgres para proteger los datos de los agentes.
 */

async function applyRLS() {
    console.log("🛡️ [Aegis] Infiltrating database kernel to enable RLS...");

    const tables = [
        "learned_patterns",
        "fabrication_queue",
        "token_usage_logs",
        "agent_memories",
        "security_logs"
    ];

    try {
        for (const table of tables) {
            console.log(`🔒 [RLS] Hardening table: ${table}`);

            // 1. Enable RLS
            await db.execute(sql.raw(`ALTER TABLE ${table} ENABLE ROW LEVEL SECURITY;`));

            // 2. Clear existing policies to avoid duplicates
            await db.execute(sql.raw(`DROP POLICY IF EXISTS ${table}_tenant_isolation ON ${table};`));

            // 3. Create isolation policy
            // This policy ensures a role can only see rows where tenant_id matches the session variable
            await db.execute(sql.raw(`
                CREATE POLICY ${table}_tenant_isolation ON ${table}
                USING (tenant_id = current_setting('app.current_tenant')::uuid);
            `));

            console.log(`✅ [RLS] Table ${table} is now isolated.`);
        }

        console.log("🦾 [Aegis] RLS Data Wall is now ACTIVE.");
    } catch (error) {
        console.error("❌ [Aegis] RLS Enforcement failed:", error);
        process.exit(1);
    }
}

applyRLS();
