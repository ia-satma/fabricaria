"use client";

import { StatCard } from "@/features/dashboard/components/stat-card";
import { ActivityChart } from "@/features/dashboard/components/activity-chart";
import { AegisLogsTable } from "@/features/dashboard/components/aegis-logs-table";
import { useDashboardMetrics } from "@/features/dashboard/hooks/use-dashboard-metrics";
import { Box, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DashboardPage() {
    const metrics = useDashboardMetrics();

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Navigation */}
            <nav className="border-b border-border/40 bg-background/95 backdrop-blur sticky top-0 z-40 w-full px-6">
                <div className="container flex h-16 items-center justify-between px-0">
                    <div className="flex items-center gap-4">
                        <Link href="/">
                            <Button variant="ghost" size="sm" className="gap-2 font-semibold">
                                <ArrowLeft className="h-4 w-4" /> Volver
                            </Button>
                        </Link>
                        <div className="h-4 w-[1px] bg-border/40" />
                        <div className="flex items-center gap-2 font-bold tracking-tighter text-xl">
                            <Box className="h-6 w-6 text-primary" />
                            <span>Mission Control</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/5 border border-emerald-500/10">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black tracking-[0.2em] uppercase text-emerald-500/80">
                            ALL SYSTEMS NOMINAL
                        </span>
                    </div>
                </div>
            </nav>

            <main className="container py-8 space-y-8 px-6">
                {/* Header */}
                <div className="space-y-2">
                    <h1 className="text-4xl font-black tracking-tighter">Panel de Observabilidad</h1>
                    <p className="text-muted-foreground">
                        Visualiza el rendimiento y seguridad del sistema en tiempo real.
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Usuarios Activos"
                        value={metrics.activeUsers}
                        change="+12% vs ayer"
                        changeType="positive"
                        icon="users"
                    />
                    <StatCard
                        title="Tokens Consumidos"
                        value={`${(metrics.tokensConsumed / 1_000_000).toFixed(1)}M`}
                        change="High thinking mode"
                        changeType="neutral"
                        icon="tokens"
                    />
                    <StatCard
                        title="AEGIS Bloqueados"
                        value={metrics.aegisBlocked}
                        change="Intenciones maliciosas"
                        changeType="negative"
                        icon="aegis"
                    />
                    <StatCard
                        title="Cache Hit Rate"
                        value={`${metrics.cacheHitRate}%`}
                        change="90% ahorro en tokens"
                        changeType="positive"
                        icon="cache"
                    />
                </div>

                {/* Charts and Logs */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <ActivityChart data={metrics.activity} />
                    <AegisLogsTable logs={metrics.logs} />
                </div>
            </main>
        </div>
    );
}
