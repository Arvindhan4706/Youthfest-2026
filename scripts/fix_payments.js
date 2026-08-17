const Razorpay = require('razorpay');
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const dotenv = require('dotenv');

const envConfig = dotenv.parse(fs.readFileSync('.env.local'));
for (const k in envConfig) {
  process.env[k] = envConfig[k];
}

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function fixPendingPayments() {
  console.log('Starting script...');
  const { data: pendingPayments, error } = await supabaseAdmin
    .from('payments')
    .select('*')
    .eq('status', 'pending');
    
  if (error || !pendingPayments) {
    console.error('Failed to fetch pending payments:', error);
    return;
  }
  
  console.log(`Found ${pendingPayments.length} pending payments. Checking...`);
  let fixedCount = 0;
  
  for (const payment of pendingPayments) {
    const orderId = payment.razorpay_order_id;
    if (!orderId) continue;
    
    try {
      if (orderId.startsWith('order_')) {
        const order = await razorpay.orders.fetch(orderId);
        if (order.status === 'paid') {
          const payments = await razorpay.orders.fetchPayments(orderId);
          const successfulPayment = payments.items.find(p => p.status === 'captured');
          
          if (successfulPayment) {
            await supabaseAdmin
              .from('payments')
              .update({ status: 'successful', razorpay_payment_id: successfulPayment.id })
              .eq('id', payment.id);
            
            // Also update the visitor record
            if (payment.visitor_id) {
              const { data: visitor } = await supabaseAdmin
                .from('visitors')
                .select('registered_events')
                .eq('id', payment.visitor_id)
                .single();
                
              if (visitor) {
                const currentEvents = visitor.registered_events || [];
                const eventTitle = payment.event_id || 'Vitality Pass';
                if (!currentEvents.includes(eventTitle)) {
                  currentEvents.push(eventTitle);
                }
                
                await supabaseAdmin
                  .from('visitors')
                  .update({
                    payment_status: 'paid',
                    registered_events: currentEvents
                  })
                  .eq('id', payment.visitor_id);
              }
            }

            console.log(`Fixed order ${orderId} -> successful`);
            fixedCount++;
          }
        }
      } else if (orderId.startsWith('plink_')) {
        const link = await razorpay.paymentLink.fetch(orderId);
        if (link.status === 'paid') {
            await supabaseAdmin
              .from('payments')
              .update({ status: 'successful' })
              .eq('id', payment.id);

            // Also update the visitor record
            if (payment.visitor_id) {
              const { data: visitor } = await supabaseAdmin
                .from('visitors')
                .select('registered_events')
                .eq('id', payment.visitor_id)
                .single();
                
              if (visitor) {
                const currentEvents = visitor.registered_events || [];
                const eventTitle = payment.event_id || 'Vitality Pass';
                if (!currentEvents.includes(eventTitle)) {
                  currentEvents.push(eventTitle);
                }
                
                await supabaseAdmin
                  .from('visitors')
                  .update({
                    payment_status: 'paid',
                    registered_events: currentEvents
                  })
                  .eq('id', payment.visitor_id);
              }
            }
            
            console.log(`Fixed link ${orderId} -> successful`);
            fixedCount++;
        }
      }
    } catch (err) {
      console.error(`Error checking ${orderId}:`, err.message);
    }
  }
  
  console.log(`Finished. Fixed ${fixedCount} payments.`);
}

fixPendingPayments();

