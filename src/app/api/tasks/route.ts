import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const listId = searchParams.get('listId');
    const isImportant = searchParams.get('isImportant') === 'true';
    
    let whereClause: any = {};
    if (listId) whereClause.listId = listId;
    if (isImportant) whereClause.isImportant = true;

    const tasks = await prisma.task.findMany({
      where: whereClause,
      include: {
        agent: true,
        lead: true,
        list: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    
    return NextResponse.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json({ error: "Error fetching tasks" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
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
      },
      include: {
        agent: true,
        lead: true,
        list: true,
      }
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json({ error: "Error creating task" }, { status: 500 });
  }
}
