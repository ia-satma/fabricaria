
"use server";

import { GeminiClient } from "../../lib/ai/gemini-client";

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || ""); // REMOVED

export async function auditCodeAction(code: string): Promise<{ score: number; vibeScore: number; report: string; vibeCritique: string; status: string }> {
  try {
    const client = new GeminiClient("gemini-2.5-flash", "QA_AUDIT");
    // const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); // REMOVED

    const prompt = `
      Act as a Senior Code Auditor. Analyze the following code snippet.
      Rate it from 0 to 100 on code quality, security, and performance.
      Provide a brief report justifying the score.

      Code:
      ${code.substring(0, 5000)}

      Return JSON format:
      {
        "score": 85,
        "report": "Code is clean but lacks..."
      }
    `;

    const text = await client.generateContent(prompt);
    const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();

    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Audit Failed:", error);
    // Fallback
    return { score: 0, vibeScore: 0, report: "Audit failed to execute due to AI error.", vibeCritique: "N/A", status: "ERROR" };
  }
}
