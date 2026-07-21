import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
// import { sendUltramsgStatuses } from "@/lib/whatsapp";

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

function getNextOccurrenceOfDay(dayOfWeek: number, timeStr: string): Date {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const now = new Date();
  const next = new Date(now);
  next.setHours(hours, minutes, 0, 0);

  if (now.getDay() === dayOfWeek) {
    if (next <= now) {
      next.setDate(next.getDate() + 7);
    }
  } else {
    const diff = (dayOfWeek + 7 - now.getDay()) % 7;
    next.setDate(next.getDate() + diff);
  }
  return next;
}

// POST: Programar o enviar un nuevo estado
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    
    const files = formData.getAll("files") as File[];
    const caption = formData.get("caption") as string | null;
    const sessionIdsStr = formData.get("sessionIds") as string | null;
    const scheduleType = formData.get("scheduleType") as string | null || "now";
    const expiresAtStr = formData.get("expiresAt") as string | null;
    let expiresAt: Date | null = null;
    if (expiresAtStr) {
      expiresAt = new Date(expiresAtStr);
    }

    let sessionIds: string[] | undefined = undefined;
    if (sessionIdsStr) {
      try {
        sessionIds = JSON.parse(sessionIdsStr);
      } catch (e) {
        console.error("Error parsing sessionIds", e);
      }
    }

    const mediaUrls: string[] = [];
    const uploadDir = path.join(process.cwd(), "public", "uploads", "whatsapp");
    
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (e) {}

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

    // Preparar registros a crear
    const recordsToCreate: any[] = [];
    
    if (scheduleType === "now") {
      let finalStatus = "SCHEDULED";
      let publishedAt: Date | null = null;
      let errorMessage = null;
      try {
        const botUrl = process.env.BOT_API_URL || "http://localhost:3001";
        const mediaPath = mediaUrls.length > 0 ? path.join(process.cwd(), "public", mediaUrls[0]) : null;
        
        const res = await fetch(`${botUrl}/status`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionIds: sessionIds || [],
            caption: caption || "",
            mediaPath
          })
        });

        if (!res.ok) {
           throw new Error("Bot API returned error: " + await res.text());
        }

        finalStatus = "PUBLISHED";
        publishedAt = new Date();
      } catch (err: any) {
        console.error("Error sending immediate status via Bot API:", err);
        finalStatus = "FAILED";
        errorMessage = err.message || String(err);
      }
      recordsToCreate.push({
        mediaUrls: JSON.stringify(mediaUrls),
        caption: caption || "",
        publishAt: null,
        status: finalStatus,
        publishedAt: publishedAt,
        errorMessage: errorMessage,
        sessionIds: sessionIds ? JSON.stringify(sessionIds) : null
      });
    } else if (scheduleType === "once") {
      const dateStr = formData.get("dateStr") as string;
      const timeStr = formData.get("timeStr") as string;
      const publishAt = new Date(`${dateStr}T${timeStr}`);
      recordsToCreate.push({
        mediaUrls: JSON.stringify(mediaUrls),
        caption: caption || "",
        publishAt,
        status: "SCHEDULED",
        sessionIds: sessionIds ? JSON.stringify(sessionIds) : null
      });
    } else if (scheduleType === "multiple") {
      const schedulesStr = formData.get("schedules") as string;
      if (schedulesStr) {
        const schedules = JSON.parse(schedulesStr);
        for (const sch of schedules) {
          recordsToCreate.push({
            mediaUrls: JSON.stringify(mediaUrls),
            caption: caption || "",
            publishAt: new Date(`${sch.date}T${sch.time}`),
            status: "SCHEDULED",
            sessionIds: sessionIds ? JSON.stringify(sessionIds) : null
          });
        }
      }
    } else if (scheduleType === "recurring") {
      const weeklyStr = formData.get("weeklySchedule") as string;
      if (weeklyStr) {
        const weekly = JSON.parse(weeklyStr);
        for (const w of weekly) {
          const publishAt = getNextOccurrenceOfDay(w.dayOfWeek, w.time);
          recordsToCreate.push({
            mediaUrls: JSON.stringify(mediaUrls),
            caption: caption || "",
            publishAt,
            status: "SCHEDULED",
            recurringInterval: "WEEKLY",
            sessionIds: sessionIds ? JSON.stringify(sessionIds) : null,
            expiresAt
          });
        }
      }
    }

    const created = [];
    for (const data of recordsToCreate) {
      const status = await prisma.whatsappStatus.create({ data });
      created.push(status);
    }

    return NextResponse.json(created.length === 1 ? created[0] : created);
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
