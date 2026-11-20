import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { code } = await req.json();
        if (!code || typeof code !== 'string') {
            return NextResponse.json({ valid: false, error: 'Invitation code is required' }, { status: 400 });
        }

        const cleanCode = code.trim().toUpperCase();

        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // Check in database profiles table
        const { data: inviter, error } = await supabaseAdmin
            .from('profiles')
            .select('id, referral_code, username')
            .eq('referral_code', cleanCode)
            .maybeSingle();

        if (inviter) {
            return NextResponse.json({ 
                valid: true, 
                code: cleanCode, 
                inviterId: inviter.id,
                inviterUsername: inviter.username 
            });
        }

        return NextResponse.json({ valid: false, error: 'Invalid invitation code. Connection refused.' }, { status: 404 });
    } catch (err: any) {
        return NextResponse.json({ valid: false, error: err.message || 'Verification error' }, { status: 500 });
    }
}
