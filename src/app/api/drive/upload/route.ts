import { NextResponse } from 'next/server';
import { uploadFile, uploadFileWithUserToken } from '@/lib/google-drive';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const parentId = formData.get('parentId') as string;

    if (!file || !parentId) {
      return NextResponse.json({ error: 'Faltan parámetros requeridos (file, parentId)' }, { status: 400 });
    }

    const authHeader = request.headers.get('Authorization');
    let userToken = null;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      userToken = authHeader.split(' ')[1];
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Subir a Drive
    let uploaded;
    if (userToken) {
      uploaded = await uploadFileWithUserToken(buffer, file.name, file.type, parentId, userToken);
    } else {
      uploaded = await uploadFile(buffer, file.name, file.type, parentId);
    }

    return NextResponse.json(uploaded);
  } catch (error) {
    console.error("Error uploading to drive:", error);
    return NextResponse.json({ error: "Failed to upload to drive", details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
