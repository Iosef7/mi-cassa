import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const property = await prisma.property.findFirst({
    where: { title: { contains: 'Villa Serena' } },
    include: { leads: true }
  });

  if (!property) {
    console.log("No se encontro Villa Serena");
    return;
  }

  const leads = property.leads;
  
  if (leads.length === 0) {
    console.log("No hay leads en Villa Serena");
    return;
  }

  const user = await prisma.user.findFirst();
  if (!user) {
    console.log("No hay usuarios, creando uno");
    await prisma.user.create({
      data: {
        email: "test@micassa.com",
        name: "Test Agent",
        role: "AGENT"
      }
    });
  }

  const agentId = (await prisma.user.findFirst())?.id;

  for (const lead of leads) {
    // 1. Actualizar source e hipoteca
    await prisma.lead.update({
      where: { id: lead.id },
      data: {
        source: Math.random() > 0.5 ? 'Facebook Ads' : 'Organic',
        requiresMortgage: Math.random() > 0.5,
      }
    });

    // 2. Crear algunas llamadas
    await prisma.call.create({
      data: {
        leadId: lead.id,
        duration: Math.floor(Math.random() * 300) + 60,
        summary: "El cliente preguntó sobre las amenidades del conjunto y las opciones de financiamiento.",
        sentiment: Math.random() > 0.3 ? "Positivo" : "Neutro",
      }
    });

    // 3. Crear algunos mensajes
    await prisma.message.create({
      data: {
        leadId: lead.id,
        content: "Hola, me interesa agendar una visita presencial para este fin de semana.",
        fromBot: false
      }
    });

    await prisma.message.create({
      data: {
        leadId: lead.id,
        content: "¡Claro! Confirmado para el sábado a las 10am.",
        fromBot: true
      }
    });

    // 4. Crear tareas
    await prisma.task.create({
      data: {
        title: "Enviar cotización formal",
        status: "PENDIENTE",
        dueDate: new Date(Date.now() + 86400000), // tomorrow
        assignedTo: agentId!,
        leadId: lead.id
      }
    });
  }

  console.log("Datos del CRM generados correctamente.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
