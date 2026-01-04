
import crypto from 'crypto';

/**
 * PASO 203: DETECCIÓN DE BUCLES "ZOMBI"
 * Objetivo: Identificar si el agente está repitiendo los mismos errores.
 */
export class ZombieLoopDetector {
    private history: string[] = [];
    private static MAX_HISTORY = 5;

    /**
     * Registra un error o comando y comprueba si hay un bucle.
     */
    checkLoop(errorContent: string): boolean {
        const hash = crypto.createHash('sha256').update(errorContent).digest('hex');
        this.history.push(hash);

        if (this.history.length > ZombieLoopDetector.MAX_HISTORY) {
            this.history.shift();
        }

        // Comprobar si las últimas 3 entradas son idénticas
        if (this.history.length >= 3) {
            const last3 = this.history.slice(-3);
            if (last3.every(h => h === last3[0])) {
                console.error("🧟‍♂️ [Zombie-Detector] Loop detected! Same error hash repeated 3 times.");
                return true;
            }
        }

        return false;
    }

    reset() {
        this.history = [];
    }
}

export const zombieDetector = new ZombieLoopDetector();
