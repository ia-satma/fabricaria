"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
    Hammer,
    Brain,
    Palette,
    ShieldCheck
} from "lucide-react";

interface Agent {
    name: string;
}

interface FeatureCardProps {
    title: string;
    subtitle: string;
    icon: React.ElementType;
    agents: Agent[];
}

function AgentRow({ agent }: { agent: Agent }) {
    return (
        <div className="flex items-center justify-between px-3 py-2 rounded-md bg-white/5 border border-white/5 group hover:border-white/10 transition-colors">
            <div className="flex items-center gap-3">
                <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-[11px] font-bold tracking-wider uppercase text-zinc-400 group-hover:text-zinc-200 transition-colors">
                    {agent.name}
                </span>
            </div>
        </div>
    );
}

function FeatureCard({ title, subtitle, icon: Icon, agents }: FeatureCardProps) {
    return (
        <Card className="bg-[#0c0c0e]/50 border-white/[0.03] backdrop-blur-xl group hover:border-white/[0.08] transition-all duration-500">
            <CardContent className="p-6 space-y-6">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                            <Icon className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold tracking-widest uppercase text-white">
                                {title}
                            </h3>
                            <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-tight">
                                {subtitle}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    {agents.map((agent) => (
                        <AgentRow key={agent.name} agent={agent} />
                    ))}
                </div>

                <div className="pt-4 border-t border-white/[0.02] flex items-center justify-between">
                    <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-tighter">
                        {agents.length} agents
                    </span>
                    <span className="text-[10px] font-bold text-blue-500/80 uppercase tracking-widest">
                        ACTIVE
                    </span>
                </div>
            </CardContent>
        </Card>
    );
}

export function VibeFactoryOS() {
    return (
        <div className="min-h-screen bg-[#050506] text-zinc-100 selection:bg-blue-500/20 p-8 font-sans">
            {/* Grid Overlay */}
            <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

            <div className="max-w-[1240px] mx-auto space-y-12 relative z-10">
                {/* Header Section */}
                <div className="flex flex-col items-center justify-center text-center space-y-6 pt-12">
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase text-white drop-shadow-2xl">
                        VIBE FACTORY OS v1.0
                    </h1>

                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/5 border border-emerald-500/10">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black tracking-[0.2em] uppercase text-emerald-500/80">
                            SYSTEM ONLINE
                        </span>
                    </div>
                </div>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 pb-24">
                    <FeatureCard
                        title="STRATEGY"
                        subtitle="C-Suite"
                        icon={Brain}
                        agents={[
                            { name: "ARCHITECT-ALPHA (CTO)" },
                            { name: "MNEMOSYNE-KEEPER (CFO)" }
                        ]}
                    />

                    <FeatureCard
                        title="BUILDERS"
                        subtitle="Engineering"
                        icon={Hammer}
                        agents={[
                            { name: "NEXUS-BRIDGE" },
                            { name: "CONSTRUCTOR" },
                            { name: "PROVISIONER" },
                            { name: "LEGACY-DIVER" }
                        ]}
                    />

                    <FeatureCard
                        title="QA & DESIGN"
                        subtitle="Quality"
                        icon={Palette}
                        agents={[
                            { name: "VIBE-MASTER" },
                            { name: "QA-VISUAL" },
                            { name: "LOGIC-VERIFIER" }
                        ]}
                    />

                    <FeatureCard
                        title="SECOPS"
                        subtitle="Security"
                        icon={ShieldCheck}
                        agents={[
                            { name: "AEGIS-SENTINEL (CISO)" },
                            { name: "CENTINELA-INTERNO" }
                        ]}
                    />
                </div>
            </div>
        </div>
    );
}
