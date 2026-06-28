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
      },
    });

    revalidatePath("/propiedades");
    return { success: true, project: newProject };
  } catch (error) {
    console.error("Error creating project:", error);
    return { success: false, error: "Failed to create project" };
  }
}
