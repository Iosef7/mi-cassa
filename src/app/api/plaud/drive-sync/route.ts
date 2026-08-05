import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { listFilesInFolder, downloadFileAsBase64 } from '@/lib/google-drive';
import { processPlaudRecording } from '@/lib/plaud-processor';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    let folderId = body.folderId;

    if (!folderId) {
      const folderSetting = await prisma.systemSettings.findUnique({
        where: { key: 'plaud_google_drive_folder_id' },
      });
      folderId = folderSetting?.value;
    }

    if (!folderId) {
      return NextResponse.json(
        { error: 'No se ha configurado la ID de la carpeta de Google Drive para Plaud.' },
        { status: 400 }
      );
    }

    // Save/update folder ID setting if provided
    if (body.folderId) {
      await prisma.systemSettings.upsert({
        where: { key: 'plaud_google_drive_folder_id' },
        create: { key: 'plaud_google_drive_folder_id', value: body.folderId },
        update: { value: body.folderId },
      });
    }

    // Fetch files in Google Drive folder
    const files = await listFilesInFolder(folderId);

    // Get processed file IDs list from SystemSettings
    const processedFilesSetting = await prisma.systemSettings.findUnique({
      where: { key: 'plaud_processed_drive_files' },
    });
    const processedIds: string[] = processedFilesSetting ? JSON.parse(processedFilesSetting.value) : [];

    const audioExtensions = ['.mp3', '.wav', '.m4a', '.aac', '.ogg', '.flac'];
    const textExtensions = ['.txt', '.json'];

    const pendingFiles = files.filter(f => {
      if (processedIds.includes(f.id!)) return false;
      const lowerName = (f.name || '').toLowerCase();
      return audioExtensions.some(ext => lowerName.endsWith(ext)) || textExtensions.some(ext => lowerName.endsWith(ext));
    });

    if (pendingFiles.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No hay archivos nuevos pendientes por procesar en Google Drive.',
        processedCount: 0,
        totalInFolder: files.length,
      });
    }

    const processedResults = [];

    for (const file of pendingFiles) {
      try {
        const base64Data = await downloadFileAsBase64(file.id!);
        const buffer = Buffer.from(base64Data, 'base64');
        const lowerName = (file.name || '').toLowerCase();

        let result;
        if (textExtensions.some(ext => lowerName.endsWith(ext))) {
          const textContent = buffer.toString('utf-8');
          result = await processPlaudRecording({
            transcriptionText: textContent,
            title: file.name || 'Grabación de Plaud',
            audioUrl: file.webViewLink || undefined,
            source: 'DRIVE',
          });
        } else {
          result = await processPlaudRecording({
            audioBuffer: buffer,
            mimeType: file.mimeType || 'audio/mp3',
            title: file.name || 'Grabación de Plaud',
            audioUrl: file.webViewLink || undefined,
            source: 'DRIVE',
          });
        }

        processedResults.push({ fileId: file.id, fileName: file.name, ...result });
        processedIds.push(file.id!);
      } catch (err: any) {
        console.error(`Error procesando archivo de Drive ${file.name}:`, err);
      }
    }

    // Save updated processed file IDs list
    await prisma.systemSettings.upsert({
      where: { key: 'plaud_processed_drive_files' },
      create: { key: 'plaud_processed_drive_files', value: JSON.stringify(processedIds) },
      update: { value: JSON.stringify(processedIds) },
    });

    return NextResponse.json({
      success: true,
      processedCount: processedResults.length,
      results: processedResults,
    });
  } catch (error: any) {
    console.error('Error en escaneo de Google Drive:', error);
    return NextResponse.json(
      { error: error?.message || 'Error escaneando la carpeta de Google Drive' },
      { status: 500 }
    );
  }
}
