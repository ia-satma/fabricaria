import { db } from "../db";
import { agents, analyticsEvents } from "../db/schema";
import { sql } from "drizzle-orm";
import { neon } from "@neondatabase/serverless";

async function seedAnalytics() {
    console.log("Seeding analytics data...");

    const sqlClient = neon(process.env.DATABASE_URL!);

    const existingAgentsResult = await sqlClient`SELECT id::text, name FROM agents`;

    if (existingAgentsResult.length === 0) {
        console.log("No agents found. Creating sample agents first...");
        await db.insert(agents).values([
            { name: "Alpha", role: "Data Processor", objective: "Process data pipelines", status: "active" },
            { name: "Bravo", role: "API Handler", objective: "Handle API requests", status: "active" },
            { name: "Charlie", role: "Monitor", objective: "System monitoring", status: "active" },
            { name: "Delta", role: "Analyzer", objective: "Data analysis", status: "idle" },
            { name: "Echo", role: "Orchestrator", objective: "Task orchestration", status: "active" },
        ]);
    }

    const agentListResult = await sqlClient`SELECT id::text, name FROM agents`;
    const agentIds = agentListResult.map(a => a.id as string);
    const agentNames = agentListResult.reduce((acc, a) => {
        acc[a.id as string] = a.name as string;
        return acc;
    }, {} as Record<string, string>);

    console.log("Agent IDs:", agentIds);

    await sqlClient`DELETE FROM analytics_events`;

    const now = new Date();
    const events: {
        date: Date;
        category: string;
        value: number;
        agentId: string | null;
    }[] = [];

    for (let day = 29; day >= 0; day--) {
        const date = new Date(now);
        date.setDate(date.getDate() - day);
        date.setHours(12, 0, 0, 0);

        const isWeekend = date.getDay() === 0 || date.getDay() === 6;
        const baseCompleted = isWeekend ? 60 : 130;
        const baseFailed = isWeekend ? 3 : 8;

        const completedVariation = Math.floor(Math.random() * 50) - 25;
        const failedVariation = Math.floor(Math.random() * 6) - 3;

        const completedCount = Math.max(20, baseCompleted + completedVariation);
        const failedCount = Math.max(1, baseFailed + failedVariation);

        for (let i = 0; i < completedCount; i++) {
            const agentId = agentIds[Math.floor(Math.random() * agentIds.length)];
            events.push({
                date,
                category: "task_completed",
                value: 1,
                agentId,
            });
        }

        for (let i = 0; i < failedCount; i++) {
            const agentId = agentIds[Math.floor(Math.random() * agentIds.length)];
            events.push({
                date,
                category: "task_failed",
                value: 1,
                agentId,
            });
        }
    }

    for (let hour = 23; hour >= 0; hour--) {
        const sampleTime = new Date(now);
        sampleTime.setHours(now.getHours() - hour, 0, 0, 0);

        const isWorkHour = sampleTime.getHours() >= 8 && sampleTime.getHours() <= 18;
        const baseCpu = isWorkHour ? 65 : 40;
        const baseMemory = isWorkHour ? 72 : 58;

        const cpuValue = Math.max(20, Math.min(95, baseCpu + Math.floor(Math.random() * 30) - 15));
        const memoryValue = Math.max(40, Math.min(90, baseMemory + Math.floor(Math.random() * 20) - 10));

        events.push({
            date: sampleTime,
            category: "cpu_sample",
            value: cpuValue,
            agentId: null,
        });

        events.push({
            date: sampleTime,
            category: "memory_sample",
            value: memoryValue,
            agentId: null,
        });
    }

    console.log(`Inserting ${events.length} events...`);

    const batchSize = 50;
    for (let i = 0; i < events.length; i += batchSize) {
        const batch = events.slice(i, i + batchSize);
        for (const event of batch) {
            if (event.agentId) {
                await sqlClient`
                    INSERT INTO analytics_events (date, category, value, agent_id)
                    VALUES (${event.date}, ${event.category}, ${event.value}, ${event.agentId}::uuid)
                `;
            } else {
                await sqlClient`
                    INSERT INTO analytics_events (date, category, value)
                    VALUES (${event.date}, ${event.category}, ${event.value})
                `;
            }
        }
        console.log(`Inserted ${Math.min(i + batchSize, events.length)} / ${events.length} events`);
    }

    const taskCounts: Record<string, number> = {};
    for (const event of events) {
        if (event.agentId && event.category === "task_completed") {
            taskCounts[event.agentId] = (taskCounts[event.agentId] || 0) + 1;
        }
    }

    for (const [id, count] of Object.entries(taskCounts)) {
        await sqlClient`UPDATE agents SET tasks_completed = ${count} WHERE id = ${id}::uuid`;
    }

    console.log(`Seeded ${events.length} analytics events`);
    console.log("Analytics seeding complete!");
}

seedAnalytics()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error("Error seeding analytics:", err);
        process.exit(1);
    });
