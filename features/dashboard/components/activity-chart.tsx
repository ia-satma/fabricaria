"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { ActivityPoint } from "../types";
import { Activity } from "lucide-react";

interface ActivityChartProps {
    data: ActivityPoint[];
}

export function ActivityChart({ data }: ActivityChartProps) {
    return (
        <Card className="glass col-span-full lg:col-span-2">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg font-black">
                    <Activity className="h-5 w-5 text-primary" />
                    Actividad de Agentes (24h)
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorAgents" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorTokens" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis
                                dataKey="time"
                                stroke="hsl(var(--muted-foreground))"
                                fontSize={10}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="hsl(var(--muted-foreground))"
                                fontSize={10}
                                tickLine={false}
                                axisLine={false}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "hsl(var(--card))",
                                    border: "1px solid hsl(var(--border))",
                                    borderRadius: "8px",
                                    fontSize: "12px",
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="agents"
                                stroke="hsl(var(--primary))"
                                fillOpacity={1}
                                fill="url(#colorAgents)"
                                strokeWidth={2}
                            />
                            <Area
                                type="monotone"
                                dataKey="tokens"
                                stroke="#10b981"
                                fillOpacity={1}
                                fill="url(#colorTokens)"
                                strokeWidth={2}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
