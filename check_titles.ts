import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
async function run() {
  const { data: visitors } = await supabase.from('visitors').select('registered_events').eq('payment_status', 'paid');
  
  const uniqueEvents = new Set<string>();
  if (visitors) {
    visitors.forEach(v => {
      if (v.registered_events) {
        v.registered_events.forEach((title: string) => uniqueEvents.add(title));
      }
    });
  }
  
  console.log("Unique events found in visitors' registered_events:");
  console.log(Array.from(uniqueEvents));
}
run();
