import { NextResponse } from 'next/server';
import { db } from '@/lib/database';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, title, message, adminPasskey, adminEmail } = body;

    if (!email || !title || !message) {
      return NextResponse.json({ success: false, message: 'Email, title, and message are required' }, { status: 400 });
    }

    if (!adminPasskey || adminPasskey !== process.env.ADMIN_PASSKEY) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const notification = await db.createNotification(email, title, message);
    
    // Log the admin action
    await db.logAdminAction(adminEmail || 'System', 'Sent Notification', { target_email: email, title });

    return NextResponse.json({ success: true, notification });
  } catch (error: any) {
    console.error("NOTIFY ROUTE ERROR:", error);
    return NextResponse.json({ success: false, message: error.message || 'Failed to send notification' }, { status: 500 });
  }
}
