
/**
 * DESPLIEGUE CANARIO (Step 136)
 * Objetivo: Rollouts progresivos basados en hash de usuario.
 */

import crypto from 'crypto';

export function isFeatureEnabled(featureName: string, userId: string, rolloutPercentage: number = 5): boolean {
    // Simple deterministic hash-based rollout
    const hash = crypto.createHash('md5').update(userId + featureName).digest('hex');
    const bucket = parseInt(hash.substring(0, 2), 16) % 100;

    const enabled = bucket < rolloutPercentage;
    console.log(`🐤 [Canary] Feature ${featureName} for user ${userId}: ${enabled ? 'ENABLED' : 'DISABLED'} (bucket: ${bucket})`);
    return enabled;
}
