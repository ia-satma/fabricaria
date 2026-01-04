
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Microscope, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { analyzeRepositoryAction } from "../actions";

export function ResearchForm() {
    const [url, setUrl] = useState("");
    const [status, setStatus] = useState<"idle" | "analyzing" | "success" | "error">("idle");
    const [result, setResult] = useState<string | null>(null);

    const handleAuditar = async () => {
        if (!url) return;
        setStatus("analyzing");
        setResult(null);

        try {
            // Call real backend action
            const artifact = await analyzeRepositoryAction(url);
            setStatus("success");
            setResult(JSON.stringify(artifact, null, 2));
        } catch (error) {
            console.error("Analysis failed:", error);
            setStatus("error");
        }
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Microscope className="h-5 w-5 text-primary" />
                    Ingesta de Repositorio
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex gap-2">
                    <Input
                        placeholder="https://github.com/..."
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        disabled={status === "analyzing"}
                    />
                    <Button onClick={handleAuditar} disabled={status === "analyzing" || !url}>
                        {status === "analyzing" ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Auditando...
                            </>
                        ) : (
                            "Auditar"
                        )}
                    </Button>
                </div>

                {status === "success" && (
                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-md text-emerald-500 flex items-start gap-2 animate-in fade-in">
                        <CheckCircle className="h-5 w-5 shrink-0 mt-0.5" />
                        <div className="space-y-2 w-full">
                            <p className="font-semibold">Análisis Completado</p>
                            <pre className="text-xs bg-black/20 p-2 rounded overflow-x-auto max-h-40">
                                {result}
                            </pre>
                        </div>
                    </div>
                )}

                {status === "error" && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-md text-red-500 flex items-center gap-2 animate-in fade-in">
                        <AlertCircle className="h-5 w-5" />
                        <p>Error en el análisis. Verifique la URL o intente nuevamente.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
