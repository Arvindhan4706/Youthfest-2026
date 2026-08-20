import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const orderIds = [
  'order_TS3DvkqssnHqnt', 'order_TRsEqprChG2Vsw', 'order_TRsHcXgyj1ZMtb',
  'order_TRt6tTCNTIJQ0K', 'order_TRv4h0KtV0A39N', 'order_TRw1UolkrsGA28',
  'order_TRwBB3tEoe3Vaj', 'order_TRzHG0ZOd0dNy2', 'order_TS0zlElSgqHd3Q',
  'order_TS165SvhHXiEN2', 'order_TS1G0EBjEr6t85', 'order_TS1TEKv1SA1lo6',
  'order_TS1YC3Rzk53nc3', 'order_TS1d72jxF7lEwt', 'order_TS2QPFq7TGlqm1',
  'order_TS2UcVRWldPlBE', 'order_TS2lc14gPFO3mw'
];

async function run() {
  console.log(`Processing ${orderIds.length} missing tickets...`);
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  
  for (const orderId of orderIds) {
    const { data: payment } = await supabase
      .from('payments')
      .select('visitor_id, event_id')
      .eq('razorpay_order_id', orderId)
      .single();
      
    if (payment && payment.visitor_id) {
      const { data: visitor } = await supabase
        .from('visitors')
        .select('id, name, email')
        .eq('id', payment.visitor_id)
        .single();
        
      if (visitor) {
        console.log(`Sending receipt & ticket for ${visitor.name} (${visitor.email})...`);
        
        try {
          await fetch(`${baseUrl}/api/send-receipt`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: visitor.email || '',
              name: visitor.name || '',
              eventTitle: payment.event_id || 'Vitality Pass',
              amountPaid: 'Paid via Razorpay'
            })
          });
          
          await fetch(`${baseUrl}/api/admin/resend-ticket`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ visitor_id: visitor.id })
          });
          console.log(` -> Success for ${visitor.email}`);
        } catch (e: any) {
          console.error(` -> Failed for ${visitor.email}:`, e.message);
        }
      }
    }
  }
  console.log("Done!");
}

run();
