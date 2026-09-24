import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!url || !key) {
            return NextResponse.json({ error: 'Supabase credentials missing.' }, { status: 500 });
        }

        const supabaseAdmin = createClient(url, key, { db: { schema: 'public' } });

        // Fetch all profiles
        const { data: users, error } = await supabaseAdmin
            .from('profiles')
            .select(`
                id, username, display_name, email, phone_number,
                wallet_balance, profit, referral_earned, level_id,
                completed_count, created_at, referral_code, referred_by,
                referral_code_used, is_frozen
            `)
            .order('created_at', { ascending: false });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        const userList = users || [];

        // Build lookup map by id and by referral_code
        const userById = new Map<string, any>();
        const userByCode = new Map<string, any>();

        userList.forEach(u => {
            userById.set(u.id, u);
            if (u.referral_code) {
                userByCode.set(u.referral_code.toUpperCase(), u);
            }
        });

        // Determine sponsor (referrer) for each user:
        // Try referred_by (UUID) first; fallback to referral_code_used
        const directReferralsMap = new Map<string, any[]>();

        userList.forEach(u => {
            let sponsorId: string | null = null;
            if (u.referred_by && userById.has(u.referred_by)) {
                sponsorId = u.referred_by;
            } else if (u.referral_code_used && userByCode.has(u.referral_code_used.toUpperCase())) {
                sponsorId = userByCode.get(u.referral_code_used.toUpperCase()).id;
            }

            if (sponsorId && sponsorId !== u.id) {
                if (!directReferralsMap.has(sponsorId)) {
                    directReferralsMap.set(sponsorId, []);
                }
                directReferralsMap.get(sponsorId)!.push(u);
            }
        });

        // Compute multi-tier downline for each user (Level 1, Level 2, Level 3)
        const enrichedUsers = userList.map(u => {
            const level1 = directReferralsMap.get(u.id) || [];
            
            // Level 2: referrals of level 1 users
            const level2: any[] = [];
            level1.forEach(l1User => {
                const subRefs = directReferralsMap.get(l1User.id) || [];
                subRefs.forEach(l2User => level2.push(l2User));
            });

            // Level 3: referrals of level 2 users
            const level3: any[] = [];
            level2.forEach(l2User => {
                const subRefs = directReferralsMap.get(l2User.id) || [];
                subRefs.forEach(l3User => level3.push(l3User));
            });

            // Sponsor info
            let sponsor: any = null;
            if (u.referred_by && userById.has(u.referred_by)) {
                const sp = userById.get(u.referred_by);
                sponsor = { id: sp.id, username: sp.username, code: sp.referral_code };
            } else if (u.referral_code_used && userByCode.has(u.referral_code_used.toUpperCase())) {
                const sp = userByCode.get(u.referral_code_used.toUpperCase());
                sponsor = { id: sp.id, username: sp.username, code: sp.referral_code };
            }

            const formatMember = (m: any, tier: number) => ({
                id: m.id,
                username: m.username || 'Anonymous',
                phone: m.phone_number || 'N/A',
                level_id: m.level_id || 1,
                wallet_balance: m.wallet_balance || 0,
                completed_count: m.completed_count || 0,
                created_at: m.created_at,
                tier
            });

            const downlineMembers = [
                ...level1.map(m => formatMember(m, 1)),
                ...level2.map(m => formatMember(m, 2)),
                ...level3.map(m => formatMember(m, 3)),
            ];

            return {
                ...u,
                sponsor,
                phone: u.phone_number || '',
                referred_users_count: level1.length,
                level1_count: level1.length,
                level2_count: level2.length,
                level3_count: level3.length,
                total_network_size: level1.length + level2.length + level3.length,
                downline: downlineMembers
            };
        });

        // Compute summary metrics
        const totalAffiliates = enrichedUsers.length;
        const activeSponsors = enrichedUsers.filter(u => u.referred_users_count > 0).length;
        const totalNetworkUnits = enrichedUsers.reduce((sum, u) => sum + u.referred_users_count, 0);
        const totalReferralEarned = enrichedUsers.reduce((sum, u) => sum + (Number(u.referral_earned) || 0), 0);

        return NextResponse.json({
            users: enrichedUsers,
            stats: {
                totalAffiliates,
                activeSponsors,
                totalNetworkUnits,
                totalReferralEarned
            }
        });

    } catch (err: any) {
        console.error('Admin referrals fetch error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
