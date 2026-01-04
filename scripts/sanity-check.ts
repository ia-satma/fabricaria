import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { fabricationQueue } from '../db/schema';
import { eq } from 'drizzle-orm';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
    console.error("❌ DATABASE_URL is not defined.");
    process.exit(1);
}

const sql = neon(databaseUrl);
const db = drizzle(sql);

async function sanityCheck() {
    try {
        console.log("🔍 Starting Sanity Check...");

        // 1. Insert dummy record
        const dummyJobId = `dummy-${Math.random().toString(36).substring(7)}`;
        console.log(`📝 Inserting dummy record with jobId: ${dummyJobId}`);
        await db.insert(fabricationQueue).values({
            jobId: dummyJobId,
            status: 'pending',
            payload: { message: 'Sanity check record' }
        });

        // 2. Read back
        console.log("📖 Reading dummy record back...");
        const result = await db.select().from(fabricationQueue).where(eq(fabricationQueue.jobId, dummyJobId));

        if (result.length > 0 && result[0].jobId === dummyJobId) {
            console.log("✅ Sanity check record found and verified.");
        } else {
            throw new Error("❌ Sanity check failed: Record not found after insertion.");
        }

        // 3. Delete
        console.log("🗑️ Deleting dummy record...");
        await db.delete(fabricationQueue).where(eq(fabricationQueue.jobId, dummyJobId));

        const finalCheck = await db.select().from(fabricationQueue).where(eq(fabricationQueue.jobId, dummyJobId));
        if (finalCheck.length === 0) {
            console.log("✅ Sanity check record deleted successfully.");
        } else {
            console.warn("⚠️ Dummy record was not deleted.");
        }

        console.log("🌟 SANITY CHECK COMPLETED SUCCESSFULLY.");
    } catch (error) {
        console.error("❌ Sanity Check Failed:", error);
        process.exit(1);
    }
}

sanityCheck();
