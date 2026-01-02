"use client";

import * as React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Bot,
    User,
    Send,
    Save,
    History,
    Sparkles,
    Loader2,
    ShieldCheck
} from "lucide-react";
import { processChatHybrid, saveThoughtSignatureAction } from "@/features/chat/actions";
import { recallMemories, saveMemory } from "@/features/memory/actions";
import { cn } from "@/lib/utils";

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    memories?: any[];
    isSaved?: boolean;
}

export function AIChat({ tenantId }: { tenantId: string }) {
    const [input, setInput] = React.useState("");
    const [messages, setMessages] = React.useState<Message[]>([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const scrollRef = React.useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    };

    React.useEffect(scrollToBottom, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: input,
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const sessionId = "session_alpha_001"; // In prod, this comes from a hook or state

            // Hybrid Brain Routing with TSIP
            const response = await processChatHybrid(input, tenantId, sessionId);

            if (response.thoughtSignature) {
                await saveThoughtSignatureAction(sessionId, response.thoughtSignature);
            }

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: response.content,
                memories: response.memories,
            };
            setMessages((prev) => [...prev, assistantMessage]);
            setIsLoading(false);
        } catch (error) {
            console.error("Chat Error:", error);
            setIsLoading(false);
        }
    };

    const handleSaveToMemory = async (content: string, messageId: string) => {
        try {
            await saveMemory(content, tenantId);
            setMessages((prev) =>
                prev.map((m) => m.id === messageId ? { ...m, isSaved: true } : m)
            );
        } catch (error) {
            console.error("Memory Save Error:", error);
        }
    };

    return (
        <Card className="w-full max-w-2xl mx-auto flex flex-col h-[600px] border-border bg-card/30 backdrop-blur-xl shadow-2xl">
            <CardHeader className="border-b border-border/40 py-4">
                <CardTitle className="flex items-center justify-between text-lg font-semibold tracking-tight">
                    <div className="flex items-center gap-2">
                        <Bot className="h-5 w-5 text-primary" />
                        <span>Asistente Génesis</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-500 uppercase tracking-wider font-bold">
                        <ShieldCheck className="h-3 w-3" />
                        Aegis Secured
                    </div>
                </CardTitle>
            </CardHeader>

            <CardContent className="flex-1 overflow-hidden p-0">
                <div ref={scrollRef} className="h-full overflow-y-auto p-4 space-y-4">
                    {messages.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full text-center space-y-2 opacity-50">
                            <Sparkles className="h-10 w-10 mb-2" />
                            <p className="text-sm">Inicia una conversación para activar el hipocampo vectorial.</p>
                        </div>
                    )}

                    {messages.map((m) => (
                        <div key={m.id} className={cn("flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300", m.role === "user" ? "justify-end" : "justify-start")}>
                            {m.role === "assistant" && (
                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                                    <Bot className="h-4 w-4 text-primary" />
                                </div>
                            )}

                            <div className="group space-y-1 max-w-[80%]">
                                <div className={cn(
                                    "p-3 rounded-2xl text-sm leading-relaxed",
                                    m.role === "user"
                                        ? "bg-primary text-primary-foreground rounded-tr-none"
                                        : "bg-muted/50 border border-border/50 rounded-tl-none"
                                )}>
                                    {m.content}
                                </div>

                                <div className={cn("flex items-center gap-2", m.role === "user" ? "justify-end" : "justify-start")}>
                                    {m.role === "user" && !m.isSaved && (
                                        <button
                                            onClick={() => handleSaveToMemory(m.content, m.id)}
                                            className="text-[10px] text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            <Save className="h-3 w-3" /> Guardar en memoria
                                        </button>
                                    )}
                                    {m.isSaved && (
                                        <span className="text-[10px] text-emerald-500 flex items-center gap-1 font-medium">
                                            <ShieldCheck className="h-3 w-3" /> Encriptado en Fortaleza
                                        </span>
                                    )}
                                    {m.memories && m.memories.length > 0 && (
                                        <span className="text-[10px] text-primary flex items-center gap-1 font-medium">
                                            <History className="h-3 w-3" /> Contexto recuperado
                                        </span>
                                    )}
                                </div>
                            </div>

                            {m.role === "user" && (
                                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0 border border-border">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                </div>
                            )}
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex gap-3 justify-start animate-pulse">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                                <Bot className="h-4 w-4 text-primary" />
                            </div>
                            <div className="bg-muted/30 border border-border/30 p-3 rounded-2xl rounded-tl-none flex gap-1">
                                <span className="w-1 h-1 rounded-full bg-primary/50 animate-bounce" />
                                <span className="w-1 h-1 rounded-full bg-primary/50 animate-bounce delay-100" />
                                <span className="w-1 h-1 rounded-full bg-primary/50 animate-bounce delay-200" />
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>

            <CardFooter className="p-4 border-t border-border/40 bg-background/50">
                <form
                    onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                    className="flex w-full items-center gap-2"
                >
                    <Input
                        placeholder="Escribe un mensaje..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="flex-1 bg-background/50 border-border/50 focus-visible:ring-primary/20"
                        disabled={isLoading}
                    />
                    <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </Button>
                </form>
            </CardFooter>
        </Card>
    );
}
