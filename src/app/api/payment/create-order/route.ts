import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(req: Request) {
  try {
    console.log('DEBUG KEYS:', {
      hasKeyId: !!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      keyIdPrefix: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.substring(0, 10),
      hasSecret: !!process.env.RAZORPAY_KEY_SECRET,
    });

    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    const body = await req.json();
    const { amount, receipt } = body;

    if (!amount) {
      return NextResponse.json({ error: 'Amount is required' }, { status: 400 });
    }

    const options = {
      amount: parseInt(amount) * 100, // Amount in paise
      currency: 'INR',
      receipt: receipt || `receipt_${Math.random().toString(36).substring(2, 9)}`,
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({ order }, { status: 200 });
  } catch (error: unknown) {
    console.error('Raw Error creating Razorpay order:', error);
    
    // Razorpay often throws an object instead of a JS Error instance
    const errorBody = error as any;
    const errorMessage = errorBody?.error?.description 
      || errorBody?.message 
      || (error instanceof Error ? error.message : 'Internal Server Error');
      
    return NextResponse.json({ error: errorMessage, raw: errorBody }, { status: 500 });
  }
}
