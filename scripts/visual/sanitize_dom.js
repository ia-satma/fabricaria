
/**
 * PASO 169: PROTOCOLO "SMART IGNORE" (Visión Estable)
 * Objetivo: Sanitizar el DOM antes de capturas de pantalla para evitar falsos positivos.
 */

(function sanitizeDOMForVisualQA() {
    console.log("📸 [Smart-Ignore] Sanitizing DOM for stable visual capture...");

    const style = document.createElement('style');
    style.innerHTML = `
        /* 1. Congelar animaciones y transiciones */
        *, *::before, *::after {
            animation: none !important;
            transition: none !important;
        }
        
        /* 2. Ocultar elementos volátiles (banners, anuncios, timestamps) */
        .ad-banner, .timestamp, .clock, .live-counter {
            display: none !important;
        }

        /* 3. Enmascarar texto dinámico con bloques neutrales */
        .dynamic-text-node {
            color: transparent !important;
            background-color: #333 !important;
            border-radius: 2px;
        }
    `;
    document.head.appendChild(style);

    // Enmascarar fechas reales si es posible
    const dateRegex = /\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}/g;
    document.querySelectorAll('*').forEach(el => {
        if (el.children.length === 0 && el.textContent && dateRegex.test(el.textContent)) {
            el.textContent = "██/██/████";
            el.classList.add('dynamic-text-node');
        }
    });

    console.log("✅ [Smart-Ignore] DOM is frozen and sanitized.");
})();
