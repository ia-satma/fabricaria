
import { exec } from 'child_process';
import util from 'util';

const execAsync = util.promisify(exec);

async function preDeploy() {
    console.log("🚀 [Pre-Deploy] Starting final quality gate...");

    try {
        // 1. Build validation
        console.log("📦 [Pre-Deploy] Checking build...");
        await execAsync('npm run build');
        console.log("✅ Build successful.");

        // 2. Test validation
        console.log("🧪 [Pre-Deploy] Running tests...");
        await execAsync('npm test');
        console.log("✅ All tests passed.");

        // 3. Environment Check
        console.log("🌍 [Pre-Deploy] Verifying environment variables...");
        const requiredEnv = ['DATABASE_URL', 'GEMINI_API_KEY'];
        const missing = requiredEnv.filter(env => !process.env[env]);

        if (missing.length > 0) {
            console.warn(`⚠️ Warning: Missing production variables: ${missing.join(', ')}`);
        } else {
            console.log("✅ Environment ready.");
        }

        console.log("\n✨ LISTO PARA DESPLIEGUE: https://fabricaria.replit.app");
        process.exit(0);

    } catch (error: any) {
        console.error("\n❌ [Pre-Deploy] GOLPE DE ESTADO - CALIDAD NO ALCANZADA");
        console.error(error.stdout || error.message);
        process.exit(1);
    }
}

preDeploy();
