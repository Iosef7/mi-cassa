import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { sendWhatsAppMessage } from "@/lib/whatsapp";
import { prisma } from "@/lib/prisma";
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// VERIFICACIÓN DEL WEBHOOK (Requerido por Meta)
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  const verifyToken = process.env.WEBHOOK_VERIFY_TOKEN;

  if (mode === "subscribe" && token === verifyToken) {
    console.log("WEBHOOK_VERIFIED");
    return new NextResponse(challenge, { status: 200 });
  } else {
    return new NextResponse("Forbidden", { status: 403 });
  }
}

// RECEPCIÓN DE MENSAJES
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Verificamos si es un evento de WhatsApp
    if (body.object) {
      if (
        body.entry &&
        body.entry[0].changes &&
        body.entry[0].changes[0] &&
        body.entry[0].changes[0].value.messages &&
        body.entry[0].changes[0].value.messages[0]
      ) {
        const phone_number_id = body.entry[0].changes[0].value.metadata.phone_number_id;
        const msgInfo = body.entry[0].changes[0].value.messages[0];
        
        // Solo procesamos mensajes de texto por ahora
        if (msgInfo.type !== "text") {
          return NextResponse.json({ status: "ok" });
        }

        const from = msgInfo.from; // Número de teléfono del cliente
        const msg_body = msgInfo.text.body;

        console.log(`Mensaje recibido de ${from}: ${msg_body}`);

        // 1. Buscar o Crear el Lead en la Base de Datos
        let lead = await prisma.lead.findFirst({
          where: { phone: from }
        });

        if (!lead) {
          // Si no existe, lo creamos
          const contactName = body.entry[0].changes[0].value.contacts?.[0]?.profile?.name || "Nuevo Prospecto WP";
          lead = await prisma.lead.create({
            data: {
              name: contactName,
              phone: from,
              source: "WhatsApp Bot",
              status: "NUEVO"
            }
          });
        } else {
          // Si ya existe y estaba inactivo, lo podemos pasar a CONTACTADO
          if (lead.status === "NUEVO") {
             await prisma.lead.update({ where: { id: lead.id }, data: { status: "CONTACTADO" } });
          }
        }

        // 2. Guardar el mensaje del cliente
        await prisma.message.create({
          data: {
            content: msg_body,
            fromBot: false,
            leadId: lead.id
          }
        });

        // 3. Procesar con Gemini (Inteligencia Artificial)
        // Obtener historial reciente para contexto
        const recentMessages = await prisma.message.findMany({
          where: { leadId: lead.id },
          orderBy: { createdAt: "desc" },
          take: 10
        });

        const conversationHistory = recentMessages.reverse().map(m => 
          `${m.fromBot ? 'Asistente' : 'Cliente'}: ${m.content}`
        ).join("\n");

        // Obtener propiedades disponibles
        const properties = await prisma.property.findMany({ where: { status: "DISPONIBLE" } });

        const prompt = `
          Eres la secretaria virtual y agente inmobiliaria de "Mi Cassa". 
          Tu objetivo es atender al cliente amablemente, responder sus dudas sobre proyectos y tratar de pre-agendar una cita.
          
          Información del cliente (Lead ID: ${lead.id}):
          Nombre: ${lead.name}
          Historial de conversación:
          ${conversationHistory}

          Catálogo de Propiedades Disponibles:
          ${JSON.stringify(properties, null, 2)}

          Instrucciones:
          - Responde de manera concisa y natural, como un mensaje de WhatsApp (usa emojis moderadamente).
          - Si el cliente busca una propiedad, recomiéndale las que mejor se ajusten.
          - Si el cliente quiere agendar una cita, pídele una fecha y hora aproximada. Si te da la fecha, dile que un humano le confirmará pronto.
          - IMPORTANTE: Tu respuesta será enviada directamente al cliente. Genera SOLO el texto de tu respuesta.
        `;

        const aiResponse = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: [{ role: "user", parts: [{ text: prompt }] }]
        });

        const botReply = aiResponse.text || "Lo siento, estoy teniendo problemas técnicos en este momento. Un asesor humano se comunicará contigo pronto.";

        // 4. Guardar respuesta del bot en BD
        await prisma.message.create({
          data: {
            content: botReply,
            fromBot: true,
            leadId: lead.id
          }
        });

        // 5. Enviar mensaje de vuelta por WhatsApp
        await sendWhatsAppMessage(from, botReply);
      }
      return NextResponse.json({ status: "ok" });
    } else {
      return new NextResponse("Not Found", { status: 404 });
    }
  } catch (error) {
    console.error("Error procesando webhook de WhatsApp:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
