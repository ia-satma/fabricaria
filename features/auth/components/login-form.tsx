"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Loader2, Mail, Lock } from "lucide-react";

interface LoginFormProps {
    className?: string;
}

export function LoginForm({ className }: LoginFormProps) {
    const [isLoading, setIsLoading] = React.useState(false);

    async function onSubmit(event: React.SyntheticEvent) {
        event.preventDefault();
        setIsLoading(true);

        // Simulate connection delay
        setTimeout(() => {
            setIsLoading(false);
        }, 2000);
    }

    return (
        <Card className={cn("w-full max-w-md mx-auto border-border bg-card/50 backdrop-blur-sm", className)}>
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold tracking-tight text-center">
                    Bienvenido de nuevo
                </CardTitle>
                <p className="text-sm text-muted-foreground text-center">
                    Ingresa tus credenciales para acceder a la fábrica
                </p>
            </CardHeader>
            <CardContent>
                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="email"
                                placeholder="nombre@empresa.com"
                                type="email"
                                autoCapitalize="none"
                                autoComplete="email"
                                autoCorrect="off"
                                disabled={isLoading}
                                className="pl-10"
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="password"
                                placeholder="••••••••"
                                type="password"
                                autoCapitalize="none"
                                autoComplete="current-password"
                                disabled={isLoading}
                                className="pl-10"
                                required
                            />
                        </div>
                    </div>
                    <Button className="w-full" type="submit" disabled={isLoading}>
                        {isLoading && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Iniciar Sesión
                    </Button>
                </form>

                <div className="mt-4 text-center text-sm">
                    <span className="text-muted-foreground">¿No tienes una cuenta? </span>
                    <button className="font-medium text-primary hover:underline">
                        Contacta a tu Administrador
                    </button>
                </div>
            </CardContent>
        </Card>
    );
}
