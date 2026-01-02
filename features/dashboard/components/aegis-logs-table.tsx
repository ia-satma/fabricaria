"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { AegisLog } from "../types";
import { ShieldCheck, ShieldAlert, ShieldQuestion, ScrollText } from "lucide-react";

interface AegisLogsTableProps {
    logs: AegisLog[];
}

const statusConfig = {
    success: {
        icon: ShieldCheck,
        className: "text-emerald-500 bg-emerald-500/10",
    },
    blocked: {
        icon: ShieldAlert,
        className: "text-red-500 bg-red-500/10",
    },
    warning: {
        icon: ShieldQuestion,
        className: "text-yellow-500 bg-yellow-500/10",
    },
};

export function AegisLogsTable({ logs }: AegisLogsTableProps) {
    return (
        <Card className="glass">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg font-black">
                    <ScrollText className="h-5 w-5 text-primary" />
                    Registros AEGIS Recientes
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {logs.map((log) => {
                        const config = statusConfig[log.status];
                        const StatusIcon = config.icon;

                        return (
                            <div
                                key={log.id}
                                className="flex items-center gap-4 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                            >
                                <div className={cn(
                                    "h-8 w-8 rounded-lg flex items-center justify-center shrink-0",
                                    config.className
                                )}>
                                    <StatusIcon className="h-4 w-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold truncate">{log.action}</p>
                                    <p className="text-xs text-muted-foreground truncate">{log.details}</p>
                                </div>
                                <div className="text-xs font-mono text-muted-foreground shrink-0">
                                    {log.timestamp}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
