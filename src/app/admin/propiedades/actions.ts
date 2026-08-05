"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function createProject(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const location = formData.get("location") as string;
    const type = formData.get("type") as string;
    const priceStr = formData.get("price") as string;
    const minPriceStr = formData.get("minPrice") as string;
    const maxPriceStr = formData.get("maxPrice") as string;
    const availableUnitsStr = formData.get("availableUnits") as string;
    const deliveryDate = formData.get("deliveryDate") as string;
    const description = formData.get("description") as string;
    const ownerName = formData.get("ownerName") as string;
    const ownerPhone = formData.get("ownerPhone") as string;
    const ownerEmail = formData.get("ownerEmail") as string;
    const ownerNotes = formData.get("ownerNotes") as string;

    const dynamicFeaturesStr = formData.get("dynamicFeatures") as string;
    const nearbyPlacesStr = formData.get("nearbyPlaces") as string;
    const bedroomsStr = formData.get("bedrooms") as string;
    const bathroomsStr = formData.get("bathrooms") as string;
    const areaStr = formData.get("area") as string;

    const parentDriveFolderId = formData.get("parentDriveFolderId") as string;
    let driveFolderId = null;

    if (parentDriveFolderId) {
      try {
        const { createFolder } = await import('@/lib/google-drive');
        const folder = await createFolder(title, parentDriveFolderId);
        driveFolderId = folder.id;
      } catch (err) {
        console.error("Error creating Google Drive folder in server action:", err);
      }
    }

    const newProject = await prisma.property.create({
      data: {
        title,
        location,
        type: type || "PROYECTO",
        operationType: "VENTA",
        price: parseFloat(priceStr) || 0,
        minPrice: minPriceStr ? parseFloat(minPriceStr) : null,
        maxPrice: maxPriceStr ? parseFloat(maxPriceStr) : null,
        availableUnits: availableUnitsStr ? parseInt(availableUnitsStr) : null,
        deliveryDate: deliveryDate || null,
        description: description || null,
        bedrooms: bedroomsStr ? parseInt(bedroomsStr) : null,
        bathrooms: bathroomsStr ? parseInt(bathroomsStr) : null,
        area: areaStr ? parseFloat(areaStr) : null,
        dynamicFeatures: dynamicFeaturesStr || "{}",
        nearbyPlaces: nearbyPlacesStr || "[]",
        images: "[]", // Default empty for now
        status: "DISPONIBLE",
        ownerName: ownerName || null,
        ownerPhone: ownerPhone || null,
        ownerEmail: ownerEmail || null,
        ownerNotes: ownerNotes || null,
        driveFolderId: driveFolderId
      },
    });

    revalidatePath("/admin/propiedades");
    // Parse/stringify to convert Prisma Decimal/Date objects to plain JS types for the Client Component
    return { success: true, project: JSON.parse(JSON.stringify(newProject)) };
  } catch (error) {
    console.error("Error creating project:", error);
    return { success: false, error: "Failed to create project" };
  }
}

import { generateAiContent } from '@/lib/ai-service';

export async function generatePropertyDescription(data: any) {
  try {
    const prompt = `Eres un experto redactor inmobiliario (copywriter). Escribe una descripción atractiva y profesional para una propiedad con los siguientes datos:
    
- Título: ${data.title || 'Sin especificar'}
- Ubicación: ${data.location || 'Sin especificar'}
- Tipo: ${data.type || 'Sin especificar'}
- Precio: ${data.price || 'Sin especificar'}
- Habitaciones: ${data.bedrooms || 'Sin especificar'}
- Baños: ${data.bathrooms || 'Sin especificar'}
- Área: ${data.area || 'Sin especificar'}
- Características adicionales: ${data.dynamicFeatures ? JSON.stringify(data.dynamicFeatures) : 'Ninguna'}

Escribe la descripción en español, resaltando los beneficios y creando un tono persuasivo, elegante y directo. Separa los párrafos para que sea fácil de leer. No uses saludos, ni inventes características irreales (pero puedes inferir beneficios obvios). Devuelve directamente el texto de la descripción sin introducciones.`;

    const response = await generateAiContent({
      operationType: 'PropertyDescriptionGeneration',
      contents: prompt,
    });
    return { success: true, description: response.text };
  } catch (error) {
    console.error('Error generating AI description:', error);
    return { success: false, error: 'Failed to generate description' };
  }
}

export async function getDisabledPropertyTabs() {
  try {
    const setting = await prisma.siteSettings.findUnique({
      where: { key: 'disabled_property_tabs' }
    });
    return setting?.value ? JSON.parse(setting.value) : [];
  } catch (error) {
    console.error("Error fetching disabled tabs:", error);
    return [];
  }
}

