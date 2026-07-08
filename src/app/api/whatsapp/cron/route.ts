import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendUltramsgStatuses } from "@/lib/whatsapp";

export async function GET(request: Request) {
  // Verificar autorización para evitar ejecuciones maliciosas
  const { searchParams } = new URL(request.url);
  const secretParam = searchParams.get("secret");
  const authHeader = request.headers.get("authorization");
  
  const isAuthorized = 
    secretParam === process.env.CRON_SECRET || 
    authHeader === `Bearer ${process.env.CRON_SECRET}` ||
    process.env.NODE_ENV === "development";

  if (!isAuthorized) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const now = new Date();
    
    // Buscar estados programados cuya fecha ya pasó o es ahora
    const pendingStatuses = await prisma.whatsappStatus.findMany({
      where: {
        status: "SCHEDULED",
        publishAt: {
          lte: now
        }
      }
    });

    if (pendingStatuses.length === 0) {
      return NextResponse.json({ message: "No hay estados pendientes para publicar." });
    }

    const results = [];

    // URL base de tu servidor para construir URLs absolutas de las imágenes locales
    // En producción deberías cambiar localhost por tu dominio real
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    for (const status of pendingStatuses) {
      try {
        let mediaUrls: string[] = [];
        try {
          mediaUrls = JSON.parse(status.mediaUrls || "[]");
        } catch (e) {
          console.error("Error parsing mediaUrls:", e);
        }

        const data = await sendUltramsgStatuses(mediaUrls, status.caption || "", baseUrl);
        
        // Actualizar estado a publicado
        await prisma.whatsappStatus.update({
            where: { id: status.id },
            data: {
              status: "PUBLISHED",
              publishedAt: new Date()
            }
          });
          results.push({ id: status.id, success: true, data });
        } else {
          throw new Error(data.error || "Error de la API de Ultramsg");
        }
      } catch (err: any) {
        console.error(`Error publicando estado ${status.id}:`, err);
        await prisma.whatsappStatus.update({
          where: { id: status.id },
          data: {
            status: "FAILED",
            errorMessage: err.message || String(err)
          }
        });
        results.push({ id: status.id, success: false, error: err.message });
      }
    }

    return NextResponse.json({ message: "Proceso cron finalizado", results });
  } catch (error) {
    console.error("Error en cron job de WhatsApp:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
