
import fs from "fs";
import { execSync } from "child_process";

/**
 * PASO 363: LA ESTAMPA DE TIEMPO "CANARY" (Verificación en Vivo)
 * Objetivo: Generar metadatos de construcción para validar la versión en vivo.
 */

function generateBuildMeta() {
    console.log("🏗️ [Build-Meta] Generating production artifacts...");

    try {
        const commitHash = execSync("git rev-parse HEAD").toString().trim();
        const buildInfo = {
            built_at: new Date().toISOString(),
            commit: commitHash,
            env: process.env.NODE_ENV || "production",
            version: "50.0.0-final"
        };

        const targetPath = "public/build-meta.json";

        // Asegurar que el directorio public existe
        if (!fs.existsSync("public")) {
            fs.mkdirSync("public");
        }

        fs.writeFileSync(targetPath, JSON.stringify(buildInfo, null, 2));
        console.log(`✅ [Build-Meta] Metadata saved to ${targetPath}`);
        console.log(`📍 Commit: ${commitHash}`);
        console.log(`⏰ Timestamp: ${buildInfo.built_at}`);

    } catch (error) {
        console.error("❌ [Build-Meta] Failed to generate metadata:", error);
    }
}

generateBuildMeta();
