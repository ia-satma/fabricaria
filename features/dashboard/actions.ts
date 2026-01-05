
"use server";

import { db } from "@/db";
import { tokenUsageLogs, auditTrail, fabricationQueue } from "@/db/schema";
import { sql, eq } from "drizzle-orm";

export async function getDashboardMetrics() {
    console.log("🧠 [Server-Action] Fetching factory metrics...");

    try {
        const costResult = await db.select({
            total: sql<string>`COALESCE(SUM(CAST(cost_usd AS DECIMAL)), 0)`
        }).from(tokenUsageLogs);

        const completedJobs = await db.select({
            count: sql<number>`count(*)`
        }).from(fabricationQueue).where(eq(fabricationQueue.status, "completed"));

        const failedJobs = await db.select({
            count: sql<number>`count(*)`
        }).from(fabricationQueue).where(eq(fabricationQueue.status, "failed"));

        const totalJobs = Number(completedJobs[0]?.count || 0) + Number(failedJobs[0]?.count || 0);
        const errorRate = totalJobs > 0 ? ((Number(failedJobs[0]?.count || 0) / totalJobs) * 100).toFixed(1) : 0;

        const productionHistory = [
            { date: "Lun", output: 120 },
            { date: "Mar", output: 150 },
            { date: "Mie", output: 180 },
            { date: "Jue", output: 200 },
            { date: "Vie", output: 170 },
            { date: "Sab", output: 90 },
            { date: "Dom", output: 60 },
        ];

        return {
            totalOutput: Number(completedJobs[0]?.count || 0),
            activeWorkers: 3,
            uptimePercent: 99.5,
            errorRate: Number(errorRate),
            productionHistory,
            totalCost: Number(costResult[0]?.total || 0).toFixed(2),
        };
    } catch (e) {
        console.error("❌ [Server-Action] Data fetch failed:", e);
        return {
            totalOutput: 0,
            activeWorkers: 0,
            uptimePercent: 0,
            errorRate: 0,
            productionHistory: [],
            totalCost: "0.00",
        };
    }
}
