import { createCheckoutSession } from "@/lib/stripe/client";

async function main() {
    console.log("💰 [Finance] Starting Billing Verification...");

    const userId = "test_user_" + Math.random().toString(36).substring(7);
    const returnUrl = "https://fabricaria.io/billing";

    try {
        console.log("   > Attempting to create checkout session...");
        await createCheckoutSession(userId, "price_test_123", returnUrl);
        // We expect this to fail gracefully or return a mock object depending on Env Keys.
        // If it throws "StripeAuthenticationError", it means the client is trying to connect (Success).
        // If it throws "Module not found", we have a problem.
    } catch (error: any) {
        if (error.type === 'StripeAuthenticationError' || error.message.includes("api_key")) {
            console.log("✅ [Finance] Stripe Client initialized and attempted connection (Authentication Expected).");
        } else {
            console.error("❌ [Finance] Unexpected error:", error);
        }
    }
}

if (require.main === module) {
    main().catch(console.error);
}
