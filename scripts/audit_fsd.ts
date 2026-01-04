
import fs from "fs";
import path from "path";

/**
 * FEATURE-SLICED VALIDATOR (Step 59)
 * Ensures the codebase stays modular by alerting on non-standard directory structures.
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
    "styles"
];

const IGNORED_ENTRIES = [
    "node_modules",
    ".git",
    ".next",
    ".replit",
    "package.json",
    "package-lock.json",
    "tsconfig.json",
    "next.config.mjs",
    "postcss.config.mjs",
    "tailwind.config.ts",
    "README.md",
    "AGENTS.md",
    "drizzle.config.ts",
    ".env"
];

function validateFSD() {
    console.log("🍰 [FSD-Guard] Auditing architectural integrity...");
    const rootEntries = fs.readdirSync(process.cwd());
    const violations: string[] = [];

    rootEntries.forEach(entry => {
        if (IGNORED_ENTRIES.includes(entry)) return;
        if (!ALLOWED_ROOT_DIRS.includes(entry)) {
            violations.push(entry);
        }
    });

    if (violations.length > 0) {
        console.warn(`🚨 [FSD-Guard] ARCHITECTURAL VIOLATION: Files/folders found outside Golden Stack structure: ${violations.join(", ")}`);
        console.warn("👉 Pro-Tip: Move business logic to 'features/<name>/'.");
    } else {
        console.log("✅ [FSD-Guard] Architecture is clean. Feature-Sliced Design enforced.");
    }
}

validateFSD();
