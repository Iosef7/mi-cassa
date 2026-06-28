const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Limpiando base de datos...");
  // Limpiar en orden de dependencias
  await prisma.task.deleteMany({});
  await prisma.call.deleteMany({});
  await prisma.message.deleteMany({});
  await prisma.appointment.deleteMany({});
  await prisma.lead.deleteMany({});
  await prisma.property.deleteMany({});
  await prisma.user.deleteMany({});

  console.log("Creando Usuarios (Equipo)...");
  const user1 = await prisma.user.create({
    data: { name: "Iosef (Admin)", email: "iosef@micassa.com", role: "ADMIN" }
  });
  const user2 = await prisma.user.create({
    data: { name: "Ana Martínez", email: "ana@micassa.com", role: "AGENT" }
  });
  const user3 = await prisma.user.create({
    data: { name: "Carlos Ruiz", email: "carlos@micassa.com", role: "AGENT" }
  });

  console.log("Creando Propiedades / Proyectos...");
  const prop1 = await prisma.property.create({
    data: {
      title: "Residencial Las Nubes (Torre A)",
      description: "Espectacular torre de departamentos de lujo con amenidades exclusivas.",
      price: 5000000, minPrice: 5000000, maxPrice: 8500000,
      type: "PROYECTO", status: "DISPONIBLE", location: "Polanco, CDMX",
      availableUnits: 12, deliveryDate: "Q3 2025",
      images: JSON.stringify(["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800"])
    }
  });

  const prop2 = await prisma.property.create({
    data: {
      title: "Casa Boutique San Ángel",
      description: "Casa estilo colonial moderna, recientemente remodelada. Excelente iluminación natural.",
      price: 12500000,
      type: "CASA", status: "DISPONIBLE", location: "San Ángel, CDMX",
      bedrooms: 4, bathrooms: 4, area: 350,
      images: JSON.stringify(["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800"])
    }
  });

  const prop3 = await prisma.property.create({
    data: {
      title: "Penthouse Santa Fe Vista",
      description: "Increíble vista panorámica a la ciudad, acabados de lujo de importación.",
      price: 18000000,
      type: "DEPARTAMENTO", status: "DISPONIBLE", location: "Santa Fe, CDMX",
      bedrooms: 3, bathrooms: 3, area: 280,
      images: JSON.stringify(["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800"])
    }
  });

  console.log("Creando Clientes (Leads)...");
  const lead1 = await prisma.lead.create({
    data: {
      name: "Roberto Garza", email: "roberto.g@gmail.com", phone: "525511223344",
      status: "VISITA_AGENDADA", budget: 15000000, source: "WhatsApp Bot",
      preferences: JSON.stringify({ "zonas": ["San Ángel", "Pedregal"], "habitaciones_minimas": 3 }),
      requiresMortgage: true, agentId: user2.id, propertyId: prop2.id
    }
  });

  const lead2 = await prisma.lead.create({
    data: {
      name: "María Fernanda López", email: "mafer.lopez@empresa.com", phone: "525599887766",
      status: "NUEVO", budget: 6000000, source: "Meta Ads",
      preferences: JSON.stringify({ "zonas": ["Polanco", "Roma"], "interes": "Inversión" }),
      requiresMortgage: false, agentId: user3.id, propertyId: prop1.id
    }
  });

  console.log("Generando historial de mensajes, llamadas y citas...");
  // Citas
  await prisma.appointment.create({
    data: {
      title: "Recorrido Casa San Ángel", date: new Date(Date.now() + 86400000 * 2),
      status: "CONFIRMADA", leadId: lead1.id, agentId: user2.id, notes: "Llevar planos"
    }
  });

  // Mensajes (Chat bot)
  await prisma.message.createMany({
    data: [
      { leadId: lead2.id, content: "Hola, me interesa la Torre Las Nubes", fromBot: false },
      { leadId: lead2.id, content: "¡Hola María Fernanda! Claro que sí. Tenemos departamentos desde 5M. ¿Te gustaría agendar una llamada con uno de nuestros asesores?", fromBot: true },
    ]
  });

  console.log("Generando Tareas...");
  await prisma.task.createMany({
    data: [
      { title: "Llamar a Roberto para confirmar visita", description: "Recordarle que lleve INE", status: "PENDIENTE", assignedTo: user2.id, leadId: lead1.id },
      { title: "Mandar presentación de Las Nubes a Mafer", status: "EN_PROGRESO", assignedTo: user3.id, leadId: lead2.id },
      { title: "Actualizar precios en portal inmobiliario", status: "COMPLETADO", assignedTo: user1.id },
      { title: "Reunión de equipo semanal", status: "PENDIENTE", assignedTo: user1.id }
    ]
  });

  console.log("¡Base de datos sembrada con éxito!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
