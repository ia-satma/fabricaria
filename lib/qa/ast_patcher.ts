
import { Project, SyntaxKind } from "ts-morph";
import path from "path";

/**
 * PASO 339: MOTOR DE PARCHEO AST
 * Objetivo: Realizar autocorrección quirúrgica de UI sin romper la lógica.
 */
export class ASTPatcher {
    private project: Project;

    constructor() {
        this.project = new Project({
            tsConfigFilePath: path.join(process.cwd(), "tsconfig.json"),
            skipAddingFilesFromTsConfig: true
        });
    }

    async addTailwindClass(filePath: string, elementId: string, className: string) {
        console.log(`🏥💻 [AST-Patcher] Step 339: Injecting class '${className}' into element with ID '${elementId}'...`);

        const sourceFile = this.project.addSourceFileAtPath(filePath);

        // Buscamos JSX elements que tengan el ID o una propiedad específica
        const elements = sourceFile.getDescendantsOfKind(SyntaxKind.JsxOpeningElement);

        for (const el of elements) {
            const props = el.getAttributes();
            const idProp = props.find(p => p.getText().includes(`id="${elementId}"`));

            if (idProp) {
                const classNameProp = props.find(p => p.getText().includes("className="));

                if (classNameProp && classNameProp.isKind(SyntaxKind.JsxAttribute)) {
                    const initializer = classNameProp.getInitializer();
                    if (initializer?.isKind(SyntaxKind.StringLiteral)) {
                        const currentVal = initializer.getLiteralValue();
                        if (!currentVal.includes(className)) {
                            initializer.setLiteralValue(`${currentVal} ${className}`.trim());
                        }
                    }
                } else {
                    el.addAttribute({
                        name: "className",
                        initializer: `"${className}"`
                    });
                }
            }
        }

        await sourceFile.save();
        console.log("✅ [AST-Patcher] Transformation complete and file saved.");
    }
}
