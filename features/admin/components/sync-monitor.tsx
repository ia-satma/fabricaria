
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCcw, CheckCircle2, AlertCircle } from "lucide-react";

/**
 * PASO 392: EL MONITOR DE DERIVA "GIT-SYNC"
 * Objetivo: Comparar hashes entre Local, GitHub y Vercel.
 */

export function SyncMonitor() {
    const [status, setStatus] = useState<'synced' | 'drift' | 'loading'>('loading');

    // Mock hashes
    const hashes = {
        local: "ae041d0",
        remote: "ae041d0",
        live: "ae041d0"
    };

    const isSynced = hashes.local === hashes.remote && hashes.remote === hashes.live;

    useEffect(() => {
        setTimeout(() => setStatus(isSynced ? 'synced' : 'drift'), 1000);
    }, [isSynced]);

    return (
        <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-zinc-400 text-sm font-medium">GIT-SYNC MONITOR</CardTitle>
                {status === 'synced' ? (
                    <Badge variant="outline" className="text-emerald-500 border-emerald-500/50 bg-emerald-500/10">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> SYNCED
                    </Badge>
                ) : (
                    <Badge variant="outline" className="text-rose-500 border-rose-500/50 bg-rose-500/10">
                        <AlertCircle className="w-3 h-3 mr-1" /> DRIFT DETECTED
                    </Badge>
                )}
            </CardHeader>
            <CardContent>
                <div className="space-y-3 mt-2 text-xs font-mono">
                    <div className="flex justify-between items-center text-zinc-500">
                        <span>Local (Replit):</span>
                        <span className="text-zinc-300">{hashes.local}</span>
                    </div>
                    <div className="flex justify-between items-center text-zinc-500">
                        <span>Remote (GitHub):</span>
                        <span className="text-zinc-300">{hashes.remote}</span>
                    </div>
                    <div className="flex justify-between items-center text-zinc-500">
                        <span>Live (Vercel):</span>
                        <span className="text-emerald-400">{hashes.live}</span>
                    </div>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-4 border-zinc-700 text-zinc-400 hover:text-zinc-100"
                >
                    <RefreshCcw className="w-3 h-3 mr-2" /> Force Sync & Redeploy
                </Button>
            </CardContent>
        </Card>
    );
}
