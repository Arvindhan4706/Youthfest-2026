import * as dotenv from 'dotenv';
import Razorpay from 'razorpay';
dotenv.config({ path: '.env.local' });
const razorpay = new Razorpay({ key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!, key_secret: process.env.RAZORPAY_KEY_SECRET! });
async function run() {
  let rzGross = 0, rzFees = 0, hasMore = true, skip = 0;
  while (hasMore) {
    const rpPayments = await razorpay.payments.all({ count: 100, skip });
    for (const rp of rpPayments.items) {
      if (rp.status === 'captured') {
        rzGross += Number(rp.amount) / 100;
        rzFees += (Number(rp.fee) || 0) / 100;
      }
    }
    if (rpPayments.items.length < 100) hasMore = false; else skip += 100;
  }
  console.log('Razorpay Gross:', rzGross);
  console.log('Razorpay Fees:', rzFees);
  console.log('Razorpay Net:', rzGross - rzFees);
}
run();
