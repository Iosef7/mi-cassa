import { NextResponse } from 'next/server';
import { listFilesInFolder } from '@/lib/google-drive';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const folderId = searchParams.get('folderId');
    
    if (!folderId) {
      return NextResponse.json({ error: "Missing folderId" }, { status: 400 });
    }

    const files = await listFilesInFolder(folderId);
    return NextResponse.json(files);
  } catch (error) {
    console.error("Error fetching drive files:", error);
    return NextResponse.json({ error: "Failed to fetch drive files", details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