export async function togglePropertyTabVisibility(tabId: string, disabled: boolean) {
  try {
    const currentTabs = await getDisabledPropertyTabs();
    let newTabs = [...currentTabs];
    
    if (disabled && !newTabs.includes(tabId)) {
      newTabs.push(tabId);
    } else if (!disabled) {
      newTabs = newTabs.filter((t: string) => t !== tabId);
    }

    await prisma.siteSettings.upsert({
      where: { key: 'disabled_property_tabs' },
      update: { value: JSON.stringify(newTabs) },
      create: { key: 'disabled_property_tabs', value: JSON.stringify(newTabs) }
    });

    return { success: true, disabledTabs: newTabs };
  } catch (error) {
    console.error("Error toggling property tab:", error);
    return { success: false, error: "Failed to toggle tab visibility" };
  }
}

export async function approveAiDraft(id: string) {
  try {
    const property = await prisma.property.findUnique({ where: { id } });
    if (!property || !property.aiDraft) {
      return { success: false, error: 'No se encontró borrador pendiente' };
    }

    let aiDraft: any = {};
    if (typeof property.aiDraft === 'string') {
      aiDraft = JSON.parse(property.aiDraft);
    } else {
      aiDraft = property.aiDraft;
    }

    const translations = {
      en: {
        title: aiDraft.suggestedTitle?.en || property.title,
        description: aiDraft.suggestedDescription?.en || property.description,
      },
      he: {
        title: aiDraft.suggestedTitle?.he || property.title,
        description: aiDraft.suggestedDescription?.he || property.description,
      },
      es: {
        title: aiDraft.suggestedTitle?.es || property.title,
        description: aiDraft.suggestedDescription?.es || property.description,
      }
    };

    let existingPresentations: any = { docs: [], plans: [], videos: [], legalDocs: [], posters: [] };
    if (property.presentations) {
      try {
        const parsed = JSON.parse(property.presentations);
        if (typeof parsed === 'object' && !Array.isArray(parsed)) {
          existingPresentations = { ...existingPresentations, ...parsed };
        }
      } catch(e) {}
    }

    let images: string[] = [];
    try {
      if (property.images) {
        images = JSON.parse(property.images);
        if (!Array.isArray(images)) images = [property.images];
      }
    } catch(e) {
      if (property.images) images = [property.images];
    }

    let newPlans: string[] = [];
    let newPosters: string[] = [];
    let newMaps: string[] = [];
    let indexesToRemove = new Set<number>();

    if (Array.isArray(aiDraft.imageCategories)) {
      aiDraft.imageCategories.forEach((cat: any) => {
        if (cat.index !== undefined && cat.index < images.length) {
          if (cat.category === 'PLANO') {
            newPlans.push(images[cat.index]);
            indexesToRemove.add(cat.index);
          } else if (cat.category === 'MAPA') {
            newMaps.push(images[cat.index]);
            indexesToRemove.add(cat.index);
          } else if (cat.category === 'TEXTO_PROMO') {
            newPosters.push(images[cat.index]);
            indexesToRemove.add(cat.index);
          }
        }
      });
    }

    const newImages = images.filter((_, idx) => !indexesToRemove.has(idx));

    const updateData: any = {
      title: aiDraft.suggestedTitle?.es || property.title,
      description: aiDraft.suggestedDescription?.es || property.description,
      type: aiDraft.suggestedType || property.type,
      images: JSON.stringify(newImages),
      presentations: JSON.stringify({
        ...existingPresentations,
        plans: [...(existingPresentations.plans || []), ...newPlans],
        posters: [...(existingPresentations.posters || []), ...newPosters],
        maps: [...(existingPresentations.maps || []), ...newMaps]
      }),
      translations: translations,
      aiDraft: null, // Clear draft after approval
      aiProcessed: true
    };

    // Keep the categorization (like image tags) in the main JSON
    if (aiDraft.imageCategories) {
      updateData.aiCategorization = aiDraft;
    }

    if (aiDraft.deducedBedrooms) updateData.bedrooms = aiDraft.deducedBedrooms;
    if (aiDraft.deducedBathrooms) updateData.bathrooms = aiDraft.deducedBathrooms;

    await prisma.property.update({
      where: { id },
      data: updateData
    });

    revalidatePath(`/admin/propiedades/${id}`);
    revalidatePath(`/p/${id}`);
    
    return { success: true };
  } catch (error: any) {
    console.error("Error approving AI draft:", error);
    return { success: false, error: error.message };
  }
}

export async function getAiProgress(propertyId: string) {
  try {
    const setting = await prisma.siteSettings.findUnique({
      where: { key: `ai_progress_${propertyId}` }
    });
    if (setting?.value) {
      return JSON.parse(setting.value);
    }
  } catch(e) {}
  return null;
}
