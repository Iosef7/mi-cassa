import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { sendUltramsgStatuses } from "@/lib/whatsapp";

// GET: Obtener todos los estados programados/históricos
export async function GET(req: NextRequest) {
  try {
    const statuses = await prisma.whatsappStatus.findMany({
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json(statuses);
  } catch (error) {
    console.error("Error fetching statuses:", error);
    return NextResponse.json({ error: "Failed to fetch statuses" }, { status: 500 });
  }
}

// POST: Programar o enviar un nuevo estado
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    
    // getAll para obtener múltiples archivos
    const files = formData.getAll("files") as File[];
    const caption = formData.get("caption") as string | null;
    const publishAtStr = formData.get("publishAt") as string | null;
    const sessionIdsStr = formData.get("sessionIds") as string | null;

    let sessionIds: string[] | undefined = undefined;
    if (sessionIdsStr) {
      try {
        sessionIds = JSON.parse(sessionIdsStr);
      } catch (e) {
        console.error("Error parsing sessionIds", e);
      }
    }

    let publishAt: Date | null = null;
    if (publishAtStr && publishAtStr !== "now") {
      publishAt = new Date(publishAtStr);
    }

    const mediaUrls: string[] = [];
    const uploadDir = path.join(process.cwd(), "public", "uploads", "whatsapp");
    
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (e) {
      // Ignorar si existe
    }

    // Guardar todos los archivos
    for (const file of files) {
      if (file.size > 0) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        const filename = `status_${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
        const filepath = path.join(uploadDir, filename);
        await writeFile(filepath, buffer);
        
        mediaUrls.push(`/uploads/whatsapp/${filename}`);
      }
    }

    // Si es "ahora" (publishAt es null), intentamos enviar inmediatamente
    let finalStatus = "SCHEDULED";
    let publishedAt: Date | null = null;
    let errorMessage = null;
    
    if (!publishAt) {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
        await sendUltramsgStatuses(mediaUrls, caption || "", baseUrl, sessionIds);
        finalStatus = "PUBLISHED";
        publishedAt = new Date();
      } catch (err: any) {
        console.error("Error sending immediate status:", err);
        finalStatus = "FAILED";
        errorMessage = err.message || String(err);
      }
    }

    const status = await prisma.whatsappStatus.create({
      data: {
        mediaUrls: JSON.stringify(mediaUrls),
        caption: caption || "",
        publishAt: publishAt,
        status: finalStatus,
        publishedAt: publishedAt,
        errorMessage: errorMessage
      }
    });

    return NextResponse.json(status);
  } catch (error) {
    console.error("Error scheduling status:", error);
    return NextResponse.json({ error: "Failed to schedule status", details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}

// DELETE: Cancelar un estado programado
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    await prisma.whatsappStatus.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting status:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
