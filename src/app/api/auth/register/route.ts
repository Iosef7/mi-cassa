import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  try {
    const { name, password, token } = await req.json()

    if (!name || !password || !token) {
      return NextResponse.json(
        { message: "Faltan campos requeridos o token de invitación" },
        { status: 400 }
      )
    }

    // Verify invitation token
    const invitation = await prisma.invitation.findUnique({
      where: { token },
    })

    if (!invitation) {
      return NextResponse.json(
        { message: "Enlace de invitación inválido" },
        { status: 400 }
      )
    }

    if (new Date() > invitation.expiresAt) {
      return NextResponse.json(
        { message: "El enlace de invitación ha expirado" },
        { status: 400 }
      )
    }

    const email = invitation.email;
    const role = invitation.role;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { message: "El correo electrónico ya está registrado" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role
      },
    })

    // Consume (delete) the invitation so it can't be used again
    await prisma.invitation.delete({
      where: { token }
    })

    return NextResponse.json(
      { message: "Usuario creado exitosamente", user: { id: user.id, name: user.name, email: user.email } },
      { status: 201 }
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { message: "Ocurrió un error al registrar el usuario" },
      { status: 500 }
    )
  }
}
