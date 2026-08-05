import { PrismaClient } from '@prisma/client';
import * as mysql from 'mysql2/promise';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando actualización de galerías...');
  
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'u777600273_aggys',
    port: 3306
  });

  const properties = await prisma.property.findMany();
  let updatedCount = 0;

  for (const property of properties) {
    // Buscar los posts en WP que coincidan con este título
    const [posts] = await connection.execute(
      `SELECT ID FROM wp_posts WHERE post_type = 'post' AND post_title = ?`,
      [property.title]
    );

    const postsArray = posts as any[];
    if (postsArray.length > 0) {
      let currentImages: string[] = [];
      try {
        if (property.images) {
          currentImages = JSON.parse(property.images);
        }
      } catch (e) {
        // En caso de que no sea un JSON válido
      }

      let added = 0;

      for (const post of postsArray) {
        const postId = post.ID;

        // Obtener todos los adjuntos (attachments) para este post
        const [attachments] = await connection.execute(
          `SELECT guid FROM wp_posts WHERE post_type = 'attachment' AND post_parent = ?`,
          [postId]
        );

        const atts = attachments as any[];
        
        for (const att of atts) {
           let url = att.guid;
           
           // Limpiar la URL como hicimos en la migración original
           url = url.replace(/https?:\/\/micassaisrael\.com\/wp-content\/uploads/g, '/uploads');
           url = url.replace(/\u202F/g, '_'); // Reemplazar espacio duro codificado

           if (!currentImages.includes(url)) {
              currentImages.push(url);
              added++;
           }
        }
      }

      if (added > 0) {
        await prisma.property.update({
           where: { id: property.id },
           data: { images: JSON.stringify(currentImages) }
        });
        console.log(`✅ ${property.title}: Añadidas ${added} imágenes a la galería (Total: ${currentImages.length})`);
        updatedCount++;
      }
    }
  }

  await connection.end();
  console.log(`\n¡Actualización completada! Se enriquecieron las galerías de ${updatedCount} propiedades.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
