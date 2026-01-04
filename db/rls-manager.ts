
import { db } from "../db";
import { sql } from "drizzle-orm";

/**
 * RLS MANAGER (Step 34)
 * Enforces Row Level Security at the database session level.
 */

export async function withTenant<T>(tenantId: string, callback: () => Promise<T>): Promise<T> {
    // We use a transaction to ensure SET LOCAL persists correctly for the queries within the callback
    return await db.transaction(async (tx) => {
        console.log(`🏰 [RLS] Setting tenant context: ${tenantId}`);

        // SET LOCAL app.current_tenant ensures isolation within this transaction
        await tx.execute(sql`SET LOCAL app.current_tenant = ${tenantId}`);

        try {
            const result = await callback();
            return result;
        } catch (error) {
            console.error(`❌ [RLS] Error in tenant context:`, error);
            throw error;
        }
    });
}
