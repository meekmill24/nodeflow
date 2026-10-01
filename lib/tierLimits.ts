export interface TierWithdrawalLimits {
    min: number; // 30 (minimum withdrawal across all levels)
    tierMin: number; // 100 | 1500 | 2500 | 5000
    tierMax: number; // 1499 | 2499 | 4999 | Infinity
    max: number; // 1499 | 2499 | 4999 | Infinity
    tierRangeLabel: string; // "$100 – $1,499" | "$1,500 – $2,499" | "$2,500 – $4,999" | "$5,000 to Any Amount"
    maxLabel: string;
    minLabel: string;
    tierName: string;
}

/**
 * Platform Canonical Withdrawal Limits:
 * Minimum across ALL levels: $30
 *
 * Exact User Defined Tier Ranges:
 * Junior: $100 – $1,499
 * Intermediate: $1,500 – $2,499
 * Senior: $2,500 – $4,999
 * Mentor: $5,000 to Any Amount
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

    // Mentor Agent: 5000 to any amount
    if (id >= 4 || price >= 5000 || name.includes('mentor')) {
        return {
            min: effectiveMin,
            tierMin: 5000,
            tierMax: Infinity,
            max: Infinity,
            tierRangeLabel: '$5,000 to Any Amount',
            maxLabel: 'Unlimited',
            minLabel: `$${effectiveMin}`,
            tierName: 'Mentor Agent'
        };
    }

    // Senior Agent: 2500 - 4999
    if (id === 3 || (price >= 1500 && price < 5000) || name.includes('senior')) {
        return {
            min: effectiveMin,
            tierMin: 2500,
            tierMax: 4999,
            max: 4999,
            tierRangeLabel: '$2,500 – $4,999',
            maxLabel: '$4,999',
            minLabel: `$${effectiveMin}`,
            tierName: 'Senior Agent'
        };
    }

    // Intermediate Agent: 1500 - 2499
    if (id === 2 || (price >= 500 && price < 1500) || name.includes('intermediate')) {
        return {
            min: effectiveMin,
            tierMin: 1500,
            tierMax: 2499,
            max: 2499,
            tierRangeLabel: '$1,500 – $2,499',
            maxLabel: '$2,499',
            minLabel: `$${effectiveMin}`,
            tierName: 'Intermediate Agent'
        };
    }

    // Junior Agent: 100 - 1499
    return {
        min: effectiveMin,
        tierMin: 100,
        tierMax: 1499,
        max: 1499,
        tierRangeLabel: '$100 – $1,499',
        maxLabel: '$1,499',
        minLabel: `$${effectiveMin}`,
        tierName: 'Junior Agent'
    };
}
