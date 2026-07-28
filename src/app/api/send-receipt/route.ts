import { NextResponse } from 'next/server';
import { getMailer, getFromEmail } from '@/lib/mailer';

export async function POST(req: Request) {
  try {
    const { email, name, eventTitle, amountPaid } = await req.json();

    if (!email || !eventTitle) {
      return NextResponse.json({ error: 'Missing email or eventTitle' }, { status: 400 });
    }

    const mailOptions = {
      from: getFromEmail(),
      to: email,
      subject: `Registration Confirmed: ${eventTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h2 style="color: #4F46E5;">Registration Confirmed!</h2>
          <p>Hi <strong>${name || 'Participant'}</strong>,</p>
          <p>Your registration and payment for <strong>${eventTitle}</strong> at Yuvenza '26 have been successfully processed.</p>
          
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Event:</strong> ${eventTitle}</p>
            <p style="margin: 5px 0;"><strong>Amount Paid:</strong> ${amountPaid || 'Included'}</p>
            <p style="margin: 5px 0;"><strong>Status:</strong> Confirmed</p>
          </div>
          
          <p>We look forward to seeing you there!</p>
          <br/>
          <p>The Yuvenza Organizing Committee</p>
        </div>
      `,
    };

    const mailer = getMailer();
    await mailer.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: 'Receipt sent successfully' });
  } catch (error: any) {
    console.error('Error sending receipt:', error);
    return NextResponse.json({ error: error.message || 'Failed to send receipt' }, { status: 500 });
  }
}
