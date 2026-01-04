export interface BlueprintArtifact {
    id: string;
    type: 'code' | 'schema' | 'config' | 'documentation';
    content: string;
    metadata: Record<string, any>;
}

export interface FabricationJob {
    id: string;
    goal: string;
    artifacts: BlueprintArtifact[];
    status: 'pending' | 'in-progress' | 'completed' | 'failed';
}
