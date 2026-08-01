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
            
            // Get user details to send a personalized receipt
            const user = await db.getByEmail(email);
            
            // Dispatch registration confirmation email
            const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
            fetch(`${baseUrl}/api/send-receipt`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email,
                name: user?.name || '',
                eventTitle,
                amountPaid: 'Paid via Razorpay'
              })
            }).catch(err => console.error("Failed to send receipt email:", err));
            
          } catch (e) {
            console.error("Failed to register for event, might already be registered:", e);
          }
        }
        
        // Update payment log to successful
        const { createClient } = require('@supabase/supabase-js');
        const supabaseAdmin = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        await supabaseAdmin
          .from('payments')
          .update({ 
            status: 'successful',
            razorpay_payment_id: razorpay_payment_id
          })
          .eq('razorpay_order_id', razorpay_payment_link_id);
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

