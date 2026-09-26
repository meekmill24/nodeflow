import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Distributes multi-tier referral commissions up to 3 levels (Tier 1, 2, 3)
 * Inspired by SimpleMoneys & Captiv8 affiliate commission models.
 * Automatically credits wallet_balance, referral_earned, logs transactions and sends notifications.
 */
export async function distributeReferralCommission(
    supabaseAdmin: SupabaseClient,
    contributorUserId: string,
    profitEarned: number,
    sourceDescription: string = 'Optimization Task'
) {
    if (!contributorUserId || profitEarned <= 0) return { success: false, distributed: 0 };

    try {
        // 1. Fetch contributor details
        const { data: contributor, error: cErr } = await supabaseAdmin
            .from('profiles')
            .select('id, username, referred_by, referral_code_used')
            .eq('id', contributorUserId)
            .maybeSingle();

        if (cErr || !contributor || (!contributor.referred_by && !contributor.referral_code_used)) {
            return { success: true, distributed: 0, reason: 'No referrer found' };
        }

        // 2. Fetch commission percentage rates from site_settings (defaults: L1=20%, L2=10%, L3=5%)
        const { data: settings } = await supabaseAdmin
            .from('site_settings')
            .select('key, value')
            .in('key', ['referral_commission_l1', 'referral_commission_l2', 'referral_commission_l3', 'referral_task_percentage']);

        const l1Rate = parseFloat(
            settings?.find(s => s.key === 'referral_commission_l1')?.value ||
            settings?.find(s => s.key === 'referral_task_percentage')?.value ||
            '20'
        );
        const l2Rate = parseFloat(settings?.find(s => s.key === 'referral_commission_l2')?.value || '10');
        const l3Rate = parseFloat(settings?.find(s => s.key === 'referral_commission_l3')?.value || '5');

        const tierRates = [
            { tier: 1, rate: l1Rate },
            { tier: 2, rate: l2Rate },
            { tier: 3, rate: l3Rate }
        ];

        let currentReferrerId: string | null = contributor.referred_by;

        // If referred_by is null but referral_code_used exists, resolve to user ID
        if (!currentReferrerId && contributor.referral_code_used) {
            const { data: sponsorByCode } = await supabaseAdmin
                .from('profiles')
                .select('id')
                .eq('referral_code', contributor.referral_code_used.toUpperCase())
                .maybeSingle();
            currentReferrerId = sponsorByCode?.id || null;
        }

        let totalDistributed = 0;
        const username = contributor.username || 'Contributor';

        for (const { tier, rate } of tierRates) {
            if (!currentReferrerId || currentReferrerId === contributorUserId) break;

            const { data: sponsor, error: sErr } = await supabaseAdmin
                .from('profiles')
                .select('id, username, wallet_balance, referral_earned, referred_by, referral_code_used')
                .eq('id', currentReferrerId)
                .maybeSingle();

            if (sErr || !sponsor) break;

            const commissionAmount = parseFloat(((profitEarned * rate) / 100).toFixed(4));

            if (commissionAmount > 0) {
                const newWallet = Number(sponsor.wallet_balance || 0) + commissionAmount;
                const newReferralEarned = Number(sponsor.referral_earned || 0) + commissionAmount;

                // Credit sponsor's profile
                await supabaseAdmin
                    .from('profiles')
                    .update({
                        wallet_balance: newWallet,
                        referral_earned: newReferralEarned,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', sponsor.id);

                // Insert into transactions
                await supabaseAdmin.from('transactions').insert({
                    user_id: sponsor.id,
                    type: 'commission',
                    amount: commissionAmount,
                    description: `Tier ${tier} Team Yield (${rate}%) from @${username} [${sourceDescription}]`,
                    status: 'approved'
                });

                // Insert into transaction_ledger if exists
                try {
                    await supabaseAdmin.from('transaction_ledger').insert({
                        user_id: sponsor.id,
                        type: 'commission',
                        amount: commissionAmount,
                        description: `Tier ${tier} Team Yield (${rate}%) from @${username}`
                    });
                } catch {
                    // optional table
                }

                // In-app notification
                try {
                    await supabaseAdmin.from('notifications').insert({
                        user_id: sponsor.id,
                        title: `Tier ${tier} Commission +$${commissionAmount.toFixed(2)} 🎉`,
                        message: `Earned $${commissionAmount.toFixed(2)} (${rate}%) commission from team member @${username}'s completed ${sourceDescription}.`,
                        type: 'success',
                        is_read: false
                    });
                } catch {
                    // notification fallback
                }

                totalDistributed += commissionAmount;
            }

            // Move to next sponsor in chain
            let nextReferrerId: string | null = sponsor.referred_by;
            if (!nextReferrerId && sponsor.referral_code_used) {
                const { data: nextByCode } = await supabaseAdmin
                    .from('profiles')
                    .select('id')
                    .eq('referral_code', sponsor.referral_code_used.toUpperCase())
                    .maybeSingle();
                nextReferrerId = nextByCode?.id || null;
            }

            currentReferrerId = nextReferrerId;
        }

        return { success: true, distributed: totalDistributed };
    } catch (err: any) {
        console.error('Error distributing referral commission:', err);
        return { success: false, error: err.message };
    }
}
