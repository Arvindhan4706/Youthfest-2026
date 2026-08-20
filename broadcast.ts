import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import QRCode from 'qrcode';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

async function run() {
  console.log("Fetching all paid visitors...");
  const { data: visitors, error } = await supabase
    .from('visitors')
    .select('*')
    .eq('payment_status', 'paid');
    
  if (error || !visitors) {
    console.error("Failed to fetch visitors:", error);
    return;
  }
  
  console.log(`Found ${visitors.length} paid visitors. Starting broadcast...`);
  
  for (let i = 0; i < visitors.length; i++) {
    const visitor = visitors[i];
    console.log(`[${i + 1}/${visitors.length}] Processing ${visitor.email} (${visitor.name})...`);
    
    try {
      const qrDataUrl = await QRCode.toDataURL(visitor.id, {
        width: 300, margin: 2, color: { dark: '#000000', light: '#ffffff' }
      });
      const eventTitle = visitor.registered_events?.length ? 'Multiple Events / Fest Pass' : 'General Fest Entry';
      
      const odRes = await fetch('http://localhost:3000/api/send-od', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: visitor.name, email: visitor.email, phone: visitor.phone,
          college: visitor.college, department: visitor.department, eventTitle: eventTitle
        })
      });
      
      const ticketRes = await fetch('http://localhost:3000/api/send-ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: visitor.name, email: visitor.email, event: eventTitle,
          venue: 'Chennai Institute Of Technology', date: 'August 21, 2026', qrDataUrl: qrDataUrl
        })
      });
      
      if (odRes.ok && ticketRes.ok) {
        console.log(`  -> Successfully sent OD and Ticket to ${visitor.email}`);
      } else {
        console.error(`  -> API Error for ${visitor.email}`);
      }
    } catch (err: any) {
      console.error(`  -> Failed to send to ${visitor.email}:`, err.message);
    }
    
    await delay(3000);
  }
  console.log("Broadcast complete!");
}
run();
