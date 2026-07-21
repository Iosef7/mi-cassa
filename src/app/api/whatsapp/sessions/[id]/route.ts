import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const BOT_URL = process.env.WHATSAPP_BOT_URL || "http://localhost:3001";

// GET: Initialize or check a session by telling the Bot to spin up the socket
export async function GET(req: NextRequest, context: any) {
  try {
    const params = await Promise.resolve(context.params);
    const res = await fetch(`${BOT_URL}/session/${params.id}`, { cache: 'no-store' });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Error fetching session:`, error);
    return NextResponse.json({ error: "Failed to fetch session from bot" }, { status: 500 });
  }
}

// POST requests to initialize a session with a pairing code
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await Promise.resolve(context.params);
    const body = await request.json();
    const { phoneNumber } = body;

    if (!phoneNumber) {
      return NextResponse.json({ error: "Phone number is required for pairing code" }, { status: 400 });
    }

    const res = await fetch(`${BOT_URL}/session/${params.id}/pair`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ phoneNumber }),
      cache: 'no-store'
    });
    
    if (!res.ok) {
        throw new Error(`Bot returned ${res.status}`);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Error sending pairing code request:`, error);
    return NextResponse.json({ error: "Failed to fetch session from bot" }, { status: 500 });
  }
}

// DELETE: Delete a session (Tell bot to logout, DB cleanup is handled by the bot)
export async function DELETE(req: NextRequest, context: any) {
  try {
    const params = await Promise.resolve(context.params);
    const res = await fetch(`${BOT_URL}/session/${params.id}`, { method: 'DELETE' });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Error deleting session:`, error);
    return NextResponse.json({ error: "Failed to delete session from bot" }, { status: 500 });
  }
}

// PUT: Rename a session (Only affects the display name in the DB)
export async function PUT(req: NextRequest, context: any) {
  try {
    const params = await Promise.resolve(context.params);
    const { newId } = await req.json(); // we use 'newId' but it's just the 'name' now
    
    const updated = await prisma.whatsAppSession.update({
      where: { sessionId: params.id },
      data: { name: newId }
    });
    
    return NextResponse.json({ success: true, session: updated });
  } catch (error) {
    console.error(`Error renaming session:`, error);
    return NextResponse.json({ error: "Failed to rename session in DB" }, { status: 500 });
  }
}
