
import { Project, SyntaxKind } from 'ts-morph';
import * as csstree from 'css-tree';
import fs from 'fs';
import path from 'path';

/**
 * PASO 164: EL SANADOR VISUAL (AST Auto-Correction)
 * Objetivo: Modificar quirúrgicamente clases de Tailwind en componentes React usando AST.
 */

export interface VisualPatchInput {
    filePath: string;
    targetId: string; // Basado en data-testid o id
    changes: {
        addClass?: string[];
        removeClass?: string[];
    };
}

export async function applyVisualPatch(input: VisualPatchInput) {
    console.log(`🩹 [Visual-Healer] Attempting AST patch on: ${input.filePath} (target: ${input.targetId})`);

    const project = new Project();
    const sourceFile = project.addSourceFileAtPath(input.filePath);

    // 1. Localizar el elemento por data-testid o id en JSX
    const jsxElements = sourceFile.getDescendantsOfKind(SyntaxKind.JsxOpeningElement);
    const selfClosingElements = sourceFile.getDescendantsOfKind(SyntaxKind.JsxSelfClosingElement);
    const allElements = [...jsxElements, ...selfClosingElements];

    let targetNode = null;

    for (const element of allElements) {
        const attributes = element.getAttributes();
        const hasTarget = attributes.some(attr => {
            if (attr.getKind() === SyntaxKind.JsxAttribute) {
                const name = (attr as any).getName();
                const value = (attr as any).getInitializer()?.getText()?.replace(/['"]/g, '');
                return (name === 'data-testid' || name === 'id') && value === input.targetId;
            }
            return false;
        });

        if (hasTarget) {
            targetNode = element;
            break;
        }
    }

    if (!targetNode) {
        throw new Error(`❌ [Visual-Healer] Target element with ID '${input.targetId}' not found in ${input.filePath}`);
    }

    // 2. Modificar el atributo className
    const classNameAttr = targetNode.getAttribute('className');
    let currentClasses = '';

    if (classNameAttr && classNameAttr.getKind() === SyntaxKind.JsxAttribute) {
        const initializer = (classNameAttr as any).getInitializer();
        if (initializer?.getKind() === SyntaxKind.StringLiteral) {
            currentClasses = initializer.getLiteralText();
        } else if (initializer?.getKind() === SyntaxKind.JsxExpression) {
            // Manejo simplificado, no toca expresiones complejas
            console.warn("⚠️ [Visual-Healer] Complex className detected. Patching might be imprecise.");
            currentClasses = initializer.getExpression()?.getText()?.replace(/['"`]/g, '') || '';
        }
    }

    let classList = currentClasses.split(' ').filter(c => c.trim() !== '');

    // Aplicar cambios
    if (input.changes.removeClass) {
        classList = classList.filter(c => !input.changes.removeClass?.includes(c));
    }
    if (input.changes.addClass) {
        input.changes.addClass.forEach(c => {
            if (!classList.includes(c)) classList.push(c);
        });
    }

    const newClassName = classList.join(' ');

    if (classNameAttr) {
        (classNameAttr as any).setInitializer(`"${newClassName}"`);
    } else {
        targetNode.addAttribute({
            name: 'className',
            initializer: `"${newClassName}"`
        });
    }

    // 3. Guardar cambios quirúrgicamente
    await sourceFile.save();
    console.log(`✅ [Visual-Healer] AST Patch applied. New classes: ${newClassName}`);
}

/**
 * Wrapper for Step 186
 */
export async function apply_visual_patch(filePath: string, targetId: string, classesToAdd: string) {
    return applyVisualPatch({
        filePath,
        targetId,
        changes: { addClass: [classesToAdd] }
    });
}
