/**
 * [ARCHITECT-ALPHA] VISION TEST SCRIPT (VANILLA JS)
 * Verifies that Puppeteer can capture the UI for analysis.
 * Uses hardcoded paths to bypass missing environment binaries.
 */
const { writeFileSync } = require('fs');
const { join } = require('path');

// Try to import from the local lib/visual/snapshot.js if it existed, 
// but we'll reimplement the core logic here to be safe and standalone.
const puppeteer = require('puppeteer');

async function main() {
    console.log('🚀 [Panopticon] Starting Vanilla Vision Test...');

    const url = process.env.DEV_SERVER_URL || 'http://localhost:3000';
    let browser;

    try {
        console.log(`👁️ [Panopticon] Capturing snapshot of: ${url}`);

        browser = await puppeteer.launch({
            headless: 'new',
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu'
            ],
            // Adjust this path if necessary based on Replit/Mac environment
            executablePath: process.platform === 'darwin'
                ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
                : '/usr/bin/chromium-browser'
        });

        const page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 800 });
        await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

        await new Promise(r => setTimeout(r, 1000));

        const screenshot = await page.screenshot({ encoding: 'base64' });
        const buffer = Buffer.from(screenshot, 'base64');
        const outputPath = join(process.cwd(), 'vision_audit_test.png');

        writeFileSync(outputPath, buffer);

        console.log(`✅ [Panopticon] Vision Test Passed. Screenshot saved to: ${outputPath}`);
        process.exit(0);
    } catch (error) {
        console.error('❌ [Panopticon] Vision Test Failed:', error);
        process.exit(1);
    } finally {
        if (browser) await browser.close();
    }
}

main();
