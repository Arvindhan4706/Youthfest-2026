import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
async function run() {
  const { count: paidCount, error: err1 } = await supabase.from('visitors').select('*', { count: 'exact', head: true }).eq('payment_status', 'paid');
  const { count: allCount, error: err2 } = await supabase.from('visitors').select('*', { count: 'exact', head: true });
  console.log('Paid visitors count:', paidCount);
  console.log('Total registered visitors count:', allCount);
  
  const { data: settings } = await supabase.from('site_settings').select('*').eq('id', 'stats').single();
  console.log('Current settings:', settings);
  
  if (paidCount !== null) {
    const newSpots = 5000 - paidCount;
    await supabase.from('site_settings').update({ participants: paidCount, spots_remaining: newSpots }).eq('id', 'stats');
    console.log(`Updated site_settings: participants=${paidCount}, spots_remaining=${newSpots}`);
  }
}
run();
