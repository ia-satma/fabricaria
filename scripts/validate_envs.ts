
import fs from "fs";

/**
 * PASO 365: VALIDACIÓN DE VARIABLES DE ENTORNO (Sincronización de Secretos)
 * Objetivo: Asegurar que las claves esenciales estén presentes antes de construir.
 */

const REQUIRED_ENVS = [
    "DATABASE_URL",
    "GEMINI_API_KEY",
    "STRIPE_SECRET_KEY",
    "SESSION_SECRET"
];

function validateEnvs() {
    console.log("🔐 [Env-Validator] Checking for required secrets...");

    let hasMissing = false;
    const missingKeys: string[] = [];

    REQUIRED_ENVS.forEach(key => {
        if (!process.env[key]) {
            // Si no está en process.env, buscamos en .env local (simulación para Replit/Antigravity)
            const dotEnvExists = fs.existsSync(".env");
            const dotEnvContent = dotEnvExists ? fs.readFileSync(".env", "utf-8") : "";

            if (!dotEnvContent.includes(`${key}=`)) {
                console.error(`❌ [Missing] ${key} is not defined.`);
                missingKeys.push(key);
                hasMissing = true;
            } else {
                console.log(`✅ [Found] ${key} (via .env)`);
            }
        } else {
            console.log(`✅ [Found] ${key}`);
        }
    });

    if (hasMissing) {
        console.error("🚨 [Env-Validator] Validation failed. Deployment aborted.");
        console.warn(`💡 Action: Add [${missingKeys.join(", ")}] to Vercel/Replit Secrets.`);
        process.exit(1);
    }

    console.log("✅ [Env-Validator] All required secrets are present.");
}

validateEnvs();
