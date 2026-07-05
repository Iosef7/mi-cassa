import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const notifications = await prisma.notification.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 20 // Fetch last 20 notifications
    });

    return NextResponse.json(notifications);
  } catch (error) {
    console.error("Notifications GET Error:", error);
    return NextResponse.json({ error: "Error fetching notifications" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { id } = body;

    if (!id) {
       // Mark all as read
       await prisma.notification.updateMany({
         where: { userId: session.user.id, read: false },
         data: { read: true }
       });
       return NextResponse.json({ success: true });
    }

    const notification = await prisma.notification.update({
      where: { id },
      data: { read: true }
    });

    return NextResponse.json(notification);
  } catch (error) {
    console.error("Notifications PUT Error:", error);
    return NextResponse.json({ error: "Error updating notification" }, { status: 500 });
  }
}
