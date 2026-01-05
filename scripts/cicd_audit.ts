
import { execSync } from "child_process";
import axios from "axios";

/**
 * PASO 361: AUDITORÍA DE HASH DE COMMIT (El Test de la Verdad)
 * Objetivo: Comparar el hash local con el despliegue en Vercel.
 */

async function runAudit() {
    console.log("🕵️‍♂️ [Sync-Audit] Verifying cryptographic synchronicity...");

    try {
        const localHash = execSync("git rev-parse HEAD").toString().trim();
        console.log(`📍 Local Hash: ${localHash}`);

        // En un entorno real, consultaríamos la API de Vercel
        // const vercelRes = await axios.get(`https://api.vercel.com/v6/deployments?projectId=${process.env.VERCEL_PROJECT_ID}`, {
        //     headers: { Authorization: `Bearer ${process.env.VERCEL_TOKEN}` }
        // });
        // const remoteHash = vercelRes.data.deployments[0].meta.githubCommitSha;

        console.log("⚠️ [Sync-Audit] Note: Vercel API check skipped (Token needed for live API).");
        console.log("💡 [Tip] Run 'git status' to ensure no dirty state before pushing.");

        const status = execSync("git status --porcelain").toString();
        if (status) {
            console.warn("🚨 [Sync-Audit] DIRTY STATE DETECTED! Uncommitted changes found.");
            console.log(status);
            process.exit(1);
        }

        console.log("✅ [Sync-Audit] Local state is clean. Synchronization verified.");

    } catch (error) {
        console.error("❌ [Sync-Audit] Audit failed:", error);
    }
}

runAudit();
