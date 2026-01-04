
import * as fs from 'fs';
import * as path from 'path';

/**
 * PASO 193: EL "KILL SWITCH" GLOBAL (Freno de Emergencia)
 */

const KILL_FLAG_FILE = path.join(process.cwd(), '.agent/KILL_SWITCH_ACTIVE');

export class GlobalKillSwitch {
    /**
     * Activa el freno de mano global.
     */
    static activate() {
        console.warn("🛑 [KILL-SWITCH] ACTIVATING GLOBAL EMERGENCY STOP!");
        if (!fs.existsSync(path.dirname(KILL_FLAG_FILE))) {
            fs.mkdirSync(path.dirname(KILL_FLAG_FILE), { recursive: true });
        }
        fs.writeFileSync(KILL_FLAG_FILE, 'TRUE');
    }

    /**
     * Verifica si la fábrica está en estado de parada.
     */
    static check() {
        if (fs.existsSync(KILL_FLAG_FILE)) {
            console.error("🛑 [KILL-SWITCH] SYSTEM HALTED. Terminating execution.");
            process.exit(1);
        }
    }

    /**
     * Restablece el sistema (solo manual).
     */
    static reset() {
        if (fs.existsSync(KILL_FLAG_FILE)) {
            fs.unlinkSync(KILL_FLAG_FILE);
            console.log("🟢 [KILL-SWITCH] System reset complete.");
        }
    }
}
