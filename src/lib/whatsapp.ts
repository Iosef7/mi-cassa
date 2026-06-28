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
