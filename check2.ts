import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
async function run() {
  const { data: payments } = await supabase.from('payments').select('*').in('razorpay_order_id', ['order_TRAxC6GJBhtun7', 'order_TRGP7zOY41eVDk']);
  console.log(payments);
}
run();
