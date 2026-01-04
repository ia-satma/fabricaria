
/**
 * SEMANTIC ROUTER MATEMÁTICO (Step 150)
 * Objetivo: Decidir entre RAG y Context Caching basado en Neq (2.5 q/h).
 */

export const NEQ_THRESHOLD = 2.5; // Consultas por hora de equilibrio

export function recommendCachingStrategy(queryVelocityPerHour: number): 'RAG' | 'CACHE' {
    if (queryVelocityPerHour > NEQ_THRESHOLD) {
        console.log(`💰 [Router] Velocity ${queryVelocityPerHour} > ${NEQ_THRESHOLD}. Recommendation: CONTEXT CACHING.`);
        return 'CACHE';
    } else {
        console.log(`💰 [Router] Velocity ${queryVelocityPerHour} <= ${NEQ_THRESHOLD}. Recommendation: RAG (Postgres).`);
        return 'RAG';
    }
}

export function estimateSessionROI(tokens: number, estimatedQueries: number) {
    const ragCost = estimatedQueries * (tokens * 0.00015 / 1000);
    const cacheCost = 4.50 + (estimatedQueries * 0.00001 / 1000); // Mock cache price

    return {
        ragCost,
        cacheCost,
        saving: ragCost - cacheCost
    };
}
