import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const RZP_KEY = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!;
const RZP_SECRET = process.env.RAZORPAY_KEY_SECRET!;

async function main() {
  console.log('Fetching pending payments from database...');
  const { data: payments, error } = await supabase
    .from('payments')
    .select('*')
    .eq('status', 'pending');

  if (error || !payments) {
    console.error('Error fetching payments:', error);
    return;
  }

  console.log(`Found ${payments.length} pending payments. Checking against Razorpay...`);
  
  let recoveredCount = 0;

  for (const payment of payments) {
    try {
      const rzpRes = await fetch(`https://api.razorpay.com/v1/orders/${payment.razorpay_order_id}/payments`, {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${RZP_KEY}:${RZP_SECRET}`).toString('base64')}`
        }
      });
      
      const rzpData = await rzpRes.json();
      
      if (rzpData && rzpData.items && rzpData.items.length > 0) {
        const capturedPayment = rzpData.items.find((item: any) => item.status === 'captured');
        
        if (capturedPayment) {
          console.log(`\nFound captured payment for Order: ${payment.razorpay_order_id} (Visitor ID: ${payment.visitor_id})`);
          
          await supabase
            .from('payments')
            .update({ 
              status: 'successful', 
              razorpay_payment_id: capturedPayment.id 
            })
            .eq('id', payment.id);
            
          const { data: visitor } = await supabase
            .from('visitors')
            .select('registered_events')
            .eq('id', payment.visitor_id)
            .single();
            
          const currentEvents = visitor?.registered_events || [];
          const eventTitle = payment.event_id === 'general-entry' || payment.event_id === 'Revents' ? 'Revents' : payment.event_id;
          const newEvents = Array.from(new Set([...currentEvents, eventTitle]));
          
          await supabase
            .from('visitors')
            .update({ 
              payment_status: 'paid',
              registered_events: newEvents
            })
            .eq('id', payment.visitor_id);
            
          console.log(` -> Synced database for visitor!`);
          
          const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
          await fetch(`${baseUrl}/api/admin/resend-ticket`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ visitor_id: payment.visitor_id })
          }).catch(err => console.error(' -> Failed to trigger ticket API:', err));
          
          console.log(` -> Dispatched ticket emails.`);
          recoveredCount++;
        }
      }
    } catch (e: any) {
      console.error(`Error processing payment ${payment.id}:`, e.message);
    }
  }

  console.log(`\nSync complete! Recovered ${recoveredCount} missing payments.`);
}

main();
