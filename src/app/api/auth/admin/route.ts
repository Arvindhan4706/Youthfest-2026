import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { passkey } = await request.json();
    // Use an environment variable for the passkey, fallback to the default if not set
    const correctPasskey = process.env.ADMIN_PASSKEY || 'yuvenza2026';

    if (passkey === correctPasskey) {
      const response = NextResponse.json({ success: true });
      // Set a secure HTTP-only cookie to maintain the session
      response.cookies.set('admin_session', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/'
      });
      return response;
    }
    
    return NextResponse.json({ success: false, message: 'Invalid passkey' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
