import { prisma } from '@/lib/prisma';
import PropiedadesClient from './PropiedadesClient';

export default async function PropiedadesFetcher() {
  const properties = await prisma.property.findMany({
    where: { operationType: 'RENTA' },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      price: true,
      minPrice: true,
      type: true,
      status: true,
      location: true,
      bedrooms: true,
      bathrooms: true,
      area: true,
      availableUnits: true,
      deliveryDate: true,
      images: true 
    }
  });

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
      price: p.price.toString(),
      minPrice: p.minPrice ? p.minPrice.toString() : null,
      maxPrice: null, // Since we omit it in DB select, keeping type safe
      description: '', // omitted in DB fetch to keep size small
      images: JSON.stringify([firstImage])
    };
  });

  return <PropiedadesClient initialProperties={optimizedProperties as any} />;
}
