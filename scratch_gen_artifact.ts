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

  let markdown = `# Mock Parliament Team Contacts\n\n`;
  markdown += `| Team Lead Email | Member Name | Member Email | Member Phone | Lead Phone |\n`;
  markdown += `|---|---|---|---|---|\n`;

  for (const tm of teamMembers || []) {
    const memberPhone = phoneMap.get(tm.member_email?.toLowerCase().trim()) || 'Not Registered';
    const leadPhone = phoneMap.get(tm.lead_email?.toLowerCase().trim()) || 'Not Registered';
    markdown += `| ${tm.lead_email} | ${tm.member_name} | ${tm.member_email} | ${memberPhone} | ${leadPhone} |\n`;
  }

  const outPath = 'C:\\Users\\arvin\\.gemini\\antigravity-ide\\brain\\76480c69-f277-49c4-8716-72b3bd90a8fd\\mock_parliament_contacts.md';
  fs.writeFileSync(outPath, markdown);
  console.log("Artifact created at", outPath);
}

run();
