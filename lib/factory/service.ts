import { ReplitFactoryClient } from "./client";
import { CrosisInjector, DNAContext } from "./injector";
import { HandoffState } from "@/lib/swarm/schema";

// Default Security Rules for new Fabricaria Projects
const DEFAULT_RULES = `
- [SECURITY] Do not expose API Keys in client-side code.
- [ARCH] Use Next.js App Router.
- [STYLE] Use TailwindCSS for styling.
- [MEMORY] Use Hybrid Memory Architecture (Neon PgVector).
`;

const DEFAULT_AGENTS_CONFIG = `
# Project Context
This project was provisioned by the Fabricaria Factory Engine.
`;

export class FactoryService {
    /**
     * PROVISIONING PROTOCOL 019 & 020 (Swarm)
     * 1. Create Headless Container
     * 2. Inject DNA (Rules + Handoff Context)
     * 3. Return Access Coordinates
     */
    static async provisionProject(title: string, handoff?: HandoffState) {
        console.log(`🏭 [FactoryService] Starting provisioning sequence for "${title}"...`);
        if (handoff) {
            console.log(`🤖 [Swarm] Handoff Protocol Active. Target Role: ${handoff.target_role}`);
        }

        // Step 1: Instantiation
        const repl = await ReplitFactoryClient.createRepl(title);
        if (!repl.id) {
            throw new Error("Container instantiation failed.");
        }

        // Step 2: DNA Injection Setup
        const dna: DNAContext = {
            ProjectName: title,
            Rules: DEFAULT_RULES,
            AgentsConfig: DEFAULT_AGENTS_CONFIG, // Fallback
            Handoff: handoff
        };

        // Fetch Connection Token (if needed for Crosis)
        // const token = await ReplitFactoryClient.getConnectionToken(repl.id);
        const token = "mock_token_for_protocol"; // Placeholder

        // Step 3: Injection Execution
        const injected = await CrosisInjector.injectDNA(repl.id, token, dna);

        if (!injected) {
            console.warn("⚠️ [FactoryService] DNA Injection had issues. Project created but might be unsecure.");
        }

        return {
            status: "PROVISIONED",
            replId: repl.id,
            url: repl.url,
            injected: injected,
            handoffId: handoff?.id
        };
    }
}
