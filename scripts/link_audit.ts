
import fs from "fs";
import path from "path";

/**
 * PASO 379: AUDITORÍA DE ENLACES ROTOS (Crawler Interno)
 * Objetivo: Asegurar que los enlaces internos apunten a rutas válidas.
 */

const APP_DIR = "app";
const IGNORE_DIRS = ["node_modules", ".next", ".git", "api"];

function getValidRoutes(dir: string, base = ""): string[] {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    let routes: string[] = [];

    entries.forEach(entry => {
        if (entry.isDirectory()) {
            if (IGNORE_DIRS.includes(entry.name)) return;
            // Next.js dynamic routes (e.g. [id]) are considered valid roots
            const routeName = entry.name.startsWith("[") ? ":id" : entry.name;
            routes = routes.concat(getValidRoutes(path.join(dir, entry.name), `${base}/${entry.name}`));
        } else if (entry.name === "page.tsx" || entry.name === "page.ts") {
            routes.push(base === "" ? "/" : base);
        }
    });

    return routes;
}

function auditLinks(dir: string, validRoutes: string[]) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const fullPath = path.join(dir, file);
        if (IGNORE_DIRS.some(d => fullPath.includes(d))) return;

        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            auditLinks(fullPath, validRoutes);
        } else if (file.endsWith(".tsx") || file.endsWith(".ts")) {
            const content = fs.readFileSync(fullPath, "utf-8");
            const linkMatches = content.match(/href=["'](\/[^"']*)["']/g);

            if (linkMatches) {
                linkMatches.forEach(match => {
                    const href = match.match(/href=["']([^"']*)["']/)![1];
                    if (href.startsWith("/api")) return; // Skip API routes

                    // Simplified check for dynamic routes
                    const isValid = validRoutes.some(route => {
                        if (route === href) return true;
                        const routeRegex = new RegExp(`^${route.replace(/:id/g, "[^/]+")}$`);
                        return routeRegex.test(href);
                    });

                    if (!isValid && href !== "/") {
                        console.warn(`🕸️ [Link-Alert] Broken or Unknown Link: '${href}' found in ${fullPath}`);
                    }
                });
            }
        }
    });
}

const validRoutes = getValidRoutes(APP_DIR);
console.log("🚦 [Link-Audit] Valid Routes in App Router:", validRoutes);
auditLinks(".", validRoutes);
console.log("✅ [Link-Audit] Scan complete.");
