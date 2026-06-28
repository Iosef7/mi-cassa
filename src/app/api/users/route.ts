import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: {
        _count: {
          select: { leads: true, tasks: true }
        },
        tasks: {
          where: { status: 'PENDIENTE' },
          select: { id: true }
        }
      },
      orderBy: { name: 'asc' }
    });

    const formattedUsers = users.map(user => ({
      ...user,
      pendingTasksCount: user.tasks.length,
      totalLeadsCount: user._count.leads,
      totalTasksCount: user._count.tasks
    }));

    return NextResponse.json(formattedUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Error fetching users" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        role: body.role || 'AGENT',
      }
    });
    return NextResponse.json(user);
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ error: "Error creating user" }, { status: 500 });
  }
}
