import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const BOT_URL = process.env.WHATSAPP_BOT_URL || "http://localhost:3001";

// GET: Obtener todas las sesiones desde la Base de Datos
export async function GET(req: NextRequest) {
  try {
    const sessions = await prisma.whatsAppSession.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json({ sessions });
  } catch (error) {
    console.error("Error fetching sessions from DB:", error);
    return NextResponse.json({ error: "Failed to fetch sessions" }, { status: 500 });
  }
}

// POST: Establecer un teléfono como "Default Sender"
export async function POST(req: NextRequest) {
  try {
    const { sessionId } = await req.json();

    if (!sessionId) {
      return NextResponse.json({ error: "sessionId es requerido" }, { status: 400 });
    }

    // Primero quitamos el default de todos
    await prisma.whatsAppSession.updateMany({
      data: { isDefaultSender: false }
    });

    // Se lo asignamos al seleccionado
    const updated = await prisma.whatsAppSession.update({
      where: { sessionId },
      data: { isDefaultSender: true }
    });

    return NextResponse.json({ success: true, session: updated });
  } catch (error) {
    console.error("Error setting default sender:", error);
    return NextResponse.json({ error: "Failed to set default sender" }, { status: 500 });
  }
}
