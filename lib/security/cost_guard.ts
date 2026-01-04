
/**
 * PASO 187: EL GOBERNADOR FINANCIERO (Cost Guard)
 * Objetivo: Circuit Breaker de tokens para evitar quiebra técnica.
 */

export class CostGuard {
    private static SESSION_BUDGET_USD = 5.00;
    private static sessionCosts: Map<string, number> = new Map();

    static async trackAndVerify(sessionId: string, tokensCount: number, model: string) {
        // Estimación rápida de coste (ej. $15 por 1M tokens en Pro)
        const costPerToken = model.includes('pro') ? 0.000015 : 0.000001;
        const callCost = tokensCount * costPerToken;

        const currentTotal = (this.sessionCosts.get(sessionId) || 0) + callCost;
        this.sessionCosts.set(sessionId, currentTotal);

        console.log(`💸 [CostGuard] Session ${sessionId} Spend: $${currentTotal.toFixed(4)} / $${this.SESSION_BUDGET_USD}`);

        if (currentTotal > this.SESSION_BUDGET_USD) {
            console.error("🛑 [CostGuard] BUDGET EXCEEDED! Activating Circuit Breaker.");
            throw new Error(`FINANCIAL_CIRCUIT_BREAKER: Session ${sessionId} exceeded max budget of $${this.SESSION_BUDGET_USD}`);
        }
    }

    static resetSession(sessionId: string) {
        this.sessionCosts.delete(sessionId);
    }
}
