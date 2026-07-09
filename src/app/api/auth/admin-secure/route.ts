import { NextResponse } from 'next/server';
import { db } from '@/lib/database';

// You can add your team members' emails here
const ALLOWED_ADMIN_EMAILS = [
  'arvindhan476@gmail.com', // Super Admin
];

export async function POST(request: Request) {
  try {
    const { email, passkey } = await request.json();

    if (!email || !passkey) {
      return NextResponse.json({ error: 'Email and Passkey are required' }, { status: 400 });
    }

    // 1. Verify Passkey
    const correctPasskey = process.env.ADMIN_PASSKEY || 'admin123';
    if (passkey !== correctPasskey) {
      return NextResponse.json({ error: 'Invalid Passkey' }, { status: 401 });
    }

    // 2. Verify Email Whitelist
    const normalizedEmail = email.toLowerCase().trim();
    if (!ALLOWED_ADMIN_EMAILS.includes(normalizedEmail)) {
      // Secretly log unauthorized access attempts for security
      await db.logAdminAction('UNAUTHORIZED', 'Failed Login Attempt (Not Whitelisted)', { email: normalizedEmail }).catch(() => {});
      return NextResponse.json({ error: 'Email not authorized' }, { status: 403 });
    }

    // 3. Log successful login
    await db.logAdminAction(normalizedEmail, 'Login', { ip: request.headers.get('x-forwarded-for') }).catch(() => {});

    return NextResponse.json({ success: true, email: normalizedEmail }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
