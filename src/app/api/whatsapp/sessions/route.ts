import { NextRequest, NextResponse } from "next/server";

const BOT_URL = process.env.WHATSAPP_BOT_URL || "http://localhost:3001";

// GET: Obtener todas las sesiones
export async function GET(req: NextRequest) {
  try {
    const res = await fetch(`${BOT_URL}/sessions`, { cache: 'no-store' });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching sessions:", error);
    return NextResponse.json({ error: "Failed to fetch sessions from bot" }, { status: 500 });
  }
}
