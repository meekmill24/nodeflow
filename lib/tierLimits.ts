export interface TierWithdrawalLimits {
    min: number;
    max: number; // finite number or Infinity
    maxLabel: string;
    minLabel: string;
    tierName: string;
}

/**
 * Platform Canonical Withdrawal Limits:
 * Minimum across ALL levels: $30
 * Single Withdrawal Tier Max Quotas:
 * Junior: $1,499 (Range: $30 - $1,499)
 * Intermediate: $2,499 (Range: $30 - $2,499)
 * Senior: $4,999 (Range: $30 - $4,999)
 * Mentor: Any amount / Unlimited (Range: $30 to Any Amount)
 */
export function getTierWithdrawalLimits(
    levelId?: number | null,
    levelPrice?: number | null,
    levelName?: string | null,
    overrideMin?: number | null
): TierWithdrawalLimits {
    const id = Number(levelId || 1);
    const price = Number(levelPrice || 0);
    const name = (levelName || '').toLowerCase();
    const effectiveMin = typeof overrideMin === 'number' && overrideMin > 0 ? overrideMin : 30;

    // Mentor: 30 to any amount (Unlimited)
    if (id >= 4 || price >= 5000 || name.includes('mentor')) {
        return {
            min: effectiveMin,
            max: Infinity,
            maxLabel: 'Unlimited',
            minLabel: `$${effectiveMin}`,
            tierName: 'Mentor Agent'
        };
    }

    // Senior: 30 to 4999
    if (id === 3 || (price >= 1500 && price < 5000) || name.includes('senior')) {
        return {
            min: effectiveMin,
            max: 4999,
            maxLabel: '$4,999',
            minLabel: `$${effectiveMin}`,
            tierName: 'Senior Agent'
        };
    }

    // Intermediate: 30 to 2499
    if (id === 2 || (price >= 500 && price < 1500) || name.includes('intermediate')) {
        return {
            min: effectiveMin,
            max: 2499,
            maxLabel: '$2,499',
            minLabel: `$${effectiveMin}`,
            tierName: 'Intermediate Agent'
        };
    }

    // Junior: 30 to 1499
    return {
        min: effectiveMin,
        max: 1499,
        maxLabel: '$1,499',
        minLabel: `$${effectiveMin}`,
        tierName: 'Junior Agent'
    };
}
