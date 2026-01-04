
import { ArchitectAgent } from "./agents/architect";
import { BuilderAgent } from "./agents/builder";

/**
 * THE ORCHESTRATOR (Step 81)
 * Role: Project Manager.
 * Goal: Intelligent task routing.
 */

export class Orchestrator {
    private architect: ArchitectAgent;
    private builder: BuilderAgent;

    constructor() {
        this.architect = new ArchitectAgent();
        this.builder = new BuilderAgent();
    }

    async routeAndExecute(request: string) {
        console.log("🔀 [Orchestrator] Analyzing request complexity...");

        // Simple Classification (In real world, use a small LLM call)
        const isComplex = request.length > 100 || request.includes("sistema") || request.includes("arquitectura");

        if (isComplex) {
            console.log("🏗️ [Orchestrator] Routing to ARCHITECT_FLOW");
            const plan = await this.architect.plan(request);
            await this.builder.execute(plan);
        } else {
            console.log("⚡ [Orchestrator] Routing to BUILDER_FLOW (Direct Execution)");
            await this.builder.execute({ goal: request });
        }
    }
}
