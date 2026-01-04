
export interface HandoffPacket {
    taskId: string;
    sourceAgent: 'ARCHITECT' | 'CODER' | 'QA' | 'RESEARCH';
    targetAgent: 'ARCHITECT' | 'CODER' | 'QA' | 'RESEARCH';
    contextSummary: string;
    artifacts: string[]; // Paths or IDs of artifacts in DB
    status: 'PENDING' | 'COMPLETED' | 'FAILED';
    timestamp: string;
}
