import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { ids } = body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "No IDs provided" }, { status: 400 });
    }

    // First, handle related records for all these IDs
    await prisma.$transaction([
      prisma.call.deleteMany({ where: { leadId: { in: ids } } }),
      prisma.task.updateMany({ where: { leadId: { in: ids } }, data: { leadId: null } }),
      prisma.lead.deleteMany({ where: { id: { in: ids } } })
    ]);

    return NextResponse.json({ success: true, count: ids.length });
  } catch (error: any) {
    console.error("Error deleting multiple leads:", error);
    return NextResponse.json({ error: error.message || "Error deleting leads" }, { status: 500 });
  }
}
