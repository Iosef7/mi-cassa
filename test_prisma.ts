import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("Starting query...");
  const t0 = Date.now();
  const property = await prisma.property.findUnique({
    where: { id: 'cmqze8s3r0000f3w8ikp2je20' },
    include: {
      leads: {
        orderBy: { createdAt: 'desc' },
        include: {
          appointments: { orderBy: { date: 'asc' } },
          calls: { orderBy: { createdAt: 'desc' } },
          messages: { orderBy: { createdAt: 'desc' } },
          tasks: { orderBy: { dueDate: 'asc' } }
        }
      }
    }
  });
  console.log("Query finished in", Date.now() - t0, "ms");
  console.log("Property title:", property?.title);
}

main().catch(console.error).finally(() => prisma.$disconnect());
