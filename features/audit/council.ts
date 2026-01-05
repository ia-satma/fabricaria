
import { GeminiClient } from "../../lib/ai/gemini-client";

/**
 * PASO 264: EL CONSEJO DE LLMs (Validación Democrática)
 * Objetivo: Consenso entre modelos para acciones críticas.
 */

export interface CouncilVote {
    model: string;
    vote: "YES" | "NO";
    reason: string;
}

export class LLMCouncil {
    private static models = [
        { name: "gemini-1.5-pro", alias: "Architect" },
        { name: "gemini-1.5-flash", alias: "Observer" }
        // In a real scenario, we would include Claude or GPT-4o via MCP or API
    ];

    static async validateAction(action: string, context: string): Promise<boolean> {
        console.log(`⚖️ [ Council] Deliberating on critical action: ${action}`);

        const votes: CouncilVote[] = [];

        for (const modelDef of this.models) {
            const client = new GeminiClient(modelDef.name, `COUNCIL_${modelDef.alias}`);
            const prompt = `
                Eres un miembro del CONSEJO DE SEGURIDAD de Fabricaria.
                Acción propuesta: ${action}
                Contexto: ${context}
                
                ¿Es esta acción segura y necesaria? 
                Responde EXCLUSIVAMENTE en formato JSON:
                { "vote": "YES" | "NO", "reason": "Justificación breve" }
            `;

            try {
                const response = await client.generateContent(prompt, { skipTSIP: true });
                const cleaned = response.replace(/```json/g, "").replace(/```/g, "").trim();
                const result = JSON.parse(cleaned);
                votes.push({ model: modelDef.alias, vote: result.vote, reason: result.reason });
            } catch (e) {
                console.error(`❌ [Council] Model ${modelDef.alias} failed to vote.`, e);
            }
        }

        const yesVotes = votes.filter(v => v.vote === "YES").length;
        const totalVotes = votes.length;
        const consensus = yesVotes / totalVotes >= 0.66; // 2/3 mayoría

        console.log(`📊 [Council] Consensus: ${consensus ? "AUTHORIZED" : "REJECTED"} (${yesVotes}/${totalVotes})`);
        votes.forEach(v => console.log(`   - ${v.model}: ${v.vote} (${v.reason})`));

        return consensus;
    }
}
