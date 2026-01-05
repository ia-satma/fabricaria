
import React from 'react';
import { SyncMonitor } from "@/features/admin/components/sync-monitor";
import { HitlQueue } from "@/features/admin/components/hitl-queue";
import { FinOpsTelemetry } from "@/features/admin/components/finops-telemetry";
import { ArtifactBrowser } from "@/features/admin/components/artifact-browser";
import { Badge } from "@/components/ui/badge";
import { Cpu, ShieldCheck, Activity } from "lucide-react";

/**
 * PASO 391: MISION CONTROL (DASHBOARD ADMINISTRATIVO)
 * Objetivo: Centralizar observabilidad, finanzas y seguridad.
 */

const SWARM_AGENTS = [
    { name: "Architect", status: "Planning", color: "text-emerald-500", task: "Phase 53: Launch Protocol" },
    { name: "Builder", status: "Executing", color: "text-cyan-500", task: "Mission Control UI" },
    { name: "Critic", status: "Waiting Approval", color: "text-amber-500", task: "Security Audit Scan" }
];

export default function MissionControlPage() {
    return (
        <div className="p-8 bg-zinc-950 min-h-screen text-zinc-100 font-mono selection:bg-cyan-500/30">
            <header className="flex justify-between items-end mb-12">
                <div>
                    <Badge variant="outline" className="mb-2 border-emerald-500/30 text-emerald-500 text-[10px] tracking-widest">
                        PHASE 53 // OPERATIONAL SINGULARITY
                    </Badge>
                    <h1 className="text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                        MISSION CONTROL
                    </h1>
                </div>
                <div className="text-right text-[10px] text-zinc-600">
                    <p>SYSTEM STATUS: OPERATIONAL</p>
                    <p>AUTH LEVEL: SUPER-ADMIN</p>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <SyncMonitor />
                <FinOpsTelemetry />
                <ArtifactBrowser />
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 flex flex-col justify-center items-center">
                    <ShieldCheck className="w-12 h-12 text-emerald-500/20 mb-4" />
                    <p className="text-zinc-500 text-xs text-center">AEGIS SECURITY PROTOCOL ACTIVE</p>
                    <p className="text-[10px] text-zinc-700 mt-1">Zero-Touch Governance Enabled</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* SWARM STATUS VIEW */}
                <div className="lg:col-span-2 bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold flex items-center">
                            <Cpu className="w-5 h-5 mr-2 text-cyan-400" /> SWARM REAL-TIME STATUS
                        </h2>
                        <Badge variant="outline" className="border-cyan-500/30 text-cyan-400 animate-pulse">
                            LIVE
                        </Badge>
                    </div>

                    <div className="space-y-6">
                        {SWARM_AGENTS.map((agent, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-zinc-950/50 border border-zinc-800/50 rounded-lg">
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded bg-zinc-900 ${agent.color}`}>
                                        <Activity className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold">{agent.name}</div>
                                        <div className="text-[10px] text-zinc-500">Task: {agent.task}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className={`text-[10px] font-bold uppercase ${agent.color}`}>
                                        {agent.status}
                                    </div>
                                    <div className="mt-1 h-1 w-24 bg-zinc-800 rounded-full overflow-hidden">
                                        <div className={`h-full ${agent.color.replace('text-', 'bg-')} w-2/3 animate-pulse`} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8">
                        <h3 className="text-xs font-bold text-zinc-500 mb-4 uppercase tracking-widest">Thought Stream</h3>
                        <div className="bg-black/40 p-4 rounded-lg border border-zinc-800 text-[11px] leading-relaxed font-mono">
                            <div className="text-emerald-400/80 mb-1">[ARCHITECT] Initiating Phase 53 security audit scan sequence...</div>
                            <div className="text-cyan-400/80 mb-1">[BUILDER] Mission Control components integrated successfully. Rendering dashboard.</div>
                            <div className="text-amber-400/80">[CRITIC] Validating environment hashes for drift detection. Synchronization: 1.0</div>
                        </div>
                    </div>
                </div>

                {/* HITL QUEUE SIDEBAR */}
                <div>
                    <HitlQueue />
                </div>
            </div>
        </div>
    );
}
