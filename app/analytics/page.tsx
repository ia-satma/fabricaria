import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, TrendingUp, Users, Zap, Activity } from "lucide-react";
import Link from "next/link";
import { AnalyticsCharts } from "@/features/analytics/AnalyticsCharts";
import { getDashboardMetrics } from "@/features/analytics/actions";

export default async function AnalyticsPage() {
    const dashboardMetrics = await getDashboardMetrics();

    const metrics = [
        {
            title: "Total Agents",
            value: dashboardMetrics.totalAgents.toString(),
            change: "+12%",
            icon: Users,
        },
        {
            title: "Tasks Completed",
            value: dashboardMetrics.totalTasksCompleted.toLocaleString(),
            change: "+23%",
            icon: Zap,
        },
        {
            title: "Avg. Response Time",
            value: dashboardMetrics.avgResponseTime,
            change: "-8%",
            icon: Activity,
        },
        {
            title: "Success Rate",
            value: dashboardMetrics.successRate,
            change: "+2.1%",
            icon: TrendingUp,
        },
    ];

    return (
        <div className="min-h-screen bg-background cyber-grid">
            <div className="border-b border-primary/20">
                <div className="container flex h-16 items-center px-4">
                    <div className="flex items-center gap-2">
                        <BarChart3 className="h-6 w-6 text-primary" />
                        <h1 className="text-2xl font-bold font-mono">Analytics Dashboard</h1>
                    </div>
                    <div className="ml-auto">
                        <Link href="/">
                            <Button variant="ghost" className="font-mono">← BACK TO HOME</Button>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="container py-8 px-4 space-y-8">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {metrics.map((metric) => (
                        <Card key={metric.title} className="cyber-card">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-mono text-muted-foreground">
                                    {metric.title}
                                </CardTitle>
                                <metric.icon className="h-4 w-4 text-primary" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold font-mono">{metric.value}</div>
                                <p className={`text-xs font-mono ${metric.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                                    {metric.change} from last week
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <AnalyticsCharts />
            </div>
        </div>
    );
}
