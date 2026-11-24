import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { distributeReferralCommission } from '@/lib/referral';
import { checkWorkingHours } from '@/lib/workingHours';

const getAdminClient = () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url) throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL');
    if (!key) throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY');
    return createClient(url, key);
};

export async function POST(req: NextRequest) {
    try {
        const { userId, bundleId, bonusAmount, totalAmount, taskId } = await req.json();
        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        const supabaseAdmin = getAdminClient();

        // Check operational working hours
        const { data: whSettings } = await supabaseAdmin
            .from('site_settings')
            .select('key, value')
            .in('key', [
                'working_hours_enabled',
                'working_hours_start',
                'working_hours_end',
                'working_hours_timezone',
                'working_hours_status',
                'working_hours_notice'
            ]);

        const whMap: Record<string, any> = {};
        (whSettings || []).forEach(s => { whMap[s.key] = s.value; });
        const whCheck = checkWorkingHours(whMap);

        if (!whCheck.isOpen) {
            return NextResponse.json({
                error: whCheck.notice || 'The optimization network is currently closed outside operational working hours. Tasks cannot be performed at this time.',
                isClosed: true,
                workingHours: whCheck
            }, { status: 403 });
        }

        // 1. Fetch current profile
        const { data: profile, error: profileFetchErr } = await supabaseAdmin
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (profileFetchErr || !profile) {
            return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
        }

        const profitEarned = Number(bonusAmount || 0);
        const bundleCost = Number(totalAmount || 0);

        const currentWallet = Number(profile.wallet_balance || 0);
        const currentProfit = Number(profile.profit || 0);
        const currentTotalEarned = Number(profile.total_earned || 0);
        const currentCompletedCount = Number(profile.completed_count || 0);

        // Check if there is an unfulfilled shortage
        if (currentWallet < bundleCost && currentWallet < 0) {
            return NextResponse.json({ error: 'Insufficient balance to complete super order' }, { status: 400 });
        }

        const updatedWallet = currentWallet + profitEarned;
        const updatedProfit = currentProfit + profitEarned;
        const updatedTotalEarned = currentTotalEarned + profitEarned;
        const updatedCompletedCount = currentCompletedCount + 1;

        // 2. Update profile with service role (guaranteed to clear pending_bundle to null)
        const { error: profileUpdateErr } = await supabaseAdmin
            .from('profiles')
            .update({
                wallet_balance: updatedWallet,
                profit: updatedProfit,
                total_earned: updatedTotalEarned,
                completed_count: updatedCompletedCount,
                pending_bundle: null
            })
            .eq('id', userId);

        if (profileUpdateErr) {
            console.error("Complete Bundle Profile Update Error:", profileUpdateErr);
            return NextResponse.json({ error: profileUpdateErr.message }, { status: 500 });
        }

        // Distribute multi-tier referral commissions to sponsors
        try {
            await distributeReferralCommission(supabaseAdmin, userId, profitEarned, 'Super Order');
        } catch (refErr) {
            console.warn('Super Order referral commission error:', refErr);
        }

        // 3. Update existing pending task in user_tasks, or create a completed task entry
        // First resolve a guaranteed-valid task_item_id from task_items catalog
        let resolvedTaskItemId: number | null = null;
        const candidateId = Number(taskId || bundleId);
        if (!isNaN(candidateId) && candidateId > 0 && candidateId < 1000000) {
            const { data: itemCheck } = await supabaseAdmin
                .from('task_items')
                .select('id')
                .eq('id', candidateId)
                .maybeSingle();
            if (itemCheck) resolvedTaskItemId = itemCheck.id;
        }

        // Check if profile.pending_bundle had a taskItemIds list
        if (!resolvedTaskItemId && (profile as any)?.pending_bundle?.taskItemIds?.[0]) {
            const candidateFromBundle = Number((profile as any).pending_bundle.taskItemIds[0]);
            if (!isNaN(candidateFromBundle)) {
                const { data: itemCheck } = await supabaseAdmin
                    .from('task_items')
                    .select('id')
                    .eq('id', candidateFromBundle)
                    .maybeSingle();
                if (itemCheck) resolvedTaskItemId = itemCheck.id;
            }
        }

        // Safe fallback to first available task item in catalog
        if (!resolvedTaskItemId) {
            const { data: fallbackItem } = await supabaseAdmin
                .from('task_items')
                .select('id')
                .limit(1)
                .maybeSingle();
            resolvedTaskItemId = fallbackItem?.id || 1931;
        }

        if (taskId) {
            await supabaseAdmin
                .from('user_tasks')
                .update({
                    status: 'completed',
                    earned_amount: profitEarned,
                    cost_amount: bundleCost,
                    is_bundle: true,
                    completed_at: new Date().toISOString()
                })
                .eq('id', taskId);

            // Clean up any other remaining pending tasks for this user so none linger
            await supabaseAdmin
                .from('user_tasks')
                .delete()
                .eq('user_id', userId)
                .eq('status', 'pending');
        } else {
            const { data: pendingTasks } = await supabaseAdmin
                .from('user_tasks')
                .select('id')
                .eq('user_id', userId)
                .eq('status', 'pending');

            if (pendingTasks && pendingTasks.length > 0) {
                await supabaseAdmin
                    .from('user_tasks')
                    .update({
                        status: 'completed',
                        earned_amount: profitEarned,
                        cost_amount: bundleCost,
                        is_bundle: true,
                        completed_at: new Date().toISOString()
                    })
                    .eq('id', pendingTasks[0].id);

                if (pendingTasks.length > 1) {
                    const remainingIds = pendingTasks.slice(1).map(p => p.id);
                    await supabaseAdmin
                        .from('user_tasks')
                        .delete()
                        .in('id', remainingIds);
                }
            } else {
                await supabaseAdmin
                    .from('user_tasks')
                    .insert({
                        user_id: userId,
                        task_item_id: resolvedTaskItemId,
                        status: 'completed',
                        earned_amount: profitEarned,
                        cost_amount: bundleCost,
                        is_bundle: true,
                        completed_at: new Date().toISOString()
                    });
            }
        }

        // 4. Record the super order yield into transaction_ledger
        if (profitEarned > 0) {
            try {
                await supabaseAdmin
                    .from('transaction_ledger')
                    .insert({
                        user_id: userId,
                        amount: profitEarned,
                        type: 'task_rebate',
                        description: 'Super Order Yield Optimization'
                    });
            } catch (ledgerErr) {
                console.warn('Ledger insert non-blocking warning:', ledgerErr);
            }
        }

        return NextResponse.json({
            success: true,
            earned_amount: profitEarned,
            wallet_balance: updatedWallet,
            completed_count: updatedCompletedCount
        });
    } catch (err: any) {
        console.error("Complete Bundle Exception:", err);
        return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
    }
}
