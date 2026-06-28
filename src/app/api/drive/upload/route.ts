import { NextResponse } from 'next/server';
import { uploadFile } from '@/lib/google-drive';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const parentId = formData.get('parentId') as string;

    if (!file || !parentId) {
      return NextResponse.json({ error: 'Faltan parámetros requeridos (file, parentId)' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Subir a Drive
    const uploaded = await uploadFile(
      buffer,
      file.name,
      file.type,
      parentId
    );

    return NextResponse.json(uploaded);
  } catch (error) {
    console.error("Error uploading to drive:", error);
    return NextResponse.json({ error: "Failed to upload to drive", details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
