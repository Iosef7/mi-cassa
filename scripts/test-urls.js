const { PrismaClient } = require('./prisma/generated/client');
const prisma = new PrismaClient();
async function main() {
  const props = await prisma.property.findMany({ select: { title: true, images: true } });
  console.log(JSON.stringify(props, null, 2));
}
main().finally(() => prisma.$disconnect());
