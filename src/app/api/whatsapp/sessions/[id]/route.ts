import { NextRequest, NextResponse } from "next/server";

const BOT_URL = process.env.WHATSAPP_BOT_URL || "http://localhost:3001";

// GET: Initialize or check a session
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

// DELETE: Delete a session
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

// PUT: Rename a session
export async function PUT(req: NextRequest, context: any) {
  try {
    const params = await Promise.resolve(context.params);
    const { newId } = await req.json();
    const res = await fetch(`${BOT_URL}/session/${params.id}/rename`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newId })
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error(`Error renaming session:`, error);
    return NextResponse.json({ error: "Failed to rename session in bot" }, { status: 500 });
  }
}
