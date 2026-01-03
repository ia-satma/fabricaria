"use server";

import { db } from "@/db";
import { agents } from "@/db/schema";
import { desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { Agent, AgentStatus } from "./types";
import { createAgentSchema, type CreateAgentInput } from "./schema";

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

export async function createAgent(input: CreateAgentInput) {
    const validated = createAgentSchema.safeParse(input);

    if (!validated.success) {
        return { error: validated.error.flatten().fieldErrors };
    }

    const { name, role, objective } = validated.data;

    const replId = `repl-${name.toLowerCase().replace(/\s+/g, "-")}-${Date.now().toString(36)}`;

    await db.insert(agents).values({
        name,
        role,
        objective,
        replId,
        status: "booting",
        tasksCompleted: 0,
        cpuLoad: 0,
    });

    revalidatePath("/agents");
    redirect("/agents");
}
