import { PrismaClient } from '@prisma/client';
import * as mysql from 'mysql2/promise';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando conexión a MySQL...');
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'u777600273_aggys',
    port: 3306
  });

  console.log('Conectado a MySQL local. Consultando propiedades...');
  
  // Obtenemos todos los 'posts' publicados
  const [posts] = await connection.execute(
    `SELECT ID, post_title, post_date, post_name FROM wp_posts WHERE post_type = 'post' AND post_status = 'publish'`
  );

  const postsArray = posts as any[];
  console.log(`Encontradas ${postsArray.length} propiedades publicadas.`);

  for (const post of postsArray) {
    const [meta] = await connection.execute(
      `SELECT meta_key, meta_value FROM wp_postmeta WHERE post_id = ?`,
      [post.ID]
    );

    const metaDict: Record<string, string> = {};
    for (const row of (meta as any[])) {
      metaDict[row.meta_key] = row.meta_value;
    }

    const description = metaDict['descripcion_espanol'] || metaDict['descripcion_ingles'] || metaDict['descripcion_heb'] || metaDict['descripcion_fran'] || '';
    
    // Extraer precio usando una expresión regular
    let priceMatch = description.match(/([\d\.,]+)\s*(NIS|ILS|\$|USD|shk|shekels|\₪)/i);
    let price = 0;
    if (priceMatch) {
        // Remover comas y puntos para parsear a número, asumiendo formato 3,400,000
        const rawPrice = priceMatch[1].replace(/[,\.]/g, '');
        price = parseFloat(rawPrice);
    }
    if (price === 0) price = 1000000; // Valor por defecto si no se encuentra

    // Extraer número de habitaciones
    let bedrooms = 1;
    let bedMatch = description.match(/(\d+(?:\.\d+)?)\s*(habitaciones|rooms|חדרים)/i);
    if (bedMatch) {
        bedrooms = Math.floor(parseFloat(bedMatch[1]));
    }

    // Ubicación de prueba usando el nombre
    let location = metaDict['ubicacion'] || post.post_title;
    if (!location) location = "Jerusalem";

    // Obtener imagen destacada
    const thumbnailId = metaDict['_thumbnail_id'];
    let images = '';
    if (thumbnailId) {
        const [thumbPost] = await connection.execute(`SELECT guid FROM wp_posts WHERE ID = ?`, [thumbnailId]);
        if ((thumbPost as any[]).length > 0) {
            images = JSON.stringify([(thumbPost as any[])[0].guid]);
        }
    }

    // Crear propiedad
    try {
        await prisma.property.create({
            data: {
                title: post.post_title || 'Propiedad sin título',
                description: description,
                price: price,
                type: 'DEPARTAMENTO',
                status: 'DISPONIBLE',
                location: location,
                bedrooms: bedrooms,
                images: images,
                createdAt: new Date(post.post_date),
                updatedAt: new Date(post.post_date)
            }
        });
        console.log(`✅ Propiedad migrada: ${post.post_title}`);
    } catch (error) {
        console.error(`❌ Error migrando ${post.post_title}:`, error);
    }
  }

  await connection.end();
  console.log('Migración finalizada con éxito.');
}

main().catch(console.error).finally(() => prisma.$disconnect());
