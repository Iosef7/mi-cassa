import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, context: any) {
  try {
    const params = await Promise.resolve(context.params);
    const sessionId = params.id;

    const session = await prisma.whatsAppSession.findUnique({
      where: { sessionId }
    });

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    if (session.currentQr) {
      return NextResponse.json({ qr: session.currentQr, isConnected: session.isConnected, pairingCode: session.pairingCode });
    }

    if (session.pairingCode) {
      return NextResponse.json({ qr: null, isConnected: session.isConnected, pairingCode: session.pairingCode });
    }

    return NextResponse.json({ waiting: true, isConnected: session.isConnected });

  } catch (error) {
    console.error(`Error fetching QR for session:`, error);
    return NextResponse.json({ error: "Failed to fetch QR" }, { status: 500 });
  }
}
