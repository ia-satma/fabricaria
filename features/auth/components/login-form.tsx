"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Loader2, Mail, Lock, ShieldCheck, AlertCircle } from "lucide-react";
import { useFormState } from "react-dom";
import { loginAction, type AuthState } from "../actions";

const initialState: AuthState = {};

interface LoginFormProps {
    className?: string;
}

export function LoginForm({ className }: LoginFormProps) {
    const [state, formAction] = useFormState(loginAction, initialState);
    const [isPending, setIsPending] = React.useState(false);

    // Sync isPending with form state if needed, but since we are handling 
    // the action manually for UX, we manage it.

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        setIsPending(true);
        // Let useFormState handle the action via the action prop usually, 
        // but here we ensure the UI feedback is immediate.
    };

    React.useEffect(() => {
        if (state.success || state.message || state.errors) {
            setIsPending(false);
        }
    }, [state]);

    return (
        <Card className={cn("w-full max-w-md mx-auto border-border bg-card/50 backdrop-blur-sm", className)}>
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold tracking-tight text-center">
                    {state.success ? "Acceso Concedido" : "Bienvenido de nuevo"}
                </CardTitle>
                <p className="text-sm text-muted-foreground text-center">
                    {state.success
                        ? "El puente sináptico con la Fortaleza está activo."
                        : "Ingresa tus credenciales para acceder a la fábrica"}
                </p>
            </CardHeader>
            <CardContent>
                {state.success ? (
                    <div className="flex flex-col items-center justify-center py-6 space-y-4 animate-in zoom-in-95">
                        <div className="rounded-full bg-emerald-500/10 p-3 ring-1 ring-emerald-500/50">
                            <ShieldCheck className="h-10 w-10 text-emerald-500" />
                        </div>
                        <p className="text-center font-medium">{state.message}</p>
                        <Button className="w-full" onClick={() => window.location.href = "/dashboard"}>
                            Ir al Dashboard
                        </Button>
                    </div>
                ) : (
                    <form action={formAction} onSubmit={() => setIsPending(true)} className="space-y-4">
                        {state.message && (
                            <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive ring-1 ring-destructive/20 animate-in fade-in">
                                <AlertCircle className="h-4 w-4" />
                                <p>{state.message}</p>
                            </div>
                        )}

                        <div className="space-y-2">
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    name="email"
                                    id="email"
                                    placeholder="nombre@empresa.com"
                                    type="email"
                                    disabled={isPending}
                                    className={cn("pl-10", state.errors?.email && "border-destructive ring-destructive/20")}
                                    required
                                />
                            </div>
                            {state.errors?.email && (
                                <p className="text-xs text-destructive">{state.errors.email[0]}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    name="password"
                                    id="password"
                                    placeholder="••••••••"
                                    type="password"
                                    disabled={isPending}
                                    className={cn("pl-10", state.errors?.password && "border-destructive ring-destructive/20")}
                                    required
                                />
                            </div>
                            {state.errors?.password && (
                                <p className="text-xs text-destructive">{state.errors.password[0]}</p>
                            )}
                        </div>

                        <Button className="w-full" type="submit" disabled={isPending}>
                            {isPending && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            {isPending ? "Conectando..." : "Iniciar Sesión"}
                        </Button>
                    </form>
                )}

                {!state.success && (
                    <div className="mt-4 text-center text-sm">
                        <span className="text-muted-foreground">¿No tienes una cuenta? </span>
                        <button className="font-medium text-primary hover:underline">
                            Contacta a tu Administrador
                        </button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
