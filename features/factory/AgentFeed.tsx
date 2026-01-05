"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { AgentMessageData } from "@/features/dashboard/actions";

interface AgentFeedProps {
    messages: AgentMessageData[];
}

function getMessageTypeStyle(type: string) {
    switch (type) {
        case 'task': return { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400', label: 'TAREA' };
        case 'response': return { bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-400', label: 'RESPUESTA' };
        case 'handoff': return { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-400', label: 'HANDOFF' };
        case 'alert': return { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400', label: 'ALERTA' };
        case 'thinking': return { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-400', label: 'PENSANDO' };
        default: return { bg: 'bg-gray-500/10', border: 'border-gray-500/30', text: 'text-gray-400', label: type.toUpperCase() };
    }
}

function formatTime(date: Date | null) {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export function AgentFeed({ messages }: AgentFeedProps) {
    return (
        <Card className="h-[500px] flex flex-col">
            <CardHeader className="pb-3">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    Neural Link - Comunicaciones en Vivo
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-0">
                <ScrollArea className="h-[420px] px-4">
                    <div className="space-y-3 pb-4">
                        {messages.map((msg, index) => {
                            const style = getMessageTypeStyle(msg.messageType);
                            return (
                                <div 
                                    key={msg.id} 
                                    className={`${style.bg} ${style.border} border rounded-lg p-3 transition-all hover:scale-[1.01]`}
                                    style={{ 
                                        animationDelay: `${index * 50}ms`,
                                        animation: 'fadeIn 0.3s ease-out forwards'
                                    }}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2 text-sm">
                                            <span className="text-lg">{msg.fromAgent?.avatar}</span>
                                            <span className="font-bold">{msg.fromAgent?.name}</span>
                                            <span className="text-muted-foreground">→</span>
                                            <span className="text-lg">{msg.toAgent?.avatar}</span>
                                            <span className="font-medium">{msg.toAgent?.name}</span>
                                        </div>
                                        <Badge className={`${style.bg} ${style.text} border ${style.border} text-xs`}>
                                            {style.label}
                                        </Badge>
                                    </div>
                                    <p className="text-sm">{msg.content}</p>
                                    <p className="text-xs text-muted-foreground mt-1 text-right font-mono">
                                        {formatTime(msg.createdAt)}
                                    </p>
                                </div>
                            );
                        })}
                        {messages.length === 0 && (
                            <div className="text-center text-muted-foreground py-10">
                                <p>Esperando comunicaciones...</p>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
