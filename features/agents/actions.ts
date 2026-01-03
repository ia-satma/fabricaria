"use server";

import { db } from "@/db";
import { agents } from "@/db/schema";
import { desc } from "drizzle-orm";
import type { Agent, AgentStatus } from "./types";

export async function getAgents(): Promise<Agent[]> {
    const result = await db
        .select()
        .from(agents)
        .orderBy(desc(agents.createdAt));

    return result.map((row) => ({
        id: row.id,
        name: row.name,
        status: (row.status || "idle") as AgentStatus,
        replId: row.replId || "",
        url: row.url,
        tasksCompleted: row.tasksCompleted || 0,
        cpuLoad: row.cpuLoad || 0,
        createdAt: row.createdAt || new Date(),
    }));
}

export async function getAgentCount(): Promise<number> {
    const result = await db.select().from(agents);
    return result.length;
}
