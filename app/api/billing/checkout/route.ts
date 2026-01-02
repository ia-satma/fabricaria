import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { stripe, STRIPE_PRICES } from "@/lib/billing/stripe";

const checkoutSchema = z.object({
    priceId: z.string().min(1),
    userId: z.string().min(1),
    successUrl: z.string().url().optional(),
    cancelUrl: z.string().url().optional(),
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const validated = checkoutSchema.parse(body);

        const origin = request.headers.get("origin") || "http://localhost:3000";

        const session = await stripe.checkout.sessions.create({
            mode: "subscription",
            payment_method_types: ["card"],
            line_items: [
                {
                    price: validated.priceId,
                    quantity: 1,
                },
            ],
            success_url: validated.successUrl || `${origin}/dashboard?checkout=success`,
            cancel_url: validated.cancelUrl || `${origin}/?checkout=canceled`,
            metadata: {
                userId: validated.userId,
            },
            client_reference_id: validated.userId,
        });

        return NextResponse.json({
            sessionId: session.id,
            url: session.url
        });
    } catch (error) {
        console.error("[AEGIS] Checkout Error:", error);

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Invalid request body", details: error.errors },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: "Failed to create checkout session" },
            { status: 500 }
        );
    }
}
