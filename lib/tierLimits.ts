export interface TierWithdrawalLimits {
    min: number;
    max: number; // finite number or Infinity
    maxLabel: string;
    minLabel: string;
    tierName: string;
}

/**
 * Platform Canonical Withdrawal Limits:
 * Junior: 100 - 1499
 * Intermediate: 1500 - 2499
 * Senior: 2500 - 4999
 * Mentor: 5000 to any amount (Unlimited)
 */
export function getTierWithdrawalLimits(
    levelId?: number | null,
    levelPrice?: number | null,
    levelName?: string | null
): TierWithdrawalLimits {
    const id = Number(levelId || 1);
    const price = Number(levelPrice || 0);
    const name = (levelName || '').toLowerCase();

    // Mentor: 5000 to any amount
    if (id >= 4 || price >= 5000 || name.includes('mentor')) {
        return {
            min: 5000,
            max: Infinity,
            maxLabel: 'Unlimited',
            minLabel: '$5,000',
            tierName: 'Mentor Agent'
        };
    }

    // Senior: 2500 - 4999
    if (id === 3 || (price >= 1500 && price < 5000) || name.includes('senior')) {
        return {
            min: 2500,
            max: 4999,
            maxLabel: '$4,999',
            minLabel: '$2,500',
            tierName: 'Senior Agent'
        };
    }

    // Intermediate: 1500 - 2499
    if (id === 2 || (price >= 500 && price < 1500) || name.includes('intermediate')) {
        return {
            min: 1500,
            max: 2499,
            maxLabel: '$2,499',
            minLabel: '$1,500',
            tierName: 'Intermediate Agent'
        };
    }

    // Junior: 100 - 1499
    return {
        min: 100,
        max: 1499,
        maxLabel: '$1,499',
        minLabel: '$100',
        tierName: 'Junior Agent'
    };
}
