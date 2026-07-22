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
    const { status = 'ONLINE' } = body;
    const now = new Date();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);

    await prisma.user.update({
      where: { id: auth.id },
      data: {
        lastSeenAt: now,
        ...(status && { status }) 
      }
    });

    const dailyLog = await prisma.dailyProductivityLog.upsert({
      where: {
        userId_date: {
          userId: auth.id,
          date: today,
        }
      },
      update: {
        lastSeenAt: now,
      },
      create: {
        userId: auth.id,
        date: today,
        firstSeenAt: now,
        lastSeenAt: now,
      }
    });

    return NextResponse.json({ success: true, logId: dailyLog.id });
  } catch (error) {
    console.error("Error in presence heartbeat:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
