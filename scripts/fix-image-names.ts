import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

function walkAndRename(dir: string) {
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walkAndRename(fullPath);
    } else {
      // The mangled UTF-8 characters "ÔÇ»" or similar (hex: c3 94 c3 87 c2 bb)
      // Node might interpret it as Buffer.from([0xc3, 0x94, 0xc3, 0x87, 0xc2, 0xbb]).toString()
      const badString = Buffer.from([0xc3, 0x94, 0xc3, 0x87, 0xc2, 0xbb]).toString('utf8');
      
      if (file.includes(badString)) {
        const newFile = file.split(badString).join('_');
        const newPath = path.join(dir, newFile);
        fs.renameSync(fullPath, newPath);
        console.log(`Renamed on disk: ${file} -> ${newFile}`);
      }
    }
  }
}

async function main() {
  console.log('--- REPARANDO NOMBRES DE ARCHIVOS ---');
  walkAndRename(path.join(process.cwd(), 'public', 'uploads'));

  console.log('--- REPARANDO BASE DE DATOS ---');
  const properties = await prisma.property.findMany();
  let updated = 0;
  for (const p of properties) {
    if (p.images) {
      // Narrow No-Break Space (U+202F) is often what got mangled
      if (p.images.includes('\u202F')) {
        const newImages = p.images.replace(/\u202F/g, '_');
        await prisma.property.update({
          where: { id: p.id },
          data: { images: newImages }
        });
        updated++;
      }
    }
  }
  console.log(`Se actualizaron ${updated} propiedades en la BD para coincidir con los nombres limpios.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
