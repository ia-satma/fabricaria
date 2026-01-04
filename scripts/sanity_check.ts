
import * as fs from 'fs';
import * as path from 'path';

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
} else {
    console.warn('.env file not found!');
}

async function main() {
    console.log('Sanity Check: Starting...');

    // Dynamic import to ensure env is loaded first
    // Note: Using relative paths for imports might require .ts extension or careful handling depending on tsconfig/runtime
    // We try generic import first.
    const { db } = await import('../db/index');
    const { fabricationQueue } = await import('../db/schema');
    const { eq } = await import('drizzle-orm');

    const jobId = 'sanity-check-' + Date.now();

    // 1. Insert
    console.log(`Inserting dummy record with jobId: ${jobId}`);
    try {
        const inserted = await db.insert(fabricationQueue).values({
            jobId: jobId,
            status: 'pending',
            payload: { type: 'sanity_test' }
        }).returning();

        if (inserted.length === 0) {
            throw new Error('Insertion failed: No record returned.');
        }
        console.log('Insertion successful:', inserted[0].id);

        // 2. Read
        console.log('Reading record back...');
        const read = await db.select().from(fabricationQueue).where(eq(fabricationQueue.jobId, jobId));

        if (read.length === 0) {
            throw new Error('Read failed: Record not found.');
        }
        console.log('Read successful. Status:', read[0].status);

        // 3. Delete
        console.log('Deleting record...');
        const deleted = await db.delete(fabricationQueue).where(eq(fabricationQueue.jobId, jobId)).returning();

        if (deleted.length === 0) {
            throw new Error('Deletion failed: No record returned.');
        }
        console.log('Deletion successful.');

        console.log('SANITY CHECK PASSED.');
    } catch (error) {
        console.error('Error during database operation:', error);
        throw error;
    }
}

main().catch((err) => {
    console.error('SANITY CHECK FAILED:', err);
    process.exit(1);
});
