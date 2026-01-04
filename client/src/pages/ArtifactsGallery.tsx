
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

/**
 * PASO 191: GALERÍA DE ARTEFACTOS (Dashboard UI)
 */

export default function ArtifactsGallery() {
    const [artifacts, setArtifacts] = useState<any[]>([]);

    useEffect(() => {
        // Simulación de fetch a .agent/artifacts
        setArtifacts([
            { id: 1, type: 'PLAN', name: 'Mastermind Blueprint', status: 'COMPLETED', date: '2026-01-04' },
            { id: 2, type: 'AUDIT', name: 'Night Patrol Report', status: 'IN_PROGRESS', date: '2026-01-04' }
        ]);
    }, []);

    return (
        <div className="p-8 space-y-6 bg-slate-950 min-h-screen text-slate-100">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                Galería de Artefactos Agénticos
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {artifacts.map((art) => (
                    <Card key={art.id} className="bg-slate-900 border-slate-800 hover:border-blue-500 transition-all cursor-pointer">
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                {art.name}
                                <Badge variant={art.status === 'COMPLETED' ? 'default' : 'secondary'}>
                                    {art.status}
                                </Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-slate-400">Tipo: {art.type}</p>
                            <p className="text-xs text-slate-500 mt-2">Generado: {art.date}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
