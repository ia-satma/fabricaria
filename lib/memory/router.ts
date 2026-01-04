
/**
 * PASO 165: EL CEREBRO ECONÓMICO (Semantic Router V2)
 * Objetivo: Automatizar la decisión de Caché vs RAG usando N_eq.
 */

export interface RouterDecision {
    tier: 'HOT_CACHE' | 'COLD_RAG';
    reason: string;
}

export const NEQ_THRESHOLD = 2.5; // Consultas por hora de equilibrio

export function routeCognitiveContext(stats: {
    session_velocity: number,
    context_size: number
}): RouterDecision {
    console.log(`🧮 [Router-V2] Analyzing cognitive request: Velocity=${stats.session_velocity}, Size=${stats.context_size}`);

    // N_eq formula conceptual integration
    const isProfitable = stats.session_velocity > NEQ_THRESHOLD;
    const isLargeContext = stats.context_size > 1_000_000;

    if (isProfitable && isLargeContext) {
        return {
            tier: 'HOT_CACHE',
            reason: `Efficiency gain: velocity ${stats.session_velocity} > ${NEQ_THRESHOLD} with large context.`
        };
    }

    return {
        tier: 'COLD_RAG',
        reason: isProfitable ? "Context too small for cache ROI." : "Velocity too low for cache subscription cost."
    };
}
