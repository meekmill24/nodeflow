import { Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({ to, subject, html, from }: { to: string | string[], subject: string, html: string, from?: string }) => {
  try {
    const { data, error } = await resend.emails.send({
      from: from || 'SmartBugMedia <notifications@smartbugmedias.com>',
      to,
      subject,
      html,
    });

    if (error) {
      console.error('Resend Error:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Unexpected Email Error:', error);
    return { success: false, error };
  }
};
