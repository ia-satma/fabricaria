/**
 * THE SEMANTIC ROUTER (Middleware)
 * Decides whether to route a query to Cold Memory (RAG) or Hot Memory (Context Cache).
 */

export interface RoutingDecision {
    route: "RAG" | "CACHE";
    reason: string;
}

export class SemanticRouter {
    /**
     * Analyzes the intent of the query and decides the best path.
     * 
     * RAG (Cold Memory) is preferred for:
     * - Specific fact retrieval ("What is my balance?")
     * - Short queries (< 50 words)
     * - Searching for past specific events
     * 
     * CACHE (Hot Memory) is preferred for:
     * - Global analysis ("Summarize my history")
     * - Complex reasoning over large context
     * - Long conversations where continuity is key
     */
    static routeQuery(query: string): RoutingDecision {
        const lowercaseQuery = query.toLowerCase();

        // 1. Check for specific intent keywords (Heuristic for RAG)
        const specificKeywords = [
            "buscar", "encuentra", "dónde", "cuándo", "saldo", "factura",
            "dato", "específico", "recuerdo", "ayer", "dije", "qué hice"
        ];

        // 2. Check for global analysis keywords (Heuristic for CACHE)
        const analysisKeywords = [
            "resume", "analiza", "todo", "historial", "patrones",
            "contexto", "global", "explicame", "entiendes"
        ];

        // 3. Length heuristic
        const isLongQuery = query.split(" ").length > 50;

        if (isLongQuery) {
            return {
                route: "CACHE",
                reason: "Query is complex/long, requires full context awareness."
            };
        }

        const hasAnalysisIntent = analysisKeywords.some(k => lowercaseQuery.includes(k));
        if (hasAnalysisIntent) {
            return {
                route: "CACHE",
                reason: "User requested high-level analysis or summary."
            };
        }

        const hasSpecificIntent = specificKeywords.some(k => lowercaseQuery.includes(k));
        if (hasSpecificIntent) {
            return {
                route: "RAG",
                reason: "User requested specific information lookup."
            };
        }

        // Default to RAG for efficiency on ambiguous short queries, 
        // to save Cache costs unless necessary.
        return {
            route: "RAG",
            reason: "Defaulting to RAG for efficiency on short/ambiguous query."
        };
    }
}
