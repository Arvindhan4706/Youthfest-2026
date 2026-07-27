import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/database';
import Razorpay from 'razorpay';
// Define the schema for visitor registration using Zod
const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Please provide a valid email address"),
  phone: z.string().regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
  college: z.string().optional(),
  department: z.string().optional(),
  year: z.string().optional(),
  gender: z.string().optional(),
  city: z.string().optional()
});
export async function POST(request: Request) {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
      key_secret: process.env.RAZORPAY_KEY_SECRET || '',
    });
    const body = await request.json();
    // Validate the incoming data
    const validatedData = registerSchema.parse(body);
    // Registration Fee Amount (e.g., Rs 500 = 50000 paise)
    const amountInPaise = 50000;
    // Create a dynamic Razorpay Payment Link
    const options = {
      amount: amountInPaise,
      currency: "INR",
      accept_partial: false,
      description: "Yuvenza Yuvenza Registration",
      customer: {
        name: validatedData.name,
        email: validatedData.email,
        contact: validatedData.phone
      },
      notify: {
        sms: false,
        email: false
      },
      reminder_enable: false,
      reference_id: `rcpt_${Math.random().toString(36).substring(2, 9)}`,
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://yuvenza-2026.vercel.app'}/payment-success?email=${encodeURIComponent(validatedData.email)}`,
      callback_method: "get"
    };
    
    // @ts-ignore - razorpay node SDK might be slightly outdated with typings, but the method exists
    const paymentLink = await razorpay.paymentLink.create(options);

    // Call the database logic only if link creation succeeds
    const newVisitor = await db.register(validatedData);

    try {
      await db.logPayment({
        visitor_id: newVisitor.id,
        event_id: 'general-entry',
        razorpay_order_id: paymentLink.id,
        amount: amountInPaise / 100,
        status: 'pending'
      });
    } catch (err) {
      console.error('Failed to log payment ledger during registration:', err);
    }

    return NextResponse.json({ 
      success: true, 
      visitor: newVisitor,
      paymentLinkUrl: paymentLink.short_url,
      order: {
        id: paymentLink.id,
        amount: paymentLink.amount,
        currency: paymentLink.currency
      }
    });
  } catch (error: any) {
    console.error("REGISTER ROUTE ERROR:", error);
    if (error?.name === 'ZodError' || error instanceof z.ZodError) {
      const firstError = error.errors?.[0]?.message || 'Validation failed';
      return NextResponse.json({ success: false, message: firstError }, { status: 400 });
    }
    const errorMsg = error?.error?.description || error?.message || 'Failed to create Razorpay order';
    return NextResponse.json({ success: false, message: errorMsg }, { status: 400 });
  }
}
