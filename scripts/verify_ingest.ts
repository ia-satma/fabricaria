
import fs from 'fs';
import path from 'path';

// 0. Manual env loading
const envPath = path.resolve(__dirname, '../.env');
if (fs.existsSync(envPath)) {
    console.log("Loading .env from:", envPath);
    const envContent = fs.readFileSync(envPath, 'utf-8');
    envContent.split('\n').forEach(line => {
        const match = line.match(/^([^#=]+)=(.*)$/);
        if (match) {
            const key = match[1].trim();
            const value = match[2].trim().replace(/^['"]|['"]$/g, '');
            process.env[key] = value;
        }
    });
}

// 1. Dynamic Imports
async function verifyIngest() {
    console.log("🕵️‍♀️ INICIANDO VERIFICACIÓN DE INGESTA (AGENTE DE INVESTIGACIÓN)...");

    const REPO_URL = "https://github.com/ia-satma/Brujeria";
    console.log(`🎯 Objetivo: ${REPO_URL}`);

    try {
        // Import action directly
        const { analyzeRepositoryAction } = await import("../features/research/actions");
        const { savePattern } = await import("../features/memory/vector-store");

        // A. ANALYZE (Gemini 1.5 Flash)
        console.log("1. Solicitando análisis a Gemini...");
        const blueprint = await analyzeRepositoryAction(REPO_URL);

        console.log("\n✅ ANÁLISIS COMPLETADO:");
        console.log("---------------------------------------------------");
        console.log(`ID: ${blueprint.id}`);
        console.log(`Type: ${blueprint.type}`);
        console.log(`Contenido (Extracto): ${blueprint.content.substring(0, 100)}...`);
        console.log(`Metadata:`, JSON.stringify(blueprint.metadata, null, 2));
        console.log("---------------------------------------------------");

        // B. SAVE TO MEMORY (Embedding)
        console.log("\n2. Guardando en Memoria Vectorial (Embedding)...");
        const success = await savePattern(
            `[REPO_ANALYSIS] ${blueprint.content}`,
            { url: REPO_URL, type: 'repository_audit', ...blueprint.metadata }
        );

        if (success) {
            console.log("✅ IMPACTO CONFIRMADO: El conocimiento ha sido asimilado en la base de datos.");
            console.log("🎉 SISTEMA FUNCIONAL. LA FÁBRICA PUEDE OPERAR.");
        } else {
            throw new Error("Fallo al guardar en vector store.");
        }

        process.exit(0);

    } catch (error: any) {
        console.error("\n❌ FALLO EN INGESTA:");
        console.error(error);
        process.exit(1);
    }
}

verifyIngest();
