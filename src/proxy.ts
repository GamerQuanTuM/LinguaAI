import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  // Check for Next.js cookie
  const token = request.cookies.get('token')?.value;

  // Protect /dashboard and its sub-routes
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!token) {
      // Missing token: redirect to login
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
