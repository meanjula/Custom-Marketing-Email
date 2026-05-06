import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendCampaignEmail({ to, cc, subject, html }) {
  const { data, error } = await resend.emails.send({
    from: process.env.FROM_EMAIL || 'onboarding@resend.dev',
    to,
    ...(cc?.length && { cc }),
    subject,
    html: html || '<p>No content</p>',
  });

  if (error) throw new Error(error.message);
  return data;
}
