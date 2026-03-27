import { Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({ to, subject, html }: { to: string | string[], subject: string, html: string }) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'NodeFlow <notifications@nodeflow.io>', // You'll need to verify your domain on Resend
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
