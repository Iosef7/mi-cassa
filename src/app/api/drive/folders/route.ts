import { NextResponse } from 'next/server';
import { listFolders } from '@/lib/google-drive';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const parentId = searchParams.get('parentId') || undefined;
    
    const folders = await listFolders(parentId);
    return NextResponse.json(folders);
  } catch (error) {
    console.error("Error fetching drive folders:", error);
    return NextResponse.json({ error: "Failed to fetch drive folders", details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
