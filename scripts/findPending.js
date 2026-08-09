const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const dotenv = require('dotenv');
const Razorpay = require('razorpay');

const envConfig = dotenv.parse(fs.readFileSync('.env.local'));
for (const k in envConfig) {
  process.env[k] = envConfig[k];
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const rzp = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

async function findPending() {
  const { data: pending } = await supabase.from('payments').select('*').eq('email', 'arvindhan476@gmail.com').eq('status', 'pending');
  
  if (!pending || pending.length === 0) {
    // If 'email' doesn't exist on payments, search by visitor_id
    const { data: visitor } = await supabase.from('visitors').select('id').eq('email', 'arvindhan476@gmail.com').single();
    if (visitor) {
      const { data: p2 } = await supabase.from('payments').select('*').eq('visitor_id', visitor.id).eq('status', 'pending');
      console.log('Pending payments for arvindhan:', p2);
      
      // Let's check Razorpay for these orders to see if they were paid
      for (const payment of p2 || []) {
        if (payment.razorpay_order_id) {
          try {
             const rzpPayments = await rzp.orders.fetchPayments(payment.razorpay_order_id);
             console.log(`Order ${payment.razorpay_order_id} has payments:`, rzpPayments.items.map(p => ({ id: p.id, status: p.status })));
          } catch (e) {
             console.error(`Error fetching order ${payment.razorpay_order_id}`, e.message);
          }
        }
      }
    }
  } else {
    console.log(pending);
  }
}

findPending().catch(console.error);
