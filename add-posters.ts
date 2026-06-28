import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const property = await prisma.property.findFirst({
    where: {
      title: {
        contains: 'Villa Serena'
      }
    }
  });

  if (!property) {
    console.log('Property not found');
    return;
  }

  let presentations = {
    docs: [],
    plans: [],
    videos: [],
    legalDocs: [],
    posters: []
  };

  try {
    if (property.presentations) {
      presentations = { ...presentations, ...JSON.parse(property.presentations) };
    }
  } catch (e) {
    console.error('Error parsing presentations:', e);
  }

  // Add dummy posters
  presentations.posters = [
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80'
  ];

  await prisma.property.update({
    where: { id: property.id },
    data: {
      presentations: JSON.stringify(presentations)
    }
  });

  console.log('Posters added to property:', property.title);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
