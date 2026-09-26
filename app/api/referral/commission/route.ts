import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { distributeReferralCommission } from '@/lib/referral';

export async function POST(req: NextRequest) {
    try {
        const { userId, profitEarned, sourceDescription } = await req.json();

        if (!userId || !profitEarned || profitEarned <= 0) {
            return NextResponse.json({ success: true, distributed: 0 });
        }

        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!url || !key) {
            return NextResponse.json({ error: 'Supabase credentials missing' }, { status: 500 });
        }

        const supabaseAdmin = createClient(url, key);
        const result = await distributeReferralCommission(
            supabaseAdmin,
            userId,
            Number(profitEarned),
            sourceDescription || 'Optimization Task'
        );

        return NextResponse.json(result);
    } catch (err: any) {
        console.error('Referral commission route error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
