import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import { Resend } from 'resend';
import { auth } from "@/auth";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado. Solo los administradores pueden invitar miembros.' }, { status: 403 });
    }

    const { email, role } = await request.json();

    if (!email || !role) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
    }

    // Rate Limiting Básico: Máximo 10 invitaciones por cada 5 minutos en todo el sistema
    const fiveMinutesAgo = new Date();
    fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5);
    const recentInvitationsCount = await prisma.invitation.count({
      where: {
        createdAt: { gte: fiveMinutesAgo }
      }
    });

    if (recentInvitationsCount >= 10) {
      return NextResponse.json({ error: 'Has superado el límite de 10 invitaciones por cada 5 minutos. Por favor, espera un momento para evitar bloqueos por spam.' }, { status: 429 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'El usuario ya existe en el sistema' }, { status: 400 });
    }

    // Generate token
    const token = crypto.randomBytes(32).toString('hex');
    
    // Expires in 24 hours
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    // Create or update invitation (in case they generate a new one for the same email)
    const invitation = await prisma.invitation.upsert({
      where: { email },
      update: { token, role, expiresAt, createdAt: new Date() },
      create: { email, token, role, expiresAt }
    });

    let emailSent = false;
    let emailErrorMessage = null;

    const origin = request.headers.get('origin');
    const host = request.headers.get('host');
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    const baseUrl = origin || (host ? `${protocol}://${host}` : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000');
    
    const inviteUrl = `${baseUrl}/register?token=${token}`;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
        <h2 style="color: #2563eb; text-align: center;">¡Estás invitado a Mi Cassa CRM!</h2>
        <p style="color: #374151; font-size: 16px;">Hola,</p>
        <p style="color: #374151; font-size: 16px;">Has sido invitado a formar parte del equipo en Mi Cassa CRM con el rol de <strong>${role === 'ADMIN' ? 'Administrador' : role === 'AGENT' ? 'Asesor' : role}</strong>.</p>
        <p style="color: #374151; font-size: 16px;">Para aceptar la invitación y crear tu cuenta, haz clic en el botón de abajo. Este enlace caducará en 24 horas.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${inviteUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Aceptar Invitación y Registrarse</a>
        </div>
        <p style="color: #6b7280; font-size: 14px;">Si el botón no funciona, copia y pega este enlace en tu navegador:</p>
        <p style="color: #6b7280; font-size: 12px; word-break: break-all;">${inviteUrl}</p>
      </div>
    `;

    // Intentar enviar con Nodemailer si está configurado en .env
    if (process.env.SMTP_EMAIL && process.env.SMTP_PASSWORD) {
      try {
        const nodemailer = require('nodemailer');
        const transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com', // Asumiendo gmail por el correo en el .env
          port: 465,
          secure: true,
          auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD,
          },
        });

        await transporter.sendMail({
          from: `"Mi Cassa CRM" <${process.env.SMTP_EMAIL}>`,
          to: email,
          subject: 'Invitación para unirte a Mi Cassa CRM',
          html: htmlContent,
        });

        console.log("Email sent successfully via Nodemailer");
        emailSent = true;
      } catch (err: any) {
        console.error("Exception sending invitation via Nodemailer:", err);
        emailErrorMessage = err.message;
      }
    } 
    // Fallback a Resend si está configurado
    else if (process.env.RESEND_API_KEY && resend) {
      try {
        const { data, error } = await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || 'Mi Cassa CRM <onboarding@resend.dev>',
          to: [email],
          subject: 'Invitación para unirte a Mi Cassa CRM',
          html: htmlContent,
        });

        if (error) {
          console.error("Error sending invitation via Resend:", error);
          emailErrorMessage = error.message;
        } else {
          console.log("Email sent successfully via Resend:", data);
          emailSent = true;
        }
      } catch (err: any) {
        console.error("Exception sending invitation via Resend:", err);
        emailErrorMessage = err.message;
      }
    } else {
      console.warn("ADVERTENCIA: Ningún proveedor de correo configurado (Falta SMTP_EMAIL/PASSWORD o RESEND_API_KEY). El correo no se enviará.");
      emailErrorMessage = "El proveedor de correo no está configurado (SMTP o Resend faltante).";
    }

    return NextResponse.json({ 
      token: invitation.token,
      emailSent,
      message: emailSent ? 'Invitación enviada por correo exitosamente.' : (emailErrorMessage || 'El proveedor de correo no está configurado (RESEND_API_KEY faltante).')
    });
  } catch (error) {
    console.error("Error creating invitation:", error);
    return NextResponse.json({ error: "Error interno al crear invitación" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const invitations = await prisma.invitation.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(invitations);
  } catch (error) {
    console.error("Error fetching invitations:", error);
    return NextResponse.json({ error: "Error al obtener invitaciones" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID requerido' }, { status: 400 });
    }

    await prisma.invitation.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting invitation:", error);
    return NextResponse.json({ error: "Error al eliminar invitación" }, { status: 500 });
  }
}

