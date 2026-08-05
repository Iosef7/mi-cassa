import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

console.log("[DEBUG-MW-EDGE] process.env.AUTH_SECRET:", process.env.AUTH_SECRET);

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  
  if (req.nextUrl.pathname.startsWith('/admin')) {
    console.log(`[DEBUG-MW] ${req.method} ${req.nextUrl.pathname}`);
    console.log(`[DEBUG-MW] isLoggedIn: ${isLoggedIn}`);
    console.log(`[DEBUG-MW] COOKIES:`, req.cookies.getAll().map(c => `${c.name}=${c.value.substring(0, 10)}...`));
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
                        req.nextUrl.pathname.startsWith('/api/whatsapp/webhook') ||
                        req.nextUrl.pathname.startsWith('/api/drive/image/') ||
                        req.nextUrl.pathname.startsWith('/api/invitations/');
    if (!isPublicApi && !isLoggedIn) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { 
        status: 401, 
        headers: { 'content-type': 'application/json' } 
      });
    }
    return NextResponse.next();
  }

  // Rutas públicas que no requieren autenticación
  const isPublicRoute = req.nextUrl.pathname === '/' || 
                        req.nextUrl.pathname.startsWith('/uploads') ||
                        req.nextUrl.pathname.startsWith('/wp-uploads') ||
                        req.nextUrl.pathname.startsWith('/images') ||
                        req.nextUrl.pathname.startsWith('/propiedades') ||
                        req.nextUrl.pathname.startsWith('/asesoria-legal') ||
                        req.nextUrl.pathname.startsWith('/hipoteca') ||
                        req.nextUrl.pathname.startsWith('/decoracion');
                        
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Redirect to login if not authenticated
  if (!isLoggedIn) {
    const response = NextResponse.redirect(new URL('/login', req.nextUrl));
    response.cookies.delete('authjs.session-token');
    response.cookies.delete('__Secure-authjs.session-token');
    response.cookies.delete('next-auth.session-token');
    response.cookies.delete('__Secure-next-auth.session-token');
    return response;
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
