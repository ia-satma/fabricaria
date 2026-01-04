
"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function auditCodeAction(code: string): Promise<{ score: number; report: string }> {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();

        return JSON.parse(cleanedText);
    } catch (error) {
        console.error("Audit Failed:", error);
        // Fallback
        return { score: 0, report: "Audit failed to execute due to AI error." };
    }
}
