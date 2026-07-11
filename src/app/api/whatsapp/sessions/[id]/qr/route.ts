import { NextRequest, NextResponse } from "next/server";

const BOT_URL = process.env.WHATSAPP_BOT_URL || "http://localhost:3001";

// GET: Get QR for a session
export async function GET(req: NextRequest, context: any) {
  try {
    const params = await Promise.resolve(context.params);
    const res = await fetch(`${BOT_URL}/session/${params.id}/qr`, { cache: 'no-store' });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Error fetching QR for session:`, error);
    return NextResponse.json({ error: "Failed to fetch QR from bot" }, { status: 500 });
  }
}
