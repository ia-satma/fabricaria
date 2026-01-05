
/**
 * PASO 385: LISTAS BLANCAS Y GUARDIANES DE CORREO (Aegis Mail)
 * Objetivo: Interceptar y validar envíos de correo para prevenir spam y fugas.
 */

export interface MailJob {
    to: string;
    subject: string;
    body: string;
}

export class AegisMailInterceptor {
    private whitelist = ["imacdesantiago@gmail.com", "admin@fabricaria.vercel.app"];

    // Regla de Prevención de Fugas de Datos (DLP)
    private dlpPatterns = [
        /[A-Za-z0-9+/]{40}/, // Possible API Key pattern
        /postgres:\/\/.*:.+@.+:.+\/.+/, // DB Connection String
        /SG\.[A-Za-z0-9_-]{22}\.[A-Za-z0-9_-]{43}/ // SendGrid Key pattern
    ];

    validate(job: MailJob): { allowed: boolean; reason?: string } {
        // 1. Verificar Lista Blanca
        const domain = job.to.split("@")[1];
        const isWhitelisted = this.whitelist.includes(job.to) || domain === "fabricaria.vercel.app";

        if (!isWhitelisted) {
            return { allowed: false, reason: "DESTINATORY_NOT_IN_WHITELIST" };
        }

        // 2. Escaneo DLP (Data Loss Prevention)
        for (const pattern of this.dlpPatterns) {
            if (pattern.test(job.body) || pattern.test(job.subject)) {
                return { allowed: false, reason: "SENSITIVE_DATA_DETECTED" };
            }
        }

        return { allowed: true };
    }
}
