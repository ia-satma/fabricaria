
import { GeminiClient } from "../../lib/ai/gemini-client";

export async function conveneCouncil(proposal: string, context: string): Promise<{ approved: boolean; feedback: string }> {
    console.log("⚖️ [Council] Convening the Council of Elders...");

    const client = new GeminiClient("gemini-2.5-flash", "COUNCIL_JUDGE");

    const prompt = `
        Act as the COUNCIL OF ELDERS for an AI software factory.
        You are composed of 3 Judges:
        1. 🛡️ Experto en Seguridad: Paranoiac, checks for vulnerabilities.
        2. ⚡ Experto en Performance: Obsessed with speed and efficiency.
        3. 💎 Experto en Producto: Focuses on usability and "vibe".

        PROPOSAL:
        ${proposal}

        CONTEXT:
        ${context}

        TASK:
        Each judge must vote YES or NO.
        Majority rule (2/3) decides.

        OUTPUT JSON ONLY:
        {
            "votes": {
                "security": "YES/NO",
                "performance": "YES/NO",
                "product": "YES/NO"
            },
            "approved": boolean,
            "feedback": "Consolidated feedback from dissenting judges..."
        }
    `;

    try {
        const text = await client.generateContent(prompt);
        const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();
        const verdict = JSON.parse(cleanedText);

        console.log(`⚖️ [Council] Verdict: ${verdict.approved ? "APPROVED ✅" : "REJECTED ❌"}`);
        if (!verdict.approved) {
            console.warn(`⚖️ [Council] Feedback: ${verdict.feedback}`);
        }
        return verdict;
    } catch (error) {
        console.error("⚖️ [Council] Failed to convene:", error);
        // Fail safe: Block if council fails? Or warn?
        // Blocking is safer for critical operations.
        return { approved: false, feedback: "Council system failure. Auto-rejected for safety." };
    }
}
