
/**
 * PASO 194: EL ROUTER SEMÁNTICO MATEMÁTICO (Neq ≈ 2.5)
 * Objetivo: Decidir si usar Context Cache (Hot) o RAG/Neon (Cold).
 */

export interface RoutingDecision {
    tier: 'HOT' | 'COLD';
    reason: string;
}

export class SemanticRouter {
    /**
     * PASO 321: EL ALGORITMO DE EQUILIBRIO (N_eq)
     * R_ratio: Ratio de reducción de latencia
     * C_in: Costo de entrada normal
     * C_cache_in: Costo de activar el caché (write cost)
     * C_store: Costo de almacenamiento por hora
     */
    static calculateNeq(rRatio: number, costIn: number, costCacheIn: number, costStore: number): number {
        // N_eq = (R_ratio * C_in - C_cache_in) / C_store
        return (rRatio * costIn - costCacheIn) / costStore;
    }

    /**
     * Evalúa si una sesión debe ser promocionada a Caché de Contexto.
     * N_eq ≈ 2.5 consultas/hora para Gemini 1.5 Pro.
     */
    static decideTier(queriesPerHour: number): RoutingDecision {
        const threshold = 2.5;
        console.log(`🧮 [Router-Semántico] Threshold N_eq: ${threshold} | Requerido q/h: ${queriesPerHour}`);

        if (queriesPerHour >= threshold) {
            return {
                tier: 'HOT',
                reason: `Eficiencia económica: ${queriesPerHour} >= ${threshold} q/h. Promocionando a Context Caching.`
            };
        }

        return {
            tier: 'COLD',
            reason: `Eficiencia económica: ${queriesPerHour} < ${threshold} q/h. Manteniendo en Cold Storage (pgvector).`
        };
    }
}
