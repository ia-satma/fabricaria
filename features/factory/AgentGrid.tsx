"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { AgentData } from "@/features/dashboard/actions";

interface AgentGridProps {
    agents: AgentData[];
}

function getStatusColor(status: string | null) {
    switch (status) {
        case 'active': return 'bg-green-500';
        case 'thinking': return 'bg-yellow-500 animate-pulse';
        case 'idle': return 'bg-gray-400';
        case 'error': return 'bg-red-500';
        default: return 'bg-blue-500';
    }
}

function getStatusBadge(status: string | null) {
    switch (status) {
        case 'active': return <Badge className="bg-green-500/20 text-green-400 border-green-500/50">ACTIVO</Badge>;
        case 'thinking': return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50 animate-pulse">PENSANDO</Badge>;
        case 'idle': return <Badge variant="secondary">INACTIVO</Badge>;
        case 'error': return <Badge variant="destructive">ERROR</Badge>;
        default: return <Badge variant="outline">{status}</Badge>;
    }
}

export function AgentGrid({ agents }: AgentGridProps) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {agents.map((agent) => (
                <TooltipProvider key={agent.id}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Card className="relative overflow-hidden hover:border-primary/50 transition-colors cursor-pointer group">
                                <div className={`absolute top-0 left-0 w-1 h-full ${getStatusColor(agent.status)}`} />
                                <CardContent className="p-4">
                                    <div className="flex items-start gap-3">
                                        <div className="text-3xl">{agent.avatar}</div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold text-lg">{agent.name}</h3>
                                                {getStatusBadge(agent.status)}
                                            </div>
                                            <p className="text-sm text-muted-foreground truncate">{agent.role}</p>
                                            
                                            {agent.currentTask && (
                                                <p className="text-xs text-primary mt-2 truncate">
                                                    {agent.currentTask}
                                                </p>
                                            )}

                                            <div className="mt-3 space-y-2">
                                                <div className="flex justify-between text-xs text-muted-foreground">
                                                    <span>CPU</span>
                                                    <span>{agent.cpuLoad}%</span>
                                                </div>
                                                <Progress value={agent.cpuLoad || 0} className="h-1" />
                                            </div>

                                            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                                                <span>Tareas completadas</span>
                                                <span className="font-mono">{agent.tasksCompleted?.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="max-w-xs">
                            <p className="font-semibold mb-1">{agent.name} - {agent.role}</p>
                            <p className="text-xs text-muted-foreground italic">&quot;{agent.personality}&quot;</p>
                            <p className="text-xs mt-2"><strong>Objetivo:</strong> {agent.objective}</p>
                            {agent.capabilities.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {agent.capabilities.slice(0, 4).map((cap, i) => (
                                        <Badge key={i} variant="outline" className="text-xs">{cap}</Badge>
                                    ))}
                                </div>
                            )}
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            ))}
        </div>
    );
}
