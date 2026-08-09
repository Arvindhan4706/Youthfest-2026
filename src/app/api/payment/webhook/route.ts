import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature');
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!secret) {
      console.error('Webhook secret not configured');
      return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
    }

    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(rawBody)
      .digest('hex');

    if (expectedSignature !== signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const event = JSON.parse(rawBody);

    if (event.event === 'payment.captured' || event.event === 'payment.authorized') {
      const payment = event.payload.payment.entity;
      const order_id = payment.order_id;
      const payment_id = payment.id;
      // Depending on if notes were added at order creation or payment link creation
      const email = payment.notes?.email || payment.email;
      const eventTitle = payment.notes?.eventTitle || (payment.description && payment.description.includes('Registration for ') ? payment.description.replace('Registration for ', '').trim() : null);

      if (email && eventTitle) {
        const { createClient } = require('@supabase/supabase-js');
        const supabaseAdmin = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const emailLower = email.toLowerCase().trim();

        // Mark visitor as paid
        await supabaseAdmin
          .from('visitors')
          .update({ payment_status: 'paid' })
          .eq('email', emailLower);

        // Add to registered_events
        const { data: visitor } = await supabaseAdmin
          .from('visitors')
          .select('registered_events, name')
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
              
            // Send receipt email securely
            const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
            fetch(`${baseUrl}/api/send-receipt`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: emailLower,
                name: visitor.name || '',
                eventTitle,
                amountPaid: 'Paid via Razorpay'
              })
            }).catch(err => console.error('Failed to send receipt from webhook:', err));
          }
        }

        // Update payment status
        if (order_id) {
          await supabaseAdmin
            .from('payments')
            .update({ 
              status: 'successful',
              razorpay_payment_id: payment_id
            })
            .eq('razorpay_order_id', order_id);
        }
      }
    }

    return NextResponse.json({ status: 'ok' }, { status: 200 });

  } catch (err: unknown) {
    console.error('Webhook Error:', err);
    return NextResponse.json({ error: 'Webhook Error' }, { status: 500 });
  }
}
