import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const allCookies = req.cookies.getAll();
  // Check for NextAuth cookies (both standard and secure prefixes, and chunked suffixes)
  const hasAuthCookie = allCookies.some(c => 
    c.name.startsWith('authjs.session-token') || 
    c.name.startsWith('__Secure-authjs.session-token') ||
    c.name.startsWith('next-auth.session-token') ||
    c.name.startsWith('__Secure-next-auth.session-token')
  );
    
  const isLoggedIn = hasAuthCookie;
  
  console.log(`[DEBUG-MW] ${req.method} ${req.nextUrl.pathname} - hasAuthCookie: ${hasAuthCookie}`);
  if (!hasAuthCookie && req.nextUrl.pathname.startsWith('/admin')) {
    console.log(`[DEBUG-MW] ALL COOKIES for failed request:`, allCookies.map(c => `${c.name}=${c.value.substring(0, 5)}...`));
    console.log(`[DEBUG-MW] RAW COOKIE HEADER:`, req.headers.get('cookie'));
  }
  
  const isOnAuthPage = req.nextUrl.pathname.startsWith('/login') || req.nextUrl.pathname.startsWith('/register');

  if (isOnAuthPage) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL('/admin', req.nextUrl));
    }
    return NextResponse.next();
  }

  // Protect /api routes
  if (req.nextUrl.pathname.startsWith('/api/')) {
    const isPublicApi = req.nextUrl.pathname.startsWith('/api/auth') || 
                        req.nextUrl.pathname.startsWith('/api/webhooks/') ||
                        req.nextUrl.pathname.startsWith('/api/whatsapp/webhook');
    if (!isPublicApi && !isLoggedIn) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { 
        status: 401, 
        headers: { 'content-type': 'application/json' } 
      });
    }
    return NextResponse.next();
  }

  // Redirect to login if not authenticated
  if (!isLoggedIn) {
    return NextResponse.redirect(new URL('/login', req.nextUrl));
  }

  // NOTE: We cannot decode the JWT in edge without importing jose manually, 
  // so we skip injecting headers. We will just let the layout handle user role.
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
