import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { username, password, phone, withdrawalPassword, referral } = await req.json();

        if (!username || !password) {
            return NextResponse.json({ error: 'Username and password required' }, { status: 400 });
        }

        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // Verify referral code exists
        if (referral) {
            const { data: inviter, error: inviterError } = await supabaseAdmin
                .from('profiles')
                .select('id')
                .eq('referral_code', referral.toUpperCase())
                .single();
            
            if (inviterError || !inviter) {
                return NextResponse.json({ error: 'Invalid invitation code. Connection refused.' }, { status: 400 });
            }
        } else {
            return NextResponse.json({ error: 'Invitation code required.' }, { status: 400 });
        }

        const fakeEmail = `${username}@smartbugmedia.io`;

        // Fetch dynamic welcome bonus from settings
        const { data: bonusData } = await supabaseAdmin
            .from('site_settings')
            .select('value')
            .eq('key', 'welcome_bonus')
            .single();
        
        const welcomeBalance = parseFloat(bonusData?.value || '25');

        const { data, error } = await supabaseAdmin.auth.admin.createUser({
            email: fakeEmail,
            password: password,
            email_confirm: true, // Forces verification bypass
            user_metadata: {
                username: username,
                display_name: username,
                phone_number: phone,
                withdrawal_password: withdrawalPassword,
                referral_code_used: referral,
                wallet_balance: welcomeBalance
            }
        });

        if (error) {
            throw error;
        }

        return NextResponse.json({ success: true, fakeEmail });
    } catch (err: any) {
        console.error('Fast-Track Registration Error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
