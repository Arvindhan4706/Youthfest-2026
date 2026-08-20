import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
const RESEND_API_KEY = process.env.RESEND_API_KEY;

async function checkResend() {
  if (!RESEND_API_KEY) {
    console.log("No Resend API Key found.");
    return;
  }
  
  try {
    const res = await fetch('https://api.resend.com/emails', {
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`
      }
    });
    
    if (!res.ok) {
      console.log("Failed to fetch from Resend:", res.status, res.statusText);
      const text = await res.text();
      console.log(text);
      return;
    }
    
    const data = await res.json();
    console.log(`Total emails in Resend history: ${data.data?.length || 0}`);
    
    // Count specific emails
    let odCount = 0;
    let qrCount = 0;
    let receiptCount = 0;
    
    if (data.data) {
      for (const email of data.data) {
        if (email.subject && email.subject.includes('On-Duty (OD) Permission Request')) {
          odCount++;
        }
        if (email.subject && email.subject.includes('Your QR Ticket')) {
          qrCount++;
        }
        if (email.subject && email.subject.includes('Receipt')) {
          receiptCount++;
        }
      }
    }
    console.log(`OD Emails Sent: ${odCount}`);
    console.log(`QR Ticket Emails Sent: ${qrCount}`);
    
  } catch (err: any) {
    console.error("Error checking Resend:", err.message);
  }
}

checkResend();
