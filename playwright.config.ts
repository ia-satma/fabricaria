
import { defineConfig, devices } from '@playwright/test';

/**
 * MATRIZ DE COMPATIBILIDAD (Step 130)
 * Goal: Multi-device viewport testing.
 */

export default defineConfig({
    testDir: './tests',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: 'html',
    use: {
        baseURL: 'http://localhost:3000',
        trace: 'on-first-retry',
    },

    projects: [
        {
            name: 'Desktop Chrome',
            use: { ...devices['Desktop Chrome'] },
        },
        {
            name: 'Mobile Safari',
            use: { ...devices['iPhone 12'] },
        },
        {
            name: 'Tablet iPad',
            use: { ...devices['iPad Pro 11'] },
        },
    ],

    // Run local dev server before starting the tests
    webServer: {
        command: 'npm run dev',
        url: 'http://localhost:3000',
        reuseExistingServer: !process.env.CI,
    },
});
