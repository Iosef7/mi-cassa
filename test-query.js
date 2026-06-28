const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const prop = await prisma.property.findFirst();
  console.log('ID:', prop.id, 'DYNAMIC:', prop.dynamicFeatures);
}

main().finally(() => prisma.$disconnect());
