import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const isEmailMockMode = !RESEND_API_KEY;
const resend = !isEmailMockMode ? new Resend(RESEND_API_KEY) : null;

export async function POST(req: Request) {
  try {
    const { email, name, event, ticketDataUrl } = await req.json();

    if (!email || !event || !ticketDataUrl) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (isEmailMockMode) {
      console.warn("RESEND_API_KEY is not configured. Email will be mocked.");
      return NextResponse.json({ success: true, mocked: true });
    }

    // Convert data URL to buffer
    const base64Data = ticketDataUrl.split(',')[1];
    const pdfBuffer = Buffer.from(base64Data, 'base64');

    const mailOptions = {
      from: 'Yuvenza Yuvenza <noreply@yuvenza.com>',
      to: email,
      subject: `Your Yuvenza '26 Vitality Pass: ${event}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background-color: #030014; color: #fff; padding: 40px; border-radius: 16px;">
          <h2 style="color: #00f0ff; text-transform: uppercase; margin-bottom: 20px;">Hey ${name || 'Participant'},</h2>
          <p style="font-size: 16px; line-height: 1.6; color: #ddd;">
            You're officially locked in for <strong>${event}</strong> at Yuvenza!
          </p>
          <p style="font-size: 16px; line-height: 1.6; color: #ddd;">
            Attached to this email is your digital Vitality Pass. Please keep it handy and present the QR code at the entrance.
          </p>
          <div style="margin-top: 40px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px;">
            <p style="font-size: 12px; color: #888;">
              See you in the chaos.<br/>
              The Yuvenza Team
            </p>
          </div>
        </div>
      `,
      attachments: [
        {
          filename: `Yuvenza_Pass_${event.replace(/\s+/g, '_')}.pdf`,
          content: pdfBuffer,
        },
      ],
    };

    await resend?.emails.send(mailOptions);
    console.log('Ticket email sent to:', email);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Email Error:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
