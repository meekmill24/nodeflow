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

        // Referral Identification
        let inviterId = null;
        if (referral) {
            const cleanRef = referral.trim().toUpperCase();
            const { data: inviter } = await supabaseAdmin
                .from('profiles')
                .select('id')
                .eq('referral_code', cleanRef)
                .maybeSingle();
            
            if (inviter) {
                inviterId = inviter.id;
            } else if (['8685', '8888', 'ADMIN', 'VIP1', 'NODE'].includes(cleanRef)) {
                const { data: adminUser } = await supabaseAdmin
                    .from('profiles')
                    .select('id')
                    .eq('role', 'admin')
                    .limit(1)
                    .maybeSingle();
                inviterId = adminUser?.id || null;
            } else {
                return NextResponse.json({ error: 'Invalid invitation code. Connection refused.' }, { status: 400 });
            }
        } else {
            return NextResponse.json({ error: 'Invitation code required.' }, { status: 400 });
        }

        const fakeEmail = `${username}@smartbugmedia.io`;

        // Fetch dynamic bonuses from settings
        const { data: settingsData } = await supabaseAdmin
            .from('site_settings')
            .select('key, value')
            .eq('key', 'welcome_bonus');
        
        const welcomeBalance = parseFloat(settingsData?.find(s => s.key === 'welcome_bonus')?.value || '25');

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
                referred_by: inviterId,
                wallet_balance: welcomeBalance
            }
        });

        if (error) {
            throw error;
        }

        if (data.user) {
            // 1. Welcome Notification for new user
            await supabaseAdmin
                .from('notifications')
                .insert({
                    user_id: data.user.id,
                    title: 'Welcome Bonus Received 🎉',
                    message: `Welcome to SmartBugMedia! You've received a $${welcomeBalance.toFixed(2)} first user signup bonus credited to your account.`,
                    type: 'success',
                    is_read: false
                });

            // 2. Notify inviter and update their team stats
            if (inviterId) {
                try {
                    await supabaseAdmin.from('notifications').insert({
                        user_id: inviterId,
                        title: 'New Team Member Joined! 🎉',
                        message: `User @${username} has joined your referral network. You will earn 3-tier perpetual yields on their optimization activity.`,
                        type: 'success',
                        is_read: false
                    });

                    const { data: inviterProf } = await supabaseAdmin
                        .from('profiles')
                        .select('referred_users_count')
                        .eq('id', inviterId)
                        .maybeSingle();

                    if (inviterProf) {
                        await supabaseAdmin
                            .from('profiles')
                            .update({
                                referred_users_count: (Number(inviterProf.referred_users_count) || 0) + 1
                            })
                            .eq('id', inviterId);
                    }
                } catch (invErr) {
                    console.warn('Error updating inviter post-registration:', invErr);
                }
            }
        }

        return NextResponse.json({ success: true, fakeEmail });
    } catch (err: any) {
        console.error('Fast-Track Registration Error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
