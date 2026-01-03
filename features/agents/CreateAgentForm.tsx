"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { createAgentSchema, type CreateAgentInput } from "./schema";
import { createAgent } from "./actions";
import { Bot, Loader2 } from "lucide-react";
import { useState } from "react";

export function CreateAgentForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CreateAgentInput>({
        resolver: zodResolver(createAgentSchema),
    });

    const onSubmit = async (data: CreateAgentInput) => {
        setIsSubmitting(true);
        setServerError(null);

        try {
            await createAgent(data);
        } catch (error) {
            setServerError("Failed to create agent. Please try again.");
            setIsSubmitting(false);
        }
    };

    return (
        <Card className="cyber-card max-w-2xl mx-auto">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <Bot className="h-8 w-8 text-primary" />
                    <div>
                        <CardTitle className="font-mono">Deploy New Agent</CardTitle>
                        <CardDescription>Configure your autonomous agent parameters</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-mono font-medium text-foreground">
                            AGENT NAME
                        </label>
                        <input
                            {...register("name")}
                            placeholder="Agent-Omega"
                            className="w-full h-10 px-3 bg-background border border-primary/30 text-foreground font-mono placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:shadow-[0_0_10px_rgba(0,240,255,0.3)] transition-all"
                        />
                        {errors.name && (
                            <p className="text-sm text-red-500">{errors.name.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-mono font-medium text-foreground">
                            ROLE
                        </label>
                        <input
                            {...register("role")}
                            placeholder="Code Generator, Data Processor, Test Runner..."
                            className="w-full h-10 px-3 bg-background border border-primary/30 text-foreground font-mono placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:shadow-[0_0_10px_rgba(0,240,255,0.3)] transition-all"
                        />
                        {errors.role && (
                            <p className="text-sm text-red-500">{errors.role.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-mono font-medium text-foreground">
                            OBJECTIVE
                        </label>
                        <textarea
                            {...register("objective")}
                            placeholder="Describe the agent's primary mission and goals..."
                            rows={4}
                            className="w-full px-3 py-2 bg-background border border-primary/30 text-foreground font-mono placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:shadow-[0_0_10px_rgba(0,240,255,0.3)] transition-all resize-none"
                        />
                        {errors.objective && (
                            <p className="text-sm text-red-500">{errors.objective.message}</p>
                        )}
                    </div>

                    {serverError && (
                        <div className="p-3 bg-red-500/20 border border-red-500/50 text-red-400 text-sm">
                            {serverError}
                        </div>
                    )}

                    <div className="flex gap-4">
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    DEPLOYING...
                                </>
                            ) : (
                                <>
                                    <Bot className="mr-2 h-4 w-4" />
                                    DEPLOY AGENT
                                </>
                            )}
                        </Button>
                        <Button type="button" variant="outline" asChild>
                            <a href="/agents">CANCEL</a>
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
