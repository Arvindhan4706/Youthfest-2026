import { NextResponse } from 'next/server';
import { db } from '@/lib/database';
// @ts-ignore
import { validatePaymentVerification } from 'razorpay/dist/utils/razorpay-utils.js';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      razorpay_payment_id, 
      razorpay_payment_link_id, 
      razorpay_payment_link_reference_id, 
      razorpay_payment_link_status, 
      razorpay_signature,
      eventTitle 
    } = body;

    if (!razorpay_payment_id || !razorpay_payment_link_id || !razorpay_signature) {
      return NextResponse.json({ error: 'Missing required payment details' }, { status: 400 });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET!;

    // Validate the signature using Razorpay's native utility for Payment Links
    const isAuthentic = validatePaymentVerification(
      {
        payment_link_id: razorpay_payment_link_id,
        payment_id: razorpay_payment_id,
        payment_link_reference_id: razorpay_payment_link_reference_id,
        payment_link_status: razorpay_payment_link_status
      },
      razorpay_signature,
      secret
    );

    if (isAuthentic) {
      const email = body.email; // We passed email via callback query params

      if (email) {
        // Update general payment status
        await db.updatePaymentStatus(email, 'paid');
        
        // If eventTitle was provided (via PaymentModal), register them for that event
        if (eventTitle) {
          try {
            await db.registerForEvent(email, eventTitle);
          } catch (e) {
            console.error("Failed to register for event, might already be registered:", e);
          }
        }
      }

      return NextResponse.json(
        { success: true, message: 'Payment successfully verified', isAuthentic: true },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: 'Invalid signature', isAuthentic: false },
        { status: 400 }
      );
    }
  } catch (error: unknown) {
    console.error('Error verifying payment link:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
