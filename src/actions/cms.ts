"use server";

import fs from 'fs/promises';
import path from 'path';

const CONFIG_FILE_PATH = path.join(process.cwd(), 'content_config.json');

export async function getCmsConfig() {
  try {
    const data = await fs.readFile(CONFIG_FILE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading cms config:", error);
    // Retornar un esqueleto por defecto en caso de error
    return {
      hero: { title: "", subtitle: "", videoUrl: "" },
      contact: { phone: "", email: "", whatsapp: "" },
      branding: { primaryColor: "", secondaryColor: "" }
    };
  }
}

export async function saveCmsConfig(newConfig: any) {
  try {
    await fs.writeFile(CONFIG_FILE_PATH, JSON.stringify(newConfig, null, 2), 'utf-8');
    return { success: true };
  } catch (error) {
    console.error("Error saving cms config:", error);
    return { success: false, error: "No se pudo guardar la configuración" };
  }
}
