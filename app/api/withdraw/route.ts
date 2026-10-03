import { getTierWithdrawalLimits } from '@/lib/tierLimits';
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
            .in('key', [
                'min_withdrawal', 
                'require_task_completion_to_withdraw', 
                'user_withdrawal_permissions',
                'daily_withdrawal_limit_junior',
                'daily_withdrawal_limit_intermediate',
                'daily_withdrawal_limit_senior',
                'daily_withdrawal_limit_mentor'
            ]);

        let requireTasksGlobal = true;
        let userPermissions: Record<string, string> = {};
        let globalMin = 30;
        let overrideDailyCount: number | null = null;

        // Fetch level info for tasks_per_set and tier limit
        const effectiveLevelId = profile.level_id || 1;
        let tasksPerSet = profile.tasks_per_set_override || 40;

        const { data: levelData } = await supabaseAdmin
            .from('levels')
            .select('id, name, tasks_per_set, price')
            .eq('id', effectiveLevelId)
            .single();

        const resolvedLevelName = levelData?.name || 'Junior Agent';
        if (levelData) {
            if (!profile.tasks_per_set_override && levelData.tasks_per_set) {
                tasksPerSet = levelData.tasks_per_set;
            }
        }

        settings?.forEach(s => {
            if (s.key === 'min_withdrawal') globalMin = parseFloat(s.value || '30');
            if (s.key === 'require_task_completion_to_withdraw') requireTasksGlobal = s.value === 'true';
            if (s.key === 'user_withdrawal_permissions') {
                try { userPermissions = JSON.parse(s.value || '{}'); } catch { userPermissions = {}; }
            }
            const lvlLower = resolvedLevelName.toLowerCase();
            if (lvlLower.includes('junior') && s.key === 'daily_withdrawal_limit_junior') {
                overrideDailyCount = parseInt(s.value, 10);
            } else if (lvlLower.includes('intermediate') && s.key === 'daily_withdrawal_limit_intermediate') {
                overrideDailyCount = parseInt(s.value, 10);
            } else if (lvlLower.includes('senior') && s.key === 'daily_withdrawal_limit_senior') {
                overrideDailyCount = parseInt(s.value, 10);
            } else if (lvlLower.includes('mentor') && s.key === 'daily_withdrawal_limit_mentor') {
                overrideDailyCount = parseInt(s.value, 10);
            }
        });

        const userPerm = userPermissions[userId]; // 'allow' | 'block' | 'require_tasks'

        // Check if admin explicitly blocked this user
        if (userPerm === 'block') {
            return NextResponse.json({ 
                error: 'Withdrawal Restricted: Withdrawals on your account have been restricted by platform administration. Please contact customer service.' 
            }, { status: 403 });
        }

        // Exact Canonical Tier Limits:
        // Junior: $30 - $1,499 (1 withdrawal per day)
        // Intermediate: $30 - $2,499 (2 withdrawals per day)
        // Senior: $30 - $4,999 (3 withdrawals per day)
        // Mentor: $30 to any amount (Unlimited)
        const tierLimits = getTierWithdrawalLimits(
            levelData?.id || effectiveLevelId,
            levelData?.price,
            resolvedLevelName,
            globalMin,
            overrideDailyCount
        );
        const levelName = tierLimits.tierName;
        const minWithdrawal = tierLimits.min;
        const maxWithdrawal = tierLimits.max;
        const dailyCountLimit = tierLimits.dailyCountLimit;

        // Check user daily withdrawals
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const resetTimestamp = profile.last_reset_at;
        const filterDate = resetTimestamp && new Date(resetTimestamp) > startOfToday 
            ? new Date(resetTimestamp).toISOString() 
            : startOfToday.toISOString();

        const { data: todayWithdrawals } = await supabaseAdmin
            .from('transactions')
            .select('id, amount, status, created_at')
            .eq('user_id', userId)
            .eq('type', 'withdrawal')
            .neq('status', 'rejected')
            .gte('created_at', filterDate);

        const todayWithdrawalCount = todayWithdrawals?.length || 0;
        const todayWithdrawnAmount = (todayWithdrawals || []).reduce((sum, tx) => sum + Number(tx.amount || 0), 0);

        // If not force-allowed by admin, check daily limits
        if (userPerm !== 'allow') {
            // 1. Daily frequency / count limit check
            if (dailyCountLimit !== Infinity && todayWithdrawalCount >= dailyCountLimit) {
                return NextResponse.json({ 
                    error: `Daily Withdrawal Limit Reached: You have reached your daily withdrawal quota (${todayWithdrawalCount}/${dailyCountLimit} completed today) for the ${levelName} tier. Please contact customer service to upgrade your account.`,
                    code: 'DAILY_LIMIT_REACHED'
                }, { status: 403 });
            }

            // 2. Cumulative daily amount limit check
            if (maxWithdrawal !== Infinity && (todayWithdrawnAmount + amt) > maxWithdrawal) {
                return NextResponse.json({ 
                    error: `Daily Amount Limit Reached: Withdrawing $${amt.toLocaleString()} will exceed your daily limit of $${maxWithdrawal.toLocaleString()} for the ${levelName} tier (Already withdrawn today: $${todayWithdrawnAmount.toLocaleString()}). Please contact customer service to upgrade your account.`,
                    code: 'DAILY_AMOUNT_EXCEEDED'
                }, { status: 403 });
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

        // Validate amount vs tier minimum
        if (amt < minWithdrawal) {
            return NextResponse.json({ 
                error: `Amount is less than the minimum withdrawal amount of $${minWithdrawal.toLocaleString()} for ${levelName}.` 
            }, { status: 400 });
        }

        // Validate amount vs tier maximum (Mentor is Infinity)
        if (maxWithdrawal !== Infinity && amt > maxWithdrawal) {
            return NextResponse.json({ 
                error: `Amount exceeds the single transaction limit for your ${levelName} tier ($${maxWithdrawal.toLocaleString()} max).` 
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
