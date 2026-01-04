
/**
 * REPLIT GRAPHQL PROVISIONING (Step 64)
 * Instantiates new Repls headlessly via GraphQL for autonomous worker scaling.
 */

const REPLIT_GQL_URL = "https://replit.com/graphql";

const CREATE_REPL_MUTATION = `
  mutation CreateRepl($input: CreateReplInput!) {
    createRepl(input: $input) {
      ... on CreateReplSuccess {
        repl {
          id
          url
          slug
        }
      }
      ... on UserError {
        message
      }
    }
  }
`;

export interface ProvisioningResult {
    replId: string;
    url: string;
}

export async function createHeadlessRepl(title: string, template: string = "node-typescript"): Promise<ProvisioningResult> {
    console.log(`🏗️ [Provisioning] Instantiating worker: "${title}" (Template: ${template})...`);

    const sid = process.env.REPLIT_SID;
    if (!sid) {
        throw new Error("REPLIT_SID is missing. Hardware provisioning impossible.");
    }

    try {
        const response = await fetch(REPLIT_GQL_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Cookie": `connect.sid=${sid}`,
                "X-Requested-With": "XMLHttpRequest",
                "User-Agent": "Mozilla/5.0 (Agentic-Fabricaria/1.0)",
                "Referer": "https://replit.com/~"
            },
            body: JSON.stringify({
                query: CREATE_REPL_MUTATION,
                variables: {
                    input: {
                        title,
                        template
                    }
                }
            })
        });

        const data = await response.json();
        const result = data?.data?.createRepl;

        if (result?.message) {
            throw new Error(`Replit GQL Error: ${result.message}`);
        }

        const repl = result?.repl;
        if (!repl) {
            throw new Error("Provisioning failed: No repl returned in response.");
        }

        console.log(`✅ [Provisioning] Worker instantiated successfully at ${repl.url}`);

        return {
            replId: repl.id,
            url: repl.url
        };

    } catch (error: any) {
        console.error("❌ [Provisioning] Fatal error during instantiation:", error.message);
        throw error;
    }
}

// CLI Execution Support
if (require.main === module) {
    const title = process.argv[2] || `worker-${Date.now()}`;
    createHeadlessRepl(title)
        .then(res => console.log("Provisioning Result:", JSON.stringify(res, null, 2)))
        .catch(() => process.exit(1));
}
