import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL
    }
  }
});

async function main() {
  console.log("Starting query with DIRECT_URL...");
  const t0 = Date.now();
  const property = await prisma.property.findFirst();
  console.log("Query finished in", Date.now() - t0, "ms");
  console.log("Property id:", property?.id);
}

main().catch(console.error).finally(() => prisma.$disconnect());
