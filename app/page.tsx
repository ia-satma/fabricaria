"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Box, Layers, Zap, X } from "lucide-react";
import { LoginForm } from "@/features/auth/components/login-form";
import { cn } from "@/lib/utils";

export default function Home() {
    const [showAuth, setShowAuth] = React.useState(false);

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-primary/10">
            {/* Navigation Layer */}
            <nav className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40 w-full">
                <div className="container flex h-14 items-center justify-between">
                    <div className="flex items-center gap-2 font-bold tracking-tight">
                        <Box className="h-5 w-5 text-primary" />
                        <span>FABRICARIA</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/playground" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                            Playground
                        </Link>
                        <Button variant="ghost" size="sm" onClick={() => setShowAuth(true)}>
                            Sign In
                        </Button>
                        <Button size="sm" onClick={() => setShowAuth(true)}>Get Started</Button>
                    </div>
                </div>
        </div>
            </nav >

        {/* Hero Section */ }
        < section className = "relative overflow-hidden space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32" >
            <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center relative z-10">
                <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary animate-in fade-in slide-in-from-top-4 duration-1000">
                    <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse" />
                    Protocolo Génesis: Online
                </div>
                <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-[1.1]">
                    Build software <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 animate-gradient-x">
                        at the speed of thought.
                    </span>
                </h1>
                <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8 animate-in fade-in duration-1000 delay-300">
                    High-performance SaaS infrastructure for autonomous factories.
                    The Golden Stack: Next.js 14, Neon Postgres, and Aeigs Security.
                </p>
                <div className="space-x-4 pt-4">
                    <Button size="lg" className="h-12 px-8 font-semibold transition-all hover:scale-105" onClick={() => setShowAuth(true)}>
                        Start Building <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="lg" className="h-12 px-8 font-semibold">
                        Documentation
                    </Button>
                </div>
            </div>

    {/* Background Ambient Gradients */ }
    <div className="absolute top-0 -z-10 h-full w-full bg-background">
        <div className="absolute bottom-auto left-auto right-0 top-0 h-[500px] w-[500px] -translate-x-[20%] translate-y-[10%] rounded-full bg-[rgba(173,109,244,0.15)] opacity-50 blur-[80px]"></div>
        <div className="absolute bottom-0 left-0 right-auto top-auto h-[500px] w-[500px] translate-x-[20%] -translate-y-[10%] rounded-full bg-[rgba(66,211,146,0.15)] opacity-50 blur-[80px]"></div>
    </div>
            </section >

        {/* Auth Overlay (Modal-like) */ }
    {
        showAuth && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in duration-300 p-4">
                <div className="relative w-full max-w-md animate-in zoom-in-95 duration-300">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute -top-12 right-0 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowAuth(false)}
                    >
                        <X className="h-6 w-6" />
                    </Button>
                    <LoginForm />
                </div>
            </div>
        )
    }

    {/* Feature Grid */ }
    <section className="container space-y-12 py-8 dark:bg-transparent md:py-12 lg:py-24 border-t border-border/40">
        <div className="mx-auto flex flex-col items-center gap-4 text-center md:max-w-[58rem]">
            <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl font-bold">Arquitectura Fortress</h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
                Seguridad Multi-Tenant a nivel de hardware y base de datos.
            </p>
        </div>
        <div className="mx-auto grid justify-center gap-6 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
            <Card className="flex flex-col justify-between border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-colors">
                <CardContent className="pt-6">
                    <Zap className="h-12 w-12 mb-4 text-indigo-500" />
                    <h3 className="text-xl font-bold">Lightning Fast</h3>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                        Optimización de Server Components y Context Caching para latencia mínima.
                    </p>
                </CardContent>
            </Card>

            <Card className="flex flex-col justify-between border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-colors">
                <CardContent className="pt-6">
                    <Layers className="h-12 w-12 mb-4 text-emerald-500" />
                    <h3 className="text-xl font-bold">Aegis Security</h3>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                        Aislamiento Multi-Tenant con Row Level Security (RLS) en el hipocampo de Neon.
                    </p>
                </CardContent>
            </Card>

            <Card className="flex flex-col justify-between border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-colors">
                <CardContent className="pt-6">
                    <Box className="h-12 w-12 mb-4 text-purple-500" />
                    <h3 className="text-xl font-bold">Mnemosyne RAG</h3>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                        Memoria agéntica de largo plazo con búsqueda vectorial HNSW de alto rendimiento.
                    </p>
                </CardContent>
            </Card>
        </div>
    </section>

    {/* Footer */ }
    <footer className="border-t border-border/40 py-10">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                Built by <span className="font-semibold underline underline-offset-4">Architect-Alpha</span>. Protocolo Génesis 2026.
            </p>
        </div>
    </footer>
        </div >
    );
}
