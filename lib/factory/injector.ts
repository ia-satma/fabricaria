import { Client } from '@replit/crosis';

// Definimos la interfaz del contexto para evitar la inferencia 'null'
interface CrosisContext {
    token: string;
    replId: string;
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
                // Función requerida para refrescar metadatos si la conexión cae
                fetchConnectionMetadata: async () => ({
                    token,
                    replId,
                }),
            },
            // Callback de cierre requerido por la firma de la función
            (reason) => {
                console.log("⚠️ Conexión Crosis cerrada o terminada. Razón:", reason);
            }
        );

        console.log("✅ Conexión Crosis establecida. Abriendo canal de archivos...");

        // Apertura del canal de archivos (Servicio 'files')
        const filesChannel = client.openChannel({ service: 'files' });

        // Esperar a que el canal esté listo (handshake completado)
        await filesChannel.promise;

        // Escritura atómica de reglas
        console.log("📝 Escribiendo .agent/rules...");
        await filesChannel.request({
            write: {
                path: '.agent/rules',
                content: rulesContent
            }
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
