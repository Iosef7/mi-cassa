import fs from 'fs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const sqlFilePath = 'C:\\Users\\iosef\\Downloads\\u777600273_aGgYS.micassaisrael-com.20260621033627.sql\\u777600273_aGgYS.sql';

async function migrateProperties() {
  console.log('Reading SQL file...');
  const content = fs.readFileSync(sqlFilePath, 'utf-8');

  console.log('Extracting posts...');
  const posts: Record<string, any> = {};

  let startIndex = 0;
  while ((startIndex = content.indexOf('INSERT INTO `wp_posts` VALUES', startIndex)) !== -1) {
    const endIndex = content.indexOf(';\n', startIndex);
    if (endIndex === -1) break;
    const block = content.substring(startIndex, endIndex);

    const rows = block.split(/\n\(/);
    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (row.includes(",'publish',") && !row.includes('revision')) {
            const match = row.match(/^(\d+),\d+,'[^']+','[^']+',(?:'[^']*'|'.*?'),'([^']*)'/);
            if (match) {
                const id = match[1];
                const title = match[2].replace(/\\'/g, "'");
                posts[id] = { id, title, meta: {} };
            }
        }
    }
    startIndex = endIndex;
  }

  console.log(`Extracted ${Object.keys(posts).length} posts. Extracting postmeta...`);

  startIndex = 0;
  while ((startIndex = content.indexOf('INSERT INTO `wp_postmeta` VALUES', startIndex)) !== -1) {
      const endIndex = content.indexOf(';\n', startIndex);
      if (endIndex === -1) break;
      const block = content.substring(startIndex, endIndex);

      const rows = block.split(/\n\(/);
      for (let i = 1; i < rows.length; i++) {
          const row = rows[i];
          const idMatch = row.match(/^\d+,(\d+),/);
          if (idMatch && posts[idMatch[1]]) {
              const postId = idMatch[1];
              const parts = row.split(`,'`);
              if (parts.length >= 3) {
                  let key = parts[1].split(`',`)[0];
                  key = key.replace(/'/g, ''); // Fix the trailing quote issue!
                  
                  let valuePart = parts.slice(2).join(`,'`);
                  valuePart = valuePart.replace(/'\)?$/, '');
                  valuePart = valuePart.replace(/\\'/g, "'").replace(/\\\\/g, "\\");
                  posts[postId].meta[key] = valuePart;
              }
          }
      }
      startIndex = endIndex;
  }

  const properties = Object.values(posts).filter(p => p.meta['precio'] || p.meta['_precio']);
  console.log(`Found ${properties.length} properties to migrate.`);

  let successCount = 0;
  for (const p of properties) {
      let priceStr = p.meta['precio'] || p.meta['_precio'] || '0';
      priceStr = priceStr.replace(/[^0-9.]/g, '');
      const price = parseFloat(priceStr) || 0;

      const title = p.title || 'Propiedad sin título';
      const description = p.meta['descripcion_espanol'] || p.meta['descripcion_ingles'] || p.meta['descripcion_heb'] || 'Sin descripción';
      const location = p.meta['ubicacion'] || 'Sin ubicación';
      
      const type = 'Casa/Depto';
      const bedrooms = 0;
      const bathrooms = 0;

      try {
          await prisma.property.create({
              data: {
                  title: title.substring(0, 255),
                  description: description,
                  price: price,
                  location: location,
                  type: type,
                  bedrooms: bedrooms,
                  bathrooms: bathrooms,
                  status: 'DISPONIBLE'
              }
          });
          successCount++;
          console.log(`Migrated: ${title}`);
      } catch (err) {
          console.error(`Failed to migrate ${title}:`, err.message);
      }
  }

  console.log(`Successfully migrated ${successCount} properties to Prisma DB.`);
  await prisma.$disconnect();
}

migrateProperties().catch(console.error);
