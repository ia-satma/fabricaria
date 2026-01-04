
/**
 * SET-OF-MARK (SoM) INJECTION SCRIPT (Step 56)
 * Injects numbered labels over interactive elements for visual grounding.
 */

(function injectSoM() {
    const interactors = document.querySelectorAll('button, a, input, select, textarea, [role="button"]');

    interactors.forEach((el, index) => {
        const rect = el.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;

        const label = document.createElement('div');
        label.innerText = index;
        label.style.position = 'fixed';
        label.style.top = `${rect.top}px`;
        label.style.left = `${rect.left}px`;
        label.style.background = 'rgba(255, 0, 0, 0.8)';
        label.style.color = 'white';
        label.style.fontSize = '12px';
        label.style.fontWeight = 'bold';
        label.style.padding = '2px 4px';
        label.style.border = '1px solid black';
        label.style.borderRadius = '3px';
        label.style.zIndex = '999999';
        label.style.pointerEvents = 'none';
        label.className = 'som-label';

        document.body.appendChild(label);

        // Outline the element
        (el as HTMLElement).style.outline = '2px solid red';
    });

    console.log(`🎯 [SoM] Injected ${interactors.length} markers.`);
})();
