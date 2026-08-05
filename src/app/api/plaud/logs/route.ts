import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const logsSetting = await prisma.systemSettings.findUnique({
      where: { key: 'plaud_processing_logs' },
    });

    const logs = logsSetting ? JSON.parse(logsSetting.value) : [];

    // Get meetings generated from Plaud Pro
    const plaudMeetings = await prisma.meeting.findMany({
      where: { title: { contains: '[Plaud Pro]' } },
      orderBy: { createdAt: 'desc' },
      take: 20,
      include: {
        lead: {
          select: { id: true, name: true, phone: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      logs,
      meetings: plaudMeetings,
    });
  } catch (error: any) {
    console.error('Error obteniendo logs de Plaud:', error);
    return NextResponse.json({ error: 'Error al cargar historial' }, { status: 500 });
  }
}
