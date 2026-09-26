import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!url || !key) {
            return NextResponse.json({ error: 'Supabase credentials missing' }, { status: 500 });
        }

        const supabaseAdmin = createClient(url, key);

        // Fetch current user's profile
        const { data: userProfile, error: uErr } = await supabaseAdmin
            .from('profiles')
            .select('id, referral_code, referral_earned, wallet_balance')
            .eq('id', userId)
            .maybeSingle();

        if (uErr || !userProfile) {
            return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
        }

        // Fetch site settings for tier commission rates and milestone bonuses
        const { data: settings } = await supabaseAdmin
            .from('site_settings')
            .select('key, value');

        const l1Rate = parseFloat(settings?.find(s => s.key === 'referral_commission_l1')?.value || '20');
        const l2Rate = parseFloat(settings?.find(s => s.key === 'referral_commission_l2')?.value || '10');
        const l3Rate = parseFloat(settings?.find(s => s.key === 'referral_commission_l3')?.value || '5');

        // Extract Captiv8s style milestone deposit rewards
        const milestoneRewards = [];
        for (let i = 1; i <= 6; i++) {
            const row = settings?.find(s => s.key === `reward_tier_${i}`);
            if (row?.value && row.value.includes('/')) {
                const [target, reward] = row.value.split('/').map(Number);
                if (!isNaN(target) && !isNaN(reward)) {
                    milestoneRewards.push({ tier: i, target, reward });
                }
            }
        }

        // Level 1: Users referred directly by this user (by referred_by UUID OR referral_code_used)
        const userCode = userProfile.referral_code?.toUpperCase();
        let l1Query = supabaseAdmin
            .from('profiles')
            .select('id, username, created_at, level_id, completed_count, profit, wallet_balance, referral_code')
            .or(`referred_by.eq.${userId}${userCode ? `,referral_code_used.eq.${userCode}` : ''}`);

        const { data: level1Profiles } = await l1Query;
        const l1List = (level1Profiles || []).filter(p => p.id !== userId);
        const l1Ids = l1List.map(p => p.id);

        // Level 2: Users referred by Level 1 users
        let l2List: any[] = [];
        const l2Ids: string[] = [];
        if (l1Ids.length > 0) {
            const { data: l2Data } = await supabaseAdmin
                .from('profiles')
                .select('id, username, created_at, level_id, completed_count, profit, wallet_balance, referral_code, referred_by')
                .in('referred_by', l1Ids);

            if (l2Data) {
                l2List = l2Data.filter(p => p.id !== userId && !l1Ids.includes(p.id));
                l2List.forEach(p => l2Ids.push(p.id));
            }
        }

        // Level 3: Users referred by Level 2 users
        let l3List: any[] = [];
        if (l2Ids.length > 0) {
            const { data: l3Data } = await supabaseAdmin
                .from('profiles')
                .select('id, username, created_at, level_id, completed_count, profit, wallet_balance, referral_code, referred_by')
                .in('referred_by', l2Ids);

            if (l3Data) {
                l3List = l3Data.filter(p => p.id !== userId && !l1Ids.includes(p.id) && !l2Ids.includes(p.id));
            }
        }

        const sanitizeMember = (m: any, tier: number) => ({
            id: m.id.slice(0, 8),
            username: m.username ? `${m.username.slice(0, 2)}***${m.username.slice(-1)}` : 'Agent',
            fullUsername: m.username || 'Contributor',
            joinedAt: m.created_at,
            tier,
            levelId: m.level_id || 1,
            completedTasks: m.completed_count || 0
        });

        const totalNetworkSize = l1List.length + l2List.length + l3List.length;

        return NextResponse.json({
            success: true,
            stats: {
                totalNetworkSize,
                totalCommissionEarned: Number(userProfile.referral_earned) || 0,
                l1Count: l1List.length,
                l2Count: l2List.length,
                l3Count: l3List.length,
                rates: {
                    l1: l1Rate,
                    l2: l2Rate,
                    l3: l3Rate
                }
            },
            milestoneRewards,
            team: {
                level1: l1List.map(m => sanitizeMember(m, 1)),
                level2: l2List.map(m => sanitizeMember(m, 2)),
                level3: l3List.map(m => sanitizeMember(m, 3))
            }
        });
    } catch (err: any) {
        console.error('Referral downline fetch error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
