import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const lists = await prisma.taskList.findMany({
      orderBy: { createdAt: 'asc' },
    });
    return NextResponse.json(lists);
  } catch (error) {
    console.error("Error fetching task lists:", error);
    return NextResponse.json({ error: "Error fetching task lists" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (!body.name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const list = await prisma.taskList.create({
      data: {
        name: body.name,
        color: body.color || null,
      }
    });

    return NextResponse.json(list);
  } catch (error) {
    console.error("Error creating task list:", error);
    return NextResponse.json({ error: "Error creating task list" }, { status: 500 });
  }
}
