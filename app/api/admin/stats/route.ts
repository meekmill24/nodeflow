import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!url || !key) {
            return NextResponse.json({ error: 'Stats Sync Failure: Supabase credentials missing (Vercel ENV).' }, { status: 500 });
        }

        const supabaseAdmin = createClient(url, key, { db: { schema: 'public' } });

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayISO = today.toISOString();

        const [ 
            users, levels, tasks, referrals, bundles, 
            deposits, withdrawals, commissions, 
            pendingDeps, pendingWiths, 
            allProfiles
        ] = await Promise.all([ 
            supabaseAdmin.from('profiles').select('*', { count: 'exact', head: true }), 
            supabaseAdmin.from('levels').select('*', { count: 'exact', head: true }), 
            supabaseAdmin.from('task_items').select('*', { count: 'exact', head: true }), 
            supabaseAdmin.from('referral_codes').select('*', { count: 'exact', head: true }), 
            supabaseAdmin.from('bundle_packages').select('*', { count: 'exact', head: true }), 
            supabaseAdmin.from('transactions').select('amount').eq('type', 'deposit').eq('status', 'approved'), 
            supabaseAdmin.from('transactions').select('amount').eq('type', 'withdrawal').eq('status', 'approved'), 
            supabaseAdmin.from('transactions').select('amount').eq('type', 'commission'), 
            supabaseAdmin.from('transactions').select('*', { count: 'exact', head: true }).eq('type', 'deposit').eq('status', 'pending'), 
            supabaseAdmin.from('transactions').select('*', { count: 'exact', head: true }).eq('type', 'withdrawal').eq('status', 'pending'), 
            supabaseAdmin.from('profiles').select('profit, completed_count'),
        ]); 

        const { data: todayTx } = await supabaseAdmin
            .from('transactions')
            .select('amount')
            .gte('created_at', todayISO)
            .eq('status', 'approved');

        const sumAmounts = (data: any[] | null) => (data || []).reduce((sum: number, t: any) => sum + (t.amount || 0), 0); 

        const totalProfit = (allProfiles.data || []).reduce((sum: number, p: any) => sum + (p.profit || 0), 0);
        const totalTasksCount = (allProfiles.data || []).reduce((sum: number, p: any) => sum + (p.completed_count || 0), 0);
        const todayVolume = sumAmounts(todayTx);

        return NextResponse.json({
            totalUsers: users.count ?? 0,
            totalLevels: levels.count ?? 0,
            totalTasks: tasks.count ?? 0,
            totalReferrals: referrals.count ?? 0,
            totalBundles: bundles.count ?? 0,
            totalDepositsAmount: sumAmounts(deposits.data),
            totalWithdrawalsAmount: sumAmounts(withdrawals.data),
            totalCommissions: sumAmounts(commissions.data),
            pendingDeposits: pendingDeps.count ?? 0,
            pendingWithdrawals: pendingWiths.count ?? 0,
            todayProfit: totalProfit,
            todayTasks: totalTasksCount,
            todayVolume: todayVolume,
        });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
