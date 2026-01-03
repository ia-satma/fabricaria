"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    LineChart,
    Line,
    AreaChart,
    Area,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import type { TaskOverviewDataPoint, PerformanceDataPoint, AgentActivityDataPoint } from "./actions";

interface AnalyticsChartsClientProps {
    taskData: TaskOverviewDataPoint[];
    performanceData: PerformanceDataPoint[];
    agentActivityData: AgentActivityDataPoint[];
}

export function AnalyticsChartsClient({
    taskData,
    performanceData,
    agentActivityData,
}: AnalyticsChartsClientProps) {
    return (
        <div className="grid gap-6 md:grid-cols-2">
            <Card className="cyber-card col-span-2">
                <CardHeader>
                    <CardTitle className="font-mono text-primary">TASKS OVERVIEW</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={taskData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                            <XAxis dataKey="name" stroke="#666" fontSize={12} />
                            <YAxis stroke="#666" fontSize={12} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#1a1a2e",
                                    border: "1px solid #00f0ff33",
                                    borderRadius: 0,
                                }}
                            />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="completed"
                                stroke="#00f0ff"
                                strokeWidth={3}
                                dot={{ fill: "#00f0ff", strokeWidth: 2, r: 4 }}
                            />
                            <Line
                                type="monotone"
                                dataKey="failed"
                                stroke="#ff4444"
                                strokeWidth={3}
                                dot={{ fill: "#ff4444", strokeWidth: 2, r: 4 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card className="cyber-card">
                <CardHeader>
                    <CardTitle className="font-mono text-primary">SYSTEM PERFORMANCE</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={performanceData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                            <XAxis dataKey="time" stroke="#666" fontSize={12} />
                            <YAxis stroke="#666" fontSize={12} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#1a1a2e",
                                    border: "1px solid #00f0ff33",
                                    borderRadius: 0,
                                }}
                            />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="cpu"
                                stroke="#00f0ff"
                                strokeWidth={2}
                                dot={false}
                            />
                            <Line
                                type="monotone"
                                dataKey="memory"
                                stroke="#ff00ff"
                                strokeWidth={2}
                                dot={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card className="cyber-card">
                <CardHeader>
                    <CardTitle className="font-mono text-primary">AGENT ACTIVITY</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={agentActivityData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                            <XAxis type="number" stroke="#666" fontSize={12} />
                            <YAxis dataKey="agent" type="category" stroke="#666" fontSize={12} width={60} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#1a1a2e",
                                    border: "1px solid #00f0ff33",
                                    borderRadius: 0,
                                }}
                            />
                            <Bar dataKey="tasks" fill="#00f0ff" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}
