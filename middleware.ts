import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Define protected routes that require authentication
  const protectedRoutes = [
    '/dashboard',
    '/products',
    '/orders',
    '/profile',
    '/onboarding',
    '/catalog-builder'
  ];
  
  // Define public routes that should redirect if already authenticated
  const publicRoutes = ['/auth'];
  
  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  // For protected routes, we'll let the client-side auth handle it
  // This middleware mainly helps with preventing flash of unauthenticated content
  
  // Handle auth route specifically
  if (pathname === '/auth' || pathname.startsWith('/auth/')) {
    // If user is on auth page, set proper cache headers to prevent back button issues
    const response = NextResponse.next();
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    return response;
  }
  
  // For protected routes, set cache headers to prevent browser caching
  if (isProtectedRoute) {
    const response = NextResponse.next();
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    return response;
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
