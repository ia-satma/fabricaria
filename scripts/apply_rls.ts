
import { db } from "../db";
import { sql } from "drizzle-orm";

async function applyRLS() {
    console.log("🛡️ [RLS] Applying Row-Level Security to agent_memories...");
    try {
        await db.execute(sql`ALTER TABLE agent_memories ENABLE ROW LEVEL SECURITY;`);
        await db.execute(sql`DROP POLICY IF EXISTS tenant_isolation ON agent_memories;`);
        await db.execute(sql`CREATE POLICY tenant_isolation ON agent_memories 
                             USING (tenant_id::text = current_setting('app.current_tenant', true));`);
        console.log("✅ [RLS] Security policy applied successfully.");
    } catch (e) {
        console.error("❌ [RLS] Failed to apply security policy:", e);
    }
}

applyRLS();
