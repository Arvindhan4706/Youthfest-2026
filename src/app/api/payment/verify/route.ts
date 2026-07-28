import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/lib/database';
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, email } = body;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: 'Missing required payment details' }, { status: 400 });
    }
    const secret = process.env.RAZORPAY_KEY_SECRET!;
    const bodyStr = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(bodyStr.toString())
      .digest('hex');
    const isAuthentic = expectedSignature === razorpay_signature;
    if (isAuthentic) {
      if (email) {
        // Use Service Role Key to bypass RLS policies
        const { createClient } = require('@supabase/supabase-js');
        const supabaseAdmin = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const emailLower = email.toLowerCase().trim();
        await supabaseAdmin
          .from('visitors')
          .update({ payment_status: 'paid' })
          .eq('email', emailLower);

        const eventTitle = body.eventTitle;
        if (eventTitle) {
          const { data: visitor } = await supabaseAdmin
            .from('visitors')
            .select('registered_events')
            .eq('email', emailLower)
            .single();

          if (visitor) {
            const events = visitor.registered_events || [];
            if (!events.includes(eventTitle)) {
              events.push(eventTitle);
              await supabaseAdmin
                .from('visitors')
                .update({ registered_events: events })
                .eq('email', emailLower);
            }
          }
        }
        
        // Update payment log to successful
        await supabaseAdmin
          .from('payments')
          .update({ 
            status: 'successful',
            razorpay_payment_id: razorpay_payment_id
          })
          .eq('razorpay_order_id', razorpay_order_id);
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
    console.error('Error verifying payment:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
