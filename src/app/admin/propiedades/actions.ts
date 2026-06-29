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

    revalidatePath("/propiedades");
    return { success: true, project: newProject };
  } catch (error) {
    console.error("Error creating project:", error);
    return { success: false, error: "Failed to create project" };
  }
}

import { GoogleGenAI } from '@google/genai';

export async function generatePropertyDescription(data: any) {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
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

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return { success: true, description: response.text };
  } catch (error) {
    console.error('Error generating AI description:', error);
    return { success: false, error: 'Failed to generate description' };
  }
}
