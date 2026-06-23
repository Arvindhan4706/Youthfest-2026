import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Email Credentials (Gmail App Password)
const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASS = process.env.SMTP_PASS || '';

// Determine if we are running in mock mode
const isEmailMockMode = !SMTP_USER || !SMTP_PASS;

const transporter = !isEmailMockMode 
  ? nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    })
  : null;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, college, department, eventTitle } = body;

    if (!name || !email || !phone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const emailSubject = `On Duty (OD) Approval for Yuvenza Youthfest 2026 - ${eventTitle || 'General Registration'}`;
    const emailBody = `
Dear ${name},

This email serves as your official On Duty (OD) approval for participating in Yuvenza's Youthfest 2026.

Participant Details:
- Name: ${name}
- College: ${college || 'N/A'}
- Department: ${department || 'N/A'}
- Event Registered: ${eventTitle || 'General Fest Entry'}
- Date of Event: August 12, 2026
- Venue: Yuvenza Main Campus

Please present this email to your respective department coordinators or HOD to claim your attendance for the day. Your QR entry pass is available on your dashboard at the Youthfest portal.

We look forward to seeing you at the biggest youth festival of the year!

Best regards,
The Yuvenza Organizing Committee
Youthfest 2026
    `.trim();

    // 1. Send Email (Nodemailer)
    if (isEmailMockMode) {
      console.log('\n=================================================================');
      console.log('📧 MOCK EMAIL DISPATCHED (No SMTP_USER / SMTP_PASS in .env.local)');
      console.log(`To: ${email}`);
      console.log(`Subject: ${emailSubject}`);
      console.log(`Body:\n${emailBody}`);
      console.log('=================================================================\n');
    } else {
      await transporter?.sendMail({
        from: `"Yuvenza Youthfest 2026" <${SMTP_USER}>`,
        to: email,
        subject: emailSubject,
        text: emailBody,
      });
    }



    return NextResponse.json({ 
      success: true, 
      message: 'OD emails sent successfully.',
      mocked: { email: isEmailMockMode }
    });

  } catch (error: any) {
    console.error('Error sending OD communication:', error);
    return NextResponse.json({ error: error.message || 'Failed to send OD' }, { status: 500 });
  }
}
