
import * as fs from 'fs';
import * as path from 'path';
import { sql } from 'drizzle-orm';

// Load .env FIRST
const envPath = path.resolve(process.cwd(), '.env');
console.log('Loading .env from:', envPath);
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf-8');
    envConfig.split('\n').forEach(line => {
        const parts = line.split('=');
        if (parts.length >= 2) {
            const key = parts[0].trim();
            const value = parts.slice(1).join('=').trim().replace(/^["']|["']$/g, '');
            process.env[key] = value;
        }
    });
}

async function main() {
    console.log('DB Audit: Starting...');

    const { db } = await import('../db/index');
    const { learnedPatterns } = await import('../db/schema');

    try {
        // raw query for count
        const result = (await db.execute(sql`SELECT count(*) FROM learned_patterns`)) as any;
        console.log('Learned patterns count:', result[0]?.count || result[0]);
        console.log('DB Audit: Connection Successful');
    } catch (error) {
        console.error('DB Audit FAILED:', error);
        process.exit(1);
    }
}

main().catch((err) => {
    console.error('Audit script fatal error:', err);
    process.exit(1);
});
