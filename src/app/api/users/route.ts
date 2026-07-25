import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: { leads: true, tasks: true }
        },
        tasks: {
          where: { status: 'PENDIENTE' },
          select: { id: true }
        },
        productivityLogs: {
          orderBy: { date: 'desc' },
          take: 30
        }
      },
      orderBy: { name: 'asc' }
    });

    const todayStr = new Date().toISOString().split('T')[0];

    const formattedUsers = users.map(user => {
      const todayLog = user.productivityLogs.find(log => {
        const logDateStr = new Date(log.date).toISOString().split('T')[0];
        return logDateStr === todayStr;
      });

      return {
        ...user,
        pendingTasksCount: user.tasks.length,
        totalLeadsCount: user._count.leads,
        totalTasksCount: user._count.tasks,
        todayAttendance: todayLog ? {
          firstSeenAt: todayLog.firstSeenAt,
          lastSeenAt: todayLog.lastSeenAt,
          dailyGoal: todayLog.dailyGoal
        } : null,
        productivityLogs: user.productivityLogs
      };
    });

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
