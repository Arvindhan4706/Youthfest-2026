import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const { email, name, eventTitle, amountPaid } = await req.json();

    if (!email || !eventTitle) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn("SMTP_USER and SMTP_PASS are not configured. Email will be mocked.");
      return NextResponse.json({ success: true, mocked: true });
    }

    const mailOptions = {
      from: `"Youthfest 2026" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `Registration Confirmed: ${eventTitle}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background-color: #030014; color: #fff; padding: 40px; border-radius: 16px;">
          <h2 style="color: #00f0ff; text-transform: uppercase; margin-bottom: 20px;">Registration Confirmed!</h2>
          <p style="font-size: 16px; line-height: 1.6; color: #ddd;">
            Hello ${name || 'Participant'},
          </p>
          <p style="font-size: 16px; line-height: 1.6; color: #ddd;">
            This email is to confirm your successful registration for <strong>${eventTitle}</strong>.
          </p>
          ${amountPaid ? `<p style="font-size: 16px; line-height: 1.6; color: #ddd;"><strong>Amount Paid:</strong> ${amountPaid}</p>` : ''}
          <div style="background-color: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); padding: 15px; border-radius: 8px; margin-top: 25px;">
            <h3 style="color: #fff; margin-top: 0;">What's Next?</h3>
            <p style="color: #bbb; font-size: 14px; margin-bottom: 0;">
              Head over to your <strong>Dashboard</strong> on the Youthfest 2026 platform. From there, you can view your digital Vitality Pass and download your PDF ticket with your unique QR code!
            </p>
          </div>
          <div style="margin-top: 40px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px;">
            <p style="font-size: 12px; color: #888;">
              See you in the chaos.<br/>
              The Yuvenza Team
            </p>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Receipt email sent: %s', info.messageId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Email Error:', error);
    return NextResponse.json({ error: 'Failed to send receipt email' }, { status: 500 });
  }
}
