import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Users, Gauge, AlertTriangle } from "lucide-react";

interface FactorySummaryGridProps {
    totalOutput: number;
    activeWorkers: number;
    uptimePercent: number;
    errorRate: number;
}

export function FactorySummaryGrid({
    totalOutput,
    activeWorkers,
    uptimePercent,
    errorRate,
}: FactorySummaryGridProps) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Output</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalOutput.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">Units produced today</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Workers</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{activeWorkers}</div>
                    <p className="text-xs text-muted-foreground">Currently running</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Uptime</CardTitle>
                    <Gauge className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-green-600">{uptimePercent}%</div>
                    <p className="text-xs text-muted-foreground">Last 24 hours</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className={`text-2xl font-bold ${errorRate > 1 ? 'text-red-600' : 'text-green-600'}`}>
                        {errorRate}%
                    </div>
                    <p className="text-xs text-muted-foreground">Production failures</p>
                </CardContent>
            </Card>
        </div>
    );
}
