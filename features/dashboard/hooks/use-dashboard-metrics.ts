import { DashboardMetrics, ActivityPoint, AegisLog } from "../types";

// Simulated data for the dashboard
export function useDashboardMetrics(): DashboardMetrics {
    const activity: ActivityPoint[] = Array.from({ length: 24 }, (_, i) => ({
        time: `${String(i).padStart(2, "0")}:00`,
        agents: Math.floor(Math.random() * 50) + 10,
        tokens: Math.floor(Math.random() * 5000) + 1000,
    }));

    const logs: AegisLog[] = [
        {
            id: "1",
            timestamp: "09:45:23",
            action: "Agent Checkout Created",
            status: "success",
            details: "Stripe session initialized",
        },
        {
            id: "2",
            timestamp: "09:42:15",
            action: "PII Detection Blocked",
            status: "blocked",
            details: "Credit card pattern detected in output",
        },
        {
            id: "3",
            timestamp: "09:38:01",
            action: "Memory Injection",
            status: "success",
            details: "Vector embedding stored in Neon",
        },
        {
            id: "4",
            timestamp: "09:35:44",
            action: "File Delete Attempt",
            status: "blocked",
            details: "Destructive action blocked by AEGIS",
        },
        {
            id: "5",
            timestamp: "09:30:12",
            action: "Context Cache Hit",
            status: "success",
            details: "90% token savings applied",
        },
    ];

    return {
        activeUsers: 127,
        tokensConsumed: 2_450_000,
        aegisBlocked: 23,
        cacheHitRate: 87,
        activity,
        logs,
    };
}
