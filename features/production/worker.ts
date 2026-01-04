
import { db } from "../../db";
import { fabricationQueue } from "../../db/schema";
import { eq } from "drizzle-orm";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

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

            // Generate Code using Gemini
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const prompt = `
        You are an expert coder. 
        Task: Implement the following blueprint: ${JSON.stringify(blueprint)}
        
        Return the Code as a single Markdown string with file paths if necessary.
      `;

            const result = await model.generateContent(prompt);
            const generatedCode = result.response.text();

            // Update job with result
            await db.update(fabricationQueue)
                .set({
                    status: "completed",
                    payload: { ...payload, output: generatedCode },
                    updatedAt: new Date()
                })
                .where(eq(fabricationQueue.id, job.id));

            console.log(`[Production] Job ${job.jobId} COMPLETED.`);

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
