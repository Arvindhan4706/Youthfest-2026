import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { db } from '@/lib/database';

export async function POST(request: Request) {
  try {
    const { access_token } = await request.json();

    if (!access_token) {
      return NextResponse.json({ message: 'No access token provided' }, { status: 400 });
    }

    // Verify token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(access_token);

    if (error || !user || !user.email) {
      return NextResponse.json({ message: 'Invalid token or user not found' }, { status: 401 });
    }

    const email = user.email;
    const name = user.user_metadata?.full_name || '';

    // Check if visitor exists in our database
    const visitor = await db.getByEmail(email);

    if (visitor) {
      return NextResponse.json({
        status: 'existing',
        visitor
      });
    } else {
      return NextResponse.json({
        status: 'new',
        email,
        name
      });
    }
  } catch (err: any) {
    return NextResponse.json({ message: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
