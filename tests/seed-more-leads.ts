import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const firstNames = ['Alejandro', 'Sofia', 'Mateo', 'Valentina', 'Diego', 'Camila', 'Leonardo', 'Isabella', 'Daniel', 'Mariana'];
const lastNames = ['Garcia', 'Martinez', 'Rodriguez', 'Lopez', 'Hernandez', 'Gonzalez', 'Perez', 'Sanchez', 'Ramirez', 'Torres'];
const statuses = ['NUEVO', 'CONTACTADO', 'VISITA_AGENDADA', 'NEGOCIACION', 'FIRMA', 'CERRADO_GANADO'];
const sources = ['Meta Ads', 'Google Ads', 'Website', 'Referido', 'WhatsApp', 'Instagram'];

function getRandomElement(arr: any[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateRandomPhone() {
  const code = '+52';
  const prefix = '55';
  const body = Math.floor(10000000 + Math.random() * 90000000); // 8 digit number
  return `${code} ${prefix} ${body}`;
}

async function main() {
  const agent = await prisma.user.findFirst();
  const properties = await prisma.property.findMany();

  const leadsData = [];

  for (let i = 0; i < 15; i++) {
    const firstName = getRandomElement(firstNames);
    const lastName = getRandomElement(lastNames);
    const name = `${firstName} ${lastName}`;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(Math.random() * 100)}@ejemplo.com`;
    
    // 70% chance to be linked to a property
    const propertyId = Math.random() > 0.3 && properties.length > 0 
      ? getRandomElement(properties).id 
      : null;

    leadsData.push({
      name,
      email,
      phone: generateRandomPhone(),
      status: getRandomElement(statuses),
      budget: Math.floor(2000000 + Math.random() * 18000000), // Budget between 2M and 20M
      source: getRandomElement(sources),
      requiresMortgage: Math.random() > 0.5,
      agentId: agent?.id || null,
      propertyId,
    });
  }

  // Create leads in bulk
  await prisma.lead.createMany({
    data: leadsData
  });

  console.log(`✅ ${leadsData.length} clientes (Leads) inventados agregados exitosamente.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
