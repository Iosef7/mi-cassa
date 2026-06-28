import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const lead = await prisma.lead.update({
      where: { id },
      data: { 
        ...(body.status && { status: body.status }),
        ...(body.name !== undefined && { name: body.name }),
        ...(body.email !== undefined && { email: body.email }),
        ...(body.phone !== undefined && { phone: body.phone }),
        ...(body.budget !== undefined && { budget: body.budget }),
        ...(body.notes !== undefined && { notes: body.notes }),
        ...(body.source !== undefined && { source: body.source }),
        ...(body.requiresMortgage !== undefined && { requiresMortgage: body.requiresMortgage }),
        ...(body.preferences !== undefined && { preferences: body.preferences })
      }
    });

    return NextResponse.json(lead);
  } catch (error) {
    console.error("Error updating lead:", error);
    return NextResponse.json({ error: "Error updating lead" }, { status: 500 });
  }
}
