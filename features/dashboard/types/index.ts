export interface MetricCard {
    title: string;
    value: string | number;
    change?: string;
    changeType?: "positive" | "negative" | "neutral";
    icon: string;
}

export interface ActivityPoint {
    time: string;
    agents: number;
    tokens: number;
}

export interface AegisLog {
    id: string;
    timestamp: string;
    action: string;
    status: "success" | "blocked" | "warning";
    details: string;
}

export interface DashboardMetrics {
    activeUsers: number;
    tokensConsumed: number;
    aegisBlocked: number;
    cacheHitRate: number;
    activity: ActivityPoint[];
    logs: AegisLog[];
}
