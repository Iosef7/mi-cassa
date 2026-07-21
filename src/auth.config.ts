import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  secret: "a3f7b9c2e5d8412398ab7cde9f0123456789abcdef0123456789abcdef012345",
  trustHost: true,
  session: { strategy: "jwt" },
  providers: [],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    }
  }
} satisfies NextAuthConfig
