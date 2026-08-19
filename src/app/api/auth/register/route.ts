import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/database';
import Razorpay from 'razorpay';
// Define the schema for visitor registration using Zod
const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Please provide a valid email address").refine(email => email.trim().toLowerCase().endsWith('@citchennai.net'), { message: "Only @citchennai.net college emails are allowed" }),
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
    
    // Call the database logic directly
    const newVisitor = await db.register(validatedData);

    return NextResponse.json({ 
      success: true, 
      visitor: newVisitor
    });
  } catch (error: any) {
    console.error("REGISTER ROUTE ERROR:", error);
    if (error?.name === 'ZodError' || error instanceof z.ZodError) {
      const firstError = error.errors?.[0]?.message || 'Validation failed';
      return NextResponse.json({ success: false, message: firstError }, { status: 400 });
    }
    const errorMsg = error?.message || 'Failed to register';
    return NextResponse.json({ success: false, message: errorMsg }, { status: 400 });
  }
}

