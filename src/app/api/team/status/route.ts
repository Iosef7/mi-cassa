import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { verifyAuth } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('session')?.value;
    const auth = await verifyAuth(token);
    
    if (!auth) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { status, currentFocus, dailyGoal } = body;
    const now = new Date();

    const dataToUpdate: any = { lastSeenAt: now };
    if (status !== undefined) dataToUpdate.status = status;
    if (currentFocus !== undefined) dataToUpdate.currentFocus = currentFocus;

    await prisma.user.update({
      where: { id: auth.id },
      data: dataToUpdate
    });

    if (dailyGoal !== undefined) {
      const today = new Date(now);
      today.setHours(0, 0, 0, 0);

      await prisma.dailyProductivityLog.upsert({
        where: {
          userId_date: {
            userId: auth.id,
            date: today,
          }
        },
        update: {
          dailyGoal: dailyGoal,
          lastSeenAt: now,
        },
        create: {
          userId: auth.id,
          date: today,
          firstSeenAt: now,
          lastSeenAt: now,
          dailyGoal: dailyGoal,
        }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating team status:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
