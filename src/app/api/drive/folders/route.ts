import { NextResponse } from 'next/server';
import { listFolders, createFolder } from '@/lib/google-drive';

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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, parentId } = body;
    
    if (!name) {
      return NextResponse.json({ error: "El nombre de la carpeta es requerido" }, { status: 400 });
    }
    
    if (!parentId) {
       return NextResponse.json({ error: "No se puede crear una carpeta en la raíz compartida. Por favor, selecciona una carpeta principal primero." }, { status: 400 });
    }

    const newFolder = await createFolder(name, parentId);
    return NextResponse.json(newFolder);
  } catch (error) {
    console.error("Error creating folder:", error);
    return NextResponse.json({ error: "Failed to create folder", details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
