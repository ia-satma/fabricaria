export interface BlueprintArtifact {
    id: string;
    type: 'code' | 'architecture' | 'review';
    content: string;
    metadata: Record<string, any>;
    techStack?: string[];
    databaseSchema?: Record<string, any>;
    apiEndpoints?: string[];
    frontendComponents?: string[];
    dependencies?: { name: string; version: string; purpose: string; confidence: 'HIGH' | 'LOW' }[];
    riskAnalysis?: { description: string; impact: 'HIGH' | 'MEDIUM' | 'LOW'; mitigation: string }[];
    cached?: boolean;
}

export interface FabricationJob {
    id: string;
    goal: string;
    artifacts: BlueprintArtifact[];
    status: 'pending' | 'in-progress' | 'completed' | 'failed';
}
