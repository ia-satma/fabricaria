
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { History, FileText, ChevronRight } from "lucide-react";

/**
 * PASO 395: LA MÁQUINA DEL TIEMPO (Navegador de Artefactos)
 * Objetivo: Ver y restaurar versiones de decisiones y código.
 */

const ARTEFACTS = [
    { title: "AGENTS.md", date: "2026-01-04 21:10", version: "v52.0.1" },
    { title: "task.md", date: "2026-01-04 21:15", version: "v53.0.0" },
    { title: "implementation_plan.md", date: "2026-01-04 21:17", version: "v53.0.0" }
];

export function ArtifactBrowser() {
    return (
        <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
                <CardTitle className="text-zinc-400 text-sm font-medium flex items-center">
                    <History className="w-4 h-4 mr-2" /> ARTIFACT TIME MACHINE
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    {ARTEFACTS.map((art, i) => (
                        <div
                            key={i}
                            className="flex items-center justify-between p-2 hover:bg-zinc-800/50 rounded cursor-pointer transition-colors group"
                        >
                            <div className="flex items-center">
                                <FileText className="w-4 h-4 mr-3 text-zinc-600 group-hover:text-cyan-400" />
                                <div>
                                    <div className="text-xs text-zinc-300">{art.title}</div>
                                    <div className="text-[10px] text-zinc-600">{art.date} — {art.version}</div>
                                </div>
                            </div>
                            <ChevronRight className="w-3 h-3 text-zinc-700" />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
