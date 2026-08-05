import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: propertyId } = await params;
    const setting = await prisma.siteSettings.findUnique({
      where: { key: `ai_progress_${propertyId}` }
    });
    
    if (setting?.value) {
      return NextResponse.json(JSON.parse(setting.value));
    }
    
    return NextResponse.json(null);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch progress" }, { status: 500 });
  }
}
