import { NextApiRequest, NextApiResponse } from 'next';
import { stripe } from '@/lib/stripe/client';
import { buffer } from 'micro';
import Stripe from 'stripe';

export const config = {
    api: {
        bodyParser: false,
    },
};

const webhookHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'POST') {
        return res.status(405).send('Method Not Allowed');
    }

    const buf = await buffer(req);
    const sig = req.headers['stripe-signature'] as string;
    let event: Stripe.Event;

    try {
        if (!process.env.STRIPE_WEBHOOK_SECRET) {
            // Fallback for dev/mock without secret
            event = JSON.parse(buf.toString());
            console.warn("⚠️ [Finance] Webhook Secret missing. Skipping signature verification (DEV ONLY).");
        } else {
            event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET);
        }
    } catch (err: any) {
        console.error(`❌ [Finance] Webhook Signature Error: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    console.log(`💰 [Finance] Processing Webhook Event: ${event.type}`);

    try {
        switch (event.type) {
            case 'checkout.session.completed':
                const session = event.data.object as Stripe.Checkout.Session;
                await handleCheckoutSessionCompleted(session);
                break;
            case 'invoice.payment_succeeded':
                const invoice = event.data.object as Stripe.Invoice;
                // Logic to extend subscription term
                break;
            case 'customer.subscription.deleted':
                const sub = event.data.object as Stripe.Subscription;
                // Logic to mark local sub as inactive
                break;
            default:
                console.log(`ℹ️ [Finance] Unhandled event type: ${event.type}`);
        }
        return res.status(200).json({ received: true });
    } catch (err) {
        console.error("❌ [Finance] Webhook handler failed:", err);
        return res.status(500).json({ error: "Webhook handler failed" });
    }
};

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
    if (!session.metadata?.userId) {
        console.error("❌ [Finance] Missing userId in session metadata.");
        return;
    }
    console.log(`✅ [Finance] Provisioning Subscription for User: ${session.metadata.userId}`);
    // DB Logic to insert subscription record would go here
    // await db.insert(subscriptions).values({...})
}

export default webhookHandler;
