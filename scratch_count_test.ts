import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
async function run() {
  const { count: paymentsCount } = await supabase.from('payments').select('*', { count: 'exact', head: true });
  const { count: visitorsCount } = await supabase.from('visitors').select('*', { count: 'exact', head: true });
  console.log('Total Payments:', paymentsCount);
  console.log('Total Visitors:', visitorsCount);

  // Test limit
  const { data: payments } = await supabase.from('payments').select('amount').limit(10000);
  console.log('Payments with limit(10000) count:', payments?.length);
}
run();
