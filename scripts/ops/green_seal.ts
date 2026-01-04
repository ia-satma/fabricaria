
import { db } from "../../db";
import { codeAudits, securityLogs } from "../../db/schema";
import { eq, and } from "drizzle-orm";

/**
 * PASO 212: EL SELLO VERDE (Release Gate)
 * Objetivo: Validar que el sistema sea apto para producción.
 */

export async function verifyGreenSeal() {
    console.log("🚦 [Green-Seal] Checking release candidate status...");

    // 1. Verificar auditorías exitosas
    const audits = await db.select().from(codeAudits).limit(10);
    const hasFailures = audits.some(a => a.status === 'FAILED');

    // 2. Verificar violaciones de seguridad críticas
    const violations = await db.select().from(securityLogs)
        .where(eq(securityLogs.severity, 'CRITICAL'));

    if (hasFailures || violations.length > 0) {
        console.error("🔴 [Green-Seal] Gate rejected. Critical issues detected.");
        return { status: 'REJECTED', reasons: ['AUDIT_FAILURES', 'SECURITY_VIOLATIONS'] };
    }

    console.log("🟢 [Green-Seal] Gate PASSED. System is production-ready.");
    return { status: 'PASSED', version: 'v2.2.0-algogov' };
}
