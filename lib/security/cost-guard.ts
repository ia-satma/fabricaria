
/**
 * COST GUARD (FINOPS CIRCUIT BREAKER)
 * Prevents runaway spending by blocking expensive jobs.
 */

export const COST_LIMIT_PER_JOB_USD = 0.50; // $0.50 limit per job

export function checkBudget(jobCost: number): void {
    if (jobCost > COST_LIMIT_PER_JOB_USD) {
        console.error(`💸 [FinOps] CIRCUIT BREAKER TRIPPED! Cost $${jobCost} exceeds limit $${COST_LIMIT_PER_JOB_USD}`);
        throw new Error(`CIRCUIT BREAKER: Budget exceeded. Job cost $${jobCost} > Limit $${COST_LIMIT_PER_JOB_USD}`);
    }
}

export function calculateCost(model: string, inputTokens: number, outputTokens: number): number {
    // Pricing (Approximate Gemini 1.5 Pro / Flash rates)
    // Flash: Input $0.075 / 1M, Output $0.30 / 1M (Cache is different)
    // Pro: Input $3.50 / 1M, Output $10.50 / 1M
    // Let's use standard rates for estimation.

    let inputRate = 0;
    let outputRate = 0;

    if (model.includes("flash")) {
        inputRate = 0.075 / 1_000_000;
        outputRate = 0.30 / 1_000_000;
    } else if (model.includes("pro")) {
        inputRate = 3.50 / 1_000_000;
        outputRate = 10.50 / 1_000_000;
    } else {
        // Fallback generic
        inputRate = 1.0 / 1_000_000;
        outputRate = 2.0 / 1_000_000;
    }

    const total = (inputTokens * inputRate) + (outputTokens * outputRate);
    return parseFloat(total.toFixed(6));
}
