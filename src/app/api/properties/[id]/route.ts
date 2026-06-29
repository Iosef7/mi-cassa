import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const property = await prisma.property.findUnique({
      where: { id },
      include: {
        leads: {
          orderBy: { createdAt: 'desc' },
          include: {
            appointments: { orderBy: { date: 'asc' } },
            calls: { orderBy: { createdAt: 'desc' } },
            messages: { orderBy: { createdAt: 'desc' } },
            tasks: { orderBy: { dueDate: 'asc' } }
          }
        }
      }
    });
    
    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    const filterBase64 = (jsonStr: string | null) => {
      if (!jsonStr) return jsonStr;
      try {
        const parsed = JSON.parse(jsonStr);
        if (Array.isArray(parsed)) {
          return JSON.stringify(parsed.map(url => url.startsWith('data:') ? '' : url).filter(Boolean));
        }
        if (typeof parsed === 'object') {
          const newObj: any = {};
          for (const key in parsed) {
            if (Array.isArray(parsed[key])) {
              newObj[key] = parsed[key].map((url: string) => url.startsWith('data:') ? '' : url).filter(Boolean);
            } else {
              newObj[key] = parsed[key];
            }
          }
          return JSON.stringify(newObj);
        }
      } catch (e) {}
      return jsonStr;
    };

    property.images = filterBase64(property.images);
    property.presentations = filterBase64(property.presentations);
    
    return NextResponse.json(property);
  } catch (error) {
    console.error("Error fetching property:", error);
    return NextResponse.json({ error: "Error fetching property", details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Only update fields that are provided
    const updateData: any = {};
    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.price !== undefined) updateData.price = body.price;
    if (body.type !== undefined) updateData.type = body.type;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.location !== undefined) updateData.location = body.location;
    if (body.bedrooms !== undefined) updateData.bedrooms = body.bedrooms ? parseInt(body.bedrooms) : null;
    if (body.bathrooms !== undefined) updateData.bathrooms = body.bathrooms ? parseInt(body.bathrooms) : null;
    if (body.area !== undefined) updateData.area = body.area ? parseFloat(body.area) : null;
    if (body.images !== undefined) updateData.images = JSON.stringify(body.images);
    if (body.ownerName !== undefined) updateData.ownerName = body.ownerName;
    if (body.ownerPhone !== undefined) updateData.ownerPhone = body.ownerPhone;
    if (body.ownerEmail !== undefined) updateData.ownerEmail = body.ownerEmail;
    if (body.ownerNotes !== undefined) updateData.ownerNotes = body.ownerNotes;
    if (body.nearbyPlaces !== undefined) updateData.nearbyPlaces = body.nearbyPlaces ? JSON.stringify(body.nearbyPlaces) : null;
    if (body.dynamicFeatures !== undefined) updateData.dynamicFeatures = body.dynamicFeatures ? JSON.stringify(body.dynamicFeatures) : null;
    if (body.independentUnit !== undefined) updateData.independentUnit = body.independentUnit;
    if (body.presentations !== undefined || body.plans !== undefined || body.videos !== undefined || body.legalDocs !== undefined || body.posters !== undefined) {
      updateData.presentations = JSON.stringify({
        docs: body.presentations || [],
        plans: body.plans || [],
        videos: body.videos || [],
        legalDocs: body.legalDocs || [],
        posters: body.posters || []
      });
    }

    const property = await prisma.property.update({
      where: { id },
      data: updateData,
      select: { id: true }
    });

    return NextResponse.json(property);
  } catch (error) {
    console.error("Error updating property:", error);
    return NextResponse.json({ error: "Error updating property" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.property.delete({
      where: { id },
      select: { id: true }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting property:", error);
    return NextResponse.json({ error: "Error deleting property" }, { status: 500 });
  }
}
