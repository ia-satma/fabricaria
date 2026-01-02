"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Users, Zap, ShieldAlert, Database, TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
    title: string;
    value: string | number;
    change?: string;
    changeType?: "positive" | "negative" | "neutral";
    icon: "users" | "tokens" | "aegis" | "cache";
}

const icons = {
    users: Users,
    tokens: Zap,
    aegis: ShieldAlert,
    cache: Database,
};

export function StatCard({ title, value, change, changeType = "neutral", icon }: StatCardProps) {
    const Icon = icons[icon];

    return (
        <Card className="glass hover:scale-[1.02] transition-all duration-300">
            <CardContent className="p-6">
                <div className="flex items-start justify-between">
                    <div className="space-y-2">
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                            {title}
                        </p>
                        <p className="text-3xl font-black tracking-tight">{value}</p>
                        {change && (
                            <div className={cn(
                                "flex items-center gap-1 text-xs font-bold",
                                changeType === "positive" && "text-emerald-500",
                                changeType === "negative" && "text-red-500",
                                changeType === "neutral" && "text-muted-foreground"
                            )}>
                                {changeType === "positive" && <TrendingUp className="h-3 w-3" />}
                                {changeType === "negative" && <TrendingDown className="h-3 w-3" />}
                                <span>{change}</span>
                            </div>
                        )}
                    </div>
                    <div className={cn(
                        "h-12 w-12 rounded-2xl flex items-center justify-center",
                        icon === "aegis" ? "bg-red-500/10 text-red-500" : "bg-primary/10 text-primary"
                    )}>
                        <Icon className="h-6 w-6" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
