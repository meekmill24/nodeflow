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
            const { data: inviter, error: inviterError } = await supabaseAdmin
                .from('profiles')
                .select('id')
                .eq('referral_code', referral.toUpperCase())
                .single();
            
            if (inviterError || !inviter) {
                return NextResponse.json({ error: 'Invalid invitation code. Connection refused.' }, { status: 400 });
            }
            inviterId = inviter.id;
        } else {
            return NextResponse.json({ error: 'Invitation code required.' }, { status: 400 });
        }

        const fakeEmail = `${username}@smartbugmedia.io`;

        // Fetch dynamic bonuses from settings
        const { data: settingsData } = await supabaseAdmin
            .from('site_settings')
            .select('key, value')
            .in('key', ['welcome_bonus', 'referral_bonus']);
        
        const welcomeBalance = parseFloat(settingsData?.find(s => s.key === 'welcome_bonus')?.value || '25');
        const referralBonus = parseFloat(settingsData?.find(s => s.key === 'referral_bonus')?.value || '10');

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
                    title: 'System Activation Reward',
                    message: `Welcome to NodeFlow. Your node has been initialized with a credit of $${welcomeBalance.toFixed(2)}.`,
                    type: 'success',
                    is_read: false
                });

            // 2. Settlement for Inviter
            if (inviterId) {
                // Fetch inviter current stats
                const { data: inviterProfile } = await supabaseAdmin
                    .from('profiles')
                    .select('wallet_balance, referral_earned, username')
                    .eq('id', inviterId)
                    .single();
                
                if (inviterProfile) {
                    const newBalance = (inviterProfile.wallet_balance || 0) + referralBonus;
                    const newReferralEarned = (inviterProfile.referral_earned || 0) + referralBonus;

                    await supabaseAdmin
                        .from('profiles')
                        .update({ 
                            wallet_balance: newBalance,
                            referral_earned: newReferralEarned 
                        })
                        .eq('id', inviterId);

                    // Notification for inviter
                    await supabaseAdmin
                        .from('notifications')
                        .insert({
                            user_id: inviterId,
                            title: 'Referral Protocol Reward',
                            message: `Synchronization successful for new node (${username}). A credit of $${referralBonus.toFixed(2)} has been added to your vault.`,
                            type: 'success',
                            is_read: false
                        });
                    
                    // Transaction record for inviter
                    await supabaseAdmin
                        .from('transactions')
                        .insert({
                            user_id: inviterId,
                            type: 'commission',
                            amount: referralBonus,
                            description: `Referral Reward for node ${username}`,
                            status: 'approved'
                        });
                }
            }
        }

        return NextResponse.json({ success: true, fakeEmail });
    } catch (err: any) {
        console.error('Fast-Track Registration Error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
