"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Zap, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PricingTier {
    name: string;
    price: string;
    description: string;
    features: string[];
    priceId: string | null;
    popular?: boolean;
    icon: React.ElementType;
}

const tiers: PricingTier[] = [
    {
        name: "Basic",
        price: "Gratis",
        description: "Para explorar la plataforma",
        features: [
            "1 proyecto",
            "100 memorias RAG",
            "Soporte comunidad",
        ],
        priceId: null,
        icon: Check,
    },
    {
        name: "Pro",
        price: "$99/mes",
        description: "Para equipos en crecimiento",
        features: [
            "Proyectos ilimitados",
            "10,000 memorias RAG",
            "API access",
            "Soporte prioritario",
            "Aegis Security+",
        ],
        priceId: "price_pro_monthly",
        popular: true,
        icon: Zap,
    },
    {
        name: "Enterprise",
        price: "Custom",
        description: "Para fábricas autónomas",
        features: [
            "Todo en Pro",
            "Memorias ilimitadas",
            "SSO / SAML",
            "SLA dedicado",
            "Onboarding personalizado",
        ],
        priceId: null,
        icon: Building2,
    },
];

export function PricingSection() {
    const [loading, setLoading] = React.useState<string | null>(null);

    const handleCheckout = async (priceId: string | null, tierName: string) => {
        if (!priceId) {
            if (tierName === "Enterprise") {
                window.location.href = "mailto:ventas@fabricaria.io?subject=Enterprise%20Inquiry";
            }
            return;
        }

        setLoading(tierName);

        try {
            const response = await fetch("/api/billing/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    priceId,
                    userId: "demo-user-001", // In production, get from auth
                }),
            });

            const data = await response.json();

            if (data.url) {
                window.location.href = data.url;
            }
        } catch (error) {
            console.error("Checkout error:", error);
        } finally {
            setLoading(null);
        }
    };

    return (
        <section className="py-24 px-6">
            <div className="max-w-6xl mx-auto">
                <div className="text-center space-y-4 mb-16">
                    <h2 className="text-4xl md:text-5xl font-black tracking-tighter">
                        Planes que escalan contigo
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Desde prototipos hasta fábricas de software autónomas.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {tiers.map((tier) => (
                        <Card
                            key={tier.name}
                            className={cn(
                                "relative glass hover:scale-[1.02] transition-all duration-500",
                                tier.popular && "border-primary/50 shadow-lg shadow-primary/10"
                            )}
                        >
                            {tier.popular && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-black uppercase tracking-widest rounded-full">
                                    Popular
                                </div>
                            )}
                            <CardHeader className="pb-4">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className={cn(
                                        "h-10 w-10 rounded-xl flex items-center justify-center",
                                        tier.popular ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                                    )}>
                                        <tier.icon className="h-5 w-5" />
                                    </div>
                                    <CardTitle className="text-xl font-black">{tier.name}</CardTitle>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-3xl font-black">{tier.price}</p>
                                    <p className="text-sm text-muted-foreground">{tier.description}</p>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <ul className="space-y-3">
                                    {tier.features.map((feature) => (
                                        <li key={feature} className="flex items-center gap-2 text-sm">
                                            <Check className="h-4 w-4 text-primary shrink-0" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Button
                                    className="w-full font-bold"
                                    variant={tier.popular ? "default" : "outline"}
                                    onClick={() => handleCheckout(tier.priceId, tier.name)}
                                    disabled={loading === tier.name}
                                >
                                    {loading === tier.name ? "Cargando..." :
                                        tier.priceId ? "Comenzar Ahora" :
                                            tier.name === "Enterprise" ? "Contactar Ventas" : "Comenzar Gratis"}
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
