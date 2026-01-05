
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
    .dynamic-data, .timestamp, .dynamic-date { 
        color: transparent !important; 
        background: #334155 !important; 
    }
`;

export function sanitizeDOMForVision() {
    // Reemplazar texto dinámico por placeholders estables
    const elements = document.querySelectorAll('span, p, h1, h2, h3, div');
    elements.forEach(el => {
        if (el.children.length === 0 && el.textContent?.trim()) {
            el.textContent = "████████";
        }
    });
}
