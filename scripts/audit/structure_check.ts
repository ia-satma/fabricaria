
import fs from "fs";
import path from "path";

/**
 * ARCHITECTURAL INTEGRITY AUDIT (Step 69)
 * Enforces FSD Lite and prohibits Barrel Files.
 */

const ALLOWED_ROOT_DIRS = [
    "app",
    "components",
    "features",
    "lib",
    "scripts",
    "types",
    "db",
    "public",
    "styles",
    "tests"
];

const IGNORED_FILES = [
    "next.config.js",
    "next.config.mjs",
    "postcss.config.js",
    "postcss.config.mjs",
    "tailwind.config.ts",
    "tsconfig.json",
    "package.json",
    "package-lock.json",
    "pnpm-lock.yaml",
    "README.md",
    "AGENTS.md",
    "drizzle.config.ts",
    ".env",
    ".env.example",
    "next-env.d.ts",
    ".gitignore",
    ".agent",
    ".replit",
    ".git_backup",
    "attached_assets",
    "replit.md",
    "server.log",
    "tsconfig.tsbuildinfo",
    "vision_audit_test.png",
    "audit_report.json",
    "pages" // Next.js standard pages directory is allowed but business logic should move to features
];

function checkStructure() {
    console.log("🏗️ [FSD-Lite] Auditing architectural integrity...");
    const rootItems = fs.readdirSync(process.cwd());
    const violations: string[] = [];
    const barrelFiles: string[] = [];

    rootItems.forEach(item => {
        if (IGNORED_FILES.includes(item)) return;
        if (item === "node_modules" || item === ".git" || item === ".next") return;

        if (!ALLOWED_ROOT_DIRS.includes(item)) {
            violations.push(item);
        }
    });

    // Scan features for barrel files
    const featuresPath = path.join(process.cwd(), "features");
    if (fs.existsSync(featuresPath)) {
        const features = fs.readdirSync(featuresPath);
        features.forEach(feature => {
            const indexFile = path.join(featuresPath, feature, "index.ts");
            if (fs.existsSync(indexFile)) {
                barrelFiles.push(`features/${feature}/index.ts`);
            }
        });
    }

    if (violations.length > 0) {
        console.error(`🚨 [FSD-Lite] BUSINESS LOGIC VIOLATION: Items found outside standard folders: ${violations.join(", ")}`);
    }

    if (barrelFiles.length > 0) {
        console.error(`🚨 [FSD-Lite] BARREL FILE VIOLATION: The following index.ts files must be removed to prevent AI hallucinations:`);
        barrelFiles.forEach(f => console.error(`   - ${f}`));
    }

    if (violations.length === 0 && barrelFiles.length === 0) {
        console.log("✅ [FSD-Lite] Architecture is clean. AI-Friendly structure enforced.");
        process.exit(0);
    } else {
        process.exit(1);
    }
}

checkStructure();
