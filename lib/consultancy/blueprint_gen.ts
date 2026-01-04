
import { GeminiClient } from "../ai/gemini-client";

/**
 * PASO 182: DYNAMIC BLUEPRINT GENERATOR (The Generative Consultant)
 * Objetivo: Transformar una idea en un AGENTS.md y un plan de acción.
 */

export async function generateProjectBlueprint(idea: string) {
    console.log("🏗️ [Consultant] Generating architectural blueprint for:", idea);

    const architect = new GeminiClient("gemini-1.5-pro", "CONSULTANT");

    // 1. Generar AGENTS.md (Constitución)
    const constitutionPrompt = `Generate a comprehensive AGENTS.md for this project idea: ${idea}. Include role definitions, interaction rules (MCP protocols), and security guidelines.`;
    const constitution = await architect.generateContent(constitutionPrompt);

    // 2. Generar Plan de Implementación (PRD)
    const prdPrompt = `Generate a technical Implementation Plan (PRD) for: ${idea}. Specify tech stack (Next.js, Neon, Drizzle), database schema, and API routes.`;
    const prd = await architect.generateContent(prdPrompt);

    return {
        constitution,
        prd,
        metadata: {
            generatedAt: new Date().toISOString(),
            engine: "Gemini 1.5 Pro (Thinking: High)"
        }
    };
}
