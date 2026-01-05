
"use server";

import { db } from "@/db";
import { tokenUsageLogs, auditTrail, fabricationQueue, agents, agentMessages } from "@/db/schema";
import { sql, eq, desc } from "drizzle-orm";

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

export interface AgentData {
    id: string;
    name: string;
    codename: string | null;
    role: string | null;
    personality: string | null;
    objective: string | null;
    capabilities: string[];
    avatar: string | null;
    status: string | null;
    currentTask: string | null;
    tasksCompleted: number | null;
    cpuLoad: number | null;
    lastActivity: Date | null;
}

export interface AgentMessageData {
    id: string;
    fromAgent: { name: string; avatar: string | null; codename: string | null } | null;
    toAgent: { name: string; avatar: string | null; codename: string | null } | null;
    messageType: string;
    content: string;
    createdAt: Date | null;
}

export async function getActiveAgents(): Promise<AgentData[]> {
    console.log("🤖 [Server-Action] Fetching active agents...");
    
    try {
        const agentList = await db.select().from(agents).orderBy(desc(agents.lastActivity));
        
        return agentList.map(a => ({
            id: a.id,
            name: a.name,
            codename: a.codename,
            role: a.role,
            personality: a.personality,
            objective: a.objective,
            capabilities: (a.capabilities as string[]) || [],
            avatar: a.avatar,
            status: a.status,
            currentTask: a.currentTask,
            tasksCompleted: a.tasksCompleted,
            cpuLoad: a.cpuLoad,
            lastActivity: a.lastActivity,
        }));
    } catch (e) {
        console.error("❌ [Server-Action] Failed to fetch agents:", e);
        return [];
    }
}

export async function getAgentMessages(limit: number = 15): Promise<AgentMessageData[]> {
    console.log("💬 [Server-Action] Fetching agent messages...");
    
    try {
        const messages = await db
            .select({
                id: agentMessages.id,
                fromAgentId: agentMessages.fromAgentId,
                toAgentId: agentMessages.toAgentId,
                messageType: agentMessages.messageType,
                content: agentMessages.content,
                createdAt: agentMessages.createdAt,
            })
            .from(agentMessages)
            .orderBy(desc(agentMessages.createdAt))
            .limit(limit);

        const agentList = await db.select({
            id: agents.id,
            name: agents.name,
            avatar: agents.avatar,
            codename: agents.codename,
        }).from(agents);

        const agentMap = new Map(agentList.map(a => [a.id, a]));

        return messages.map(m => ({
            id: m.id,
            fromAgent: m.fromAgentId ? agentMap.get(m.fromAgentId) || null : null,
            toAgent: m.toAgentId ? agentMap.get(m.toAgentId) || null : null,
            messageType: m.messageType,
            content: m.content,
            createdAt: m.createdAt,
        }));
    } catch (e) {
        console.error("❌ [Server-Action] Failed to fetch messages:", e);
        return [];
    }
}

export async function simulateAgentActivity() {
    const agentList = await db.select({ id: agents.id, codename: agents.codename }).from(agents);
    
    if (agentList.length < 2) return;

    const activities = [
        { from: 'nexus', to: 'argos', type: 'task', content: '🎯 Nuevo repositorio detectado para auditoría' },
        { from: 'argos', to: 'minerva', type: 'handoff', content: '📦 5 patrones extraídos, listos para embedding' },
        { from: 'vulcan', to: 'sentinel', type: 'alert', content: '🔐 Validación requerida para nuevo código' },
        { from: 'sentinel', to: 'nexus', type: 'response', content: '🛡️ Sistema seguro, sin anomalías' },
        { from: 'chronos', to: 'nexus', type: 'response', content: '⏰ Cola procesada, 0 trabajos pendientes' },
        { from: 'minerva', to: 'vulcan', type: 'thinking', content: '💭 Nuevo patrón identificado: micro-frontend' },
    ];

    const activity = activities[Math.floor(Math.random() * activities.length)];
    const fromAgent = agentList.find(a => a.codename === activity.from);
    const toAgent = agentList.find(a => a.codename === activity.to);

    if (fromAgent && toAgent) {
        await db.insert(agentMessages).values({
            fromAgentId: fromAgent.id,
            toAgentId: toAgent.id,
            messageType: activity.type,
            content: activity.content,
        });
    }
}
