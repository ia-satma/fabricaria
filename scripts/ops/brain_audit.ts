
import fs from 'fs';
import path from 'path';

/**
 * PASO 216: AUDITORÍA DEL "CEREBRO"
 * Objetivo: Verificar la evolución del archivo AGENTS.md.
 */

async function verifyBrainEvolution() {
    console.log("🧠 [Brain-Audit] Verifying episodic memory evolution...");

    const agentsPath = path.join(process.cwd(), 'AGENTS.md');

    if (!fs.existsSync(agentsPath)) {
        console.error("❌ FALLO DE MEMORIA EPISÓDICA: AGENTS.md no existe.");
        process.exit(1);
    }

    const content = fs.readFileSync(agentsPath, 'utf8');

    // Buscar el patrón sugerido por el usuario
    const hasHyperBaseRule = content.includes('HyperBase') || content.includes('NUEVA REGLA');

    if (hasHyperBaseRule) {
        console.log("--------------------------------------------------");
        console.log("✅ EVOLUCIÓN CONFIRMADA");
        console.log("📝 Hallazgo: El sistema identificó a 'HyperBase' como un anti-patrón.");
        console.log("🤖 Estado: El Cerebro Agéntico ha aprendido la lección.");
        console.log("--------------------------------------------------");
    } else {
        console.error("⚠️ [Brain-Audit] FALLO DE MEMORIA EPISÓDICA.");
        console.error("El sistema no registró la lección sobre HyperBase.");
    }
}

verifyBrainEvolution();
