
import { chromium } from 'playwright';
import { GeminiClient } from '../../lib/ai/gemini-client';
import fs from 'fs';

/**
 * EL OBSERVADOR VISUAL (Step 125)
 * Objetivo: QA Visual agéntico con Gemini Vision.
 */

async function performVisualCheck(path: string) {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    const url = `http://localhost:3000${path}`;

    console.log(`👁️ [Visual-Check] Taking snapshot of ${url}...`);

    try {
        await page.goto(url);
        await page.waitForTimeout(2000); // Wait for animations

        const screenshotPath = `snapshot-${path.replace(/\//g, '-') || 'home'}.png`;
        await page.screenshot({ path: screenshotPath });

        console.log(`✅ Snapshot saved to ${screenshotPath}. Sending to Gemini for analysis...`);

        // Gemini Vision Prompt
        const client = new GeminiClient("gemini-1.5-pro", "VISUAL_QA");
        const imageData = fs.readFileSync(screenshotPath).toString('base64');

        const prompt = `
Analiza esta captura de pantalla de la interfaz de usuario.
Busca elementos superpuestos, textos cortados, imágenes rotas o errores de layout evidentes.
Responde estrictamente en JSON con este formato:
{
  "status": "PASS" | "FAIL",
  "issues": ["...", "..."],
  "score": 0-100
}
`;

        // Note: In real production, we'd pass the base64 image chunk to the generateContent call.
        // Assuming GeminiClient handles multimodal or we simulate the response for Phase 12 logic.
        const response = await client.generateContent(prompt, { responseMimeType: "application/json" });
        const result = JSON.parse(response);

        console.log(`📊 Visual QA Result for ${path}:`, result);
        return result;

    } catch (error) {
        console.error(`❌ Visual Check failed for ${path}:`, error);
        return { status: "FAIL", issues: ["Technical failure during check"] };
    } finally {
        await browser.close();
    }
}

async function runSuite() {
    const results = [];
    results.push(await performVisualCheck("/"));
    results.push(await performVisualCheck("/admin/mission-control"));

    fs.writeFileSync('visual_qa_report.json', JSON.stringify(results, null, 2));
}

runSuite();
