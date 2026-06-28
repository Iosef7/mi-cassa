const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const props = await prisma.property.findMany();
  props.forEach(p => {
    console.log('Prop', p.id);
    console.log('Images length:', p.images ? p.images.length : 0);
    console.log('Presentations length:', p.presentations ? p.presentations.length : 0);
    console.log('Nearby length:', p.nearbyPlaces ? p.nearbyPlaces.length : 0);
  });
}
main().catch(console.error).finally(() => prisma.$disconnect());
