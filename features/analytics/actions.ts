"use server";

import { db } from "@/db";
import { agents, analyticsEvents } from "@/db/schema";
import { sql, desc, eq, and, gte, lte } from "drizzle-orm";

export interface DashboardMetrics {
    totalAgents: number;
    totalTasksCompleted: number;
    avgResponseTime: string;
    successRate: string;
}

export interface TaskOverviewDataPoint {
    name: string;
    completed: number;
    failed: number;
}

export interface PerformanceDataPoint {
    time: string;
    cpu: number;
    memory: number;
}

export interface AgentActivityDataPoint {
    agent: string;
    tasks: number;
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
    const agentCountResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(agents);
    const totalAgents = Number(agentCountResult[0]?.count || 0);

    const completedResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(analyticsEvents)
        .where(eq(analyticsEvents.category, "task_completed"));

    const failedResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(analyticsEvents)
        .where(eq(analyticsEvents.category, "task_failed"));

    const totalCompleted = Number(completedResult[0]?.count || 0);
    const totalFailed = Number(failedResult[0]?.count || 0);
    const totalTasks = totalCompleted + totalFailed;

    const successRate = totalTasks > 0 
        ? ((totalCompleted / totalTasks) * 100).toFixed(1)
        : "0.0";

    const cpuResult = await db
        .select({ avgValue: sql<number>`avg(value)` })
        .from(analyticsEvents)
        .where(eq(analyticsEvents.category, "cpu_sample"));
    const avgCpu = Number(cpuResult[0]?.avgValue || 50);
    const avgResponseTime = (0.5 + (avgCpu / 100) * 1.5).toFixed(1);

    return {
        totalAgents,
        totalTasksCompleted: totalCompleted,
        avgResponseTime: `${avgResponseTime}s`,
        successRate: `${successRate}%`,
    };
}

export async function getTasksOverviewData(): Promise<TaskOverviewDataPoint[]> {
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    
    const result = await db.execute(sql`
        SELECT 
            to_char(date::date, 'YYYY-MM-DD') as day_key,
            EXTRACT(DOW FROM date::date)::int as day_of_week,
            COALESCE(SUM(CASE WHEN category = 'task_completed' THEN value ELSE 0 END), 0)::int as completed,
            COALESCE(SUM(CASE WHEN category = 'task_failed' THEN value ELSE 0 END), 0)::int as failed
        FROM analytics_events
        WHERE category IN ('task_completed', 'task_failed')
          AND date >= CURRENT_DATE - INTERVAL '6 days'
        GROUP BY date::date
        ORDER BY date::date
    `);

    const rows = result.rows as Array<{ 
        day_key: string; 
        day_of_week: string | number; 
        completed: string | number; 
        failed: string | number; 
    }>;

    return rows.map(row => ({
        name: dayNames[Number(row.day_of_week)],
        completed: Number(row.completed),
        failed: Number(row.failed),
    }));
}

export async function getPerformanceData(): Promise<PerformanceDataPoint[]> {
    const result = await db.execute(sql`
        SELECT 
            EXTRACT(HOUR FROM date)::int as hour,
            category,
            value
        FROM analytics_events
        WHERE category IN ('cpu_sample', 'memory_sample')
          AND date >= NOW() - INTERVAL '24 hours'
        ORDER BY date
    `);

    const dataByHour: Record<string, { cpu: number; memory: number }> = {};

    for (const row of result.rows as Array<{ hour: string | number; category: string; value: string | number }>) {
        const hourKey = Number(row.hour).toString().padStart(2, "0") + ":00";
        if (!dataByHour[hourKey]) {
            dataByHour[hourKey] = { cpu: 0, memory: 0 };
        }
        if (row.category === "cpu_sample") {
            dataByHour[hourKey].cpu = Number(row.value);
        } else if (row.category === "memory_sample") {
            dataByHour[hourKey].memory = Number(row.value);
        }
    }

    const sortedHours = Object.keys(dataByHour).sort();
    return sortedHours.map((time) => ({
        time,
        cpu: dataByHour[time].cpu,
        memory: dataByHour[time].memory,
    }));
}

export async function getAgentActivityData(): Promise<AgentActivityDataPoint[]> {
    const agentList = await db
        .select()
        .from(agents)
        .orderBy(desc(agents.tasksCompleted));

    return agentList.slice(0, 5).map((agent) => ({
        agent: agent.name,
        tasks: agent.tasksCompleted || 0,
    }));
}
