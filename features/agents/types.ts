export type AgentStatus = 'active' | 'booting' | 'failed' | 'idle';

export interface Agent {
    id: string;
    name: string;
    status: AgentStatus;
    replId: string;
    url: string | null;
    tasksCompleted: number;
    cpuLoad: number;
    createdAt: Date;
}
