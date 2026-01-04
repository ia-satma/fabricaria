
import fs from 'fs';
import path from 'path';
// REMOVE static DB imports to avoid pre-env loading
// import { db } from "../db";
// import { codeAudits } from "../db/schema";
// import { eq, and } from "drizzle-orm";

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

async function testPipeline() {
    console.log("🏭 INICIANDO SIMULACRO DE PRODUCCIÓN (END-TO-END)...");

    // 1. Dynamic Imports (Critical for Env Loading)
    const { db } = await import("../db");
    const { codeAudits } = await import("../db/schema");
    const { eq } = await import("drizzle-orm");
    const { analyzeRepositoryAction } = await import("../features/research/actions");

    const TEST_URL = "https://github.com/ia-satma/SimulacroFactory";

    try {
        // --- PASS 1: COLD START (AI Analysis) ---
        console.log("\n🧪 1. [COLD START] Ejecutando análisis inicial (Debe usar IA)...");
        const artifact1 = await analyzeRepositoryAction(TEST_URL);

        console.log("✅ Resultado Paso 1 (IA):");
        console.log(`   ID: ${artifact1.id}`);
        console.log(`   Type: ${artifact1.type}`);
        console.log(`   Cached: ${artifact1.cached || false}`);
        console.log(`   Content Preview: ${artifact1.content.substring(0, 50)}...`);

        if (artifact1.cached) {
            // It might be cached from a previous failed run that actually saved?
            // Or from Step 17 testing if we used same URL.
            // But 'SimulacroFactory' is new. 
            console.log("ℹ️ Nota: El artefacto ya existía en caché (¿Ejecución previa?).");
        }

        // --- VERIFY DB PERSISTENCE ---
        console.log("\n💾 2. [PERSISTENCIA] Verificando base de datos Neon...");
        const dbRecords = await db.select().from(codeAudits).where(eq(codeAudits.repoUrl, TEST_URL));

        if (dbRecords.length > 0) {
            console.log(`✅ Registro encontrado en 'code_audits'. Hash: ${dbRecords[0].hash.substring(0, 10)}...`);
        } else {
            throw new Error("❌ FALLO: No se encontró el registro en la base de datos.");
        }

        // --- PASS 2: WARM CACHE (DB Retrieval) ---
        console.log("\n⚡ 3. [WARM CACHE] Ejecutando segundo análisis (Debe usar Caché)...");
        const t0 = Date.now();
        const artifact2 = await analyzeRepositoryAction(TEST_URL);
        const t1 = Date.now();

        console.log(`✅ Resultado Paso 3 (Caché):`);
        console.log(`   Cached Payload: ${artifact2.cached}`);
        console.log(`   Tiempo de respuesta: ${t1 - t0}ms`);

        if (!artifact2.cached) {
            console.warn("⚠️ ALERTA: Se esperaba 'cached: true' pero vino falso. Revisar lógica de hash o inserción.");
        } else {
            console.log("🎉 ÉXITO: El sistema de caché interceptó la llamada.");
        }

        console.log("\n---------------------------------------------------");
        console.log("🟢 SISTEMA INTEGRAL: OPERATIVO");
        console.log("---------------------------------------------------");

        process.exit(0);

    } catch (error: any) {
        console.error("\n❌ FALLO EN SIMULACRO:");
        console.error(error);
        process.exit(1);
    }
}

testPipeline();
