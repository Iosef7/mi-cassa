"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export type SectionStatus = "active" | "maintenance" | "hidden";

export interface SectionSetting {
  status: SectionStatus;
  name: string;
}

export interface SectionSettingsMap {
  [sectionKey: string]: SectionSetting;
}

const DEFAULT_SECTIONS: SectionSettingsMap = {
  "/admin/propiedades": { status: "active", name: "Proyectos" },
  "/admin/prospectos": { status: "active", name: "Clientes" },
  "/admin/tareas": { status: "active", name: "Tareas" },
  "/admin/ia": { status: "active", name: "Control IA" },
  "/admin/ai-match": { status: "active", name: "Matchmaker" },
  "/admin/tabulador": { status: "active", name: "Tabulador" },
  "/admin/agenda": { status: "active", name: "Agenda" },
  "/admin/llamadas": { status: "active", name: "Llamadas" },
  "/admin/marketing": { status: "active", name: "Marketing" },
};

import { unstable_cache } from "next/cache";

export const getSectionSettings = unstable_cache(
  async (): Promise<SectionSettingsMap> => {
    try {
      const setting = await prisma.siteSettings.findUnique({
        where: { key: "section_access" },
      });

      if (!setting) {
        return DEFAULT_SECTIONS;
      }

      const data = JSON.parse(setting.value) as SectionSettingsMap;
      return { ...DEFAULT_SECTIONS, ...data };
    } catch (error) {
      console.error("Error fetching section settings:", error);
      return DEFAULT_SECTIONS;
    }
  },
  ["section_settings"],
  { tags: ["settings"] }
);

import { updateTag } from "next/cache";

export async function updateSectionSettings(settings: SectionSettingsMap) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  try {
    await prisma.siteSettings.upsert({
      where: { key: "section_access" },
      update: { value: JSON.stringify(settings) },
      create: { key: "section_access", value: JSON.stringify(settings) },
    });
    updateTag("settings");
    return { success: true };
  } catch (error) {
    console.error("Error updating section settings:", error);
    return { success: false, error: "Failed to update settings" };
  }
}

export const getSiteLogo = unstable_cache(
  async (): Promise<string | null> => {
    try {
      const setting = await prisma.siteSettings.findUnique({
        where: { key: "site_logo" },
      });
      return setting ? setting.value : null;
    } catch (error) {
      console.error("Error fetching site logo:", error);
      return null;
    }
  },
  ["site_logo"],
  { tags: ["logo"] }
);

export async function updateSiteLogo(base64Image: string) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  try {
    await prisma.siteSettings.upsert({
      where: { key: "site_logo" },
      update: { value: base64Image },
      create: { key: "site_logo", value: base64Image },
    });
    updateTag("logo");
    return { success: true };
  } catch (error) {
    console.error("Error updating site logo:", error);
    return { success: false, error: "Failed to update logo" };
  }
}
