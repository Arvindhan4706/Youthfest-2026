import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
async function run() {
  const { data: payments } = await supabase.from('payments').select('status');
  const { data: visitors } = await supabase.from('visitors').select('payment_status');
  
  const paymentStats = (payments || []).reduce((acc: any, p: any) => {
    acc[p.status] = (acc[p.status] || 0) + 1;
    return acc;
  }, {});

  const visitorStats = (visitors || []).reduce((acc: any, v: any) => {
    acc[v.payment_status] = (acc[v.payment_status] || 0) + 1;
    return acc;
  }, {});

  console.log('--- Payment Stats ---');
  console.log(paymentStats);
  console.log('--- Visitor Stats ---');
  console.log(visitorStats);
}
run();
