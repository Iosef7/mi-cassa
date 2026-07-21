const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const project = await prisma.developmentProject.create({
    data: {
      name: "Uziel Complex",
      location: "Bait Vagan, Jerusalem",
      description: "Exclusivo desarrollo de renovación urbana en una de las zonas con mayor estabilidad, demanda y solidez en el mercado inmobiliario de Jerusalem. Una oportunidad de inversión premium con una ventana de entrada limitada a un mes antes de la apertura al mercado abierto.\n\nTipos de Departamentos: 3 Ambientes (Desde 73 m²). Todas las unidades incluyen estacionamiento subterráneo.",
      status: "PLANIFICACION",
      dealType: "Renovación Urbana (Preventa Exclusiva)",
      ownershipShare: 40,
      estimatedCost: 27000,
      expectedRevenue: 75,
      notes: "Estructura Financiera:\n- Rendimiento Anual: Tasa fija garantizada del 10% al 11% anual (interés compuesto).\n- Potencial Total: Ganancia estimada de hasta el 75% - 76% al finalizar el periodo de 42 meses.\n- Plusvalía Directa: Participación del 40% sobre el incremento del valor del terreno durante la fase inicial.\n- Beneficio Especial: Bono de descuento exclusivo de ₪6,000 por m² por debajo del precio de lista regular (beneficio de hasta ₪600,000).",
      attachments: JSON.stringify({
        images: [],
        videos: [],
        presentations: [],
        legalDocs: [],
        posters: []
      })
    }
  });
  console.log("Proyecto creado con ID:", project.id);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
