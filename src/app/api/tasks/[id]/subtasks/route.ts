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
    const subtask = await prisma.subtask.create({
      data: {
        title: body.title,
        taskId: (await params).id
      }
    });

    return NextResponse.json(subtask);
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear subtarea' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('session')?.value;
    const auth = await verifyAuth(token);
    if (!auth) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    const body = await request.json();
    const url = new URL(request.url);
    const subtaskId = url.searchParams.get('subtaskId');

    if (!subtaskId) return NextResponse.json({ error: 'ID no proporcionado' }, { status: 400 });

    const subtask = await prisma.subtask.update({
      where: { id: subtaskId },
      data: { isCompleted: body.isCompleted, title: body.title }
    });

    return NextResponse.json(subtask);
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar subtarea' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('session')?.value;
    const auth = await verifyAuth(token);
    if (!auth) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    const url = new URL(request.url);
    const subtaskId = url.searchParams.get('subtaskId');

    if (!subtaskId) return NextResponse.json({ error: 'ID no proporcionado' }, { status: 400 });

    await prisma.subtask.delete({
      where: { id: subtaskId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar subtarea' }, { status: 500 });
  }
}
