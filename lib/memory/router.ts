
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
     * PASO 345: CLASIFICADOR DE INTENCIÓN (Semantic Router)
     * Decide si la tarea requiere ver todo el contexto (Cache) o solo fragmentos (RAG).
     */
    static async classifyIntent(prompt: string, client: any): Promise<'CACHE' | 'RAG'> {
        console.log("🚦 [Semantic-Router] Step 345: Classifying intent with Gemini Flash...");

        const classificationPrompt = `
            Clasifica la siguiente consulta para optimización de memoria.
            RESPUESTA EXCLUSIVA: "CACHE" o "RAG".
            
            - Usa "CACHE" si la consulta requiere contexto global, resumen de archivos largos, o auditoría estructural.
            - Usa "RAG" si la consulta es específica, busca un dato puntual, o pregunta sobre una fecha/valor concreto.
            
            CONSULTA: "${prompt}"
        `;

        const result = await client.generateContent(classificationPrompt);
        const intent = result.trim().toUpperCase();

        return intent === 'CACHE' ? 'CACHE' : 'RAG';
    }

    /**
     * Evalúa si una sesión debe ser promocionada a Caché de Contexto.
     * N_eq ≈ 2.5 consultas/hora para Gemini 1.5 Pro.
     */
    static async decideTier(prompt: string, queriesPerHour: number, client: any): Promise<RoutingDecision> {
        const intent = await this.classifyIntent(prompt, client);
        const threshold = 2.5;

        console.log(`🧮 [Router-Semántico] Intent: ${intent} | queries/h: ${queriesPerHour} | Neq: ${threshold}`);

        if (intent === 'CACHE' && queriesPerHour >= threshold) {
            return {
                tier: 'HOT',
                reason: `INTENT_CACHE + Neq_HIT: ${queriesPerHour} >= ${threshold} q/h. Promocionando a Context Caching.`
            };
        }

        return {
            tier: 'COLD',
            reason: `INTENT_${intent}: Manteniendo en Cold Storage (pgvector) para eficiencia de costo.`
        };
    }
}
