import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
async function run() {
  const { data: payments } = await supabase.from('payments').select('*');
  const successful = (payments || []).filter((p: any) => p.status === 'successful');
  const total = successful.reduce((acc: any, p: any) => acc + p.amount, 0);
  console.log('Total successful payments:', successful.length);
  console.log('Total amount:', total);
  const byAmount: any = {};
  successful.forEach((p: any) => {
    byAmount[p.amount] = (byAmount[p.amount] || 0) + 1;
  });
  console.log('Breakdown by amount:', byAmount);
}
run();
