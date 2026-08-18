import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
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

    // 3. Init Razorpay
    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    // 4. Fetch Payments
    let rzGross = 0;
    let rzFees = 0;
    let hasMore = true;
    let skip = 0;

    // To prevent API timeouts on large data, we'll fetch up to a certain limit (e.g. 1000 payments).
    // Razorpay API allows 100 per request.
    let safetyCounter = 0;

    while (hasMore && safetyCounter < 10) {
      safetyCounter++;
      const rpPayments = await razorpay.payments.all({ count: 100, skip: skip });
      
      for (const rp of rpPayments.items) {
        if (rp.status === 'captured') {
          rzGross += rp.amount / 100;
          rzFees += (rp.fee || 0) / 100;
        }
      }
      
      if (rpPayments.items.length < 100) {
        hasMore = false;
      } else {
        skip += 100;
      }
    }

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
