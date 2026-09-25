import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

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

        // 3. Update existing pending task in user_tasks, or clean up pending tasks
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
                const numericId = typeof bundleId === 'string' ? Number(bundleId.replace(/\D/g, '')) : Number(bundleId);
                const taskItemId = !isNaN(numericId) && numericId > 0 ? numericId : 2171;
                await supabaseAdmin
                    .from('user_tasks')
                    .insert({
                        user_id: userId,
                        task_item_id: taskItemId,
                        status: 'completed',
                        earned_amount: profitEarned,
                        cost_amount: bundleCost,
                        is_bundle: true,
                        completed_at: new Date().toISOString()
                    });
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
