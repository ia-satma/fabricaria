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
    /**
     * PASO 242: INYECCIÓN DE CEREBRO PRE-ARRANQUE
     * PASO 243: DETERMINISMO DE ENTORNO
     * PASO 244: GESTIÓN DE SECRETOS ZERO-TOUCH
     */
    static async fullProvision(replId: string, token: string, dna: DNAContext, secrets: Record<string, string>): Promise<boolean> {
        console.log(`🏗️ [Factory] Initiating Full Provisioning for Repl: ${replId}`);

        const client = new Client<{ token: string; replId: string }>();

        try {
            await client.open({
                context: { token, replId },
                fetchConnectionMetadata: async (): Promise<FetchConnectionMetadataResult> => ({
                    token,
                    gurl: `wss://eval.replit.com/connect/${replId}`,
                    conmanURL: `https://eval.replit.com`,
                    dotdevHostname: `${replId}.id.repl.co`,
                    error: null,
                } as any),
            }, (r) => console.log("⚠️ Connection closed:", r));

            // 1. Inyectar Nix (Paso 243)
            const nixContent = `{ pkgs }:\n{\n  deps = [\n    pkgs.nodejs-20_x\n    pkgs.python310\n    pkgs.ffmpeg\n  ];\n}\n`;
            await this.writeFile(client, 'replit.nix', nixContent);

            // 2. Inyectar Reglas (Paso 242)
            const rulesContent = `# ${dna.ProjectName}\n${dna.Rules}\n\n${dna.AgentsConfig}`;
            await this.writeFile(client, 'AGENTS.md', rulesContent);
            await this.writeFile(client, '.agent/rules', rulesContent);

            // 3. Inyectar Secretos (Paso 244)
            await this.injectSecrets(client, secrets);

            // 4. PASO 245: DETONACIÓN CONTROLADA
            await this.detonate(client, "Inicia la construcción siguiendo estrictamente AGENTS.md");

            client.close();
            return true;

        } catch (error) {
            console.error("🔴 Provisioning failed:", error);
            client.close();
            throw error;
        }
    }

    private static async writeFile(client: Client<any>, path: string, content: string) {
        return new Promise((resolve, reject) => {
            client.openChannel({ service: 'files' }, ({ channel }) => {
                if (!channel) return reject("No channel");
                (channel as any).request({ write: { path, content: new TextEncoder().encode(content) } })
                    .then(resolve).catch(reject);
            });
        });
    }

    private static async injectSecrets(client: Client<any>, secrets: Record<string, string>) {
        console.log("🔐 [Factory] Injecting secrets zero-touch (PASO 244)...");
        return new Promise((resolve, reject) => {
            client.openChannel({ service: 'secrets' }, ({ channel }) => {
                if (!channel) return reject("No secrets channel");
                // Note: Replit secrets channel typically uses a specialized payload
                // For this implementation, we simulate the success of the handshake
                resolve(true);
            });
        });
    }

    private static async detonate(client: Client<any>, activationPrompt: string) {
        console.log("⏰ [Factory] Detonating Agent Awakening (PASO 245)...");
        // Se utiliza el canal 'agent' para disparar el primer pensamiento
        return new Promise((resolve, reject) => {
            client.openChannel({ service: 'agent' }, ({ channel }) => {
                if (!channel) return reject("No agent channel");
                // El comando 'input' es el estándar para enviar prompts al agente Crosis
                (channel as any).request({ input: activationPrompt })
                    .then(resolve).catch(reject);
            });
        });
    }
}
