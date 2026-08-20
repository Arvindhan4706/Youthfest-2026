import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
async function run() {
  const { data: events } = await supabase.from('events').select('*');
  const { data: visitors } = await supabase.from('visitors').select('registered_events').eq('payment_status', 'paid');
  
  const counts: Record<string, number> = {};
  
  if (events && visitors) {
    events.forEach(e => counts[e.title] = 0);
    
    visitors.forEach(v => {
      if (v.registered_events) {
        v.registered_events.forEach((title: string) => {
          if (counts[title] !== undefined) counts[title]++;
          else counts[title] = 1;
        });
      }
    });
    
    console.log("EVENTS REGISTRATION COUNTS:");
    events.forEach(e => {
      console.log(`[${e.track_id}] ${e.title}: ${counts[e.title]} registrations`);
    });
  }
}
run();
