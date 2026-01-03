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

const taskData = [
    { name: "Mon", completed: 120, failed: 8 },
    { name: "Tue", completed: 145, failed: 12 },
    { name: "Wed", completed: 132, failed: 5 },
    { name: "Thu", completed: 178, failed: 9 },
    { name: "Fri", completed: 156, failed: 7 },
    { name: "Sat", completed: 89, failed: 3 },
    { name: "Sun", completed: 67, failed: 2 },
];

const performanceData = [
    { time: "00:00", cpu: 45, memory: 62 },
    { time: "04:00", cpu: 38, memory: 58 },
    { time: "08:00", cpu: 72, memory: 75 },
    { time: "12:00", cpu: 85, memory: 82 },
    { time: "16:00", cpu: 78, memory: 79 },
    { time: "20:00", cpu: 55, memory: 68 },
    { time: "23:59", cpu: 42, memory: 60 },
];

const agentActivityData = [
    { agent: "Alpha", tasks: 1247 },
    { agent: "Bravo", tasks: 892 },
    { agent: "Charlie", tasks: 756 },
    { agent: "Delta", tasks: 534 },
    { agent: "Echo", tasks: 2341 },
];

export function AnalyticsCharts() {
    return (
        <div className="grid gap-6 md:grid-cols-2">
            <Card className="cyber-card col-span-2">
                <CardHeader>
                    <CardTitle className="font-mono text-primary">TASKS OVERVIEW</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={taskData}>
                            <defs>
                                <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#00f0ff" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorFailed" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ff4444" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#ff4444" stopOpacity={0} />
                                </linearGradient>
                            </defs>
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
                            <Area
                                type="monotone"
                                dataKey="completed"
                                stroke="#00f0ff"
                                fillOpacity={1}
                                fill="url(#colorCompleted)"
                            />
                            <Area
                                type="monotone"
                                dataKey="failed"
                                stroke="#ff4444"
                                fillOpacity={1}
                                fill="url(#colorFailed)"
                            />
                        </AreaChart>
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
