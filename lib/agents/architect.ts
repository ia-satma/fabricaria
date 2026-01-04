
import { GeminiClient } from "../ai/gemini-client";

/**
 * THE ARCHITECT (Step 77)
 * Role: Senior Systems Designer.
 * Goal: Complex planning and artifact generation.
 */

export class ArchitectAgent {
    private client: GeminiClient;

    constructor() {
        this.client = new GeminiClient("gemini-1.5-pro", "Architect");
    }

    async plan(request: string): Promise<any> {
        console.log("🏗️ [Architect] Planning implementation for:", request.substring(0, 50));

        const systemPrompt = `
Eres un Arquitecto de Software Senior. Tu trabajo NO es escribir código final.
Tu trabajo es analizar requerimientos vagos y generar un PLAN DE IMPLEMENTACIÓN detallado en formato JSON.

REGLAS:
1. Sigue estrictamente @TechStack y @Rules de AGENTS.md.
2. Divide la tarea en pasos atómicos.
3. Define los esquemas Zod necesarios primero.

SALIDA ESPERADA (JSON):
{
  "project_name": "string",
  "goal": "string",
  "schemas": [{ "file": "path", "content": "zod definition" }],
  "files_to_create": [{ "file": "path", "logic": "description" }],
  "shell_commands": ["string"],
  "dependencies": ["string"]
}
`;

        const response = await this.client.generateContent(\`\${systemPrompt}\n\nREQUERIMIENTO: \${request}\`, {
            responseMimeType: "application/json",
            thinkingLevel: "HIGH" // Forced reasoning for complex planning
        } as any);

        return JSON.parse(response);
    }
}
