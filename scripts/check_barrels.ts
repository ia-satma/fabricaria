
import fs from "fs";
import path from "path";

/**
 * PASO 368: LIMPIEZA DE "BARREL FILES" (Optimización de Build)
 * Objetivo: Detectar archivos index.ts que exportan todo (*) y ralentizan Next.js.
 */

const IGNORE_DIRS = ["node_modules", ".next", ".git"];

function scanBarrels(dir: string) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const fullPath = path.join(dir, file);
        if (IGNORE_DIRS.some(d => fullPath.includes(d))) return;

        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            scanBarrels(fullPath);
        } else if (file === "index.ts" || file === "index.tsx") {
            const content = fs.readFileSync(fullPath, "utf-8");
            if (content.includes("export * from")) {
                console.warn(`🛢️ [Barrel-Alert] Potential build bottleneck at: ${fullPath}`);
                console.warn("💡 Suggestion: Use named imports instead of 'export *' to improve tree-shaking.");
            }
        }
    });
}

function runBarrelAudit() {
    console.log("🔍 [Barrel-Audit] Scanning for export bottlenecks...");
    scanBarrels(".");
    console.log("✅ [Barrel-Audit] Scan complete.");
}

runBarrelAudit();
