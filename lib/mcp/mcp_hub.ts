
/**
 * PASO 174: MCP CENTRAL HUB (The Orchestrator)
 * Objetivo: Unificar el acceso a múltiples servidores MCP (GitHub, SendGrid, Neon).
 */

export interface MCPTool {
    name: string;
    server: string;
    execute: (args: any) => Promise<any>;
}

export class MCPHub {
    private tools: Map<string, MCPTool> = new Map();

    constructor() {
        console.log("🕸️ [MCP-Hub] Initializing Central Hub...");
    }

    registerTool(tool: MCPTool) {
        console.log(`🔌 [MCP-Hub] Registering tool: ${tool.name} from server ${tool.server}`);
        this.tools.set(tool.name, tool);
    }

    async callTool(name: string, args: any): Promise<any> {
        const tool = this.tools.get(name);
        if (!tool) {
            throw new Error(`❌ [MCP-Hub] Tool '${name}' not found.`);
        }

        console.log(`📡 [MCP-Hub] Calling tool: ${name} with args:`, args);
        return await tool.execute(args);
    }

    listTools(): string[] {
        return Array.from(this.tools.keys());
    }
}

export const mcpHub = new MCPHub();
