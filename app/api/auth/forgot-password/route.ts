import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/resend';
import { PasswordResetEmail } from '@/lib/email-templates';

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();

        if (!email || typeof email !== 'string') {
            return NextResponse.json({ error: 'Valid email address is required' }, { status: 400 });
        }

        const cleanEmail = email.trim().toLowerCase();

        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const origin = req.nextUrl?.origin || process.env.NEXT_PUBLIC_SITE_URL || 'https://smartbugmedias.com';

        // Generate password recovery link via Supabase Admin (bypasses Supabase SMTP limits)
        const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
            type: 'recovery',
            email: cleanEmail,
            options: {
                redirectTo: `${origin}/auth/reset-password`
            }
        });

        if (linkError) {
            console.error('Password reset link generation error:', linkError);
            return NextResponse.json({ error: linkError.message || 'Unable to generate reset link' }, { status: 400 });
        }

        const resetLink = linkData?.properties?.action_link;

        if (resetLink) {
            // Send institutional password reset email via Resend
            const emailResult = await sendEmail({
                to: cleanEmail,
                subject: 'SmartBugMedia: Protocol Recovery & Password Reset',
                html: PasswordResetEmail(resetLink)
            });

            if (!emailResult.success) {
                console.error('Resend delivery failed:', emailResult.error);
                return NextResponse.json({ error: 'Failed to dispatch recovery email. Please verify the address and try again.' }, { status: 500 });
            }
        }

        return NextResponse.json({ success: true, message: 'Recovery instructions dispatched.' });
    } catch (err: any) {
        console.error('Forgot password API exception:', err);
        return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
    }
}
