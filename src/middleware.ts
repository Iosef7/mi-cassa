import NextAuth from "next-auth"
import { authConfig } from "./auth.config"

export default NextAuth(authConfig).auth((req) => {
  const isLoggedIn = !!req.auth
  const isOnAuthPage = req.nextUrl.pathname.startsWith('/login') || req.nextUrl.pathname.startsWith('/register')

  if (isOnAuthPage) {
    if (isLoggedIn) {
      return Response.redirect(new URL('/admin', req.nextUrl))
    }
    return
  }

  // Si no está logueado y trata de acceder a cualquier ruta que no sea auth (por ejemplo /admin)
  // lo mandamos al login. Podemos agregar rutas públicas aquí si fuera necesario.
  if (!isLoggedIn) {
    return Response.redirect(new URL('/login', req.nextUrl))
  }
})

// Especificar qué rutas debe interceptar el middleware
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
