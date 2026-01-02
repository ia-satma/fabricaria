/**
 * [ARCHITECT-ALPHA] VISION TEST SCRIPT
 * Verifies that Puppeteer can capture the UI for analysis.
 */
import { takeSnapshot } from '../lib/visual/snapshot';
import { writeFileSync } from 'fs';
import { join } from 'path';

async function main() {
    console.log('🚀 [Panopticon] Starting Vision Test...');

    try {
        // Capture the landing page (assuming dev server is running)
        // Note: In Replit, replace with your actual dev URL if different
        const url = process.env.DEV_SERVER_URL || 'http://localhost:3000';
        const base64 = await takeSnapshot(url);

        // Save as a local file for manual inspection (optional)
        const outputPath = join(process.cwd(), 'vision_audit_test.png');
        const buffer = Buffer.from(base64, 'base64');
        writeFileSync(outputPath, buffer);

        console.log(`✅ [Panopticon] Vision Test Passed. Screenshot saved to: ${outputPath}`);
        console.log('📸 [Panopticon] Base64 Length:', base64.length);

        process.exit(0);
    } catch (error) {
        console.error('❌ [Panopticon] Vision Test Failed:', error);
        process.exit(1);
    }
}

main();
