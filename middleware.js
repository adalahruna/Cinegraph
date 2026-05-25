import { NextResponse } from 'next/server'

export function middleware(request) {
  // Check if the request is for admin routes
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    // For now, we'll let the client-side handle admin authentication
    // In a production app, you'd want to verify the JWT token here
    return NextResponse.next()
  }

  // Check if the request is for admin API routes
  if (request.nextUrl.pathname.startsWith('/api/admin')) {
    // Add security headers for admin API routes
    const response = NextResponse.next()
    
    // Add security headers
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('X-XSS-Protection', '1; mode=block')
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/admin/:path*'
  ]
}