import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/resend';
import { WelcomeEmail } from '@/lib/email-templates';

export async function POST(req: Request) {
  try {
    const { email, username } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const { success, data, error } = await sendEmail({
      to: email,
      subject: 'NodeFlow: Protocol Activation Confirmed',
      html: WelcomeEmail(username || email),
    });

    if (!success) {
      throw error;
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Welcome Email Error:', error);
    return NextResponse.json({ error: 'Failed to send welcome email' }, { status: 500 });
  }
}
