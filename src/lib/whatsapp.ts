const ULTRAMSG_INSTANCE = "instance184166";
const ULTRAMSG_TOKEN = "uk1wn7uyxmt325mp";
const ULTRAMSG_URL = `https://api.ultramsg.com/${ULTRAMSG_INSTANCE}`;

export async function sendWhatsAppMessage(to: string, text: string) {
  const token = process.env.WHATSAPP_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!token || !phoneNumberId) {
    console.warn("WhatsApp credentials not configured. Skipping message send.");
    console.warn(`Message intended for ${to}: ${text}`);
    return false;
  }

  const url = `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`;

  const payload = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: to,
    type: "text",
    text: {
      preview_url: false,
      body: text,
    },
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("WhatsApp API Error:", errorData);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Fetch error sending WhatsApp message:", error);
    return false;
  }
}

/**
 * Sends multiple media items or text to WhatsApp Status via Baileys Bot.
 * @param mediaUrls Array of public URLs for the images/videos.
 * @param caption Optional text caption for the first image, or text-only status.
 * @param baseUrl Base URL for relative images (e.g. http://localhost:3000)
 * @param sessionIds Optional array of session IDs to broadcast to. If empty/undefined, broadcasts to all connected sessions.
 */
interface BotStatusPayload {
  caption?: string;
  sessionIds?: string[];
  imageBase64?: string;
  videoBase64?: string;
}

export async function sendUltramsgStatuses(mediaUrls: string[], caption: string, baseUrl: string, sessionIds?: string[]) {
  const results = [];
  const BOT_URL = process.env.WHATSAPP_BOT_URL || "http://localhost:3001";
  
  if (mediaUrls.length === 0) {
    // Texto solamente
    try {
      const payload: BotStatusPayload = { caption: caption || "" };
      if (sessionIds && sessionIds.length > 0) {
        payload.sessionIds = sessionIds;
      }
      
      const response = await fetch(`${BOT_URL}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (data.error) throw new Error(typeof data.error === "object" ? JSON.stringify(data.error) : data.error);
      results.push(data);
    } catch (e) {
      console.error("Bot error text:", e);
      throw e;
    }
  } else {
    // Múltiples medios (imágenes o videos)
    for (let i = 0; i < mediaUrls.length; i++) {
      let url = mediaUrls[i];
      let mediaPayload = url;
      let isVideo = false;
      
      // Convertimos a base64 porque el bot necesita el buffer de la imagen/video
      if (url.startsWith("/uploads/")) {
        const fs = require('fs');
        const path = require('path');
        try {
          const localPath = path.join(process.cwd(), 'public', url);
          const bitmap = fs.readFileSync(localPath);
          const ext = path.extname(localPath).toLowerCase().substring(1) || 'jpeg';
          isVideo = ['mp4', 'webm', 'ogg', 'mov'].includes(ext);
          const mimeType = isVideo ? (ext === 'mov' ? 'video/quicktime' : `video/${ext}`) : `image/${ext === 'jpg' ? 'jpeg' : ext}`;
          mediaPayload = `data:${mimeType};base64,` + bitmap.toString('base64');
        } catch (e) {
          console.error("No se pudo leer el archivo local:", e);
        }
      } else {
        // Si es una URL pública en producción
        try {
          const res = await fetch(url.startsWith("http") ? url : `${baseUrl}${url}`);
          const contentType = res.headers.get('content-type') || 'image/jpeg';
          isVideo = contentType.startsWith('video/');
          const arrayBuffer = await res.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          mediaPayload = `data:${contentType};base64,` + buffer.toString('base64');
        } catch (e) {
          console.error("Error descargando imagen/video remota:", e);
        }
      }

      try {
        const payload: BotStatusPayload = isVideo ? { videoBase64: mediaPayload } : { imageBase64: mediaPayload };
        if (sessionIds && sessionIds.length > 0) {
          payload.sessionIds = sessionIds;
        }
        // Agregar caption solo al primer archivo
        if (i === 0 && caption) {
          payload.caption = caption;
        }

        const response = await fetch(`${BOT_URL}/status`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        const data = await response.json();
        if (data.error) throw new Error(typeof data.error === "object" ? JSON.stringify(data.error) : data.error);
        results.push(data);
        
        // Pequeño delay entre envíos para asegurar el orden
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (e) {
        console.error("Bot error media:", e);
        throw e;
      }
    }
  }
  
  return results;
}

