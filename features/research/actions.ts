
"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { BlueprintArtifact } from "../../types/factory-protocol";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function analyzeRepositoryAction(url: string): Promise<BlueprintArtifact> {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
      You are an elite software architect. Analyze the provided repository URL: ${url}.
      Infer the likely purpose, tech stack, and core structure based on the name and common patterns.
      Generate a "Blueprint" that describes the project.
      
      Return ONLY a JSON object with this structure (no markdown):
      {
        "id": "generated-id",
        "type": "code",
        "content": "Description of the architecture...",
        "metadata": { "techStack": ["..."], "complexity": "..." }
      }
    `;

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        // Clean markdown if present
        const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();

        const artifact: BlueprintArtifact = JSON.parse(cleanedText);
        return artifact;
    } catch (error) {
        console.error("Research Agent Failed:", error);
        throw new Error("Failed to analyze repository.");
    }
}
