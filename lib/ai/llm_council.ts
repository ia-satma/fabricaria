
import { GeminiClient } from "./gemini-client";

/**
 * PASO 180: LLM COUNCIL PROTOCOL
 * Objetivo: Votación colectiva para decisiones críticas de arquitectura o I+D.
 */

export interface VoteResult {
    decision: 'APPROVE' | 'REJECT' | 'NEUTRAL';
    reason: string;
}

export class LLMCouncil {
    private members = [
        { name: "Architect-Alpha", model: "gemini-1.5-pro" },
        { name: "Aegis-Sentinel", model: "gemini-1.5-pro" },
        { name: "Vibe-Master", model: "gemini-1.5-flash" }
    ];

    async debate(proposal: string): Promise<string> {
        console.log("🏛️ [LLM-Council] A debate has started regarding:", proposal);

        const votes: VoteResult[] = [];

        for (const member of this.members) {
            console.log(`🎙️ [Council] Member ${member.name} is voting...`);
            const client = new GeminiClient(member.model, member.name);

            const response = await client.generateContent(`
                Proposal: ${proposal}
                As ${member.name}, analyze this. Respond ONLY with a JSON:
                { "decision": "APPROVE" | "REJECT", "reason": "..." }
            `);

            try {
                const result = JSON.parse(response);
                votes.push(result);
            } catch {
                votes.push({ decision: 'NEUTRAL', reason: 'Failed to format vote.' });
            }
        }

        const approvals = votes.filter(v => v.decision === 'APPROVE').length;
        const finalDecision = approvals > (this.members.length / 2) ? "APPROVED ✅" : "REJECTED ❌";

        console.log(`⚖️ [LLM-Council] Final verdict: ${finalDecision}`);
        return finalDecision;
    }
}

export const council = new LLMCouncil();
