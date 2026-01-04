
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BadgeDollarSign } from "lucide-react";
// import { createClient } from "@/lib/utils/supabase/client"; // REMOVED

import { fetchTotalCostAction } from "../../features/dashboard/actions";

export function CostWidget() {
    const [cost, setCost] = useState<string>("0.0000");

    useEffect(() => {
        const loadCost = async () => {
            const total = await fetchTotalCostAction();
            setCost(total);
        };
        loadCost();
        // Poll every 30s
        const interval = setInterval(loadCost, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <Card className="w-[200px] absolute top-4 right-4 z-50 shadow-lg bg-black/80 backdrop-blur border-border">
            <CardContent className="p-4 flex flex-col items-center">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <BadgeDollarSign className="w-4 h-4" />
                    <span className="text-xs font-mono uppercase">Daily Spend</span>
                </div>
                <div className="text-2xl font-bold text-emerald-400 font-mono">
                    ${cost}
                </div>
            </CardContent>
        </Card>
    );
}
