import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/resend';
import { EmailVerificationTemplate } from '@/lib/email-templates';

export async function POST(req: NextRequest) {
    try {
        const { email, username, password, phone, withdrawalPassword, referral } = await req.json();

        if (!username || !password) {
            return NextResponse.json({ error: 'Username and password required' }, { status: 400 });
        }

        const cleanUsername = username.trim();
        const hasRealEmail = email && typeof email === 'string' && email.trim().includes('@');
        const targetEmail = hasRealEmail 
            ? email.trim().toLowerCase() 
            : `${cleanUsername.toLowerCase()}@smartbugmedia.io`;

        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // Check if username or email is already taken in profiles
        const { data: existingUser } = await supabaseAdmin
            .from('profiles')
            .select('id, username, email')
            .or(`username.ilike.${cleanUsername},email.ilike.${targetEmail}`)
            .limit(1)
            .maybeSingle();

        if (existingUser) {
            if (existingUser.username?.toLowerCase() === cleanUsername.toLowerCase()) {
                return NextResponse.json({ error: 'Username is already registered. Please choose another or log in.' }, { status: 400 });
            }
            if (existingUser.email?.toLowerCase() === targetEmail.toLowerCase()) {
                return NextResponse.json({ error: 'Email address is already registered. Please log in.' }, { status: 400 });
            }
        }

        // Referral Identification
        let inviterId = null;
        const cleanRef = referral ? referral.trim().toUpperCase() : '';
        if (cleanRef) {
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
        } else if (!hasRealEmail) {
            return NextResponse.json({ error: 'Invitation code required for fast-track registration.' }, { status: 400 });
        }

        // Fetch dynamic bonuses from settings
        const { data: settingsData } = await supabaseAdmin
            .from('site_settings')
            .select('key, value')
            .eq('key', 'welcome_bonus');
        
        const welcomeBalance = parseFloat(settingsData?.find(s => s.key === 'welcome_bonus')?.value || '25');

        const userMetadata = {
            username: cleanUsername,
            display_name: cleanUsername,
            phone_number: phone,
            withdrawal_password: withdrawalPassword,
            referral_code_used: cleanRef || null,
            referred_by: inviterId,
            wallet_balance: welcomeBalance
        };

        const origin = req.nextUrl?.origin || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

        let userId: string | null = null;
        let requireEmailVerification = false;

        if (hasRealEmail) {
            // Generate signup link via Supabase Admin (bypasses Supabase default SMTP rate limits!)
            const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
                type: 'signup',
                email: targetEmail,
                password: password,
                options: {
                    data: userMetadata,
                    redirectTo: `${origin}/auth/callback`
                }
            });

            if (linkError) {
                if (linkError.message?.toLowerCase().includes('already registered')) {
                    return NextResponse.json({ error: 'This email is already registered. Please log in.' }, { status: 400 });
                }
                throw linkError;
            }

            userId = linkData.user?.id || (linkData as any)?.id;
            const actionLink = linkData.properties?.action_link;

            // Send verification email via Resend API
            if (actionLink && process.env.RESEND_API_KEY) {
                const resendResult = await sendEmail({
                    to: targetEmail,
                    subject: 'SmartBugMedia: Verify Your Account',
                    html: EmailVerificationTemplate(actionLink, cleanUsername)
                });

                if (resendResult.success) {
                    requireEmailVerification = true;
                } else {
                    console.warn('Resend notice (domain unverified on Resend):', resendResult.error);
                    // If Resend is restricted to verified domain on free tier, auto-confirm so user is not blocked
                    if (userId) {
                        await supabaseAdmin.auth.admin.updateUserById(userId, { email_confirm: true });
                    }
                    requireEmailVerification = false;
                }
            } else {
                if (userId) {
                    await supabaseAdmin.auth.admin.updateUserById(userId, { email_confirm: true });
                }
            }
        } else {
            // Fast-track username registration (auto-confirmed)
            const { data: createData, error: createError } = await supabaseAdmin.auth.admin.createUser({
                email: targetEmail,
                password: password,
                email_confirm: true,
                user_metadata: userMetadata
            });

            if (createError) throw createError;
            userId = createData.user?.id;
            requireEmailVerification = false;
        }

        if (userId) {
            // Ensure profile record is synchronized
            await supabaseAdmin.from('profiles').upsert({
                id: userId,
                username: cleanUsername,
                display_name: cleanUsername,
                email: targetEmail,
                phone_number: phone,
                withdrawal_password: withdrawalPassword,
                referral_code_used: cleanRef || null,
                referred_by: inviterId,
                wallet_balance: welcomeBalance,
                role: 'user',
                level_id: 1,
                current_set: 1,
                completed_count: 0
            }, { onConflict: 'id' });

            // 1. Welcome Notification for new user
            await supabaseAdmin
                .from('notifications')
                .insert({
                    user_id: userId,
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
                        message: `User @${cleanUsername} has joined your referral network. You will earn 3-tier perpetual yields on their optimization activity.`,
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

        return NextResponse.json({ 
            success: true, 
            email: targetEmail,
            requireEmailVerification 
        });
    } catch (err: any) {
        console.error('Registration Error:', err);
        return NextResponse.json({ error: err.message || 'Registration failed' }, { status: 500 });
    }
}
