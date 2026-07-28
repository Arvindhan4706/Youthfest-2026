import { NextResponse } from 'next/server';
import { db } from '@/lib/database';
import { getMailer, getFromEmail } from '@/lib/mailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { subject, message, audience, adminPasskey, adminEmail } = body;

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

    const mailer = getMailer();
    
    // Send in batches to avoid SMTP limits (e.g., 50 at a time in BCC)
    const batchSize = 50;
    for (let i = 0; i < targetEmails.length; i += batchSize) {
      const batch = targetEmails.slice(i, i + batchSize);
      await mailer.sendMail({
        from: getFromEmail(),
        to: process.env.SMTP_USER, // Set 'To' to the sender email itself
        bcc: batch,
        subject: subject,
        html: message.replace(/\n/g, '<br/>'),
      });
    }

    // Log the broadcast
    await db.logAdminAction(adminEmail || 'System', 'Sent Broadcast Email', { 
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
