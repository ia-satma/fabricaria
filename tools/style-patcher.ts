
import { Project, SyntaxKind, JsxAttribute } from 'ts-morph';
import path from 'path';

/**
 * THE PLASTIC SURGEON (Step 85)
 * Goal: AST-based JSX attribute manipulation for surgical CSS patching.
 */

export function updateTailwindClasses(filePath: string, testId: string, classesToAdd: string[], classesToRemove: string[]) {
    const project = new Project();
    const sourceFile = project.addSourceFileAtPath(filePath);

    console.log(`🩺 [Surgical-Patch] Opening ${path.basename(filePath)} for micro-surgery on ID: ${testId}`);

    // 1. Find the JSX element with data-testid or id
    const elements = sourceFile.getDescendantsOfKind(SyntaxKind.JsxOpeningElement);
    const targetElement = elements.find(el => {
        const attributes = el.getAttributes();
        return attributes.some(attr => {
            if (attr instanceof JsxAttribute) {
                // Handle different ts-morph versions or missing types
                const name = (attr as any).getNameNode ? (attr as any).getNameNode().getText() : (attr as any).getName();
                const initializer = attr.getInitializer();
                if ((name === 'data-testid' || name === 'id') && initializer?.getText().includes(testId)) {
                    return true;
                }
            }
            return false;
        });
    });

    if (!targetElement) {
        throw new Error(`Component with ID ${testId} not found in ${filePath}`);
    }

    // 2. Find and update className attribute
    const classNameAttr = targetElement.getAttribute('className');
    if (classNameAttr && classNameAttr instanceof JsxAttribute) {
        const initializer = classNameAttr.getInitializer();
        if (initializer && initializer.getKind() === SyntaxKind.StringLiteral) {
            let currentClasses = initializer.getText().replace(/['"]/g, '').split(' ');

            // Remove classes
            currentClasses = currentClasses.filter(c => !classesToRemove.includes(c));

            // Add classes (avoid duplicates)
            classesToAdd.forEach(c => {
                if (!currentClasses.includes(c)) currentClasses.push(c);
            });

            classNameAttr.setInitializer(`'${currentClasses.join(' ')}'`);
            sourceFile.saveSync();
            console.log(`✅ [Surgical-Patch] Surgery successful on ${testId}.`);
        }
    } else {
        // Create className if it doesn't exist
        targetElement.addAttribute({
            name: 'className',
            initializer: `'${classesToAdd.join(' ')}'`
        });
        sourceFile.saveSync();
        console.log(`✅ [Surgical-Patch] Initialized className for ${testId}.`);
    }
}
