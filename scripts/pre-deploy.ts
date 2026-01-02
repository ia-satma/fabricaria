import fs from 'fs';
import path from 'path';

async function main() {
    console.log("🛫 [DevOps] Initiating Pre-Flight Checks...");
    let passed = true;

    // 1. Environment Variables
    const requiredVars = ['DATABASE_URL'];
    // Note: STRIPE might be optional for build, but critical for run.
    const missingVars = requiredVars.filter(v => !process.env[v]);

    if (missingVars.length > 0) {
        console.error(`❌ Missing Critical Env Vars: ${missingVars.join(', ')}`);
        passed = false;
    } else {
        console.log("✅ Environment Variables Present.");
    }

    // 2. Critical Files
    // Check if MCP Server file exists
    const mcpPath = path.join(process.cwd(), 'lib/mcp/stripe-server.ts');
    if (!fs.existsSync(mcpPath)) {
        console.error(`❌ MCP Server file missing at ${mcpPath}`);
        passed = false;
    } else {
        console.log("✅ MCP Server file verified.");
    }

    // 3. Deployment Config
    const replitConfigPath = path.join(process.cwd(), '.replit');
    if (fs.existsSync(replitConfigPath)) {
        const config = fs.readFileSync(replitConfigPath, 'utf8');
        if (config.includes('run-web') && config.includes('run-worker')) {
            console.log("✅ .replit configured for Split-Brain (Found run-web/run-worker references).");
        } else {
            console.warn("⚠️ .replit might not be fully configured for Split-Brain.");
        }
    }

    if (passed) {
        console.log("\n🚀 READY FOR DEPLOYMENT");
        console.log("   Legacy Command: npm run start");
        console.log("   Worker Command: npm run run-worker");
        process.exit(0);
    } else {
        console.error("\n🛑 HALT: Pre-flight checks failed.");
        process.exit(1);
    }
}

if (require.main === module) {
    main().catch(console.error);
}
