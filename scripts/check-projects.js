const { PrismaClient } = require('./prisma/generated/client');
const prisma = new PrismaClient();

async function main() {
  const projects = await prisma.developmentProject.findMany();
  console.log('Total DevelopmentProjects:', projects.length);
  const properties = await prisma.property.findMany();
  console.log('Total Properties:', properties.length);
  console.log(properties.map(p => `${p.title} (${p.type})`));
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
