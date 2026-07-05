import { PrismaClient } from '../../prisma/generated/client';

const prismaClientSingleton = () => {
  let url = process.env.DATABASE_URL;
  // Ensure connection limit is safe to prevent pool exhaustion both locally and on Render
  if (url) {
    url = url.replace(/connection_limit=\d+/, 'connection_limit=5');
  }

  console.log("PRISMA DATABASE URL IN USE:", url?.replace(/:[^:@]{1,}@/, ':***@'));
  
  return new PrismaClient({
    datasources: { db: { url } },
    log: ['query'],
  })
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
