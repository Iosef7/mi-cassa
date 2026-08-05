import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  // Extraemos el ID directamente de la URL para evitar el bug de 'await params' de Next.js 15+
  const propertyId = req.nextUrl.pathname.split('/')[3];
  
  try {
    // Marcamos el lock como cancelado
    await prisma.siteSettings.updateMany({
      where: { key: `ai_lock_${propertyId}` },
      data: { value: 'cancelled' }
    });

    // Actualizamos el progreso visual
    await prisma.siteSettings.upsert({
      where: { key: `ai_progress_${propertyId}` },
      update: { value: JSON.stringify({ percent: 100, message: 'Proceso cancelado por el usuario' }) },
      create: { key: `ai_progress_${propertyId}`, value: JSON.stringify({ percent: 100, message: 'Proceso cancelado por el usuario' }) }
    });

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
