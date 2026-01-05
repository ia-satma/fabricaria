
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, XCircle, Clock } from "lucide-react";

/**
 * PASO 393: EL INTERRUPTOR DE "HITL" (Cola de Aprobación Humana)
 * Objetivo: Autorizar acciones de alto riesgo bloqueadas por Aegis.
 */

const PENDING_ACTIONS = [
    {
        id: "hitl-942",
        agent: "Marketing",
        action: "Send 5,000 Emails",
        risk: "High (Token Burn)",
        cost: "$12.50",
        timestamp: "2 mins ago"
    }
];

export function HitlQueue() {
    return (
        <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
                <CardTitle className="text-zinc-400 text-sm font-medium flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-amber-500" /> HITL APPROVAL QUEUE
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {PENDING_ACTIONS.length === 0 ? (
                        <div className="text-zinc-600 text-xs italic py-4 text-center">
                            No high-risk actions pending approval.
                        </div>
                    ) : (
                        PENDING_ACTIONS.map(action => (
                            <div key={action.id} className="p-3 border border-zinc-800 rounded bg-zinc-950/50">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="text-xs font-bold text-zinc-200">
                                        {action.agent}: {action.action}
                                    </div>
                                    <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/50 text-[10px]">
                                        PENDING
                                    </Badge>
                                </div>
                                <div className="text-[10px] text-zinc-500 space-y-1">
                                    <p>Risk: <span className="text-amber-400">{action.risk}</span></p>
                                    <p>Est. Cost: <span className="text-cyan-400">{action.cost}</span></p>
                                    <p className="italic">{action.timestamp}</p>
                                </div>
                                <div className="flex gap-2 mt-4">
                                    <Button size="sm" className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-xs h-8">
                                        <ShieldCheck className="w-3 h-3 mr-1" /> Approve
                                    </Button>
                                    <Button size="sm" variant="destructive" className="flex-1 text-xs h-8">
                                        <XCircle className="w-3 h-3 mr-1" /> Block
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
