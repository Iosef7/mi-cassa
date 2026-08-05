import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('--- VERIFICANDO MIGRACIÓN ---');
  
  const properties = await prisma.property.findMany();
  console.log(`Total propiedades: ${properties.length}`);

  let missingImages = 0;
  let hasPrice = 0;
  let defaultPrice = 0;

  for (const p of properties) {
    if (p.price.toNumber() === 1000000) defaultPrice++;
    else hasPrice++;

    if (p.images) {
      try {
        const imgs = JSON.parse(p.images);
        if (imgs.length > 0) {
          const imgPath = imgs[0]; // e.g. /uploads/2024/12/file.jpg
          const localPath = path.join(process.cwd(), 'public', imgPath);
          if (!fs.existsSync(localPath)) {
            console.log(`[ALERTA] Imagen no encontrada en disco para "${p.title}": ${localPath}`);
            missingImages++;
          }
        }
      } catch (e) {
        // Not a JSON
      }
    }
  }

  console.log(`\nResultados:`);
  console.log(`- Propiedades con precio extraído: ${hasPrice}`);
  console.log(`- Propiedades con precio por defecto (1M): ${defaultPrice}`);
  console.log(`- Imágenes faltantes en disco: ${missingImages}`);

  if (properties.length > 0) {
    console.log(`\nEjemplo de una propiedad importada:`);
    const ex = properties[Math.floor(Math.random() * properties.length)];
    console.log(`- Título: ${ex.title}`);
    console.log(`- Precio: ${ex.price.toString()}`);
    console.log(`- Habitaciones: ${ex.bedrooms}`);
    console.log(`- Ubicación: ${ex.location}`);
    console.log(`- Imágenes: ${ex.images}`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
