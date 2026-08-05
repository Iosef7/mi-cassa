import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando actualización de URLs de imágenes...');
  
  const properties = await prisma.property.findMany();
  let count = 0;

  for (const property of properties) {
    if (property.images && property.images.includes('micassaisrael.com/wp-content/uploads')) {
      // Reemplazar la URL antigua por la nueva ruta local
      const newImages = property.images.replace(/https?:\/\/micassaisrael\.com\/wp-content\/uploads/g, '/uploads');
      
      await prisma.property.update({
        where: { id: property.id },
        data: { images: newImages }
      });
      count++;
      console.log(`✅ Actualizada propiedad: ${property.title}`);
    }
  }

  console.log(`\n¡Actualización completada! Se actualizaron ${count} propiedades.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
