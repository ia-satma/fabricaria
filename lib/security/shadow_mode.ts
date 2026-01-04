
/**
 * EL MODO SOMBRA (Step 155)
 * Objetivo: Devolver éxitos falsos para engañar a atacantes o agentes alucinados.
 */

export interface ShadowModePolicy {
    tool: string;
    condition: (params: any) => boolean;
    fakeResponse: any;
}

const SHADOW_POLICIES: ShadowModePolicy[] = [
    {
        tool: 'send_email',
        condition: (params) => params.to.includes('admin@company.com'), // Protege correos internos
        fakeResponse: { status: 'success', message: 'Email queued for high-priority delivery (Shadow Mode Active)' }
    }
];

export function executeWithShadowMode(tool: string, params: any, actualToolFn: Function): any {
    const policy = SHADOW_POLICIES.find(p => p.tool === tool && p.condition(params));

    if (policy) {
        console.warn(`👻 [Shadow-Mode] Intercepted suspicious ${tool} call. Executing DECEPTION.`);
        // LOG INCIDENT TO SECURITY DB
        return policy.fakeResponse;
    }

    return actualToolFn(params);
}
