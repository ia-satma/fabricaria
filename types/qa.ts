
/**
 * ARTEFACTOS DE VERIFICACIÓN VISUAL (Step 109)
 * Goal: Standardized JSON schema for QA reporting.
 */

export interface VisualDiscrepancy {
    x: number;
    y: number;
    issue: string;
    description: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface VisualVerificationArtifact {
    status: 'PASS' | 'FAIL';
    screenshotPath: string;
    discrepancies: VisualDiscrepancy[];
    vibeScore: number; // 0-100
    timestamp: string;
}
