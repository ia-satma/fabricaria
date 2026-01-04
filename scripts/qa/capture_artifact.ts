
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

/**
 * VISUAL ARTIFACT CAPTURE (Step 71)
 * Captures a screenshot of the local dev environment for QA validation.
 */

async function captureArtifact(url: string, taskName: string) {
    console.log(`📸 [QA-Visual] Capturing artifact for task: "${taskName}"...`);

    const artifactDir = path.join(process.cwd(), 'artifacts/qa');
    if (!fs.existsSync(artifactDir)) {
        fs.mkdirSync(artifactDir, { recursive: true });
    }

    const screenshotPath = path.join(artifactDir, `${taskName.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}.png`);

    try {
        const browser = await puppeteer.launch({ headless: "new" });
        const page = await browser.newPage();

        await page.setViewport({ width: 1280, height: 800 });

        console.log(`🌐 [QA-Visual] Navigating to ${url}...`);
        await page.goto(url, { waitUntil: 'networkidle0' });

        await page.screenshot({ path: screenshotPath });
        console.log(`✅ [QA-Visual] Screenshot saved to: ${screenshotPath}`);

        await browser.close();

        // Report Generation
        const report = {
            task: taskName,
            url: url,
            screenshot: screenshotPath,
            timestamp: new Date().toISOString(),
            status: "PENDING_VISION_AUDIT"
        };

        const reportPath = screenshotPath.replace('.png', '_report.json');
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

        console.log(`📄 [QA-Visual] Report generated: ${reportPath}`);
        return report;

    } catch (error) {
        console.error("❌ [QA-Visual] Capture failed:", error);
        throw error;
    }
}

// CLI Support
if (require.main === module) {
    const url = process.argv[2] || 'http://localhost:3000';
    const taskName = process.argv[3] || 'UI-Verification';
    captureArtifact(url, taskName).catch(() => process.exit(1));
}

export { captureArtifact };
