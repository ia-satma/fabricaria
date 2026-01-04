
import { GeminiClient } from "../ai/gemini-client";

/**
 * HYBRID FLOW (Step 55)
 * Architect (Pro) plans -> Constructor (Flash) executes.
 * Transmutes abstract reasoning into structured JSON placeholders.
 */

interface ImplementationPlan {
    files_to_create: string[];
    key_functions: string[];
    dependencies: string[];
    instructions: string;
}

export class HybridFlowManager {
    private architect: GeminiClient;
    private constructorAgent: GeminiClient;

    constructor() {
        // Architect uses the high-reasoning model
        this.architect = new GeminiClient("gemini-1.5-pro", "ARCHITECT-ALPHA");
        // Constructor uses the fast, cheap model
        this.constructorAgent = new GeminiClient("gemini-1.5-flash", "CONSTRUCTOR-WORKER");
    }

    async runTask(taskDescription: string) {
        console.log("🏗️ [HybridFlow] Starting Phase 1: Architect (Pro) Planning...");

        // Phase 1: Architect Planning
        const planPrompt = `
            Analyze this complex task. DO NOT write implementation code.
            Generate a detailed JSON implementation plan.
            
            TASK: ${taskDescription}
            
            OUTPUT SCHEMA:
            {
                "files_to_create": ["path/to/file.ts"],
                "key_functions": ["functionName(args)"],
                "dependencies": ["npm-package"],
                "instructions": "Step-by-step logic description"
            }
        `;

        const rawPlan = await this.architect.generateContent(planPrompt, {
            responseMimeType: "application/json"
        } as any);

        const plan: ImplementationPlan = JSON.parse(rawPlan);
        console.log("🏗️ [HybridFlow] Phase 1 Complete. Plan transmuted to JSON.");

        // Phase 2: Constructor Execution
        console.log("🏗️ [HybridFlow] Starting Phase 2: Constructor (Flash) Implementation...");

        const executionPrompt = `
            You are an expert executor. Implement the following plan strictly.
            
            PLAN:
            ${JSON.stringify(plan, null, 2)}
            
            Context: Follow the Golden Stack (Next.js 14, Tailwind, Shadcn, Neon, Drizzle).
            Generate the necessary code for the files listed.
        `;

        // We use lower thinking level via model name or config simulation
        const result = await this.constructorAgent.generateContent(executionPrompt);

        console.log("🏗️ [HybridFlow] Phase 2 Complete. Implementation generated.");
        return {
            plan,
            result
        };
    }
}
