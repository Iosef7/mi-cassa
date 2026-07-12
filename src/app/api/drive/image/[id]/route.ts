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
    const auth = new google.auth.GoogleAuth({
      keyFile: KEYFILEPATH,
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    });
    const authClient = await auth.getClient();
    const token = await authClient.getAccessToken();
    const drive = google.drive({ version: 'v3', auth: authClient as any });

    const response = await drive.files.get({
      fileId: id,
      fields: 'thumbnailLink, mimeType, webContentLink',
    });

    if (response.data.thumbnailLink) {
      // Replace the size parameter to get a high-quality image (e.g., s2000 for 2000px)
      const highResUrl = response.data.thumbnailLink.replace(/=s\d+$/, '=s2000');
      
      try {
        const imageResponse = await fetch(highResUrl, {
          headers: token.token ? { Authorization: `Bearer ${token.token}` } : {}
        });
        if (imageResponse.ok) {
          const arrayBuffer = await imageResponse.arrayBuffer();
          return new NextResponse(arrayBuffer, {
            headers: {
              'Content-Type': imageResponse.headers.get('content-type') || 'image/jpeg',
              'Cache-Control': 'public, max-age=31536000, immutable',
            },
          });
        }
        console.error("Failed to fetch image from Google Drive thumbnail link:", imageResponse.status, imageResponse.statusText);
      } catch (e) {
        console.error("Error fetching image from highResUrl:", e);
      }
    }

    // Fallback: stream the original file using service account credentials.
    // We only do this for non-video files to avoid streaming massive video files into Next.js Image optimizer.
    const isVideo = response.data.mimeType?.startsWith('video/');
    if (!isVideo) {
      const mediaResponse = await drive.files.get(
        { fileId: id, alt: 'media' },
        { responseType: 'stream' }
      );

      const webStream = new ReadableStream({
        start(controller) {
          (mediaResponse.data as any).on('data', (chunk: any) => controller.enqueue(chunk));
          (mediaResponse.data as any).on('end', () => controller.close());
          (mediaResponse.data as any).on('error', (err: any) => controller.error(err));
        }
      });

      const contentType = mediaResponse.headers['content-type'] || 'image/jpeg';

      return new NextResponse(webStream, {
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=86400, stale-while-revalidate=43200'
        }
      });
    }

    return new NextResponse(null, { status: 404 });
  } catch (error: any) {
    console.error("Error fetching image from Drive via API:", error.message);
    return new NextResponse(null, { status: 404 });
  }
}
