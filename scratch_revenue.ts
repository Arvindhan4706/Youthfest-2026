import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
async function run() {
  const { data: payments } = await supabase.from('payments').select('amount').eq('status', 'successful');
  const total = (payments || []).reduce((acc: any, p: any) => acc + (p.amount || 0), 0);
  console.log('Current DB Gross Revenue:', total);
}
run();
