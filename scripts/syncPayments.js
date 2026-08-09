const Razorpay = require('razorpay');
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const dotenv = require('dotenv');
const QRCode = require('qrcode');

// Load environment variables from .env.local
const envConfig = dotenv.parse(fs.readFileSync('.env.local'));
for (const k in envConfig) {
  process.env[k] = envConfig[k];
}

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function syncPayments() {
  console.log('Fetching successful payments from Razorpay...');
  
  try {
    const payments = await razorpay.payments.all({ count: 100 });
    const successfulPayments = payments.items.filter(p => p.status === 'captured');
    
    console.log(`Found ${successfulPayments.length} successful payments out of last 100.`);

    for (const payment of successfulPayments) {
      const email = payment.email;
      if (!email) {
        console.log(`Payment ${payment.id} has no email associated, skipping.`);
        continue;
      }

      console.log(`Processing payment for ${email} (${payment.id})...`);
      
      const { data: visitor, error: fetchError } = await supabase
        .from('visitors')
        .select('*')
        .eq('email', email)
        .single();
        
      if (fetchError || !visitor) {
        console.log(`Visitor not found in Supabase for email: ${email}`);
        continue;
      }

      const currentEvents = visitor.registered_events || [];
      let eventTitle = "Vitality Pass";
      if (payment.description && payment.description.includes('Registration for ')) {
        eventTitle = payment.description.replace('Registration for ', '').trim();
      }
      
      let updatedEvents = [...currentEvents];
      if (!updatedEvents.includes(eventTitle)) {
        updatedEvents.push(eventTitle);
      }

      console.log(`Updating Supabase for ${email}...`);
      const { error: updateError } = await supabase
        .from('visitors')
        .update({
          payment_status: 'paid',
          registered_events: updatedEvents
        })
        .eq('id', visitor.id);
        
      if (updateError) {
        console.error(`Failed to update visitor in Supabase:`, updateError);
        continue;
      }

      // Check if payment already logged
      const { data: existingPayment } = await supabase
        .from('payments')
        .select('id')
        .eq('razorpay_payment_id', payment.id)
        .single();
        
      if (!existingPayment) {
        const { error: paymentDbError } = await supabase
          .from('payments')
          .insert({
            visitor_id: visitor.id,
            event_id: eventTitle,
            razorpay_order_id: payment.order_id || 'manual_sync',
            razorpay_payment_id: payment.id,
            amount: payment.amount / 100, 
            status: 'successful'
          });

        if (paymentDbError) {
           console.error(`Failed to log payment in DB:`, paymentDbError);
        }
      }

      console.log(`Sending ticket email for ${email}...`);
      try {
        const qrDataString = `${visitor.email}|${eventTitle}`;
        const base64Qr = await QRCode.toDataURL(qrDataString, { width: 300, margin: 1 });
        
        const response = await fetch('http://localhost:3000/api/send-ticket', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: visitor.name,
            email: visitor.email,
            event: eventTitle,
            venue: 'Chennai Institute Of Technology',
            date: 'August 12, 2026',
            qrDataUrl: base64Qr
          })
        });

        if (response.ok) {
          console.log(`Email sent successfully to ${email}!`);
        } else {
          console.error(`Failed to send email to ${email}: ${response.statusText}`);
        }
      } catch (e) {
        console.error(`Error pinging local API for ${email}:`, e);
      }
    }

    console.log('Synchronization complete!');

  } catch (error) {
    console.error('Error syncing payments:', error);
  }
}

syncPayments();
