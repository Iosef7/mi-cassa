import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { verifyAuth } from '@/lib/auth';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('session')?.value;
    const auth = await verifyAuth(token);
    if (!auth) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    const { id } = await params;
    const body = await request.json();

    const task = await prisma.task.update({
      where: { id },
      data: {
        ...(body.title !== undefined && { title: body.title }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.status !== undefined && { status: body.status }),
        ...(body.isImportant !== undefined && { isImportant: body.isImportant }),
        ...(body.dueDate !== undefined && { dueDate: body.dueDate ? new Date(body.dueDate) : null }),
        ...(body.assignedTo !== undefined && { assignedTo: body.assignedTo }),
        ...(body.listId !== undefined && { listId: body.listId }),
        ...(body.leadId !== undefined && { leadId: body.leadId }),
      },
      include: {
        agent: true,
        lead: true,
        list: true,
      }
    });

    // Create Audit Log
    await prisma.taskAuditLog.create({
      data: {
        action: 'UPDATE',
        details: `Task updated by ${auth.name}`,
        taskId: id,
        userId: auth.id
      }
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json({ error: "Error updating task" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('session')?.value;
    const auth = await verifyAuth(token);
    if (!auth) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    
    // Solo los administradores pueden borrar tareas
    if (auth.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Acceso denegado: Solo los administradores pueden eliminar tareas.' }, { status: 403 });
    }

    const { id } = await params;
    
    await prisma.task.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json({ error: "Error deleting task" }, { status: 500 });
  }
}
