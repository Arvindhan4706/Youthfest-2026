import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { db } from '@/lib/database';

const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASS = process.env.SMTP_PASS || '';
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
    const { subject, message, audience, adminPasskey } = body;

    if (!subject || !message || !audience || !adminPasskey) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    // Verify admin passkey
    if (adminPasskey !== process.env.ADMIN_PASSKEY) {
      return NextResponse.json({ success: false, message: 'Unauthorized: Invalid Admin Passkey' }, { status: 401 });
    }

    // Determine target audience
    let targetEmails: string[] = [];
    const allVisitors = await db.getAllVisitors();

    if (audience === 'paid') {
      const allPayments = await db.getAllPayments();
      const successfulPaymentVisitorIds = new Set(
        allPayments.filter(p => p.status === 'successful').map(p => p.visitor_id)
      );
      targetEmails = allVisitors
        .filter(v => successfulPaymentVisitorIds.has(v.id))
        .map(v => v.email)
        .filter(Boolean);
    } else {
      // All
      targetEmails = allVisitors.map(v => v.email).filter(Boolean);
    }

    // Remove duplicates
    targetEmails = Array.from(new Set(targetEmails));

    if (targetEmails.length === 0) {
      return NextResponse.json({ success: false, message: 'No recipients found for this audience' }, { status: 400 });
    }

    if (isEmailMockMode) {
      console.log('\n=================================================================');
      console.log('📧 MOCK BROADCAST DISPATCHED (No SMTP credentials)');
      console.log(`To: ${targetEmails.length} recipients`);
      console.log(`Subject: ${subject}`);
      console.log(`Body:\n${message}`);
      console.log('=================================================================\n');
    } else {
      // Send in batches to avoid SMTP limits (e.g., 50 at a time in BCC)
      const batchSize = 50;
      for (let i = 0; i < targetEmails.length; i += batchSize) {
        const batch = targetEmails.slice(i, i + batchSize);
        await transporter?.sendMail({
          from: `"Yuvenza Youthfest" <${SMTP_USER}>`,
          bcc: batch,
          subject: subject,
          text: message,
        });
      }
    }

    // Log the broadcast
    await db.logAdminAction('System', 'Sent Broadcast Email', { 
      audience, 
      count: targetEmails.length,
      subject 
    });

    return NextResponse.json({ success: true, count: targetEmails.length });
  } catch (error: any) {
    console.error("BROADCAST ERROR:", error);
    return NextResponse.json({ success: false, message: error.message || 'Failed to broadcast' }, { status: 500 });
  }
}
