"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Send, Database, BrainCircuit, History } from "lucide-react";
import { saveMemory, recallMemories } from "../actions";

export function MemoryConsole({ tenantId }: { tenantId: string }) {
    const [content, setContent] = React.useState("");
    const [query, setQuery] = React.useState("");
    const [memories, setMemories] = React.useState<any[]>([]);
    const [isSaving, setIsSaving] = React.useState(false);
    const [isSearching, setIsSearching] = React.useState(false);

    const handleSave = async () => {
        if (!content) return;
        setIsSaving(true);
        try {
            await saveMemory(content, tenantId);
            setContent("");
            // Success feedback would go here (Toast)
        } finally {
            setIsSaving(false);
        }
    };

    const handleSearch = async () => {
        if (!query) return;
        setIsSearching(true);
        try {
            const results = await recallMemories(query, tenantId);
            setMemories(results);
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <Card className="w-full max-w-3xl border-border bg-card/30 backdrop-blur-md">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <BrainCircuit className="h-5 w-5 text-primary" />
                    Consola Mnemosyne
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Save Memory Section */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Inyectar Memoria (Embeddings)</label>
                    <div className="flex gap-2">
                        <Input
                            placeholder="Ej: El cliente prefiere diseño minimalista tipo Linear..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            disabled={isSaving}
                        />
                        <Button onClick={handleSave} disabled={isSaving}>
                            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Database className="h-4 w-4 mr-2" />}
                            Inyectar
                        </Button>
                    </div>
                </div>

                {/* Search Memory Section */}
                <div className="space-y-2 pt-4 border-t border-border/40">
                    <label className="text-sm font-medium text-muted-foreground">Búsqueda Semántica (RAG)</label>
                    <div className="flex gap-2">
                        <Input
                            placeholder="¿Qué sabemos del cliente?"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            disabled={isSearching}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                        <Button variant="secondary" onClick={handleSearch} disabled={isSearching}>
                            {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
                            Recordar
                        </Button>
                    </div>
                </div>

                {/* Results List */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                        <History className="h-3 w-3" />
                        Recuerdos Recuperados
                    </div>
                    {memories.length > 0 ? (
                        <div className="space-y-2">
                            {memories.map((m, i) => (
                                <div key={i} className="p-3 rounded-lg border border-border/50 bg-background/50 animate-in fade-in slide-in-from-left-2 duration-300" style={{ animationDelay: `${i * 100}ms` }}>
                                    <p className="text-sm leading-relaxed">{m.content}</p>
                                    <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground">
                                        <span>Distancia: {(m.distance as number).toFixed(4)}</span>
                                        <span>{new Date(m.created_at).toLocaleString()}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-10 text-center border border-dashed border-border/50 rounded-lg">
                            <p className="text-sm text-muted-foreground">No se han recuperado memorias aún.</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
