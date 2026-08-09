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

async function fixDb() {
  const email = 'arvindhan476@gmail.com';
  
  const { data: visitor } = await supabase.from('visitors').select('*').eq('email', email).single();
  if (!visitor) return console.log('Visitor not found');
  
  // Fix registered events
  let events = visitor.registered_events || [];
  events = events.filter(e => e !== 'Vitality Pass');
  if (!events.includes('Squid Game')) events.push('Squid Game');
  
  await supabase.from('visitors').update({ registered_events: events }).eq('id', visitor.id);
  console.log('Fixed visitors table');
  
  // Fix payments
  const { error } = await supabase.from('payments').update({ event_id: 'Squid Game' }).eq('razorpay_payment_id', 'pay_TNO3O1QgNAH0R9');
  console.log('Fixed payments table', error || 'Success');
}

fixDb().catch(console.error);
