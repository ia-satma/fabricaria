
"use server";

import { db } from "../../db";
import { fabricationQueue, agents } from "../../db/schema";
import { count, eq, sql } from "drizzle-orm";

export async function getDashboardMetrics() {
    // Aggregate metrics from DB
    const pendingJobs = await db.select({ count: count() }).from(fabricationQueue).where(eq(fabricationQueue.status, "pending"));
    const activeWorkers = await db.select({ count: count() }).from(agents).where(eq(agents.status, "active"));
    const completedJobs = await db.select({ count: count() }).from(fabricationQueue).where(eq(fabricationQueue.status, "completed"));
    // const totalJobs = await db.select({ count: count() }).from(fabricationQueue); // Optional

    // Mocking "uptime" or calculating it if we had logs
    const uptimePercent = 99.9;

    // Calculate specific metrics if needed, for instance, based on timestamps
    // For now, return what fits the UI interface

    return {
        totalOutput: completedJobs[0]?.count || 0,
        activeWorkers: activeWorkers[0]?.count || 0,
        uptimePercent,
        errorRate: 0, // Placeholder or calculate from failed jobs
        productionHistory: [] // Placeholder or query analyticsEvents
    };
}
