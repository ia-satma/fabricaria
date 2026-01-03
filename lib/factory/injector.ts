import { Client, FetchConnectionMetadataResult } from '@replit/crosis';
import { HandoffState } from "@/lib/swarm/schema";

interface CrosisContext {
    token: string;
    replId: string;
}

export interface DNAContext {
    ProjectName: string;
    Rules: string;
    AgentsConfig: string;
    Handoff?: HandoffState;
}

export class CrosisInjector {
    static async injectDNA(replId: string, token: string, dna: DNAContext): Promise<boolean> {
        const rulesContent = `# ${dna.ProjectName}\n${dna.Rules}\n\n${dna.AgentsConfig}`;
        if (dna.Handoff) {
            const handoffContext = `\n# Handoff Context\nTarget: ${dna.Handoff.target_role}\nTask: ${dna.Handoff.intent.summary}`;
            return injectAgentConfiguration(replId, token, rulesContent + handoffContext);
        }
        return injectAgentConfiguration(replId, token, rulesContent);
    }
}

export async function injectAgentConfiguration(replId: string, token: string, rulesContent: string) {
    console.log(`💉 Iniciando inyección Crosis en Repl: ${replId}...`);

    const client = new Client<CrosisContext>();

    try {
        await client.open(
            {
                context: {
                    token,
                    replId,
                },
                fetchConnectionMetadata: async (): Promise<FetchConnectionMetadataResult> => ({
                    token,
                    gurl: `wss://eval.replit.com/connect/${replId}`,
                    conmanURL: `https://eval.replit.com`,
                    dotdevHostname: `${replId}.id.repl.co`,
                    error: null,
                }),
            },
            (reason) => {
                console.log("⚠️ Conexión Crosis cerrada o terminada. Razón:", reason);
            }
        );

        console.log("✅ Conexión Crosis establecida. Abriendo canal de archivos...");

        return new Promise<boolean>((resolve, reject) => {
            client.openChannel({ service: 'files' }, ({ channel }) => {
                if (!channel) {
                    console.error("🔴 Error abriendo canal");
                    client.close();
                    reject(new Error("No se pudo abrir el canal"));
                    return;
                }

                console.log("📝 Escribiendo .agent/rules...");
                channel.request({
                    write: {
                        path: '.agent/rules',
                        content: new TextEncoder().encode(rulesContent)
                    }
                }).then(() => {
                    console.log("✅ Inyección completada. Cerrando enlace.");
                    client.close();
                    resolve(true);
                }).catch((err) => {
                    console.error("🔴 Error escribiendo archivo:", err);
                    client.close();
                    reject(err);
                });
            });
        });

    } catch (error) {
        console.error("🔴 Fallo en el protocolo Crosis:", error);
        // Aseguramos el cierre del cliente en caso de error
        client.close();
        throw error;
    }
}
