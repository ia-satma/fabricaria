import { Client } from '@replit/crosis'; // Importación correcta según SDK
// Si necesitas WebSocket nativo en Node, asegúrate de tener 'ws' instalado y configurado
// import WebSocket from "ws"; 

export async function injectAgentConfiguration(replId: string, token: string, rulesContent: string) {
    console.log(`💉 Iniciando inyección Crosis en Repl: ${replId}...`);

    const client = new Client();

    try {
        // CORRECCIÓN: Se añade el segundo argumento requerido (callback de cierre)
        await client.open(
            {
                context: {
                    token,
                    replId,
                },
                fetchConnectionMetadata: async () => ({
                    token,
                }),
            },
            // 👇 ESTE ES EL ARGUMENTO QUE FALTABA:
            (reason) => {
                console.log("⚠️ Conexión Crosis cerrada. Razón:", reason);
            }
        );

        console.log("✅ Conexión Crosis establecida.");

        // Apertura del canal de archivos (Servicio 'files')
        const filesChannel = client.openChannel({ service: 'files' });
        await filesChannel.promise; // Esperar handshake

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
        client.close();
        throw error;
    }
}
