import { google } from "googleapis";
import sharp from "sharp";

let driveClient: any = null;

export const initGoogleDrive = async () => {
    try {
        const clientId = process.env.GOOGLE_DRIVE_CLIENT_ID;
        const clientSecret = process.env.GOOGLE_DRIVE_CLIENT_SECRET;
        const refreshToken = process.env.GOOGLE_DRIVE_REFRESH_TOKEN;
        const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

        if (clientId && clientSecret && refreshToken && folderId) {
            const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
            oauth2Client.setCredentials({ refresh_token: refreshToken });
            const tempClient = google.drive({ version: 'v3', auth: oauth2Client });

            driveClient = tempClient;
            console.log('[Google Drive] Client initialized.');
        } else {
            console.log('[Google Drive] Missing OAuth2 credentials or Folder ID.');
            driveClient = null;
        }
    } catch (e: any) {
        console.error('[Google Drive] Connection test FAILED:', e.message);
        driveClient = null;
    }
};

// Initialize immediately
initGoogleDrive();

export const getDriveClient = () => driveClient;

const isOptimizableImage = (mimeType = '') => (
    mimeType.startsWith('image/') &&
    !mimeType.includes('gif') &&
    !mimeType.includes('svg')
  );
  
export const optimizeImageBuffer = async (
    buffer: Buffer,
    mimeType: string,
    maxWidth = 1920,
    maxHeight = 1920,
    quality = 78,
  ) => {
    if (!isOptimizableImage(mimeType)) {
      return {
        buffer,
        mimeType,
        extension: mimeType.split('/')[1] || 'bin'
      };
    }
  
    const optimizedBuffer = await sharp(buffer)
      .rotate()
      .resize({
        width: maxWidth,
        height: maxHeight,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality, effort: 5 })
      .toBuffer();
  
    return {
      buffer: optimizedBuffer,
      mimeType: 'image/webp',
      extension: 'webp'
    };
  };

export const uploadToDrive = async (buffer: Buffer, originalName: string, mimeType: string) => {
    if (!driveClient) throw new Error("Google Drive client not initialized");
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

    // Convert Buffer to a Readable Stream
    const { Readable } = require('stream');
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);

    const fileMetadata = {
        name: originalName,
        parents: folderId ? [folderId] : undefined,
    };
    const media = {
        mimeType: mimeType,
        body: stream,
    };

    const file = await driveClient.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id',
    });

    console.log(`[Google Drive] Uploaded file: ${originalName} with ID: ${file.data.id}`);
    return file.data.id;
};

export const deleteDriveFile = async (fileId: string) => {
    if (!driveClient) return false;
    try {
        await driveClient.files.delete({ fileId });
        console.log(`[Google Drive] Deleted file: ${fileId}`);
        return true;
    } catch (err: any) {
        console.error(`[Google Drive] Error deleting file ${fileId}:`, err.message);
        return false;
    }
};

export const getDriveFileStream = async (fileId: string) => {
    if (!driveClient) throw new Error("Google Drive client not initialized");
    const res = await driveClient.files.get(
        { fileId, alt: 'media' },
        { responseType: 'stream' }
    );
    return res.data;
};

export const getDriveFileResponse = async (fileId: string) => {
    if (!driveClient) throw new Error("Google Drive client not initialized");
    const res = await driveClient.files.get(
        { fileId, alt: 'media' },
        { responseType: 'stream' }
    );
    return res;
};
