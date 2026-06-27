import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Initialize Redis only if the environment variables are present
const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null;

// Create a new ratelimiter, that allows 5 requests per 10 seconds
const ratelimit = redis
  ? new Ratelimit({
      redis: redis,
      limiter: Ratelimit.slidingWindow(5, '10 s'),
      analytics: true,
    })
  : null;

export async function middleware(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
  
  // Rate Limit API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    if (ratelimit) {
      const { success, pending, limit, reset, remaining } = await ratelimit.limit(`ratelimit_${ip}`);
      if (!success) {
        return NextResponse.json({ error: 'Too Many Requests' }, { status: 429 });
      }
    }
  }

  // Protect Admin Route (Basic check, real auth should use Supabase cookies)
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const authCookie = request.cookies.get('sb-access-token'); // Replace with actual supabase auth cookie if configured
    
    // For now, we allow the client-side component to handle auth, 
    // but in a fully "pakka" app, you'd verify the JWT here.
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*', '/admin/:path*'],
};
