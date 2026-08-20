import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
async function run() {
  const { data, error } = await supabase.from('events').select('id, title, fee, track_id').eq('id', 'gen-1').single();
  if (error) console.error('Not found:', error.message);
  else console.log('Found in Supabase:', data);
}
run();
