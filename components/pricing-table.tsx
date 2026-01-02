import React from 'react';
import { Button } from "@/components/ui/button";
// Assuming Shadcn UI components exist or standard HTML fallback

const PLANS = [
    {
        name: "Hobby Agent",
        price: "$19/mo",
        priceId: "price_hobby_mock_id",
        features: ["1 Autonomous Agent", "Basic Memory (128mb)", "Community Support"]
    },
    {
        name: "Pro Swarm",
        price: "$99/mo",
        priceId: "price_pro_mock_id",
        features: ["10 Autonomous Agents", "Hybrid Memory (Unlimited)", "Priority Governance"]
    }
];

export function PricingTable() {

    const handleSubscribe = async (priceId: string) => {
        // In real app: Call API to create session -> Redirect to Stripe
        console.log(`Subscribing to ${priceId}...`);
        alert("Redirecting to Stripe Checkout (Simulated)...");
    };

    return (
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto p-6">
            {PLANS.map((plan) => (
                <div key={plan.name} className="border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <div className="text-3xl font-bold mb-6">{plan.price}</div>

                    <ul className="space-y-3 mb-8">
                        {plan.features.map((f, i) => (
                            <li key={i} className="flex items-center text-sm text-gray-600">
                                <span className="mr-2 text-green-500">✓</span> {f}
                            </li>
                        ))}
                    </ul>

                    <button
                        onClick={() => handleSubscribe(plan.priceId)}
                        className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        Deploy Infrastructure
                    </button>
                </div>
            ))}
        </div>
    );
}
