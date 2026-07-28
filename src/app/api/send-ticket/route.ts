import { NextResponse } from 'next/server';
import { getMailer, getFromEmail } from '@/lib/mailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, event, venue, date, qrDataUrl } = body;

    if (!name || !email || !event || !qrDataUrl) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Ensure qrDataUrl is a valid base64 string
    const base64Data = qrDataUrl.split(';base64,').pop();
    if (!base64Data) {
      throw new Error("Invalid QR code data");
    }

    const pdfBuffer = Buffer.from(base64Data, 'base64');

    const mailOptions = {
      from: getFromEmail(),
      to: email,
      subject: `Your Yuvenza '26 Vitality Pass: ${event}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #4F46E5;">Yuvenza '26</h1>
            <h2>Vitality Pass</h2>
          </div>
          
          <p>Hi <strong>${name}</strong>,</p>
          <p>Your registration for <strong>${event}</strong> is confirmed! Attached is your official Vitality Pass (QR Code).</p>
          
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Event:</strong> ${event}</p>
            <p style="margin: 5px 0;"><strong>Date:</strong> ${date || 'August 12, 2026'}</p>
            <p style="margin: 5px 0;"><strong>Venue:</strong> ${venue || 'Yuvenza Main Campus'}</p>
          </div>
          
          <p><strong>IMPORTANT:</strong> Please present the attached QR code at the registration desk for seamless entry.</p>
          
          <p>See you there!</p>
          <p>The Yuvenza Organizing Committee</p>
        </div>
      `,
      attachments: [
        {
          filename: `Yuvenza_Pass_${event.replace(/\s+/g, '_')}.png`,
          content: pdfBuffer,
          contentType: 'image/png'
        }
      ]
    };

    const mailer = getMailer();
    await mailer.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: 'Ticket email sent successfully.' });
  } catch (error: any) {
    console.error('Error sending ticket:', error);
    return NextResponse.json({ error: error.message || 'Failed to send ticket' }, { status: 500 });
  }
}
