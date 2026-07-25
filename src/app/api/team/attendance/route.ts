import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const auth = await verifyAuth();
    if (!auth) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '30');

    const whereCondition: any = {};
    if (userId) {
      whereCondition.userId = userId;
    }

    const logs = await prisma.dailyProductivityLog.findMany({
      where: whereCondition,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            lastSeenAt: true
          }
        }
      },
      orderBy: { date: 'desc' },
      take: limit
    });

    const formatted = logs.map(log => {
      const start = new Date(log.firstSeenAt);
      const end = new Date(log.lastSeenAt);
      const diffMs = Math.max(0, end.getTime() - start.getTime());
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

      return {
        id: log.id,
        userId: log.userId,
        userName: log.user.name,
        userEmail: log.user.email,
        userRole: log.user.role,
        userStatus: log.user.status,
        date: log.date,
        firstSeenAt: log.firstSeenAt,
        lastSeenAt: log.lastSeenAt,
        dailyGoal: log.dailyGoal,
        durationFormatted: `${hours}h ${minutes}m`,
        durationMinutes: Math.round(diffMs / 60000)
      };
    });

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Error fetching attendance logs:", error);
    return NextResponse.json({ error: "Error fetching attendance logs" }, { status: 500 });
  }
}
