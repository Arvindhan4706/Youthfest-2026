import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(req: Request) {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });
    
    const body = await req.json();
    const { amount, receipt } = body;
    
    if (!amount) {
      return NextResponse.json({ error: 'Amount is required' }, { status: 400 });
    }

    const amountInPaise = parseInt(amount) * 100;
    if (amountInPaise < 100) {
      return NextResponse.json({ error: 'Minimum amount must be 1 INR' }, { status: 400 });
    }

    const options = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: receipt || `rcpt_${Math.random().toString(36).substring(2, 9)}`,
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({ 
      order_id: order.id,
      amount: order.amount,
      currency: order.currency
    }, { status: 200 });

  } catch (error: unknown) {
    console.error('Error creating Razorpay order:', error);
    const errorBody = error as any;
    const errorMessage = errorBody?.error?.description 
      || errorBody?.message 
      || (error instanceof Error ? error.message : 'Internal Server Error');
      
    // Handle auth failures specifically if needed
    if (errorBody?.statusCode === 401) {
      return NextResponse.json({ error: 'Authentication failed with Razorpay' }, { status: 401 });
    }
    
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
