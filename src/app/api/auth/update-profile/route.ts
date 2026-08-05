import { NextResponse } from 'next/server';
import { db } from '@/lib/database';
import { z } from 'zod';

const updateProfileSchema = z.object({
  email: z.string().email("Invalid email"),
  phone: z.string().regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
  college: z.string().optional(),
  department: z.string().optional(),
  city: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = updateProfileSchema.parse(body);

    const updatedVisitor = await db.updateProfile(validatedData.email, {
      phone: validatedData.phone,
      college: validatedData.college,
      department: validatedData.department,
      city: validatedData.city
    });

    return NextResponse.json({ success: true, visitor: updatedVisitor });
  } catch (error: any) {
    console.error("UPDATE PROFILE ERROR:", error);
    if (error?.name === 'ZodError' || error instanceof z.ZodError) {
      const firstError = error.errors?.[0]?.message || 'Validation failed';
      return NextResponse.json({ success: false, message: firstError }, { status: 400 });
    }
    return NextResponse.json({ success: false, message: error.message || 'Failed to update profile' }, { status: 400 });
  }
}
