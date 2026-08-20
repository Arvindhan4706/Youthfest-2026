import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
async function run() {
  const { data: visitors } = await supabase.from('visitors').select('id, registered_events').not('registered_events', 'is', null);
  
  if (!visitors) return;
  
  let updatedCount = 0;
  
  for (const visitor of visitors) {
    if (!visitor.registered_events) continue;
    
    let changed = false;
    const newEvents = visitor.registered_events.map((title: string) => {
      if (title === 'INKSPIRE') {
        changed = true;
        return 'Inkspire';
      }
      if (title === 'Pazhagikalam – Dance Workshop' || title.startsWith('Pazhagikalam')) {
        changed = true;
        return 'Pazhagikalam';
      }
      return title;
    });
    
    if (changed) {
      // deduplicate in case
      const uniqueNewEvents = Array.from(new Set(newEvents));
      await supabase.from('visitors').update({ registered_events: uniqueNewEvents }).eq('id', visitor.id);
      updatedCount++;
    }
  }
  
  console.log(`Normalized registered_events for ${updatedCount} visitors.`);
}
run();
