"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateAiSettings(settings: Record<string, string>) {
  try {
    const promises = Object.entries(settings).map(async ([key, value]) => {
      return prisma.siteSettings.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      });
    });

    await Promise.all(promises);
    revalidatePath("/admin/ia");
    return { success: true };
  } catch (error: any) {
    console.error("Error updating AI settings:", error);
    return { success: false, error: error.message };
  }
}
