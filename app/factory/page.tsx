"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FactorySummaryGrid } from "@/features/factory/FactorySummaryGrid";
import { ProductionChart } from "@/features/factory/ProductionChart";
import { AgentGrid } from "@/features/factory/AgentGrid";
import { AgentFeed } from "@/features/factory/AgentFeed";
import { ResearchForm } from "@/features/research/components/research-form";
import { getDashboardMetrics, getActiveAgents, getAgentMessages, simulateAgentActivity } from "@/features/dashboard/actions";
import type { AgentData, AgentMessageData } from "@/features/dashboard/actions";
import { useEffect, useState, useCallback } from "react";

export default function FactoryDashboardPage() {
    const [metrics, setMetrics] = useState<any>(null);
    const [agents, setAgents] = useState<AgentData[]>([]);
    const [messages, setMessages] = useState<AgentMessageData[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        try {
            const [metricsData, agentsData, messagesData] = await Promise.all([
                getDashboardMetrics(),
                getActiveAgents(),
                getAgentMessages(15)
            ]);
            setMetrics(metricsData);
            setAgents(agentsData);
            setMessages(messagesData);
        } catch (error) {
            console.error("Failed to fetch data:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();

        const interval = setInterval(async () => {
            await simulateAgentActivity();
            const newMessages = await getAgentMessages(15);
            setMessages(newMessages);
        }, 8000);

        return () => clearInterval(interval);
    }, [fetchData]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-primary/30 rounded-full animate-spin border-t-primary"></div>
                </div>
                <p className="text-muted-foreground animate-pulse">Inicializando Factory OS...</p>
            </div>
        );
    }

    if (!metrics) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-destructive">Sistema Offline - Error de conexión</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="border-b">
                <div className="container flex h-16 items-center px-4">
                    <h1 className="text-2xl font-bold">Factory Dashboard</h1>
                    <div className="ml-auto">
                        <Link href="/">
                            <Button variant="ghost">← Volver al Inicio</Button>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="container py-8 px-4 space-y-8">
                <FactorySummaryGrid
                    totalOutput={metrics.totalOutput}
                    activeWorkers={agents.filter(a => a.status === 'active' || a.status === 'thinking').length}
                    uptimePercent={metrics.uptimePercent}
                    errorRate={metrics.errorRate}
                />

                <section>
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <span>🤖</span> Agentes Autónomos
                        <span className="text-xs text-muted-foreground font-normal ml-2">
                            ({agents.filter(a => a.status === 'active').length} activos)
                        </span>
                    </h2>
                    <AgentGrid agents={agents} />
                </section>

                <div className="grid gap-8 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-8">
                        <ProductionChart data={metrics.productionHistory} />
                        <AgentFeed messages={messages} />
                    </div>
                    <div className="space-y-8">
                        <ResearchForm />
                    </div>
                </div>
            </div>
        </div>
    );
}
