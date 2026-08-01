import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { db } from '@/lib/database';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { payment_id, razorpay_payment_id, amount, adminPasskey, adminEmail } = body;

    if (!payment_id || !razorpay_payment_id || !amount || !adminPasskey) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    // Verify admin passkey
    if (adminPasskey !== process.env.ADMIN_PASSKEY) {
      return NextResponse.json({ success: false, message: 'Unauthorized: Invalid Admin Passkey' }, { status: 401 });
    }

    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
      key_secret: process.env.RAZORPAY_KEY_SECRET || '',
    });

    // Amount is stored in INR in DB, Razorpay requires Paise
    const amountInPaise = Math.round(Number(amount) * 100);

    // Call Razorpay Refund API
    const refund = await razorpay.payments.refund(razorpay_payment_id, {
      amount: amountInPaise,
      speed: 'normal'
    });

    if (refund.id) {
      // Update DB to refunded
      await db.updatePaymentRefunded(payment_id);
      
      if (adminEmail) {
        await db.logAdminAction(adminEmail, 'Refunded Payment', { payment_id, amount });
      }
      
      return NextResponse.json({ success: true, refund });
    } else {
      throw new Error('Refund failed at Razorpay');
    }
  } catch (error: any) {
    console.error("ADMIN REFUND ERROR:", error);
    const errorMsg = error?.error?.description || error?.message || 'Failed to process refund';
    return NextResponse.json({ success: false, message: errorMsg }, { status: 500 });
  }
}

