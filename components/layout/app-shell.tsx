
import React from "react";
import { Sidebar, SidebarContent, SidebarHeader, SidebarFooter, SidebarTrigger } from "@/components/ui/sidebar";
import { User, LayoutDashboard, Terminal, Shield, BarChart3, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * PASO 306: EL PRIMER COMPONENTE MAESTRO (Layout Shell)
 * Diseño: Cyberpunk Corporativo Inmersivo.
 */

export function AppShell({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen w-full bg-background cyber-grid">
            <nav className="flex flex-col w-64 border-r border-primary/10 bg-card/40 backdrop-blur-xl">
                <div className="p-6 border-b border-primary/10">
                    <h1 className="text-xl font-bold font-mono tracking-tighter neon-text">
                        FABRICAR.IA
                    </h1>
                </div>

                <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                    <NavItem icon={LayoutDashboard} label="Mission Control" active />
                    <NavItem icon={Terminal} label="Neural Terminal" />
                    <NavItem icon={Shield} label="Aegis Sentinel" />
                    <NavItem icon={BarChart3} label="Financial Ops" />
                    <div className="pt-4 pb-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-widest font-mono">
                        Infrastructure
                    </div>
                    <NavItem icon={Settings} label="Core Settings" />
                </div>

                <div className="p-4 border-t border-primary/10">
                    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-primary/10 transition-colors cursor-pointer group">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 group-hover:border-primary">
                            <User className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-medium truncate">Comandante</p>
                            <p className="text-xs text-muted-foreground truncate highlight-primary">Sovereign Admin</p>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="flex-1 overflow-y-auto relative">
                <header className="sticky top-0 z-10 p-4 flex justify-between items-center glass border-b border-primary/5">
                    <div className="flex items-center gap-4">
                        <SidebarTrigger className="text-primary" />
                        <div className="text-xs font-mono text-primary/60">
                            SYSTEM_NOMINAL // SINGULARITY: 100%
                        </div>
                    </div>
                    <div className="flex gap-4">
                        {/* Dynamic widgets can go here */}
                    </div>
                </header>
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}

function NavItem({ icon: Icon, label, active = false }: { icon: any, label: string, active?: boolean }) {
    return (
        <div className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-md transition-all cursor-pointer group",
            active
                ? "bg-primary/10 text-primary border-r-2 border-primary shadow-[0_0_15px_rgba(0,240,255,0.1)]"
                : "text-muted-foreground hover:bg-primary/5 hover:text-foreground"
        )}>
            <Icon className={cn("w-5 h-5", active ? "text-primary" : "group-hover:text-primary")} />
            <span className="text-sm font-medium font-mono">{label}</span>
        </div>
    );
}
