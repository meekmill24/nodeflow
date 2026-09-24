import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
        if (!url || !key) {
            return NextResponse.json({ error: 'Supabase credentials missing.' }, { status: 500 });
        }

        const supabaseAdmin = createClient(url, key);
        const body = await req.json();
        const { userId, amount, network, walletAddress } = body;

        if (!userId) {
            return NextResponse.json({ error: 'User identifier required.' }, { status: 400 });
        }

        const amt = parseFloat(amount);
        if (isNaN(amt) || amt <= 0) {
            return NextResponse.json({ error: 'Invalid withdrawal amount.' }, { status: 400 });
        }

        // 1. Fetch user profile and level
        const { data: profile, error: profErr } = await supabaseAdmin
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (profErr || !profile) {
            return NextResponse.json({ error: 'User profile not found.' }, { status: 404 });
        }

        if (profile.is_frozen) {
            return NextResponse.json({ 
                error: 'Account Frozen: Your account is currently suspended. Withdrawals cannot be initiated. Please contact customer support.' 
            }, { status: 403 });
        }

        // 2. Fetch withdrawal settings & admin permissions
        const { data: settings } = await supabaseAdmin
            .from('site_settings')
            .select('key, value')
            .in('key', ['require_task_completion_to_withdraw', 'user_withdrawal_permissions', 'min_withdrawal']);

        let requireTasksGlobal = true;
        let userPermissions: Record<string, string> = {};
        let globalMin = 30;

        settings?.forEach(s => {
            if (s.key === 'require_task_completion_to_withdraw') requireTasksGlobal = s.value === 'true';
            if (s.key === 'min_withdrawal') globalMin = parseFloat(s.value || '30');
            if (s.key === 'user_withdrawal_permissions') {
                try { userPermissions = JSON.parse(s.value || '{}'); } catch { userPermissions = {}; }
            }
        });

        const userPerm = userPermissions[userId]; // 'allow' | 'block' | 'require_tasks'

        // Check if admin explicitly blocked this user
        if (userPerm === 'block') {
            return NextResponse.json({ 
                error: 'Withdrawal Restricted: Withdrawals on your account have been restricted by platform administration. Please contact customer service.' 
            }, { status: 403 });
        }

        // Fetch level info for tasks_per_set and min_withdrawal
        let tasksPerSet = profile.tasks_per_set_override || 40;
        let effectiveMin = globalMin;
        let levelName = 'Junior Agent';

        if (profile.level_id) {
            const { data: levelData } = await supabaseAdmin
                .from('levels')
                .select('name, tasks_per_set, min_withdrawal')
                .eq('id', profile.level_id)
                .single();
            if (levelData) {
                levelName = levelData.name;
                if (!profile.tasks_per_set_override && levelData.tasks_per_set) {
                    tasksPerSet = levelData.tasks_per_set;
                }
                if (levelData.min_withdrawal) effectiveMin = levelData.min_withdrawal;
            }
        }

        // If not force-allowed by admin, check task set completion
        if (userPerm !== 'allow' && requireTasksGlobal) {
            const completedCount = Number(profile.completed_count || 0);
            const tasksInCurrentSet = completedCount % tasksPerSet;
            const isSetCompleted = completedCount > 0 && tasksInCurrentSet === 0;

            if (!isSetCompleted) {
                return NextResponse.json({ 
                    error: `Task Set Incomplete: You must complete all ${tasksPerSet} tasks in your current set before initiating a withdrawal. You have currently completed ${tasksInCurrentSet}/${tasksPerSet} tasks.` 
                }, { status: 400 });
            }
        }

        // Validate amount vs minimum
        if (amt < effectiveMin) {
            return NextResponse.json({ 
                error: `Amount is less than the minimum withdrawal amount of $${effectiveMin.toFixed(2)}.` 
            }, { status: 400 });
        }

        // Validate wallet balance
        const balance = Number(profile.wallet_balance || 0);
        if (amt > balance) {
            return NextResponse.json({ 
                error: `Insufficient balance. Available: $${balance.toFixed(2)}.` 
            }, { status: 400 });
        }

        // Execute withdrawal transaction
        const { data: txData, error: txErr } = await supabaseAdmin
            .from('transactions')
            .insert({
                user_id: userId,
                type: 'withdrawal',
                amount: amt,
                status: 'pending',
                network: network || 'TRX',
                address: (walletAddress || '').trim()
            })
            .select()
            .single();

        if (txErr) throw txErr;

        const cleanTxId = txData?.id 
            ? `TXN-${String(txData.id).padStart(6, '0')}` 
            : `TXN-${Math.floor(100000 + Math.random() * 900000)}`;

        // Record in transaction_ledger
        try {
            await supabaseAdmin.from('transaction_ledger').insert({
                user_id: userId,
                amount: amt,
                type: 'withdrawal',
                description: `Withdrawal (${network}) of $${amt.toFixed(2)} to ${(walletAddress || '').trim()} (${levelName}) - TXID: #${cleanTxId}`
            });
        } catch (ledgerErr) {
            console.warn('Ledger error:', ledgerErr);
        }

        // Create notification
        try {
            await supabaseAdmin.from('notifications').insert({
                user_id: userId,
                title: 'Withdrawal Initiated',
                message: `Your withdrawal request of $${amt.toFixed(2)} ${network} (TXID: #${cleanTxId}) has been registered and is pending verification.`,
                type: 'info',
                is_read: false
            });
        } catch (notifErr) {
            console.warn('Notification error:', notifErr);
        }

        // Deduct wallet balance and add to freeze balance
        const newBalance = Math.max(0, balance - amt);
        const newFreeze = Number(profile.freeze_balance || 0) + amt;

        await supabaseAdmin
            .from('profiles')
            .update({
                wallet_balance: newBalance,
                freeze_balance: newFreeze,
                wallet_address: (walletAddress || '').trim(),
                wallet_network: network
            })
            .eq('id', userId);

        return NextResponse.json({
            success: true,
            transaction: txData,
            cleanTxId,
            newBalance,
            newFreeze
        });

    } catch (err: any) {
        console.error('Server withdrawal error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
