'use server'

import { prisma } from '@/lib/prisma';
import { generateAiContent } from '@/lib/ai-service';
import { downloadFileAsBase64 } from '@/lib/google-drive';
import { revalidatePath } from 'next/cache';

async function updateProgress(propertyId: string, percent: number, message: string) {
  try {
    await prisma.siteSettings.upsert({
      where: { key: `ai_progress_${propertyId}` },
      update: { value: JSON.stringify({ percent, message }) },
      create: { key: `ai_progress_${propertyId}`, value: JSON.stringify({ percent, message }) }
    });
  } catch (e) {
    console.error("Progress update failed", e);
  }
}

// Helper para obtener el mimeType de una URL
function getMimeTypeFromUrl(url: string) {
  const extension = url.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'png': return 'image/png';
    case 'webp': return 'image/webp';
    case 'pdf': return 'application/pdf';
    case 'jpg':
    case 'jpeg':
    default:
      return 'image/jpeg';
  }
}

// Función de entrada que retorna inmediatamente para evitar Timeout del navegador
export async function autoFillProperty(propertyId: string, mode: 'DIRECT' | 'DRAFT' = 'DRAFT') {
  // 1. Verificamos si ya hay un proceso corriendo usando un lock en la DB
  const lockKey = `ai_lock_${propertyId}`;
  const existingLock = await prisma.siteSettings.findUnique({ where: { key: lockKey } });
  
  if (existingLock) {
    const lockTime = new Date(existingLock.updatedAt).getTime();
    const now = Date.now();
    // Si el lock tiene menos de 10 minutos, asumimos que sigue corriendo
    if (now - lockTime < 10 * 60 * 1000) {
      return { success: true, background: true, message: 'El proceso ya está en ejecución' };
    }
  }

  // Establecer el lock
  await prisma.siteSettings.upsert({
    where: { key: lockKey },
    update: { value: 'running' },
    create: { key: lockKey, value: 'running' }
  });

  // Disparamos en segundo plano y no hacemos await
  autoFillPropertyBackground(propertyId, mode).catch(async e => {
    console.error("Error crítico en segundo plano:", e);
    await updateProgress(propertyId, 100, `Error crítico: ${e.message}`);
    await prisma.siteSettings.deleteMany({ where: { key: lockKey } });
  });

  return { success: true, background: true };
}

