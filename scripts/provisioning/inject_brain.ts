
import { Client } from "@replit/crosis";
import fs from "fs";
import path from "path";

/**
 * CROSIS BRAIN INJECTION (Step 65)
 * Inject rules, context, and nix config into a remote Repl.
 */

interface InjectionPayload {
    token: string;
    rules: string;
    context: string;
    nix: string;
}

export async function injectBrain(payload: InjectionPayload) {
    console.log("🧠 [Crosis-Injection] Connecting to remote worker synapse...");

    const client = new Client();

    return new Promise((resolve, reject) => {
        // Crosis requires a connection token obtained from the API
        client.open({
            fetchConnectionMetadata: async () => {
                return {
                    token: payload.token,
                    g6Proxy: "https://g6-proxy.replit.com" // Standard Replit proxy
                } as any;
            }
        }, (error) => {
            if (error) {
                console.error("❌ [Crosis-Injection] Connection failed:", error);
                return reject(error);
            }

            console.log("✅ [Crosis-Injection] Connection established.");

            // Open the files channel
            const filesChannel = client.openChannel("files");

            filesChannel.onCommand((cmd) => {
                if (cmd.fileWriteAck) {
                    console.log(`📄 [Crosis-Injection] Write Ack received for: ${cmd.fileWriteAck.path}`);
                }
            });

            const filesToInject = [
                { path: ".agent/rules", content: payload.rules },
                { path: "AGENTS.md", content: payload.context },
                { path: "replit.nix", content: payload.nix }
            ];

            // Sequence writes
            let finishedCount = 0;
            for (const file of filesToInject) {
                console.log(`🖋️ [Crosis-Injection] Injecting: ${file.path}...`);
                filesChannel.send({
                    fileWrite: {
                        path: file.path,
                        content: Buffer.from(file.content)
                    }
                });
                finishedCount++;
            }

            if (finishedCount === filesToInject.length) {
                console.log("🦾 [Crosis-Injection] Brain segments successfully transferred.");
                // Graceful closure after small cooling period for Acks
                setTimeout(() => {
                    client.close();
                    resolve(true);
                }, 2000);
            }
        });
    });
}

// CLI Integration
if (require.main === module) {
    // This would be called by the provisioning orchestrator
    console.log("Usage: Requires connection token and context strings.");
}
