import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
    ListResourcesRequestSchema,
    ReadResourceRequestSchema
} from "@modelcontextprotocol/sdk/types.js";
import { Aegis } from "@/lib/governance/aegis";
import { createCheckoutSession } from "@/lib/stripe/client";

/**
 * STRIPE MCP SERVER (Neural Link)
 * Exposes financial capabilities to the AI Agent via a secure protocol.
 */

// Define Tools
const TOOL_CREATE_CHECKOUT = "create_checkout_session";
const RESOURCE_PRICING = "fabricaria://pricing/plans";

const server = new Server(
    {
        name: "fabricaria-stripe-mcp",
        version: "1.0.0",
    },
    {
        capabilities: {
            resources: {},
            tools: {},
        },
    }
);

// 1. List Resources (Read-Only Data)
server.setRequestHandler(ListResourcesRequestSchema, async () => {
    return {
        resources: [
            {
                uri: RESOURCE_PRICING,
                name: "Pricing Plans",
                mimeType: "application/json",
                description: "List of available subscription plans"
            }
        ]
    };
});

// 2. Read Resource
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    if (request.params.uri === RESOURCE_PRICING) {
        return {
            contents: [{
                uri: RESOURCE_PRICING,
                mimeType: "application/json",
                text: JSON.stringify([
                    { id: "price_hobby", name: "Hobby Agent", cost: 19 },
                    { id: "price_swarm", name: "Pro Swarm", cost: 99 }
                ])
            }]
        };
    }
    throw new Error("Resource not found");
});

// 3. List Tools (Actions)
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: TOOL_CREATE_CHECKOUT,
                description: "Creates a Stripe Checkout Session for a user subscription.",
                inputSchema: {
                    type: "object",
                    properties: {
                        userId: { type: "string" },
                        priceId: { type: "string" },
                        returnUrl: { type: "string" }
                    },
                    required: ["userId", "priceId", "returnUrl"]
                }
            }
        ]
    };
});

// 4. Call Tool (Execution with Aegis Protection)
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    console.log(`🔌 [MCP] Tool Call Received: ${name}`);

    if (name === TOOL_CREATE_CHECKOUT) {
        if (!args || typeof args !== 'object') {
            throw new Error("Invalid arguments");
        }

        // GOVERNANCE CHECK: Aegis
        // Ensure no malicious injection in strings
        Aegis.validateToolCall(name, args);

        const { userId, priceId, returnUrl } = args as any;

        try {
            // In a real scenario, Client might be mocked or fail if no key
            const session = await createCheckoutSession(userId, priceId, returnUrl);

            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({
                            status: "success",
                            sessionId: session.id,
                            url: session.url
                        })
                    }
                ]
            };
        } catch (error: any) {
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({
                            status: "error",
                            message: error.message
                        })
                    }
                ],
                isError: true
            };
        }
    }

    throw new Error("Tool not found");
});

// Start Server
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("🟢 Fabricaria Stripe MCP Server running on stdio");
}

main().catch((error) => {
    console.error("🔴 Fatal MCP Error:", error);
    process.exit(1);
});
