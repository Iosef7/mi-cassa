import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const listId = searchParams.get('listId');
    const isImportant = searchParams.get('isImportant') === 'true';
    const since = searchParams.get('since');
    
    let whereClause: any = {};
    if (listId) whereClause.listId = listId;
    if (isImportant) whereClause.isImportant = true;
    if (since) {
      whereClause.createdAt = { gt: new Date(since) };
    }

    const tasks = await prisma.task.findMany({
      where: whereClause,
      include: {
        agent: true,
        lead: true,
        list: true,
        property: true,
        subtasks: true,
        comments: {
          include: { user: true }
        },
        attachments: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    
    return NextResponse.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json({ error: "Error fetching tasks" }, { status: 500 });
  }
}

import { cookies } from 'next/headers';
import { verifyAuth } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('session')?.value;
    const auth = await verifyAuth(token);
    if (!auth) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    const body = await request.json();
    
    if (!body.title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const task = await prisma.task.create({
      data: {
        title: body.title,
        description: body.description || null,
        status: body.status || 'PENDIENTE',
        isImportant: body.isImportant || false,
        dueDate: body.dueDate ? new Date(body.dueDate) : null,
        assignedTo: body.assignedTo || null,
        listId: body.listId || null,
        leadId: body.leadId || null,
        propertyId: body.propertyId || null,
        recurrenceRule: body.recurrenceRule || null,
      },
      include: {
        agent: true,
        lead: true,
        list: true,
        property: true,
        subtasks: true,
        comments: true,
        attachments: true,
      }
    });

    // Create Audit Log
    await prisma.taskAuditLog.create({
      data: {
        action: 'CREATE',
        details: `Task created by ${auth.name}`,
        taskId: task.id,
        userId: auth.id
      }
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json({ error: "Error creating task" }, { status: 500 });
  }
}
