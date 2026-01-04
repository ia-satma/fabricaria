"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FactorySummaryGrid } from "@/features/factory/FactorySummaryGrid";
import { ProductionChart } from "@/features/factory/ProductionChart";

import { WorkerStatusTable } from "@/features/factory/WorkerStatusTable";
import { ResearchForm } from "@/features/research/components/research-form";
import { getDashboardMetrics } from "@/features/dashboard/actions";
import { useEffect, useState } from "react";

export default function FactoryDashboardPage() {
    const [metrics, setMetrics] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchMetrics() {
            try {
                const data = await getDashboardMetrics();
                setMetrics(data);
            } catch (error) {
                console.error("Failed to fetch metrics:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchMetrics();
    }, []);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading Factory OS...</div>;
    }

    // Empty state handling if no metrics
    if (!metrics) {
        return <div className="min-h-screen flex items-center justify-center">System Offline</div>;
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="border-b">
                <div className="container flex h-16 items-center px-4">
                    <h1 className="text-2xl font-bold">Factory Dashboard</h1>
                    <div className="ml-auto">
                        <Link href="/">
                            <Button variant="ghost">← Back to Home</Button>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="container py-8 px-4 space-y-8">
                <FactorySummaryGrid
                    totalOutput={metrics.totalOutput}
                    activeWorkers={metrics.activeWorkers}
                    uptimePercent={metrics.uptimePercent}
                    errorRate={metrics.errorRate}
                />

                <div className="grid gap-8 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <ProductionChart data={metrics.productionHistory} />
                    </div>
                    <div className="space-y-8">
                        <ResearchForm />
                        {/* Fetch workers separately or include in metrics */}
                        <WorkerStatusTable workers={[]} />
                    </div>
                </div>
            </div>
        </div>
    );
}
