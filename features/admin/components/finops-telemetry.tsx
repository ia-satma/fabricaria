
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, TrendingUp, Zap } from "lucide-react";

/**
 * PASO 394: TELEMETRÍA FINANCIERA EN TIEMPO REAL (FinOps)
 * Objetivo: Visualizar el burnout de tokens y detener procesos costosos.
 */

export function FinOpsTelemetry() {
    return (
        <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-zinc-400 text-sm font-medium">FINOPS TELEMETRY</CardTitle>
                <TrendingUp className="h-4 w-4 text-cyan-500" />
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                            <span className="text-zinc-500">Current Burn Rate:</span>
                            <span className="text-cyan-400">$0.02 / min</span>
                        </div>
                        <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-cyan-500 h-full w-[14%]" />
                        </div>
                        <p className="text-[10px] text-zinc-500 text-right">Budget Utilization: 14%</p>
                    </div>

                    <div className="p-2 border border-rose-500/20 bg-rose-500/5 rounded">
                        <p className="text-[10px] text-zinc-400 mb-2 font-mono">
                            <Zap className="inline w-3 h-3 mr-1 text-rose-500" />
                            EMERGENCY PROTOCOL
                        </p>
                        <Button
                            variant="destructive"
                            size="sm"
                            className="w-full bg-rose-600 hover:bg-rose-700 text-xs h-8"
                        >
                            <AlertTriangle className="w-3 h-3 mr-1 shadow-rose-500" /> Financial Panic Button
                        </Button>
                        <p className="text-[9px] text-zinc-600 mt-2 text-center">
                            Downgrades all models to Flash & stops non-essential jobs.
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
