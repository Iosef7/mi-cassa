import { prisma } from '@/lib/prisma';
import PropertyDetailClient from './PropertyDetailClient';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (id === 'new') return { title: 'Nueva Propiedad | Mi Cassa' };
  
  const property = await prisma.property.findUnique({
    where: { id },
    select: { title: true }
  });
  
  return {
    title: property ? `${property.title} | Mi Cassa` : 'Propiedad no encontrada',
  };
}

export default async function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (id === 'new') {
    return notFound();
  }

  return <PropertyDetailClient />;
}
