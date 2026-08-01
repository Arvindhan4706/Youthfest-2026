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
export default async function proxy(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
  let response = NextResponse.next();
  // Rate Limit API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    if (ratelimit) {
      const { success } = await ratelimit.limit(`ratelimit_${ip}`);
      if (!success) {
        response = NextResponse.json({ error: 'Too Many Requests' }, { status: 429 });
        return response;
      }
    }
  }
  // Admin Route Protection is handled client-side via passkey in this app architecture.
  // If moving to full server-side auth, implement JWT verification here.
  // Apply Security Headers
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
  // Basic CSP - Adjust if external scripts/iframes are blocked
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.vercel-insights.com https://*.razorpay.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https://images.unsplash.com https://i.postimg.cc https://v0.blob.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://*.supabase.co https://*.razorpay.com; frame-src 'self' https://*.razorpay.com;"
  );
  return response;
}
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};

