import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const property = await prisma.property.findFirst();
  if (!property) return;

  const agent = await prisma.user.findFirst();

  // Create two leads interested in this property
  await prisma.lead.create({
    data: {
      name: 'Carlos Mendoza',
      email: 'carlos.mendoza@ejemplo.com',
      phone: '+52 55 1234 5678',
      status: 'VISITA_AGENDADA',
      budget: 18000000,
      source: 'Website',
      propertyId: property.id,
      agentId: agent?.id
    }
  });

  await prisma.lead.create({
    data: {
      name: 'Ana Sofia Garcia',
      email: 'ana.sofia@ejemplo.com',
      phone: '+52 55 8765 4321',
      status: 'NEGOCIACION',
      budget: 19500000,
      source: 'WhatsApp',
      propertyId: property.id,
      agentId: agent?.id
    }
  });

  console.log('✅ Clientes interesados de prueba creados.');
}

main().catch(console.error).finally(() => prisma.$disconnect());
