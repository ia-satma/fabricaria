
import crypto from "crypto";
import { db } from "../../db";
import { sql } from "drizzle-orm";

/**
 * PASO 251: EL REGISTRO INMUTABLE (Tamper-Evident Logs)
 * PASO 252: "CRYPTO-SHREDDING" (GDPR Compliance)
 */

export interface AuditLogEntry {
    tenantId: string;
    action: string;
    actor: string;
    payload: any;
    traceId: string;
}

export class BlackBox {
    private static algorithm = "aes-256-gcm";

    /**
     * Graba una acción en el log inmutable con encadenamiento de hash.
     * Hn = Hash(Action_n + Hn-1)
     */
    static async logAction(entry: AuditLogEntry) {
        console.log(`📜 [Black-Box] Securing action: ${entry.action} for trace: ${entry.traceId}`);

        // 1. Obtener el hash del último registro (Hash Chain)
        const lastEntry = await db.execute(sql`
            SELECT hash FROM audit_trail ORDER BY created_at DESC LIMIT 1
        `) as any;
        const previousHash = lastEntry.rows?.[0]?.hash || "GENESIS_BLOCK";

        // 2. Crypto-Shredding: Cifrar el payload con una clave específica del tenant (PASO 252)
        const tenantKey = await this.getTenantKey(entry.tenantId);
        const encryptedPayload = this.encrypt(JSON.stringify(entry.payload), tenantKey);

        // 3. Crear el nuevo hash encadenado
        const currentData = `${entry.action}${entry.actor}${encryptedPayload.content}${previousHash}`;
        const currentHash = crypto.createHash("sha256").update(currentData).digest("hex");

        // 4. Insertar en DB
        await db.execute(sql`
            INSERT INTO audit_trail (tenant_id, action, actor, payload, hash, previous_hash, trace_id)
            VALUES (${entry.tenantId}, ${entry.action}, ${entry.actor}, ${encryptedPayload.content}, ${currentHash}, ${previousHash}, ${entry.traceId})
        `);

        return currentHash;
    }

    /**
     * PASO 252: Destruir el acceso a los datos de un cliente sin romper la cadena.
     */
    static async shredTenantData(tenantId: string) {
        console.warn(`🗑️ [Crypto-Shredding] Destroying encryption key for tenant: ${tenantId}`);
        await db.execute(sql`DELETE FROM tenant_keys WHERE tenant_id = ${tenantId}`);
        console.log("✅ Data is now mathematically unrecoverable (white noise).");
    }

    private static async getTenantKey(tenantId: string): Promise<Buffer> {
        const keyRow = await db.execute(sql`SELECT secret_key FROM tenant_keys WHERE tenant_id = ${tenantId}`) as any;
        if (keyRow.rows?.[0]) return Buffer.from(keyRow.rows[0].secret_key, 'hex');

        const newKey = crypto.randomBytes(32);
        await db.execute(sql`INSERT INTO tenant_keys (tenant_id, secret_key) VALUES (${tenantId}, ${newKey.toString('hex')})`);
        return newKey;
    }

    private static encrypt(text: string, key: Buffer) {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(this.algorithm, key, iv);
        const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
        return {
            iv: iv.toString("hex"),
            content: encrypted.toString("hex")
        };
    }
}
