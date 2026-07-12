import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(request: Request) {
  try {
    const { email, role } = await request.json();

    if (!email || !role) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
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
      update: { token, role, expiresAt },
      create: { email, token, role, expiresAt }
    });

    // Send email using Resend
    if (process.env.RESEND_API_KEY) {
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

      // Enviar el correo en segundo plano usando Resend
      Promise.resolve().then(async () => {
        try {
          const { data, error } = await resend!.emails.send({
            // Cambia este correo por uno de tu dominio verificado cuando pases a producción
            from: process.env.RESEND_FROM_EMAIL || 'Mi Cassa CRM <onboarding@resend.dev>',
            to: [email],
            subject: 'Invitación para unirte a Mi Cassa CRM',
            html: htmlContent,
          });

          if (error) {
            console.error("Error sending invitation via Resend:", error);
          } else {
            console.log("Email sent successfully via Resend:", data);
          }
        } catch (err: any) {
          console.error("Exception sending invitation via Resend:", err);
        }
      });
    } else {
      console.warn("ADVERTENCIA: La variable de entorno RESEND_API_KEY no está configurada. El correo no se enviará.");
    }

    return NextResponse.json({ token: invitation.token });
  } catch (error) {
    console.error("Error creating invitation:", error);
    return NextResponse.json({ error: "Error interno al crear invitación" }, { status: 500 });
  }
}