// Función principal para procesar una propiedad con IA (Auto-Llenado)
async function autoFillPropertyBackground(propertyId: string, mode: 'DIRECT' | 'DRAFT' = 'DRAFT') {
  const lockKey = `ai_lock_${propertyId}`;
  try {
    // 1. Buscar la propiedad
    const property = await prisma.property.findUnique({
      where: { id: propertyId }
    });

    if (!property) {
       await updateProgress(propertyId, 100, 'Error: Propiedad no encontrada');
       await prisma.siteSettings.deleteMany({ where: { key: lockKey } });
       return;
    }
    if (!property.images) {
       await updateProgress(propertyId, 100, 'Error: La propiedad no tiene imágenes');
       await prisma.siteSettings.deleteMany({ where: { key: lockKey } });
       return;
    }

    let images: string[] = [];
    try {
      images = JSON.parse(property.images);
      if (!Array.isArray(images)) images = [property.images];
    } catch (e) {
      images = [property.images];
    }

    if (images.length === 0) throw new Error('No hay imágenes válidas');

    // Procesamos un MÁXIMO de 35 imágenes por petición para evitar saturar la memoria del servidor (OOM crash)
    // Para propiedades de 100+ fotos, enviar 500MB en JSON en una sola petición mata el proceso de Node.js
    const imagesToProcess = images.slice(0, 35);
    
    let downloadedCount = 0;
    await updateProgress(propertyId, 5, `Iniciando descarga de ${imagesToProcess.length} imágenes (límite de seguridad)...`);
    
    // Descargamos las imágenes SECUENCIALMENTE para no saturar el servidor local
    const base64Images: (any | null)[] = [];
    for (const url of imagesToProcess) {
      try {
        let base64Data = '';
        let mimeType = getMimeTypeFromUrl(url);

        // Check for cancellation
        const currentLock = await prisma.siteSettings.findUnique({ where: { key: lockKey } });
        if (!currentLock || currentLock.value === 'cancelled') {
          throw new Error('Cancelado por el usuario');
        }

        if (url.includes('drive.google.com')) {
          const match = url.match(/[-\w]{25,}/);
          if (match) {
            base64Data = await downloadFileAsBase64(match[0]);
            mimeType = 'image/jpeg';
          } else {
            throw new Error('Drive URL invalida');
          }
        } else {
          const absoluteUrl = url.startsWith('http') ? url : `http://localhost:3002${url}`;
          const res = await fetch(absoluteUrl, { signal: AbortSignal.timeout(15000) });
          if (!res.ok) throw new Error(`HTTP error ${res.status}`);
          const arrayBuffer = await res.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          base64Data = buffer.toString('base64');
        }
        
        downloadedCount++;
        const percent = 5 + Math.floor((downloadedCount / imagesToProcess.length) * 35);
        await updateProgress(propertyId, percent, `Descargando imagen ${downloadedCount} de ${imagesToProcess.length}...`);

        base64Images.push({
          inlineData: {
            data: base64Data,
            mimeType: mimeType || 'image/jpeg'
          },
        });
      } catch (e) {
        console.error(`Error fetching image ${url}:`, e);
        downloadedCount++;
        await updateProgress(propertyId, 5 + Math.floor((downloadedCount / imagesToProcess.length) * 35), `Imagen ${downloadedCount} falló, continuando...`);
        base64Images.push(null);
      }
    }
    
    const validImages = base64Images.filter(img => img !== null);

    const prompt = `
    Eres un experto en Real Estate, SEO y Traducción. Analiza estas imágenes de la propiedad.
    Actualmente, la propiedad tiene estos datos:
    - Título: ${property.title}
    - Descripción: ${property.description || 'Sin descripción'}
    - Precio: ${property.price.toString()}
    - Tipo: ${property.type}
    
    Tu tarea es:
    1. Deducir cuántas habitaciones y baños tiene (si es posible estimar).
    2. Identificar características destacadas (piscina, jardín, cocina remodelada).
    3. Deducir el Tipo de Propiedad sugerido ('PROYECTO', 'DEPARTAMENTO', 'CASA', 'PENTHOUSE', etc) analizando si son muchas unidades (ej. 425 viviendas) o una sola.
    4. Escribir un título comercial MUY atractivo (máximo 60 caracteres) en Español, Inglés y Hebreo.
    5. Escribir una descripción comercial detallada en los 3 idiomas.
       - REGLA DE OCR (TEXTO EN IMÁGENES): Busca texto en las fotos promocionales (flyers, carteles). Si encuentras texto de marketing ya escrito en Inglés o Hebreo, EXTRAE literalmente ese texto en lugar de inventar una traducción de cero. Si solo hay texto en Español (o no hay texto), entonces SÍ traduce y adapta comercialmente la descripción para completar los 3 idiomas.
    6. Generar meta tags de SEO.
    7. CLASIFICACIÓN DE IMÁGENES: A continuación recibirás una lista de imágenes. Debes clasificar CADA UNA en una de estas categorías: 'INTERIOR', 'EXTERIOR', 'PLANO' (floor plan), 'MAPA' (ubicación geográfica), 'TEXTO_PROMO' (flyers con texto publicitario).
    8. RECOMENDACIONES: Emite 1-3 recomendaciones como experto en Real Estate sobre qué mejorar (ej. "Añadir más fotos de interiores", "Subir foto de la cocina", "El precio parece bajo").
    9. RESUMEN: Redacta un pequeño resumen (2-3 líneas en español) explicando exactamente qué cambiaste, cuántas imágenes clasificaste y qué dedujiste.
    
    Debes responder ESTRICTAMENTE en este formato JSON válido, sin Markdown extra:
    {
      "confidenceScore": 95,
      "summary": "He analizado 15 imágenes. Encontré 1 plano y 2 mapas. Deduje 3 habitaciones y añadí etiquetas SEO.",
      "suggestedType": "PROYECTO",
      "recommendations": ["Añadir más fotos de los interiores", "El precio no está definido"],
      "deducedBedrooms": 3,
      "deducedBathrooms": 2,
      "suggestedTitle": { "es": "...", "en": "...", "he": "..." },
      "suggestedDescription": { "es": "...", "en": "...", "he": "..." },
      "seoMetaTags": { "title": "...", "description": "...", "keywords": "..." },
      "dynamicFeatures": "Piscina, Jardín",
      "imageCategories": [
        { "index": 0, "category": "EXTERIOR" },
        { "index": 1, "category": "INTERIOR" },
        { "index": 2, "category": "PLANO" },
        { "index": 3, "category": "MAPA" },
        { "index": 4, "category": "TEXTO_PROMO" }
      ]
    }
    `;

    const contentParts: any[] = [{ text: prompt }];
    validImages.forEach((img, idx) => {
      contentParts.push({ text: `Imagen [Index: ${idx}]:` });
      contentParts.push(img);
    });

    await updateProgress(propertyId, 45, 'Analizando las imágenes con Google Gemini (puede tomar unos minutos)...');

    // Verificar cancelación antes de enviar a Gemini
    const preGeminiLock = await prisma.siteSettings.findUnique({ where: { key: lockKey } });
    if (!preGeminiLock || preGeminiLock.value === 'cancelled') {
        throw new Error('Cancelado por el usuario');
    }

    // 3. Llamada al Motor Lógico (Gemini)
    let response;
    try {
      response = await generateAiContent({
        operationType: 'PROPERTY_AUTOFILL',
        contents: [{ role: 'user', parts: contentParts }],
        config: {
          systemInstruction: prompt
        }
      });
    } catch (aiError: any) {
      await updateProgress(propertyId, 100, `Error de IA: ${aiError.message}`);
      return { success: false, error: `Error de IA: ${aiError.message}` };
    }

    const aiText = response.text || '{}';
    const cleanJson = aiText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    let aiData;
    try {
      aiData = JSON.parse(cleanJson);
    } catch (e) {
      await updateProgress(propertyId, 100, 'Error: La IA no devolvió un JSON válido');
      return { success: false, error: "La IA no devolvió un JSON válido" };
    }

    await updateProgress(propertyId, 95, 'Estructurando los datos extraídos de la IA...');

    // 4. Actualizar la base de datos con los datos inferidos o guardarlos en borrador
    let updateData: any = {
      aiProcessed: true,
      aiCategorization: aiData,
    };

    const shouldAutoApprove = mode === 'DRAFT' && (aiData.confidenceScore >= 95);
    const finalMode = shouldAutoApprove ? 'DIRECT' : mode;

    if (finalMode === 'DIRECT') {
      const pres: any = {
        docs: [],
        plans: [],
        videos: [],
        legalDocs: [],
        posters: [],
        maps: [],
      };
      if (property.presentations) {
        try {
          const parsed = JSON.parse(property.presentations);
          if (typeof parsed === 'object' && !Array.isArray(parsed)) {
            Object.assign(pres, parsed);
          }
        } catch(e) {}
      }

      let indexesToRemove = new Set<number>();
  
      if (Array.isArray(aiData.imageCategories)) {
        aiData.imageCategories.forEach((cat: any) => {
          if (cat.index !== undefined && cat.index < images.length) {
            const label = cat.category;
            const url = images[cat.index];
            if (label === 'PLANO') {
             pres.plans.push(url);
           } else if (label === 'MAPA') {
             pres.maps.push(url);
           } else if (label === 'RENDERS_EXTERIORES' || label === 'AFICHE' || label === 'BROCHURE') {
             pres.posters.push(url); 
           } else {
             indexesToRemove.add(cat.index);
            }
          }
        });
      }
  
      const newImages = images.filter((_, idx) => !indexesToRemove.has(idx));

      updateData = {
        ...updateData,
        aiDraft: null,
        title: aiData.suggestedTitle?.es || property.title,
        description: aiData.suggestedDescription?.es || property.description,
        type: aiData.suggestedType || property.type,
        images: JSON.stringify(newImages),
        presentations: JSON.stringify(pres),
        translations: {
          en: { title: aiData.suggestedTitle?.en, description: aiData.suggestedDescription?.en },
          he: { title: aiData.suggestedTitle?.he, description: aiData.suggestedDescription?.he },
          es: { title: aiData.suggestedTitle?.es, description: aiData.suggestedDescription?.es }
        }
      };
      if (aiData.deducedBedrooms) updateData.bedrooms = aiData.deducedBedrooms;
      if (aiData.deducedBathrooms) updateData.bathrooms = aiData.deducedBathrooms;
    } else {
      updateData.aiDraft = JSON.stringify(aiData);
    }

    const updatedProperty = await prisma.property.update({
      where: { id: propertyId },
      data: updateData
    });

    await updateProgress(propertyId, 100, '¡Análisis Completado!');

    revalidatePath(`/admin/propiedades/${propertyId}`);
    revalidatePath(`/p/${propertyId}`);

    await prisma.siteSettings.deleteMany({ where: { key: lockKey } });

    return { success: true, data: updatedProperty };

  } catch (error: any) {
    console.error("Error auto-filling property:", error);
    await updateProgress(propertyId, 100, `Error general: ${error.message}`);
    await prisma.siteSettings.deleteMany({ where: { key: lockKey } });
    return { success: false, error: error.message };
  }
}
