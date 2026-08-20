import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
async function run() {
  const { data, error } = await supabase.from('events').upsert({
    id: 'gen-1',
    track_id: 'main-events',
    title: 'General Entry',
    description: 'Get your general entry pass to Yuvenza 2026! Access the fest grounds, enjoy performances, food stalls, and the electric atmosphere.',
    team_size: '1',
    fee: '₹50',
    difficulty: 'Easy',
    image_url: '/event-images/general_entry.png',
    event_date: 'August 21, 2026',
    venue: 'Chennai Institute Of Technology',
    rules: ['Carry your valid college ID card.', 'General Entry pass grants access to the fest grounds only.', 'Event-specific registrations require separate tickets.']
  }, { onConflict: 'id' });
  if (error) console.error('Error:', error);
  else console.log('General Entry event added successfully!');
}
run();
