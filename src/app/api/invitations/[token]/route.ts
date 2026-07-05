import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: Promise<{ token: string }> }) {
  try {
    const { token } = await params;

    const invitation = await prisma.invitation.findUnique({
      where: { token },
    });

    if (!invitation) {
      return NextResponse.json({ error: 'Invitación no encontrada' }, { status: 404 });
    }

    if (new Date() > invitation.expiresAt) {
      return NextResponse.json({ error: 'La invitación ha expirado' }, { status: 400 });
    }

    // Return the email and role pre-assigned so the frontend can display/use them
    return NextResponse.json({ 
      email: invitation.email, 
      role: invitation.role 
    });
  } catch (error) {
    console.error("Error validating invitation:", error);
    return NextResponse.json({ error: "Error validando invitación" }, { status: 500 });
  }
}
