import { NextResponse } from 'next/server';
import { db } from '@/lib/database';

export async function POST(request: Request) {
  try {
    const { email, passkey } = await request.json();

    if (!email || !passkey) {
      return NextResponse.json({ error: 'Email and Passkey are required' }, { status: 400 });
    }

    // 1. Verify Passkey — reads ADMIN_PASSKEY (server-only) or falls back to NEXT_PUBLIC_ADMIN_PASSKEY
    const correctPasskey = process.env.ADMIN_PASSKEY || process.env.NEXT_PUBLIC_ADMIN_PASSKEY;
    if (!correctPasskey) {
      return NextResponse.json({ error: 'Server misconfiguration: passkey not set' }, { status: 500 });
    }
    if (passkey !== correctPasskey) {
      return NextResponse.json({ error: 'Invalid Passkey' }, { status: 401 });
    }

    // 2. Verify Email & Role from Database
    const normalizedEmail = email.toLowerCase().trim();
    
    // Auto-initialize first admin if table is empty
    let allUsers = await db.getAllAdminUsers().catch(() => []);
    if (allUsers.length === 0) {
      const envEmails = process.env.ADMIN_EMAILS
        ? process.env.ADMIN_EMAILS.split(',').map(e => e.trim().toLowerCase())
        : ['arvindhan476@gmail.com'];
      
      for (const envEmail of envEmails) {
        await db.addAdminUser(envEmail, 'Super Admin').catch(() => {});
      }
      allUsers = await db.getAllAdminUsers().catch(() => []);
    }

    const adminUser = await db.getAdminUserByEmail(normalizedEmail).catch(() => null);

    if (!adminUser) {
      // Secretly log unauthorized access attempts for security
      await db.logAdminAction('UNAUTHORIZED', 'Failed Login Attempt (Not in DB)', { email: normalizedEmail }).catch(() => {});
      return NextResponse.json({ error: 'Email not authorized' }, { status: 403 });
    }

    // 3. Log successful login
    await db.logAdminAction(normalizedEmail, 'Login', { ip: request.headers.get('x-forwarded-for') }).catch(() => {});

    return NextResponse.json({ success: true, email: normalizedEmail, role: adminUser.role }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
