import puppeteer from 'puppeteer';

/**
 * [ARCHITECT-ALPHA] VISUAL AUDIT ENGINE
 * Captures the current state of the UI for Gemini Vision analysis.
 */
export async function takeSnapshot(url: string = 'http://localhost:3000'): Promise<string> {
    console.log(`👁️ [Panopticon] Capturing snapshot of: ${url}`);

    let browser;
    try {
        browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu'
            ],
            executablePath: process.platform === 'darwin'
                ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
                : 'chromium',
        });

        const page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 800 });

        // Wait for network to be idle
        await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

        // Slight delay for animations
        await new Promise(r => setTimeout(r, 1000));

        const screenshot = await page.screenshot({ encoding: 'base64' });

        console.log('✅ [Panopticon] Snapshot captured successfully.');
        return screenshot as string;
    } catch (error) {
        console.error('❌ [Panopticon] Snapshot failed:', error);
        throw error;
    } finally {
        if (browser) await browser.close();
    }
}
