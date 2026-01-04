
"use server";

import { GeminiClient } from "../../lib/ai/gemini-client";

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || ""); // REMOVED


import { z } from "zod";

const AuditInputSchema = z.string().min(10);
const AuditOutputSchema = z.object({
  score: z.number().min(0).max(100),
  report: z.string(),
  vibeScore: z.number().optional().default(0),
  vibeCritique: z.string().optional().default("N/A"),
  status: z.string().optional().default("SUCCESS")
});

export async function auditCodeAction(code: string): Promise<z.infer<typeof AuditOutputSchema>> {
  try {
    // 1. Validate Input (Paso 128)
    const validatedCode = AuditInputSchema.parse(code);

    const client = new GeminiClient("gemini-1.5-flash", "QA_AUDIT");
    const prompt = `
      Act as a Senior Code Auditor. Analyze the following code snippet.
      Rate it from 0 to 100 on code quality, security, and performance.
      Provide a brief report justifying the score.

      Code:
      ${validatedCode.substring(0, 5000)}

      Return JSON format:
      {
        "score": 85,
        "report": "Code is clean but lacks..."
      }
    `;

    const text = await client.generateContent(prompt, { responseMimeType: "application/json" });

    // 2. Validate Output (Paso 128)
    const json = JSON.parse(text);
    return AuditOutputSchema.parse(json);

  } catch (error) {
    console.error("Audit Failed:", error);
    if (error instanceof z.ZodError) {
      return { score: 0, report: "Invalid contract: " + error.message, status: "CONTRACT_ERROR", vibeScore: 0, vibeCritique: "N/A" };
    }
    return { score: 0, report: "Audit failed to execute due to AI error.", status: "ERROR", vibeScore: 0, vibeCritique: "N/A" };
  }
}
