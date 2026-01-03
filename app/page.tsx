"use client";

import * as React from "react";
import Link from "next/link";
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
            <nav className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40 w-full px-6 md:px-12">
                <div className="container flex h-16 items-center justify-between px-0">
                    <div className="flex items-center gap-2 font-bold tracking-tighter text-xl">
                        <Box className="h-6 w-6 text-primary" />
                        <span>fabricaria</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <Link href="/command" className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-all">
                            Command
                        </Link>
                        <Link href="/factory" className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-all">
                            Factory
                        </Link>
                        <Link href="/agents" className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-all">
                            Agents
                        </Link>
                        <Link href="/playground" className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-all">
                            Playground
                        </Link>
                        <Button variant="ghost" size="sm" className="font-semibold" onClick={() => setShowAuth(true)}>
                            Sign In
                        </Button>
                        <Button size="sm" className="font-bold px-6 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all" onClick={() => setShowAuth(true)}>
                            Get Started
                        </Button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative overflow-hidden pt-20 pb-32 md:pt-32 md:pb-48">
                <div className="container flex max-w-[72rem] flex-col items-center gap-8 text-center relative z-10 mx-auto px-6">
                    <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-primary animate-fade-in">
                        <span className="flex h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                        Protocolo Génesis: Online
                    </div>

                    <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-4 animate-fade-in delay-100">
                        Build software <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 animate-gradient-x px-2">
                            at high speed.
                        </span>
                    </h1>

                    <p className="max-w-[42rem] text-lg md:text-xl font-medium text-muted-foreground leading-relaxed animate-fade-in delay-200">
                        High-performance SaaS infrastructure for autonomous factories.
                        Powered by <span className="text-foreground font-bold">Golden Stack</span> architecture.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 pt-8 animate-fade-in delay-300">
                        <Button size="lg" className="h-14 px-10 text-base font-bold rounded-2xl shadow-2xl shadow-primary/30 hover:scale-105 transition-all" onClick={() => setShowAuth(true)}>
                            Start Building <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                        <Button variant="outline" size="lg" className="h-14 px-10 text-base font-bold rounded-2xl border-2 hover:bg-muted transition-all">
                            Documentation
                        </Button>
                    </div>
                </div>

                {/* Background Ambient Gradients */}
                <div className="absolute top-0 -z-10 h-full w-full bg-background overflow-hidden">
                    <div className="absolute -top-[10%] -right-[10%] h-[600px] w-[600px] rounded-full bg-indigo-500/10 blur-[120px] animate-pulse-slow"></div>
                    <div className="absolute top-[20%] -left-[10%] h-[500px] w-[500px] rounded-full bg-emerald-500/10 blur-[120px] animate-pulse-slow delay-700"></div>
                </div>
            </section>

            {/* Feature Grid */}
            <section className="container py-24 mx-auto px-6 border-t border-border/40">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    <Card className="glass group hover:scale-[1.02] transition-all duration-500">
                        <CardContent className="p-8 space-y-4">
                            <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform">
                                <Zap className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-black tracking-tight">Lightning Fast</h3>
                            <p className="text-muted-foreground leading-relaxed font-medium">
                                Optimización de Server Components y Context Caching para latencia mínima y rendimiento extremo.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="glass group hover:scale-[1.02] transition-all duration-500">
                        <CardContent className="p-8 space-y-4">
                            <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                                <Layers className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-black tracking-tight">Fortress Architecture</h3>
                            <p className="text-muted-foreground leading-relaxed font-medium">
                                Aislamiento Multi-Tenant nativo con políticas RLS avanzadas y cifrado AES-256.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="glass group hover:scale-[1.02] transition-all duration-500">
                        <CardContent className="p-8 space-y-4">
                            <div className="h-12 w-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500 group-hover:scale-110 transition-transform">
                                <Box className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-black tracking-tight">Mnemosyne RAG</h3>
                            <p className="text-muted-foreground leading-relaxed font-medium">
                                Memoria agéntica de largo plazo con búsqueda vectorial HNSW para respuestas contextuales.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Auth Overlay */}
            {showAuth && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-md animate-fade-in p-6">
                    <div className="relative w-full max-w-md animate-float">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute -top-14 right-0 text-muted-foreground hover:text-foreground hover:bg-white/10 rounded-full"
                            onClick={() => setShowAuth(false)}
                        >
                            <X className="h-8 w-8" />
                        </Button>
                        <LoginForm className="shadow-2xl border-white/10" />
                    </div>
                </div>
            )}

            {/* Footer */}
            <footer className="border-t border-border/40 py-12">
                <div className="container flex flex-col items-center justify-between gap-6 md:h-24 md:flex-row mx-auto px-6">
                    <p className="text-center text-sm font-bold tracking-tight text-muted-foreground md:text-left">
                        Built by <span className="text-foreground underline underline-offset-8 decoration-primary/30">Architect-Alpha</span>. Protocolo Génesis 2026.
                    </p>
                    <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        <Link href="/dashboard" className="hover:text-primary transition-colors">OS status</Link>
                        <span>Security: Aegis v2</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
