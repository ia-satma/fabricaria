
import { test, expect } from '@playwright/test';
import { GeminiClient } from '../../lib/ai/gemini-client';

/**
 * EL CONTADOR DE COSTOS (Step 129)
 * Objetivo: Verificar que el Circuit Breaker corta la ejecución ante un bucle de tokens.
 */

test.describe('FinOps Circuit Breaker', () => {
    test('Should abort when thinking tokens exceed budget', async ({ }) => {
        console.log("💸 [FinOps-Test] Simulating infinite thinking loop...");

        const client = new GeminiClient("gemini-1.5-pro", "FINOPS_TEST");
        const infinitePrompt = "Genera una lista infinita de números primos y describe cada uno con 10 párrafos de pensamiento profundo.";

        // We expect the client to throw THOUGHT_BUDGET_EXCEEDED
        try {
            await client.generateContent(infinitePrompt);
            // If it doesn't throw, we fail the test
            throw new Error("Test failed: Circuit breaker did not catch the infinite loop.");
        } catch (error: any) {
            console.log(`✅ [FinOps-Test] Caught expected error: ${error.message}`);
            expect(error.message).toBe("THOUGHT_BUDGET_EXCEEDED");
        }
    });
});
