
import { GeminiClient } from "../../lib/ai/gemini-client";

/**
 * THE COUNCIL OF ELDERS (Step 106)
 * Goal: Consensus-based validation for critical changes.
 */

export class LLMCouncil {
    private judges: GeminiClient[];

    constructor() {
        this.judges = [
            new GeminiClient("gemini-1.5-pro", "SecurityExpert"),
            new GeminiClient("gemini-1.5-pro", "PerformanceExpert"),
            new GeminiClient("gemini-1.5-flash", "StyleExpert")
        ];
    }

    async convene(proposal: string): Promise<{ decision: 'APPROVED' | 'REJECTED', feedback: string }> {
        console.log("⚖️ [Council] Convening the Elders for a critical decision...");

        const votes = await Promise.all(this.judges.map(async (judge, i) => {
            const systemPrompt = this.getJudgePrompt(i);
            const result = await judge.generateContent(`${systemPrompt}\n\nPROPUESTA:\n${proposal}\n\nResponde SOLO con JSON: { "vote": "YES" | "NO", "reason": "..." }`);
            try {
                return JSON.parse(result.replace(/```json|```/g, ''));
            } catch {
                return { vote: "NO", reason: "Fallback: Invalid response format." };
            }
        }));

        const positiveVotes = votes.filter(v => v.vote === "YES").length;
        const feedback = votes.map((v, i) => `[Juez ${i}] ${v.reason}`).join("\n");

        if (positiveVotes >= 2) {
            console.log(`✅ [Council] Consensus reached: APPROVED (${positiveVotes}/3)`);
            return { decision: 'APPROVED', feedback };
        } else {
            console.warn(`❌ [Council] Consensus failed: REJECTED (${positiveVotes}/3)`);
            return { decision: 'REJECTED', feedback };
        }
    }

    private getJudgePrompt(index: number): string {
        const prompts = [
            "Eres un experto en ciberseguridad. Evalúa si el código tiene vulnerabilidades o filtraciones de secretos.",
            "Eres un experto en escalabilidad y base de datos. Evalúa si el código causará bloqueos o lentitud.",
            "Eres un experto en UI/UX y Clean Code. Evalúa si el código sigue los estándares de FSD y Tailwind."
        ];
        return prompts[index];
    }
}
