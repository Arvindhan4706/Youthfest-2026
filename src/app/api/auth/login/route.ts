import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/database';

const loginSchema = z.object({
  email: z.string().email("Please provide a valid email address"),
  phone: z.string().min(1, "Phone number is required")
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate the incoming data
    const validatedData = loginSchema.parse(body);

    // Call the database logic
    const visitor = await db.login(validatedData.email, validatedData.phone);

    return NextResponse.json({ success: true, visitor });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, message: error.errors[0].message }, { status: 400 });
    }
    
    return NextResponse.json({ success: false, message: error.message }, { status: 401 });
  }
}
