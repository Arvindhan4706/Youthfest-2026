import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { db } from '@/lib/database';

export async function POST(request: Request) {
  try {
    const { email, passkey } = await request.json();

    // 1. Verify Passkey
    const correctPasskey = process.env.ADMIN_PASSKEY || process.env.NEXT_PUBLIC_ADMIN_PASSKEY;
    if (!correctPasskey || passkey?.trim() !== correctPasskey.trim()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Verify Admin Role
    const normalizedEmail = email.toLowerCase().trim();
    const adminUser = await db.getAdminUserByEmail(normalizedEmail).catch(() => null);
    if (!adminUser || (adminUser.role !== 'Super Admin' && adminUser.role !== 'Editor')) {
      return NextResponse.json({ error: 'Unauthorized Role' }, { status: 403 });
    }

    // We no longer need to initialize Razorpay because we are using the DB as the source of truth.

    // 4. Fetch Payments from Database
    const payments = await db.getAllPayments();
    let rzGross = 0;
    
    for (const p of payments) {
      if (p.status === 'successful') {
        rzGross += p.amount;
      }
    }
    
    // Gateway fees are 0 for UPI transactions
    const rzFees = 0;
    const rzNet = rzGross - rzFees;

    return NextResponse.json({ 
      success: true, 
      gross: rzGross, 
      fees: rzFees, 
      net: rzNet 
    });

  } catch (error: any) {
    console.error('Failed to fetch Razorpay stats:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
