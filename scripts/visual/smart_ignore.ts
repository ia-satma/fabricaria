
/**
 * PASO 316: PROTOCOLO "SMART IGNORE"
 * Objetivo: Limpiar el DOM de elementos ruidosos antes de capturas de pantalla.
 */

export const SMART_IGNORE_STYLES = `
    * { 
        animation: none !important; 
        transition: none !important; 
        caret-color: transparent !important;
    }
    .dynamic-data, .timestamp, .dynamic-date, .user-avatar { 
        filter: blur(10px) !important;
        background: #1e293b !important; 
    }
    .som-marker {
        position: absolute;
        top: 0; left: 0;
        background: rgba(0, 240, 255, 0.8);
        color: black;
        font-family: monospace;
        font-size: 10px;
        padding: 2px;
        z-index: 9999;
        pointer-events: none;
    }
`;

export function sanitizeDOMForVision() {
    console.log("🙈✨ [Smart-Ignore-V2] Step 337: Sanitizing DOM for structural comparison.");
    // Reemplazar texto dinámico por bloques sólidos para evitar distracciones semánticas
    const elements = document.querySelectorAll('span, p, h1, h2, h3');
    elements.forEach(el => {
        if (el.children.length === 0 && el.textContent?.trim() && !el.classList.contains('som-marker')) {
            el.textContent = "████████";
        }
    });
}
