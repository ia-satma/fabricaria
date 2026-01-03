import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("[AEGIS] STRIPE_SECRET_KEY not found in environment variables");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-12-15.clover" as any, // 👈 ACTUALIZAR ESTA LÍNEA EXACTAMENTE ASÍ
    typescript: true,
});

// Price IDs - Replace with your actual Stripe Price IDs
export const STRIPE_PRICES = {
    FREE: null,
    PRO: process.env.STRIPE_PRO_PRICE_ID || "price_pro_monthly",
    ENTERPRISE: null, // Custom pricing
} as const;

export type PriceTier = keyof typeof STRIPE_PRICES;
