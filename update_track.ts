import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
async function run() {
  const { error } = await supabase.from('events').update({ track_id: 'general-entry' }).eq('id', 'gen-1');
  if (error) console.error('Error:', error);
  else console.log('Updated track_id to general-entry!');
}
run();
