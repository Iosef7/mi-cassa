import { Metadata, ResolvingMetadata } from 'next';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import PropertyClientView from './PropertyClientView';

type Props = {
  params: { id: string };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params;
  const property = await prisma.property.findUnique({
    where: { id },
    select: {
      title: true,
      description: true,
      images: true,
      price: true,
      operationType: true,
    },
  });

  if (!property) {
    return {
      title: 'Propiedad no encontrada - Mi Cassa',
    };
  }

  let imageUrl = '/logo_final.png';
  try {
    if (property.images) {
      const parsed = JSON.parse(property.images);
      if (Array.isArray(parsed) && parsed.length > 0) {
        imageUrl = parsed[0];
      }
    }
  } catch (e) {
    // Ignore parse error
  }

  const title = `${property.operationType} - ${property.title} | Mi Cassa`;
  const description = property.description?.substring(0, 160) || `Increíble propiedad en ${property.operationType.toLowerCase()} por ${property.price} ILS.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: property.title,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function PublicPropertyPage({ params }: Props) {
  const { id } = await params;
  
  // Only select non-sensitive fields
  const property = await prisma.property.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      description: true,
      price: true,
      type: true,
      status: true,
      location: true,
      bedrooms: true,
      bathrooms: true,
      area: true,
      images: true,
      operationType: true,
      availableUnits: true,
      deliveryDate: true,
      minPrice: true,
      maxPrice: true,
      presentations: true,
      dynamicFeatures: true,
      nearbyPlaces: true,
      independentUnit: true,
    },
  });

  if (!property) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <PropertyClientView property={property} />
    </div>
  );
}
