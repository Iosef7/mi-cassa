import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId, messageId, remoteJid, fromMe, content, pushName } = body;

    if (!sessionId || !remoteJid || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Ignorar mensajes de grupo (por ahora)
    if (remoteJid.includes("@g.us")) {
       return NextResponse.json({ status: "ignored_group" });
    }

    const phone = remoteJid.split('@')[0];

    // 1. Buscar o Crear el Lead en la Base de Datos
    let lead = await prisma.lead.findFirst({
      where: { phone: phone }
    });

    if (!lead && !fromMe) {
      // Si no existe y el mensaje viene de afuera, lo creamos
      lead = await prisma.lead.create({
        data: {
          name: pushName || "Nuevo Prospecto WP",
          phone: phone,
          source: "WhatsApp Bot",
          status: "NUEVO"
        }
      });
    } else if (lead && !fromMe && lead.status === "NUEVO") {
      // Si ya existe y estaba inactivo, lo pasamos a CONTACTADO
      await prisma.lead.update({ where: { id: lead.id }, data: { status: "CONTACTADO" } });
    }

    // 2. Guardar el mensaje en el Historial de WhatsApp
    await prisma.whatsAppMessage.create({
      data: {
        sessionId,
        remoteJid,
        fromMe,
        messageId,
        content,
        status: fromMe ? "SENT" : "DELIVERED",
        leadId: lead ? lead.id : null
      }
    });

    console.log(`[Webhook] Mensaje guardado en CRM de ${phone}`);

    // NOTA PARA EL FUTURO CHATBOT:
    // Aquí es donde llamaremos a la lógica de respuestas automáticas o a un servicio de IA (ej. Gemini)
    // if (!fromMe) { 
    //    const response = await generateAiResponse(content);
    //    await enqueueWhatsAppMessage(sessionId, remoteJid, response);
    // }

    return NextResponse.json({ status: "success" });

  } catch (error) {
    console.error("Error en el Webhook de WhatsApp:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
