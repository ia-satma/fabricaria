import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/billing/stripe";
import { headers } from "next/headers";
import { db } from "@/db";
import { subscriptions } from "@/db/schema";
import { eq } from "drizzle-orm";
import Stripe from "stripe";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
    if (!webhookSecret) {
        console.error("[AEGIS] STRIPE_WEBHOOK_SECRET not configured");
        return NextResponse.json(
            { error: "Webhook secret not configured" },
            { status: 500 }
        );
    }

    const body = await request.text();
    const signature = headers().get("stripe-signature");

    if (!signature) {
        return NextResponse.json(
            { error: "Missing stripe-signature header" },
            { status: 400 }
        );
    }

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
        console.error("[AEGIS] Webhook signature verification failed:", err);
        return NextResponse.json(
            { error: "Invalid signature" },
            { status: 400 }
        );
    }

    console.log(`[STRIPE] Received event: ${event.type}`);

    try {
        switch (event.type) {
            case "checkout.session.completed": {
                const session = event.data.object as Stripe.Checkout.Session;
                const userId = session.metadata?.userId || session.client_reference_id;

                if (userId && session.subscription) {
                    const subscription = await stripe.subscriptions.retrieve(
                        session.subscription as string
                    );

                    // Update or create subscription record
                    console.log(`[STRIPE] Creating subscription for user ${userId}`);
                    // In production, upsert the subscription record
                }
                break;
            }

            case "customer.subscription.updated": {
                const subscription = event.data.object as Stripe.Subscription;
                console.log(`[STRIPE] Subscription ${subscription.id} updated to ${subscription.status}`);
                break;
            }

            case "customer.subscription.deleted": {
                const subscription = event.data.object as Stripe.Subscription;
                console.log(`[STRIPE] Subscription ${subscription.id} cancelled`);
                break;
            }

            default:
                console.log(`[STRIPE] Unhandled event type: ${event.type}`);
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error("[AEGIS] Webhook processing error:", error);
        return NextResponse.json(
            { error: "Webhook processing failed" },
            { status: 500 }
        );
    }
}
