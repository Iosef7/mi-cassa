import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcrypt"
import { authConfig } from "./auth.config"

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma as any),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      allowDangerousEmailAccountLinking: true,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "openid email profile https://www.googleapis.com/auth/calendar.events"
        }
      }
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "tu@email.com" },
        password: { label: "Contraseña", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Credenciales inválidas")
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email as string
          }
        })

        if (!user || !user.password) {
          throw new Error("Usuario no encontrado")
        }

        const isValid = await bcrypt.compare(credentials.password as string, user.password)

        if (!isValid) {
          throw new Error("Contraseña incorrecta")
        }

        return user
      }
    })
  ],
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        const existingUser = await prisma.user.findUnique({ where: { email: user.email! } });
        if (existingUser) return true; // El usuario ya existe

        const invitation = await prisma.invitation.findUnique({ where: { email: user.email! } });
        if (!invitation) {
          // No tiene invitación, denegar acceso
          return "/login?error=AccessDenied";
        }
      }
      return true;
    }
  },
  events: {
    async createUser({ user }) {
      // Hook que se ejecuta justo después de que Prisma crea el usuario en la BD
      if (user.email) {
        const invitation = await prisma.invitation.findUnique({ where: { email: user.email } });
        if (invitation) {
          await prisma.user.update({
            where: { id: user.id },
            data: { 
              role: invitation.role, 
              emailVerified: new Date() 
            }
          });
          
          await prisma.invitation.delete({ where: { email: user.email } });

          // Notificar a los administradores
          const admins = await prisma.user.findMany({ where: { role: 'ADMIN' } });
          if (admins.length > 0) {
            await prisma.notification.createMany({
              data: admins.map(admin => ({
                userId: admin.id,
                title: "Nuevo miembro del equipo",
                message: `${user.name || user.email} ha aceptado su invitación y se ha unido.`,
                link: "/admin/equipo",
              }))
            });
          }
        }
      }
    }
  }
})
