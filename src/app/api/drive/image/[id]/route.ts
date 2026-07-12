import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import path from 'path';
import fs from 'fs';

const KEYFILEPATH = path.join(process.cwd(), 'google-credentials.json');

async function getDriveClient() {
  if (!fs.existsSync(KEYFILEPATH)) {
    throw new Error('No se encontró el archivo google-credentials.json en la raíz del proyecto.');
  }

  const auth = new google.auth.GoogleAuth({
    keyFile: KEYFILEPATH,
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],
  });

  const authClient = await auth.getClient();
  return google.drive({ version: 'v3', auth: authClient as any });
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const drive = await getDriveClient();

    const response = await drive.files.get({
      fileId: id,
      fields: 'thumbnailLink, webContentLink',
    });

    if (response.data.thumbnailLink) {
      // Replace the size parameter to get a high-quality image (e.g., s2000 for 2000px)
      const highResUrl = response.data.thumbnailLink.replace(/=s\d+$/, '=s2000');
      return NextResponse.redirect(highResUrl);
    }

    if (response.data.webContentLink) {
      return NextResponse.redirect(response.data.webContentLink);
    }

    return new NextResponse(null, { status: 404 });
  } catch (error: any) {
    console.error("Error fetching image from Drive via API:", error.message);
    return new NextResponse(null, { status: 404 });
  }
}
