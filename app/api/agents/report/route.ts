import { NextResponse } from 'next/server';
import { db } from '@/db';
import { agents } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { replId, url, status, name } = body;

        if (!replId) {
            return NextResponse.json({
                success: false,
                error: 'Missing replId'
            }, { status: 400 });
        }

        console.log(`📡 Recibido reporte de agente - Repl: ${replId}, Status: ${status}, URL: ${url}`);

        // Intentar encontrar si el agente ya existe por su replId
        const existingAgent = await db.query.agents.findFirst({
            where: eq(agents.replId, replId),
        });

        if (existingAgent) {
            await db.update(agents)
                .set({
                    url: url || existingAgent.url,
                    status: status || existingAgent.status,
                    updatedAt: new Date()
                })
                .where(eq(agents.replId, replId));

            console.log(`✅ Agente ${replId} actualizado.`);
        } else {
            await db.insert(agents).values({
                replId,
                name: name || `Agent-${replId.substring(0, 6)}`,
                url: url || '',
                status: status || 'active',
            });

            console.log(`✅ Nuevo agente ${replId} registrado.`);
        }

        return NextResponse.json({
            success: true,
            message: 'Status reported successfully'
        });

    } catch (error: any) {
        console.error('❌ Error en /api/agents/report:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Internal Server Error'
        }, { status: 500 });
    }
}
