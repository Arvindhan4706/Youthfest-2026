import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/lib/database';
export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-razorpay-signature');
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!secret) {
      console.error('RAZORPAY_WEBHOOK_SECRET is not set');
      return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
    }
    if (!signature) {
      return NextResponse.json({ error: 'No signature found' }, { status: 400 });
    }
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(rawBody)
      .digest('hex');
    if (expectedSignature !== signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }
    const event = JSON.parse(rawBody);
    const { createClient } = require('@supabase/supabase-js');
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    if (event.event === 'payment_link.paid') {
      const email = event.payload?.payment_link?.entity?.customer?.email;
      const paymentLinkId = event.payload?.payment_link?.entity?.id;
      const paymentId = event.payload?.payment?.entity?.id;

      if (email) {
        await db.updatePaymentStatus(email, 'paid');
        console.log(`Updated payment status for ${email} to paid`);
      }

      if (paymentLinkId && paymentId) {
        await supabaseAdmin
          .from('payments')
          .update({ status: 'successful', razorpay_payment_id: paymentId })
          .eq('razorpay_order_id', paymentLinkId);
        console.log(`Updated payments table for link ${paymentLinkId}`);
      }
    } else if (event.event === 'order.paid' || event.event === 'payment.captured') {
      const orderId = event.payload?.payment?.entity?.order_id || event.payload?.order?.entity?.id;
      const paymentId = event.payload?.payment?.entity?.id;

      if (orderId && paymentId) {
        await supabaseAdmin
          .from('payments')
          .update({ status: 'successful', razorpay_payment_id: paymentId })
          .eq('razorpay_order_id', orderId);
        console.log(`Updated payments table for order ${orderId}`);
      }
    }
    return NextResponse.json({ status: 'ok' });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
