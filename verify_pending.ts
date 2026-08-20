import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import Razorpay from 'razorpay';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

async function run() {
  console.log('Fetching pending payments from DB...');
  const { data: pendingPayments, error } = await supabase
    .from('payments')
    .select('*')
    .eq('status', 'pending');

  if (error) {
    console.error('Error fetching payments:', error);
    return;
  }

  console.log(`Found ${pendingPayments.length} pending payments. Checking against Razorpay...`);

  let updatedCount = 0;

  for (const payment of pendingPayments) {
    try {
      const orderId = payment.razorpay_order_id;
      if (!orderId) continue;
      
      const order = await razorpay.orders.fetch(orderId);
      
      if (order.status === 'paid') {
        console.log(`Order ${orderId} is PAID in Razorpay. Updating database...`);
        
        // 1. Update Payment Table
        await supabase
          .from('payments')
          .update({ status: 'successful' })
          .eq('id', payment.id);
          
        // 2. Fetch Visitor and Update Status
        if (payment.visitor_id) {
          const { data: visitor } = await supabase
            .from('visitors')
            .select('*')
            .eq('id', payment.visitor_id)
            .single();
            
          if (visitor) {
            // Update payment_status
            await supabase
              .from('visitors')
              .update({ payment_status: 'paid' })
              .eq('id', visitor.id);
              
            // Add event to registered_events
            const events = visitor.registered_events || [];
            if (payment.event_id && !events.includes(payment.event_id)) {
              events.push(payment.event_id);
              await supabase
                .from('visitors')
                .update({ registered_events: events })
                .eq('id', visitor.id);
            }
          }
        }
        updatedCount++;
      }
    } catch (err: any) {
      console.error(`Error checking order ${payment.razorpay_order_id}:`, err.message || err);
    }
  }

  console.log(`Verification complete. Updated ${updatedCount} payments.`);
}

run();
