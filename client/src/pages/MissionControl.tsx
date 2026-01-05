
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

/**
 * PASO 214: MISSION CONTROL (The Eye of God)
 * Objetivo: Observabilidad total de la flota en tiempo real.
 */

export default function MissionControl() {
    const [telemetry, setTelemetry] = useState<any>({
        cognition: [],
        security: [],
        finance: { tokens: 0, cost: 0 }
    });

    useEffect(() => {
        // Simulación de conexión a WebSocket
        const interval = setInterval(() => {
            setTelemetry((prev: any) => ({
                ...prev,
                finance: {
                    tokens: prev.finance.tokens + Math.floor(Math.random() * 120),
                    cost: prev.finance.cost + (Math.random() * 0.05)
                },
                cognition: [
                    { id: Date.now(), agent: 'ARCHITECT', mind: 'Evaluating AST patch accuracy...', status: 'THINKING' },
                    ...prev.cognition.slice(0, 5)
                ]
            }));
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="p-8 space-y-8 bg-black min-h-screen text-slate-100 font-mono">
            <header className="flex justify-between items-center border-b border-slate-800 pb-4">
                <h1 className="text-3xl font-black tracking-tighter text-blue-500 italic">
                    MISSION CONTROL // FABRICAR.IA
                </h1>
                <Badge variant="outline" className="text-emerald-500 border-emerald-500 animate-pulse">
                    SYSTEM: AUTARKIC
                </Badge>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* PANEL COGNITIVO */}
                <Card className="bg-slate-950 border-slate-800 lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-blue-400">Cognitive Stream (Live Thoughts)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[400px] pr-4">
                            {telemetry.cognition.map((log: any) => (
                                <div key={log.id} className="mb-4 p-3 bg-slate-900/50 border-l-2 border-blue-500/30">
                                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                                        <span>Agent: {log.agent}</span>
                                        <span>{log.status}</span>
                                    </div>
                                    <p className="text-sm text-slate-300">{log.mind}</p>
                                </div>
                            ))}
                        </ScrollArea>
                    </CardContent>
                </Card>

                {/* PANEL FINANCIERO & SEGURIDAD */}
                <div className="space-y-6">
                    <Card className="bg-slate-950 border-slate-800 bg-gradient-to-br from-slate-950 to-emerald-950/20">
                        <CardHeader>
                            <CardTitle className="text-emerald-400">Financial Pulse</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold">${telemetry.finance.cost.toFixed(4)}</div>
                            <p className="text-xs text-slate-500 mt-1">Tokens Consumed: {telemetry.finance.tokens.toLocaleString()}</p>
                            <div className="mt-4 h-2 bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500" style={{ width: '40%' }}></div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-950 border-slate-800 bg-gradient-to-br from-slate-950 to-red-950/20">
                        <CardHeader>
                            <CardTitle className="text-red-400">Aegis Alerts</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="text-xs p-2 bg-red-950/30 border border-red-900/50 text-red-200">
                                    [BLOCK] rm -rf detected (IP: 10.0.0.4)
                                </div>
                                <div className="text-xs p-2 bg-orange-950/30 border border-orange-900/50 text-orange-200">
                                    [PII] Redacted Email (Presidio V1)
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <footer className="pt-8 border-t border-slate-900 flex justify-between text-[10px] text-slate-700">
                <div>SWARM_BUS_ID: {Math.random().toString(36).toUpperCase().slice(2, 14)}</div>
                <div>SEP-1763 COMPLIANT // AEGIS-V3 ENGINE</div>
            </footer>
        </div>
    );
}
