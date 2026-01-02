import { GraphQLClient, gql } from "graphql-request";

const REPLIT_GRAPHQL_URL = "https://replit.com/graphql";

// Ensure we have a valid token (REPLIT_SID or a dedicated Service Token)
const REPLIT_TOKEN = process.env.REPLIT_SID || process.env.REPLIT_TOKEN;

if (!REPLIT_TOKEN) {
    console.warn("⚠️ [Factory] REPLIT_SID or REPLIT_TOKEN not found. Provisioning calls may fail.");
}

const client = new GraphQLClient(REPLIT_GRAPHQL_URL, {
    headers: {
        "User-Agent": "Fabricaria-Headless-Factory/1.0",
        "X-Requested-With": "XMLHttpRequest",
        "Referer": "https://replit.com/",
        Cookie: `connect.sid=${REPLIT_TOKEN}`,
    },
});

export interface CreateReplResult {
    id: string;
    url: string;
    slug: string;
}

export class ReplitFactoryClient {
    /**
     * Creates a new Repl using the internal GraphQL mutation.
     * Use with caution.
     */
    static async createRepl(title: string, language: string = "nextjs"): Promise<CreateReplResult> {
        console.log(`🏭 [Factory] Provisioning new container: "${title}" (${language})...`);

        const mutation = gql`
            mutation CreateRepl($input: CreateReplInput!) {
                createRepl(input: $input) {
                    repl {
                        id
                        url
                        slug
                    }
                }
            }
        `;

        try {
            const data: any = await client.request(mutation, {
                input: {
                    title,
                    language,
                    isPrivate: true, // Defaulting to private for security
                },
            });

            const repl = data.createRepl.repl;
            console.log(`✅ [Factory] Container created: ${repl.id} (${repl.url})`);

            return {
                id: repl.id,
                url: `https://replit.com${repl.url}`,
                slug: repl.slug
            };
        } catch (error) {
            console.error("❌ [Factory] Creation failed:", error);
            throw new Error("Failed to provision Repl via GraphQL.");
        }
    }

    /**
     * Gets the connection token (GCT) for Crosis.
     * Required for WebSocket connection.
     */
    static async getConnectionToken(replId: string): Promise<string> {
        const query = gql`
            query ReplConnectionToken($id: String!) {
                repl(id: $id) {
                    id
                    token
                }
            }
        `;

        // Note: The actual GCT fetch usually requires a different endpoint or the 'repl' query details.
        // For Replit internal usage, sometimes it's under 'repl.token' or specialized mutation.
        // We will try retrieving the repl token directly.
        try {
            // In many implementations, we might just need the SID for Crosis user auth vs Repl token.
            // But for file operations, we usually need a Repl Token.
            // Let's assume the SID matches user context for now, or use this query if valid.
            const data: any = await client.request(query, { id: replId });
            return data.repl?.token || "";
        } catch (e) {
            console.warn("⚠️ [Factory] Could not fetch specific Repl Token. Crosis might fallback to User Auth.", e);
            return "";
        }
    }
}
