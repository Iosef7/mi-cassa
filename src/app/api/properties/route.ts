import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createFolder } from '@/lib/google-drive';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const properties = await prisma.property.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        description: true,
        price: true,
        minPrice: true,
        type: true,
        status: true,
        location: true,
        bedrooms: true,
        bathrooms: true,
        area: true,
        availableUnits: true,
        deliveryDate: true
        // NOT FETCHING 'images' because it contains massive base64 strings that take 12s to download
      }
    });

    // Reduce payload size by extracting only the first image
    const optimizedProperties = properties.map(p => {
      let firstImage = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=600';
      try {
        const pImages = (p as any).images;
        if (pImages) {
          const parsed = JSON.parse(pImages);
          if (parsed && parsed.length > 0) {
            firstImage = parsed[0];
          }
        }
      } catch (e) {}
      
      return {
        ...p,
        images: JSON.stringify([firstImage])
      };
    });

    console.log("Returning optimized properties, isArray:", Array.isArray(optimizedProperties));
    return NextResponse.json(optimizedProperties);
  } catch (error) {
    console.error("Error fetching properties:", error);
    return NextResponse.json({ error: "Error fetching properties", details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, price, type, location, bedrooms, bathrooms, area, images, presentations, plans, videos, ownerName, ownerPhone, ownerEmail, ownerNotes, nearbyPlaces, dynamicFeatures, parentDriveFolderId } = body;

    let driveFolderId = null;

    // Crear carpeta en Google Drive si se seleccionó una carpeta padre
    if (parentDriveFolderId) {
      try {
        const folder = await createFolder(title, parentDriveFolderId);
        driveFolderId = folder.id;
      } catch (err) {
        console.error("Error creating Google Drive folder:", err);
        // Continuamos de todas formas, pero lo ideal sería notificar
      }
    }

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
        status: "DISPONIBLE",
        driveFolderId: driveFolderId
      }
    });

    return NextResponse.json(property, { status: 201 });
  } catch (error) {
    console.error("Error creating property:", error);
    return NextResponse.json({ error: "Error creating property" }, { status: 500 });
  }
}
