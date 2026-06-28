const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Creando contenido inicial CMS...");
  
  // Limpiar Pages y Sections
  await prisma.section.deleteMany({});
  await prisma.page.deleteMany({});
  await prisma.siteSettings.deleteMany({});

  // Crear la página de Inicio
  const homePage = await prisma.page.create({
    data: {
      title: "Inicio",
      slug: "home",
      isPublished: true,
      metaTitle: "MiCassa | Tu hogar en Israel",
      metaDesc: "Hacemos de tu inversión un éxito con el mejor asesoramiento para comprar y alquilar tu casa en Israel."
    }
  });

  // Crear secciones (solo un ejemplo para conectarlo)
  await prisma.section.create({
    data: {
      pageId: homePage.id,
      type: "HERO",
      order: 1,
      content: JSON.stringify({
        title: "Tu hogar en Israel",
        subtitle: "Hacemos de tu inversión un éxito con el mejor asesoramiento para comprar y alquilar tu casa en Israel.",
        buttonText: "Más Información",
        image: "https://images.unsplash.com/photo-1544984243-ec57b16fac25?auto=format&fit=crop&q=80&w=2000"
      })
    }
  });

  console.log("¡CMS sembrado con éxito!");
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
