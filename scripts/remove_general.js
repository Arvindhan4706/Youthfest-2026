const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Need to use service_role key to bypass RLS policies that might restrict deletion
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log('Deleting general-entry payments...');
  const { data, error } = await supabase
    .from('payments')
    .delete()
    .eq('event_id', 'general-entry');
  
  if (error) {
    console.error('Error deleting payments:', error);
  } else {
    console.log('Successfully deleted general-entry payments.', data);
  }
}

run();
