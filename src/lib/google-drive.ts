import { google, drive_v3 } from 'googleapis';
import path from 'path';
import fs from 'fs';

// Inicializar la autenticación con la Service Account
const KEYFILEPATH = path.join(process.cwd(), 'google-credentials.json');

// Scopes necesarios para manejar archivos y carpetas
const SCOPES = ['https://www.googleapis.com/auth/drive'];

let authClient: any = null;
let drive: drive_v3.Drive | null = null;

async function getDriveClient() {
  if (drive) return drive;

  if (!fs.existsSync(KEYFILEPATH)) {
    throw new Error('No se encontró el archivo google-credentials.json en la raíz del proyecto.');
  }

  const auth = new google.auth.GoogleAuth({
    keyFile: KEYFILEPATH,
    scopes: SCOPES,
  });

  authClient = await auth.getClient();
  drive = google.drive({ version: 'v3', auth: authClient });
  return drive;
}

/**
 * Lista las carpetas dentro de una carpeta padre específica.
 * Si no se pasa parentId, lista las carpetas compartidas con el Service Account (en "Compartido conmigo" o raíz).
 */
export async function listFolders(parentId?: string) {
  const driveClient = await getDriveClient();
  let query = "mimeType='application/vnd.google-apps.folder' and trashed=false";
  
  if (parentId) {
    query += ` and '${parentId}' in parents`;
  } else {
    // Si no hay parentId, buscaremos en "Shared with me" porque la cuenta de servicio 
    // no tiene carpetas propias por defecto, solo las que se le comparten.
    query += " and sharedWithMe=true";
  }

  const res = await driveClient.files.list({
    q: query,
    fields: 'files(id, name)',
    orderBy: 'name',
  });

  return res.data.files || [];
}

/**
 * Crea una nueva subcarpeta dentro de un parentId.
 */
export async function createFolder(name: string, parentId: string) {
  const driveClient = await getDriveClient();
  const fileMetadata = {
    name: name,
    mimeType: 'application/vnd.google-apps.folder',
    parents: [parentId]
  };

  const folder = await driveClient.files.create({
    requestBody: fileMetadata,
    fields: 'id, name, webViewLink'
  });

  // Compartir la carpeta creada (opcional, pero util para que otros la vean si el owner es el service account)
  // Como la carpeta padre ya esta compartida, hereda los permisos.

  return folder.data;
}

/**
 * Sube un archivo a Google Drive dentro de una carpeta específica.
 */
export async function uploadFile(buffer: Buffer, filename: string, mimeType: string, parentId: string) {
  const driveClient = await getDriveClient();

  const fileMetadata = {
    name: filename,
    parents: [parentId]
  };

  const media = {
    mimeType: mimeType,
    body: require('stream').Readable.from(buffer),
  };

  const file = await driveClient.files.create({
    requestBody: fileMetadata,
    media: media,
    fields: 'id, name, webViewLink, webContentLink',
  });

  // Dar permisos de lectura públicos al archivo para que se pueda ver en el panel sin pedir login de Google
  try {
    await driveClient.permissions.create({
      fileId: file.data.id!,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      }
    });
  } catch (e) {
    console.error("Error setting permissions:", e);
  }

  return file.data;
}

/**
 * Lista los archivos de una carpeta.
 */
export async function listFilesInFolder(folderId: string) {
  const driveClient = await getDriveClient();
  const res = await driveClient.files.list({
    q: `'${folderId}' in parents and mimeType != 'application/vnd.google-apps.folder' and trashed=false`,
    fields: 'files(id, name, mimeType, webViewLink, webContentLink)',
  });

  return res.data.files || [];
}

/**
 * Sube un archivo en base64 a Drive (útil para la migración o si el frontend envía base64).
 */
export async function uploadBase64(base64Data: string, filename: string, parentId: string) {
  // Ej: data:image/jpeg;base64,/9j/4AAQ...
  const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  
  if (!matches || matches.length !== 3) {
    // Si no es un formato data URI valido, asumir que ya es url de Google Drive
    if (base64Data.startsWith('http')) return { webViewLink: base64Data };
    throw new Error('Invalid base64 string');
  }

  const mimeType = matches[1];
  const buffer = Buffer.from(matches[2], 'base64');
  
  return uploadFile(buffer, filename, mimeType, parentId);
}
