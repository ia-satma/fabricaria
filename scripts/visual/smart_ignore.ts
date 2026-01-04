
/**
 * PASO 210: QA VISUAL CON "SMART IGNORE"
 * Objetivo: Limpiar el DOM de elementos ruidosos antes de capturas de pantalla.
 */

export const SMART_IGNORE_CSS = `
    /* Detener todas las animaciones y transiciones */
    *, *::before, *::after {
        animation: none !important;
        transition: none !important;
    }

    /* Enmascarar fechas y contenido dinámico */
    [data-qa-mask], 
    .dynamic-date, 
    .timestamp {
        color: transparent !important;
        background-color: #334155 !important; /* Slate-700 */
        border-radius: 4px;
    }
`;

export function applySmartIgnore(page: any) {
    console.log("👁️ [Smart-Ignore] Injecting stabilization CSS into browser...");
    return page.addStyleTag({ content: SMART_IGNORE_CSS });
}
