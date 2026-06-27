import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: 'Missing required payment details' }, { status: 400 });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET!;
    const bodyStr = razorpay_order_id + '|' + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(bodyStr.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Payment is verified
      return NextResponse.json(
        { message: 'Payment successfully verified', isAuthentic: true },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: 'Invalid signature', isAuthentic: false },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Error verifying payment:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
