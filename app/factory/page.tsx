import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FactorySummaryGrid } from "@/features/factory/FactorySummaryGrid";
import { ProductionChart } from "@/features/factory/ProductionChart";
import { WorkerStatusTable } from "@/features/factory/WorkerStatusTable";

const mockMetrics = {
    totalOutput: 12847,
    activeWorkers: 8,
    uptimePercent: 99.2,
    errorRate: 0.3,
    productionHistory: [
        { hour: '00:00', output: 450 },
        { hour: '04:00', output: 520 },
        { hour: '08:00', output: 780 },
        { hour: '12:00', output: 890 },
        { hour: '16:00', output: 720 },
        { hour: '20:00', output: 650 },
    ]
};

const mockWorkers = [
    { id: '1', name: 'Worker Alpha', role: 'Assembler', status: 'running' as const, outputPerHour: 145, lastHeartbeat: new Date() },
    { id: '2', name: 'Worker Beta', role: 'QA Inspector', status: 'running' as const, outputPerHour: 89, lastHeartbeat: new Date() },
    { id: '3', name: 'Worker Gamma', role: 'Packager', status: 'idle' as const, outputPerHour: 0, lastHeartbeat: new Date(Date.now() - 300000) },
];

export default function FactoryDashboardPage() {
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
                    totalOutput={mockMetrics.totalOutput}
                    activeWorkers={mockMetrics.activeWorkers}
                    uptimePercent={mockMetrics.uptimePercent}
                    errorRate={mockMetrics.errorRate}
                />

                <div className="grid gap-8 lg:grid-cols-2">
                    <ProductionChart data={mockMetrics.productionHistory} />
                    <WorkerStatusTable workers={mockWorkers} />
                </div>
            </div>
        </div>
    );
}
