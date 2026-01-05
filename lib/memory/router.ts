
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
     * PASO 231: FÓRMULA DE EQUILIBRIO (N_eq)
     * R_ratio: Ratio de reducción de latencia (ej. 0.8)
     * C_in: Costo de entrada normal per session
     * C_cache_in: Costo de activar el caché (write cost)
     * C_store: Costo de almacenamiento por hora
     */
    static calculateNeq(rRatio: number, costIn: number, costCacheIn: number, costStore: number): number {
        return (rRatio * costIn - costCacheIn) / costStore;
    }

    /**
     * Evalúa si una sesión debe ser promocionada a Caché de Contexto.
     * N_eq ≈ 2.5 consultas/hora para Gemini 1.5 Pro.
     */
    static decideTier(queriesPerHour: number): RoutingDecision {
        // Valores promedio industriales para Gemini 1.5 Pro
        const nEq = this.calculateNeq(0.8, 1.25, 0.5, 0.2);
        console.log(`🧮 [Router-Semántico] Calculando N_eq: ${nEq.toFixed(2)} | Actual: ${queriesPerHour} q/h`);

        if (queriesPerHour >= nEq) {
            return {
                tier: 'HOT',
                reason: `Eficiencia económica: ${queriesPerHour} >= N_eq (${nEq.toFixed(2)}). Promocionando a Context Caching.`
            };
        }

        return {
            tier: 'COLD',
            reason: `Eficiencia económica: ${queriesPerHour} < N_eq (${nEq.toFixed(2)}). Manteniendo en Cold Storage (Neon pgvector).`
        };
    }
}
