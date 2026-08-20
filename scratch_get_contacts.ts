import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function run() {
  console.log("Fetching team members for Mock Parliament...");
  const { data: teamMembers, error } = await supabase
    .from('team_members')
    .select('member_name, member_email, lead_email')
    .eq('event_title', 'Mock Parliament');

  if (error) {
    console.error("Error fetching team members:", error);
    return;
  }

  console.log(`Found ${teamMembers?.length} team members.`);
  
  // Extract all unique emails (members and leads)
  const emails = new Set<string>();
  teamMembers?.forEach(tm => {
    if (tm.member_email) emails.add(tm.member_email.toLowerCase().trim());
    if (tm.lead_email) emails.add(tm.lead_email.toLowerCase().trim());
  });

  const { data: visitors, error: vError } = await supabase
    .from('visitors')
    .select('name, email, phone')
    .in('email', Array.from(emails));

  if (vError) {
    console.error("Error fetching visitors:", vError);
    return;
  }

  const phoneMap = new Map<string, string>();
  visitors?.forEach(v => {
    phoneMap.set(v.email.toLowerCase().trim(), v.phone);
  });

  console.log("\n--- Contact List for Mock Parliament ---");
  const output = [];
  
  for (const tm of teamMembers || []) {
    const memberPhone = phoneMap.get(tm.member_email?.toLowerCase().trim()) || 'Not Registered as Visitor';
    const leadPhone = phoneMap.get(tm.lead_email?.toLowerCase().trim()) || 'Not Found';
    output.push(`Member: ${tm.member_name} | Email: ${tm.member_email} | Member Phone: ${memberPhone} | Lead Email: ${tm.lead_email} | Lead Phone: ${leadPhone}`);
  }
  
  console.log(output.join('\n'));
}

run();
