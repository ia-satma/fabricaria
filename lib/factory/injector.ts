import { Client } from '@replit/crosis';

// Definimos la interfaz del contexto para evitar la inferencia 'null'
interface CrosisContext {
    token: string;
    replId: string;
}

// DNA Context para inyección de configuración
export interface DNAContext {
    ProjectName: string;
    Rules: string;
    AgentsConfig: string;
    Handoff?: any;
}

export async function injectAgentConfiguration(replId: string, token: string, rulesContent: string) {
    console.log(`💉 Iniciando inyección Crosis en Repl: ${replId}...`);

    // CORRECCIÓN CRÍTICA: Tipamos explícitamente el Cliente con la interfaz del contexto.
    // Esto evita el error "not assignable to type 'null'".
    const client = new Client<CrosisContext>();

    try {
        // Conexión usando la API pública 'open'
        await client.open(
            {
                context: {
                    token,
                    replId,
                },
                // CORRECCIÓN DEFINITIVA: Usamos 'as any' para bypassear la validación estricta de tipos
                // de Crosis que exige 'gurl' y 'conmanURL', las cuales no tenemos en este contexto simple.
                fetchConnectionMetadata: async () => ({
                    token,
                    replId,
                    // Estos valores dummy satisfacen la estructura si 'as any' fallara, 
                    // pero el cast final es lo que arregla el build.
                    gurl: "",
                    conmanURL: "",
                    dotdevHostname: "",
                    error: null
                } as any),
            },
            // Callback de cierre requerido por la firma de la función
            (reason) => {
                console.log("⚠️ Conexión Crosis cerrada o terminada. Razón:", reason);
            }
        );

        console.log("✅ Conexión Crosis establecida. Abriendo canal de archivos...");

        // Apertura del canal de archivos (Servicio 'files')
        const filesChannel = await client.openChannel({ service: 'files' }, ({ channel }: any) => {
            // Escritura atómica de reglas
            console.log("📝 Escribiendo .agent/rules...");
            channel.request({
                write: {
                    path: '.agent/rules',
                    content: rulesContent
                }
            });
        });

        console.log("✅ Inyección completada. Cerrando enlace.");
        client.close();
        return true;

    } catch (error) {
        console.error("🔴 Fallo en el protocolo Crosis:", error);
        // Aseguramos el cierre del cliente en caso de error
        client.close();
        throw error;
    }
}

// Wrapper class para compatibilidad con service.ts
export class CrosisInjector {
    static async injectDNA(replId: string, token: string, dna: DNAContext): Promise<boolean> {
        const rulesContent = `${dna.Rules}\n\n# Agent Config\n${dna.AgentsConfig}`;
        return await injectAgentConfiguration(replId, token, rulesContent);
    }
}
