import { NextResponse } from 'next/server';
import { injectAgentConfiguration } from '@/lib/factory/injector';
import { getAgentDNA } from '@/lib/factory/templates';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { replId, token } = body;

        if (!replId || !token) {
            return NextResponse.json({
                success: false,
                error: 'Missing replId or token in request body'
            }, { status: 400 });
        }

        console.log(`🚀 Iniciando prueba de inyección para Repl ID: ${replId}`);

        const dnaContent = getAgentDNA('SMOKE-TEST-001');

        const result = await injectAgentConfiguration(replId, token, dnaContent);

        if (result) {
            return NextResponse.json({
                success: true,
                message: 'Injection smoke test completed successfully',
                file: '.agent/rules'
            });
        } else {
            throw new Error('Injection returned false without throwing');
        }

    } catch (error: any) {
        console.error('❌ Error en /api/test-injection:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Internal Server Error'
        }, { status: 500 });
    }
}
