
"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { BlueprintArtifact } from "../../types/factory-protocol";
import { db } from "../../db";
import { codeAudits } from "../../db/schema";
import { eq, and } from "drizzle-orm";
import { validateArtifact } from "../../lib/security/interceptor";
import crypto from "crypto";
import { GeminiClient } from "../../lib/ai/gemini-client"; // Static import

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

/**
 * Generates a SHA-256 hash for the repository URL (and potentially commit/date).
 */
function generateHash(url: string): string {
  const today = new Date().toISOString().split('T')[0]; // Simple daily cache for now
  return crypto.createHash('sha256').update(`${url}-${today}`).digest('hex');
}

export async function analyzeRepositoryAction(url: string): Promise<BlueprintArtifact> {
  try {
    console.log(`🔍 [Research] Analyzing: ${url}`);

    // 1. CACHE CHECK (Step 15)
    const contentHash = generateHash(url);
    const existingAudit = await db.select()
      .from(codeAudits)
      .where(and(eq(codeAudits.repoUrl, url), eq(codeAudits.hash, contentHash)))
      .limit(1);

    // 2. TREE OF THOUGHTS ANALYSIS (Step 16)
    // Update: MEMORY ROUTER CHECK (Step 19)
    const { decideMemoryStrategy, maintainCache } = await import("../../features/memory/router");

    if (existingAudit.length > 0) {
      console.log("⚡ [Cache] Cache Hit! Returning saved blueprint.");

      // TRIGGER HEARTBEAT (Step 24)
      // Even on a cache hit, we want to keep the underlying Gemini context alive if it's HOT
      const cachedArtifact = existingAudit[0].blueprint as BlueprintArtifact;
      if (cachedArtifact.metadata?.memoryStrategy === 'HOT_CACHE') {
        maintainCache(`cache-${contentHash}`);
      }

      return { ...cachedArtifact, cached: true };
    }

    // Simulating context size (e.g. from a previous fetch or just rough guess of repo size)
    // For a URL analysis, we don't have the full content yet, but let's assume we fetched a file structure
    // or we are predicting based on typical repo size.
    // Let's assume a "Medium" repo size for simulation
    const simulatedRepoTokens = 600_000;
    const simulatedFrequency = 4; // High frequency simulation to trigger HOT_CACHE if desired

    const strategy = decideMemoryStrategy(simulatedRepoTokens, simulatedFrequency);
    console.log(`💰 [FinOps] Memory Router Decision: ${strategy} (Tokens: ${simulatedRepoTokens}, Freq: ${simulatedFrequency}/h)`);

    let modelName = "gemini-2.5-flash";

    if (strategy === 'HOT_CACHE') {
      // Logic to create/use generic cache (Simulated API Call)
      console.log("🔥 [Hot Cache] Establishing ephemeral high-speed context...");
      // TRIGGER HEARTBEAT (Step 24)
      maintainCache(`cache-${contentHash}`);
      // In real production: await genAI.cachedContent.create(...)
    } else {
      console.log("🧊 [Cold RAG] Using standard vector retrieval path.");
    }

    const model = genAI.getGenerativeModel({ model: modelName });

    const prompt = `
      Act as an Elite Software Architect using the 'Tree of Thoughts' method.
      Analyze the provided repository URL: ${url}.
      
      [STRATEGY: ${strategy}]

      Execute the following thought process:
      
      🌲 Branch 1 (Structural):
      - Analyze the folder structure, languages, and core technologies.
      
      🌲 Branch 2 (Functional):
      - Infer the business rules, primary use cases, and intended behavior.
      
      🌲 Branch 3 (Critical/Security):
      - Identify potential security vulnerabilities, anti-patterns, or scalability risks.

      🔍 DEEP RESEARCH PROTOCOL (Step 31):
      - If using 3rd party libraries, you MUST provide a summary of the API functions used.
      - Rate your confidence in the existence and syntax of these functions (HIGH/LOW).
      - If LOW confidence, flag as "MANUAL_VERIFICATION_REQUIRED" in riskAnalysis.

      🌱 SYNTHESIS (Final Blueprint):
      - Combine all insights into a comprehensive architectural definition.

      OUTPUT ONLY a JSON object validating against this schema (NO MARKDOWN):
      {
        "id": "generated-uuid",
        "type": "architecture",
        "content": "Full synthesis of the architecture...",
        "techStack": ["Next.js", "Tailwind", "Drizzle"],
        "databaseSchema": { "users": ["id", "email"] },
        "apiEndpoints": ["GET /api/users"],
        "frontendComponents": ["LoginButton"],
        "dependencies": [
            { "name": "axios", "version": "v1.x", "purpose": "HTTP Client", "confidence": "HIGH" },
            { "name": "obscure-lib", "version": "unknown", "purpose": "Magic", "confidence": "LOW" }
        ],
        "riskAnalysis": [
            { "description": "API might be deprecated", "impact": "HIGH", "mitigation": "Verify docs manually" }
        ],
        "metadata": {
            "complexity": "High/Medium/Low",
            "securityRisk": "High/Medium/Low",
            "memoryStrategy": "${strategy}",
            "branchInsights": {
                "structural": "...",
                "functional": "...",
                "critical": "..."
            }
        }
      }
    `;

    // Use Centralized FinOps Client with JSON MODE (Step 27)
    const client = new GeminiClient(modelName, "RESEARCH_EMBEDDINGS");

    // Force strict JSON output
    const text = await client.generateContent(prompt, {
      response_mime_type: "application/json"
    });

    const artifact: BlueprintArtifact = JSON.parse(text);

    // 3. AEGIS SECURITY INTERCEPTOR (Step 17)
    console.log("🛡️ [Aegis] Intercepting artifact for validation...");
    validateArtifact(artifact);
    console.log("✅ [Aegis] Artifact secured.");

    // 4. SAVE TO DB (Cache Population)
    await db.insert(codeAudits).values({
      repoUrl: url,
      hash: contentHash,
      blueprint: artifact
    });

    console.log("💾 [Research] Blueprint saved to Audit Log.");
    return { ...artifact, cached: false };

  } catch (error: any) {
    console.error("❌ Research Agent Failed:", error.message || error);
    // Better error handling for the client
    if (error.message?.includes("BLOQUEO DE SEGURIDAD")) {
      throw new Error(error.message);
    }
    throw new Error("Failed to analyze repository. See server logs.");
  }
}
