
/**
 * PASO 194: EL ROUTER SEMÁNTICO MATEMÁTICO (Neq ≈ 2.5)
 * Objetivo: Decidir si usar Context Cache (Hot) o RAG/Neon (Cold).
 */

export interface RoutingDecision {
    tier: 'HOT' | 'COLD';
    reason: string;
}

export class SemanticRouter {
    // Neq = (R_ratio * C_in - C_cache_in) / C_store
    // Para Gemini 1.5 Pro, Neq ≈ 2.5 consultas/hora
    private static NEQ_THRESHOLD = 2.5;

    /**
     * Evalúa si una sesión debe ser promocionada a Caché de Contexto.
     */
    static decideTier(queriesPerHour: number, contextSizeTokens: number): RoutingDecision {
        console.log(`🧮 [Router-Semántico] Evaluando velocidad: ${queriesPerHour} q/h | Tamaño: ${contextSizeTokens} tokens`);

        if (queriesPerHour >= this.NEQ_THRESHOLD) {
            return {
                tier: 'HOT',
                reason: `Velocidad ${queriesPerHour} >= ${this.NEQ_THRESHOLD}. Es económicamente rentable usar Context Caching.`
            };
        }

        return {
            tier: 'COLD',
            reason: `Velocidad ${queriesPerHour} < ${this.NEQ_THRESHOLD}. Mejor usar RAG sobre Neon para ahorrar costos de almacenamiento.`
        };
    }
}
