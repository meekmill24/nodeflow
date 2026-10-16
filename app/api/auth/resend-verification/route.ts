import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/resend';
import { EmailVerificationTemplate } from '@/lib/email-templates';

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

        // Generate magic link / signup verification link without touching Supabase rate limits
        const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
            type: 'magiclink',
            email: cleanEmail,
            options: {
                redirectTo: `${origin}/auth/callback`
            }
        });

        if (linkError) {
            console.error('Resend verification link generation error:', linkError);
            return NextResponse.json({ error: linkError.message || 'Unable to generate verification link' }, { status: 400 });
        }

        const actionLink = linkData?.properties?.action_link;

        if (actionLink) {
            const sendResult = await sendEmail({
                to: cleanEmail,
                subject: 'SmartBugMedia: Verify Your Account',
                html: EmailVerificationTemplate(actionLink)
            });

            if (!sendResult.success) {
                console.error('Failed to send verification email via Resend:', sendResult.error);
                return NextResponse.json({ error: 'Failed to dispatch email. Please try again shortly.' }, { status: 500 });
            }
        }

        return NextResponse.json({ success: true, message: 'Verification email resent successfully. Please check your inbox.' });
    } catch (err: any) {
        console.error('Resend verification exception:', err);
        return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
    }
}
