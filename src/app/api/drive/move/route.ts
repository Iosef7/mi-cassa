import { NextResponse } from 'next/server';
import { moveFolderWithUserToken } from '@/lib/google-drive';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.split('Bearer ')[1];
    
    if (!token) {
      return NextResponse.json({ error: "No se proporcionó un token de autenticación de Google Drive" }, { status: 401 });
    }

    const body = await request.json();
    const { folderId, newParentId } = body;
    
    if (!folderId || !newParentId) {
      return NextResponse.json({ error: "Faltan los parámetros folderId o newParentId" }, { status: 400 });
    }
    
    const result = await moveFolderWithUserToken(folderId, newParentId, token);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error moving folder:", error);
    return NextResponse.json({ error: "Error al mover la carpeta", details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
