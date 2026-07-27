import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { db } from '@/lib/database';

export async function POST(request: Request) {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
      key_secret: process.env.RAZORPAY_KEY_SECRET || '',
    });

    const body = await request.json();
    const { email, name, phone } = body;

    if (!email || !name || !phone) {
      return NextResponse.json({ success: false, message: 'Missing user details' }, { status: 400 });
    }

    // Amount in Paise
    const amountInPaise = 50000;

    const options = {
      amount: amountInPaise,
      currency: "INR",
      accept_partial: false,
      description: "Yuvenza Yuvenza Registration",
      customer: {
        name,
        email,
        contact: phone
      },
      notify: {
        sms: false,
        email: false
      },
      reminder_enable: false,
      reference_id: `rcpt_${Math.random().toString(36).substring(2, 9)}`,
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://yuvenza-2026.vercel.app'}/payment-success?email=${encodeURIComponent(email)}`,
      callback_method: "get"
    };
    
    // @ts-ignore
    const paymentLink = await razorpay.paymentLink.create(options);

    // Get visitor to log the payment ledger properly
    const visitor = await db.getVisitorByEmail(email);

    if (visitor) {
      // Insert to payments ledger if method exists
      try {
        if (db.logPayment) {
          await db.logPayment({
            visitor_id: visitor.id,
            event_id: 'general-entry',
            razorpay_order_id: paymentLink.id,
            amount: amountInPaise / 100,
            status: 'pending'
          });
        }
      } catch (err) {
        console.error('Failed to log payment retry in ledger:', err);
      }
    }

    return NextResponse.json({ 
      success: true, 
      paymentLinkUrl: paymentLink.short_url
    });
  } catch (error: any) {
    console.error("RETRY PAYMENT ERROR:", error);
    const errorMsg = error?.error?.description || error?.message || 'Failed to generate Razorpay link';
    return NextResponse.json({ success: false, message: errorMsg }, { status: 400 });
  }
}
