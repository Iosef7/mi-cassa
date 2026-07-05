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

    const response = await drive.files.get(
      { fileId: id, alt: 'media' },
      { responseType: 'stream' }
    );

    // Explicitly casting the node stream to any to bypass type issues with web stream conversion
    const webStream = new ReadableStream({
      start(controller) {
        (response.data as any).on('data', (chunk: any) => controller.enqueue(chunk));
        (response.data as any).on('end', () => controller.close());
        (response.data as any).on('error', (err: any) => controller.error(err));
      }
    });

    const contentType = response.headers['content-type'] || 'image/jpeg';

    return new NextResponse(webStream, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=43200'
      }
    });
  } catch (error: any) {
    console.error("Error fetching image from Drive via API:", error.message);
    return new NextResponse(null, { status: 404 });
  }
}
