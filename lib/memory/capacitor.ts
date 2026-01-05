
/**
 * PASO 257: EL "CAPACITOR DE PENSAMIENTO" (Buffer Redis/In-Memory)
 * Objetivo: Almacenamiento temporal de alta velocidad para firmas TSIP.
 */

export class ThoughtCapacitor {
    private static buffer: Map<string, { signature: string, expires: number }> = new Map();

    static async set(sessionId: string, signature: string, ttlSeconds: number = 600) {
        console.log(`🔋 [Capacitor] Buffering thought signature for session: ${sessionId}`);
        this.buffer.set(sessionId, {
            signature,
            expires: Date.now() + (ttlSeconds * 1000)
        });
    }

    static async get(sessionId: string): Promise<string | null> {
        const entry = this.buffer.get(sessionId);
        if (!entry) return null;

        if (Date.now() > entry.expires) {
            this.buffer.delete(sessionId);
            return null;
        }

        return entry.signature;
    }

    static flush() {
        this.buffer.clear();
    }
}
