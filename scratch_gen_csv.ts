import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function run() {
  const { data: teamMembers, error } = await supabase
    .from('team_members')
    .select('member_name, member_email, lead_email')
    .eq('event_title', 'Mock Parliament');

  if (error) return;

  const emails = new Set<string>();
  teamMembers?.forEach(tm => {
    if (tm.member_email) emails.add(tm.member_email.toLowerCase().trim());
    if (tm.lead_email) emails.add(tm.lead_email.toLowerCase().trim());
  });

  const { data: visitors, error: vError } = await supabase
    .from('visitors')
    .select('name, email, phone')
    .in('email', Array.from(emails));

  if (vError) return;

  const phoneMap = new Map<string, string>();
  visitors?.forEach(v => {
    phoneMap.set(v.email.toLowerCase().trim(), v.phone);
  });

  let csv = `Team Lead Email,Member Name,Member Email,Member Phone,Lead Phone\n`;

  for (const tm of teamMembers || []) {
    const memberPhone = phoneMap.get(tm.member_email?.toLowerCase().trim()) || 'Not Registered';
    const leadPhone = phoneMap.get(tm.lead_email?.toLowerCase().trim()) || 'Not Registered';
    // Handle names with commas
    const safeName = tm.member_name ? `"${tm.member_name.replace(/"/g, '""')}"` : '';
    csv += `${tm.lead_email},${safeName},${tm.member_email},${memberPhone},${leadPhone}\n`;
  }

  const outPath = path.join(process.cwd(), 'mock_parliament_contacts.csv');
  fs.writeFileSync(outPath, csv);
  console.log("CSV created at", outPath);
}

run();
