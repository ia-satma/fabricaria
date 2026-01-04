
import fs from 'fs';
import path from 'path';

/**
 * THE SENTINEL (Step 29)
 * Watchdog script to prevent infinite loops and runway spending.
 */

const WATCH_DIR = process.cwd();
const LOG_FILE = path.resolve(WATCH_DIR, 'debug.log'); // Assuming a debug log exists or we monitor stdout redirect
const MAX_WRITES_PER_MINUTE = 10; // Mandated limit
const MAX_LOG_SIZE_MB = 10;

let writeCount = 0;
let lastReset = Date.now();

console.log("🐕 [Sentinel] Watchdog started. Guarding your wallet.");

// 1. Sliding Window Check
setInterval(() => {
    writeCount = 0;
    lastReset = Date.now();
}, 60000);

// 2. File Watcher
// We use fs.watch (recursive where supported) or simple polling for critical files if recursive isn't reliable on all OS
// specific to 'features' and 'components' to avoid noise from .git or node_modules
const criticalPaths = [
    path.resolve(WATCH_DIR, 'features'),
    path.resolve(WATCH_DIR, 'components'),
    path.resolve(WATCH_DIR, 'db')
];

criticalPaths.forEach(dir => {
    if (fs.existsSync(dir)) {
        fs.watch(dir, { recursive: true }, (eventType, filename) => {
            if (filename) {
                writeCount++;
                // console.log(`🐕 [Sentinel] Modification detected: ${filename} (${writeCount}/min)`);
                checkHealth();
            }
        });
    }
});

function checkHealth() {
    // Check Write Rate
    if (writeCount > MAX_WRITES_PER_MINUTE) {
        triggerPanic(`High write rate detected: ${writeCount} writes in < 1 minute.`);
    }

    // Check Log Size
    if (fs.existsSync(LOG_FILE)) {
        const stats = fs.statSync(LOG_FILE);
        const sizeMB = stats.size / (1024 * 1024);
        if (sizeMB > MAX_LOG_SIZE_MB) {
            triggerPanic(`Log file size exceeded: ${sizeMB.toFixed(2)}MB.`);
        }
    }
}

function triggerPanic(reason: string) {
    console.error(`\n🐕🚨 [Sentinel] PANIC TRIGGERED! ${reason}`);
    console.error("🐕🚨 [Sentinel] KILLING PROCESS TO PROTECT RESOURCES.");

    // Create STOP signal file
    fs.writeFileSync(path.resolve(WATCH_DIR, 'STOP_WORK'), `PANIC: ${reason}`);

    // Force Exit
    process.exit(1);
}

// Keep process alive
setInterval(() => { }, 10000);
