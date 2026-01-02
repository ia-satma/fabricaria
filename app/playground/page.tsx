"use client";

import { AIChat } from "@/features/chat/components/ai-chat";
import { MemoryConsole } from "@/features/memory/components/memory-console";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Box } from "lucide-react";
import Link from "next/link";

export default function PlaygroundPage() {
    // Demo Tenant ID (In a real app, this comes from the auth session)
    const demoTenantId = "00000000-0000-0000-0000-000000000000";

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            <nav className="border-b border-border/40 bg-background/95 backdrop-blur sticky top-0 z-40 w-full px-4">
                <div className="container flex h-14 items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/">
                            <Button variant="ghost" size="sm" className="gap-2">
                                <ArrowLeft className="h-4 w-4" /> Volver
                            </Button>
                        </Link>
                        <div className="h-4 w-[1px] bg-border/40" />
                        <div className="flex items-center gap-2 font-bold tracking-tight">
                            <Box className="h-5 w-5 text-primary" />
                            <span>CEREBRO GÉNESIS</span>
                        </div>
                    </div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold border border-border/40 px-2 py-0.5 rounded bg-muted/30">
                        Playground Mode
                    </div>
                </div>
            </nav>

            <main className="container py-10 space-y-12">
                <div className="max-w-2xl mx-auto text-center space-y-4">
                    <h1 className="text-4xl font-bold tracking-tighter">Laboratorio de Memoria</h1>
                    <p className="text-muted-foreground">
                        Interactúa con la infraestructura de Memoria Híbrida.
                        Inyecta conocimientos en la **Fortaleza** y recupera contexto semántico en el chat.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 items-start">
                    <section className="space-y-6">
                        <h2 className="text-lg font-semibold flex items-center gap-2 px-1">
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">1</span>
                            Persistencia Semántica
                        </h2>
                        <MemoryConsole tenantId={demoTenantId} />
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-lg font-semibold flex items-center gap-2 px-1">
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">2</span>
                            Bucle Cognitivo (RAG)
                        </h2>
                        <AIChat tenantId={demoTenantId} />
                    </section>
                </div>
            </main>
        </div>
    );
}
