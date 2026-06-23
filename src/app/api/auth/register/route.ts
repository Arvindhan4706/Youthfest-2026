import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/database';

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
    const body = await request.json();
    
    // Validate the incoming data
    const validatedData = registerSchema.parse(body);

    // Call the database logic (which runs on the server side here)
    const newVisitor = await db.register(validatedData);

    return NextResponse.json({ success: true, visitor: newVisitor });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, message: error.errors[0].message }, { status: 400 });
    }
    
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
