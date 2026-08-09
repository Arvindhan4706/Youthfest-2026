const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const dotenv = require('dotenv');

const envConfig = dotenv.parse(fs.readFileSync('.env.local'));
for (const k in envConfig) {
  process.env[k] = envConfig[k];
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function syncMockParliament() {
  const email = 'arvindhan476@gmail.com';
  const eventTitle = 'Mock Parliament';
  
  // Update visitor
  const { data: visitor } = await supabase.from('visitors').select('*').eq('email', email).single();
  let events = visitor.registered_events || [];
  if (!events.includes(eventTitle)) {
    events.push(eventTitle);
    await supabase.from('visitors').update({ registered_events: events, payment_status: 'paid' }).eq('email', email);
  }
  
  // Update payment
  await supabase.from('payments').update({ status: 'successful', razorpay_payment_id: 'pay_TNY25rIJR48HgZ' }).eq('razorpay_order_id', 'order_TNY1rOz3rygiJh');
  
  console.log('Successfully synced Mock Parliament for ' + email);
}

syncMockParliament().catch(console.error);
