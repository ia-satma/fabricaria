import { db } from "../../db";
import { fabricationQueue } from "../../db/schema";
import { eq } from "drizzle-orm";
import { GeminiClient } from "../../lib/ai/gemini-client";
import { saveAgentState } from "../../lib/git-memory";
import fs from 'fs';
import path from 'path';

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || ""); // REMOVED

export async function runProductionWorker() {
    console.log("[Production] Worker started. Polling for jobs...");

    // Exponential backoff or simple interval in real life.
    // For this restoration, we'll process one batch.
    const pendingJobs = await db.select().from(fabricationQueue).where(eq(fabricationQueue.status, "pending")).limit(5);

    if (pendingJobs.length === 0) {
        console.log("[Production] No pending jobs found.");
        return;
    }

    for (const job of pendingJobs) {
        console.log(`[Production] Processing Job ${job.jobId}...`);

        // PERSISTENCE (Step 28)
        await saveAgentState({
            stepId: 773, // Dynamic IDs would follow actual step
            currentTask: `Processing Job ${job.jobId}`,
            status: 'working',
            memory: { jobId: job.id, payload: job.payload },
            lastUpdate: new Date().toISOString()
        });

        try {
            // Update status to in-progress
            await db.update(fabricationQueue)
                .set({ status: "in-progress" })
                .where(eq(fabricationQueue.id, job.id));

            const payload = job.payload as any;
            const blueprint = payload?.blueprint; // Assuming payload has blueprint or instructions

            if (!blueprint) {
                throw new Error("No blueprint found in job payload");
            }

            const client = new GeminiClient("gemini-1.5-flash", "INDUSTRIAL_WORKER");

            // META-PROMPTING LOOP (Step 30) & SCHEMA-FIRST TDD (Step 32)
            let attempt = 0;
            const maxAttempts = 3;
            let currentPrompt = `
        You are an expert coder observing SCHEMA-FIRST TDD.
        Task: Implement the following blueprint: ${JSON.stringify(blueprint)}
        
        [PROTOCOL: TWO-PHASE GENERATION]
        
        PHASE 1: DEFINITIONS (Types & Schemas)
        - Generate all interfaces, types, and Zod schemas FIRST.
        - Ensure strict typing.
        
        PHASE 2: IMPLEMENTATION
        - Write the logic that satisfies the types from Phase 1.
        
        RETURN FORMAT:
        Return a single Markdown string containing both phases (e.g. types.ts and index.ts).
        Ensure file paths are specified correctly.
      `;
            let lastError: any = null;
            let generatedContent = "";

            while (attempt < maxAttempts) {
                attempt++;

                // SENTINEL CHECK (Step 29)
                const STOP_FILE = path.resolve(process.cwd(), 'STOP_WORK');
                if (fs.existsSync(STOP_FILE)) {
                    const reason = fs.readFileSync(STOP_FILE, 'utf-8');
                    throw new Error(`SENTINEL PANIC: Worker halted. Reason: ${reason}`);
                }

                try {
                    console.log(`🔨 [Worker] Attempt ${attempt}/${maxAttempts}...`);

                    if (attempt > 1 && lastError) {
                        console.log("🧠 [Meta-Prompting] Learning from previous failure...");
                        // Call Gemini to analyze why it failed (simulated here with refined prompt injection)
                        currentPrompt += `\n\n[CRITICAL CORRECTION - ATTEMPT ${attempt}]\nPrevious error: ${lastError.message}\nANALYSIS: Avoid the patterns that led to this error. Ensure strict Type-Safety.`;
                    }

                    // Generate Code
                    generatedContent = await client.generateContent(currentPrompt);
                    break; // Success!

                } catch (error: any) {
                    console.error(`❌ [Worker] Attempt ${attempt} failed:`, error.message);
                    lastError = error;
                    if (attempt >= maxAttempts) throw error;
                }
            }

            const generatedCode = generatedContent; // Assign final success result


            // AEGIS SECURITY CHECK (Step 20)
            const { validateAgentAction } = await import("../../lib/security/aegis-interceptor");
            console.log(`🛡️ [Aegis] Validating generated code for Job ${job.jobId}...`);
            await validateAgentAction("PRODUCTION_CODE_GEN", generatedCode);
            console.log(`✅ [Aegis] Code approved.`);

            // SWARM HANDOFF (Step 22)
            const handoffPacket = {
                taskId: job.jobId,
                sourceAgent: "CODER",
                targetAgent: "QA",
                contextSummary: "Code generated and validated by Aegis. Ready for visual inspection.",
                artifacts: ["generated_code"], // In real app, point to specific file paths
                status: "PENDING",
                timestamp: new Date().toISOString()
            };

            // Update job with result AND handoff packet
            await db.update(fabricationQueue)
                .set({
                    status: "completed",
                    payload: { ...payload, output: generatedCode },
                    handoffData: handoffPacket, // Save Swarm State
                    updatedAt: new Date()
                })
                .where(eq(fabricationQueue.id, job.id));

            console.log(`🤝 [Swarm] Handoff packet created for Job ${job.jobId} -> Target: QA`);

            // COUNCIL OF ELDERS (Step 25)
            // If the job involved modifying critical existing systems, convene the council.
            // We simulate checking if it's a "Critical Modification"
            const isCritical = job.payload && (job.payload as any).isCritical === true;

            if (isCritical) {
                const { conveneCouncil } = await import("../../features/audit/council");
                const verdict = await conveneCouncil(generatedCode, "Critical modification to production system.");

                if (!verdict.approved) {
                    throw new Error(`COUNCIL VETOED CHANGE: ${verdict.feedback}`);
                }
            }

            console.log(`[Production] Job ${job.jobId} COMPLETED.`);

            // PERSISTENCE (Step 28)
            await saveAgentState({
                stepId: 773,
                currentTask: "Idle - Waiting for work",
                status: 'idle',
                memory: {},
                lastUpdate: new Date().toISOString()
            });

        } catch (error: any) {
            console.error(`[Production] Job ${job.jobId} FAILED:`, error);
            await db.update(fabricationQueue)
                .set({
                    status: "failed",
                    payload: { ...job.payload as any, error: error.message },
                    updatedAt: new Date()
                })
                .where(eq(fabricationQueue.id, job.id));
        }
    }
}
