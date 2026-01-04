import { neon } from '@neondatabase/serverless';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
    console.error("❌ DATABASE_URL is not defined.");
    process.exit(1);
}

const sql = neon(databaseUrl);

async function initDb() {
    try {
        console.log("🚀 Initializing database extensions...");
        await sql`CREATE EXTENSION IF NOT EXISTS vector;`;
        await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`;
        console.log("✅ Extensions enabled successfully.");
    } catch (error) {
        console.error("❌ Failed to initialize extensions:", error);
        process.exit(1);
    }
}

initDb();
