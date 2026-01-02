import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
    console.warn("⚠️ [Finance] STRIPE_SECRET_KEY is missing. Billing features will not work.");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-12-15.clover" as any, // 👈 ACTUALIZAR ESTA LÍNEA EXACTAMENTE ASÍ
    typescript: true,
});

export async function createCheckoutSession(userId: string, priceId: string, returnUrl: string) {
    // In a real implementation:
    // 1. Check if user already has a Stripe Customer ID in DB.
    // 2. If not, create one.
    // 3. Create Checkout Session.

    try {
        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            success_url: `${returnUrl}?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${returnUrl}?canceled=true`,
            client_reference_id: userId,
            metadata: {
                userId: userId
            }
        });

        return session;
    } catch (error) {
        console.error("❌ [Finance] Failed to create checkout session:", error);
        throw error;
    }
}
