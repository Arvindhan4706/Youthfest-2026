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

async function checkDb() {
  const email = 'arvindhan476@gmail.com';
  
  const { data: visitor } = await supabase.from('visitors').select('*').eq('email', email).single();
  console.log('Visitor ID:', visitor?.id);

  const { data: payments, error } = await supabase.from('payments').select('*');
  console.log('ALL PAYMENTS COUNT:', payments?.length, error);
  
  if (payments) {
    const matching = payments.filter(p => p.visitor_id === visitor?.id);
    console.log('Payments for visitor:', matching);
  }
}

checkDb().catch(console.error);
