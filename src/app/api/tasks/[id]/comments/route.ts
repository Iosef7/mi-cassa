import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { verifyAuth } from '@/lib/auth';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('session')?.value;
    const auth = await verifyAuth(token);
    if (!auth) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    const body = await request.json();
    const comment = await prisma.taskComment.create({
      data: {
        content: body.content,
        taskId: (await params).id,
        userId: auth.id
      },
      include: {
        user: true
      }
    });

    return NextResponse.json(comment);
  } catch (error) {
    return NextResponse.json({ error: 'Error al añadir comentario' }, { status: 500 });
  }
}
