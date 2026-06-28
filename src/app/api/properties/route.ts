import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const properties = await prisma.property.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(properties);
  } catch (error) {
    console.error("Error fetching properties:", error);
    return NextResponse.json({ error: "Error fetching properties" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, price, type, location, bedrooms, bathrooms, area, images, presentations, plans, videos, ownerName, ownerPhone, ownerEmail, ownerNotes, nearbyPlaces, dynamicFeatures } = body;

    const property = await prisma.property.create({
      data: {
        title,
        description,
        price,
        type,
        location,
        ownerName,
        ownerPhone,
        ownerEmail,
        ownerNotes,
        bedrooms: bedrooms ? parseInt(bedrooms) : null,
        bathrooms: bathrooms ? parseInt(bathrooms) : null,
        area: area ? parseFloat(area) : null,
        images: JSON.stringify(images || []),
        nearbyPlaces: nearbyPlaces ? JSON.stringify(nearbyPlaces) : null,
        dynamicFeatures: dynamicFeatures ? JSON.stringify(dynamicFeatures) : null,
        presentations: JSON.stringify({
          docs: presentations || [],
          plans: plans || [],
          videos: videos || []
        }),
        status: "DISPONIBLE"
      }
    });

    return NextResponse.json(property, { status: 201 });
  } catch (error) {
    console.error("Error creating property:", error);
    return NextResponse.json({ error: "Error creating property" }, { status: 500 });
  }
}
