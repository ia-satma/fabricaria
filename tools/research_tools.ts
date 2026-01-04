
import { execSync } from 'child_process';

/**
 * THE INVESTIGATOR PROFUNDO (Step 108)
 * Goal: Verify package existence to avoid hallucinations.
 */

export async function verifyPackage(name: string, ecosystem: 'npm' | 'pypi' = 'npm'): Promise<{ exists: boolean, version?: string, error?: string }> {
    console.log(`🕵️ [Deep-Research] Verifying ${name} in ${ecosystem}...`);

    try {
        if (ecosystem === 'npm') {
            const output = execSync(`npm view ${name} version --silent`).toString().trim();
            return { exists: !!output, version: output };
        } else {
            const output = execSync(`pip index versions ${name} --silent`).toString().trim();
            return { exists: !!output };
        }
    } catch (error: any) {
        console.warn(`⚠️ [Deep-Research] Package ${name} not found or verification failed.`);
        return { exists: false, error: error.message };
    }
}
