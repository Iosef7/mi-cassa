import { NextRequest, NextResponse } from "next/server";
import { generateAiContent, ai } from "@/lib/ai-service";
import { writeFile, unlink } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const textData = formData.get("text") as string;
    const files = formData.getAll("files") as File[];
    const driveUrls = formData.getAll("driveUrls") as string[];
    const driveToken = formData.get("driveToken") as string;

    if (!textData && (!files || files.length === 0) && (!driveUrls || driveUrls.length === 0)) {
      return NextResponse.json(
        { error: "No se proporcionó texto ni archivos" },
        { status: 400 }
      );
    }

    const uploadedAiFiles = [];
    const tempFilePaths = [];
    const debugDownloadErrors: any[] = [];

    // 1. Guardar archivos temporalmente y subirlos a Gemini
    if (files && files.length > 0) {
      for (const file of files) {
        const buffer = Buffer.from(await file.arrayBuffer());
        // Crear un nombre único para evitar colisiones
        const tempPath = join(tmpdir(), `${Date.now()}_${file.name}`);
        await writeFile(tempPath, buffer);
        tempFilePaths.push(tempPath);

        try {
          const uploadResult = await (ai.files.upload as any)({
            file: tempPath,
            mimeType: file.type || "application/octet-stream",
          });
          uploadedAiFiles.push({
            fileUri: uploadResult.uri,
            mimeType: uploadResult.mimeType,
            originalName: file.name,
            type: file.type,
            localTempPath: tempPath
          });
        } catch (uploadError) {
          console.error("Error uploading file to Gemini:", file.name, uploadError);
        }
      }
    }

    // 1.5. Descargar archivos de Drive y subirlos a Gemini
    if (driveUrls && driveUrls.length > 0 && driveToken) {
      for (const url of driveUrls) {
        let fileId = "";
        const dMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
        if (dMatch) fileId = dMatch[1];
        else {
          const idMatch = url.match(/id=([a-zA-Z0-9_-]+)/);
          if (idMatch) fileId = idMatch[1];
        }

        if (fileId) {
          try {
            const metaRes = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?fields=name,mimeType&supportsAllDrives=true`, {
              headers: { Authorization: `Bearer ${driveToken}` }
            });
            if (!metaRes.ok) {
               const errText = await metaRes.text();
               console.error(`Metadata fetch failed for ${fileId}:`, errText);
               debugDownloadErrors.push({ url, stage: 'metadata', error: errText });
               continue;
            }
            const meta = await metaRes.json();
            
            if (meta.name) {
              const isWorkspaceFile = meta.mimeType && meta.mimeType.startsWith('application/vnd.google-apps.');
              
              let downloadUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&supportsAllDrives=true`;
              let fileMimeType = meta.mimeType;
              let fileName = meta.name;
              
              if (isWorkspaceFile) {
                 // Export workspace files to standard formats that Gemini can read
                 if (meta.mimeType === 'application/vnd.google-apps.document') {
                     fileMimeType = 'text/plain';
                     fileName += '.txt';
                 } else if (meta.mimeType === 'application/vnd.google-apps.spreadsheet') {
                     fileMimeType = 'text/csv';
                     fileName += '.csv';
                 } else {
                     fileMimeType = 'application/pdf';
                     fileName += '.pdf';
                 }
                 downloadUrl = `https://www.googleapis.com/drive/v3/files/${fileId}/export?mimeType=${encodeURIComponent(fileMimeType)}`;
              }

              const contentRes = await fetch(downloadUrl, {
                headers: { Authorization: `Bearer ${driveToken}` }
              });
              if (!contentRes.ok) {
                const errText = await contentRes.text();
                console.error("Error downloading file from Drive:", errText);
                debugDownloadErrors.push({ url, stage: 'download', error: errText });
                continue;
              }
              const buffer = Buffer.from(await contentRes.arrayBuffer());
              
              const tempPath = join(tmpdir(), `${Date.now()}_drive_${fileName}`);
              await writeFile(tempPath, buffer);
              tempFilePaths.push(tempPath);
              
              const uploadResult = await (ai.files.upload as any)({
                file: tempPath,
                mimeType: fileMimeType || "application/octet-stream",
              });
              uploadedAiFiles.push({
                fileUri: uploadResult.uri,
                mimeType: uploadResult.mimeType,
                originalName: url, // Pasamos el URL como nombre original para que la IA devuelva el URL
                type: meta.mimeType,
                localTempPath: tempPath
              });
            }
          } catch (e: any) {
            console.error("Error downloading Drive file for AI:", url, e);
            debugDownloadErrors.push({ url, stage: 'exception', error: String(e) });
          }
        }
      }
    } else if (driveUrls && driveUrls.length > 0) {
      debugDownloadErrors.push({ stage: 'skipped', error: 'driveToken is missing or empty' });
    }

    // 2. Preparar los contenidos para el modelo
    const contents = [];
    
    if (textData) {
      contents.push({ text: `Aquí tienes información adicional en texto provista por el usuario:\n\n${textData}` });
    }

    if (uploadedAiFiles.length > 0) {
      const fileDescriptions = uploadedAiFiles.map((f, i) => {
        return `Archivo [${i}]: nombre original "${f.originalName}", tipo "${f.mimeType}". URI: ${f.fileUri}`;
      }).join("\n");
      
      contents.push({ text: `He adjuntado los siguientes archivos para que los analices:\n${fileDescriptions}` });

      for (const f of uploadedAiFiles) {
        contents.push({
          fileData: {
            mimeType: f.mimeType,
            fileUri: f.fileUri
          }
        });
      }
    }

    const promptText = `
Eres un asistente experto en bienes raíces. Analiza los archivos y el texto proporcionados para extraer información de una propiedad o proyecto inmobiliario.
Extrae la información en un formato JSON estricto que cumpla EXACTAMENTE con esta estructura (usa null si no encuentras el dato, no inventes nada que no esté explícito o sugerido fuertemente en el material):

{
  "title": "String, un título sugerido atractivo",
  "description": "String, una descripción persuasiva y completa en base a la info",
  "price": "Number, precio base o inicial encontrado",
  "minPrice": "Number",
  "maxPrice": "Number",
  "type": "String, debe ser uno de: CASA, DEPARTAMENTO, TERRENO, LOCAL, PROYECTO",
  "location": "String, dirección o ubicación principal",
  "bedrooms": "Number",
  "bathrooms": "Number",
  "area": "Number, área en metros cuadrados (solo el número)",
  "availableUnits": "Number",
  "deliveryDate": "String",
  "dynamicFeatures": {
    "pool": "String, descripción de la piscina si la tiene (Ej: 'Sí, privada', 'Compartida'), o null si no",
    "balcony": "String, descripción de balcón o terraza (Ej: 'Terraza de 20m2', 'Balcón al frente'), o null",
    "patio": "String, descripción del patio o jardín, o null",
    "bunker": "String, si tiene búnker o mamad (Ej: 'Sí, de 10m2'), o null",
    "orientation": "String, orientación (Ej: 'Norte', 'Sur', 'Este', 'Oeste'), o null",
    "condition": "String, estado de conservación (Ej: 'Excelente', 'A estrenar', 'A remodelar'), o null",
    "petFriendly": "String, si se permiten mascotas ('Sí', 'No', 'Consultar'), o null",
    "hoaFees": "String, gastos comunes / expensas / vaad bait (Ej: '₪ 500 / mes'), o null",
    "floors": "String, niveles o plantas de la propiedad (Ej: '2 plantas', 'Piso 5'), o null",
    "parking": "String, lugares de estacionamiento (Ej: '2 lugares cubiertos'), o null",
    "antiquity": "String, antigüedad (Ej: 'A estrenar', '10 años'), o null"
  },
  "fileCategorization": {
    "images": ["Array de números con los índices de los archivos que son exclusivamente fotos de la propiedad (ej: [0, 2])"],
    "presentations": ["Array de números con los índices de archivos que son presentaciones en PDF, folletos informativos, planos o catálogos"],
    "videos": ["Array de números con los índices de los archivos que son videos (ej: recorridos virtuales, formato mp4)"],
    "posters": ["Array de números con los índices de los archivos que sean afiches gráficos publicitarios, flyers, banners o material promocional de marketing"],
    "legalDocs": ["Array de números con los índices de los archivos que sean documentos legales, contratos, escrituras, tabu, etc."]
  }
}

Presta especial atención a extraer toda la información posible para la Ficha Técnica (dynamicFeatures). 
Presta especial atención a mapear CADA archivo subido (usando su índice basado en el orden provisto arriba) en la categoría CORRECTA dentro de 'fileCategorization'. Si es un afiche, mándalo a posters; si es presentación o plano, a presentations; si es video, a videos.
Responde SOLO con el JSON válido.
`;

    contents.push({ text: promptText });

    // 3. Llamar al modelo de Gemini
    const response = await generateAiContent({
      operationType: "PropertyDataExtraction",
      contents: contents,
      config: {
        responseMimeType: "application/json",
        temperature: 0.2
      }
    });

    // 4. Leer de vuelta los archivos para enviarlos al cliente como data URIs (si son pequeños) para poder previsualizarlos en la UI de inmediato
    const categorizedDataURIs: Record<string, string> = {};
    for (const f of uploadedAiFiles) {
       // Convertir los temporales de vuelta a base64 para mandar a la UI y que se visualicen. 
       // Omitimos los archivos de Drive que NO sean imágenes (como videos pesados) para no reenviarlos.
       // Las imágenes sí las convertimos a base64 para evitar errores de CORS o expiración de URL en la UI.
       if (!f.originalName.startsWith('http') || (f.mimeType && f.mimeType.startsWith('image/'))) {
         const fs = require('fs');
         const base64 = fs.readFileSync(f.localTempPath, { encoding: 'base64' });
         categorizedDataURIs[f.originalName] = `data:${f.mimeType};base64,${base64}`;
       }
    }

    // Limpiar temporales
    for (const tempPath of tempFilePaths) {
      try {
        await unlink(tempPath);
      } catch (err) {
        console.error("Error deleting temp file:", tempPath, err);
      }
    }

    // Parsear
    let aiResultText = response.text;
    
    const aiData = JSON.parse((aiResultText || "").trim());
    
    // Inyectar los Data URIs en la respuesta mapeando originalName -> data URI
    const responseData = { 
      success: true, 
      data: aiData, 
      filesData: categorizedDataURIs,
      fileNames: uploadedAiFiles.map(f => f.originalName),
      debug: {
        textDataLength: textData ? textData.length : 0,
        driveUrlsCount: driveUrls ? driveUrls.length : 0,
        uploadedAiFilesCount: uploadedAiFiles.length,
        downloadErrors: debugDownloadErrors,
        files: uploadedAiFiles.map(f => ({
          name: f.originalName,
          mimeType: f.mimeType,
          uri: f.fileUri
        }))
      }
    };

    // DEBUG: Escribir a un archivo local
    try {
      const fs = require('fs');
      const path = require('path');
      fs.writeFileSync(path.join(process.cwd(), 'ai_debug.json'), JSON.stringify(responseData, null, 2));
    } catch(e) {}

    return NextResponse.json(responseData);

  } catch (error: any) {
    console.error("Error en AI Extract Endpoint:", error);
    return NextResponse.json(
      { error: "Hubo un error procesando la extracción con IA.", details: error.message },
      { status: 500 }
    );
  }
}
