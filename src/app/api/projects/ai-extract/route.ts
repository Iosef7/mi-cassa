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
                originalName: url, 
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
Eres un analista experto en inversiones inmobiliarias y bienes raíces. 
Analiza exhaustivamente los archivos adjuntos (documentos, imágenes, presentaciones financieras, textos) para extraer información detallada de un PROYECTO DE DESARROLLO INMOBILIARIO o INVERSIÓN (Development Project).
Tu tarea es estructurar los datos en un formato JSON estricto que cumpla EXACTAMENTE con esta estructura (usa null si no encuentras el dato o si no hay suficiente información. No inventes nada).

{
  "name": "String, un nombre claro para el proyecto (Ej: 'Uziel Complex', 'Residencial Los Álamos')",
  "location": "String, dirección, zona o ubicación general (Ej: 'Bait Vagan, Jerusalem')",
  "architect": "String, nombre del arquitecto o firma si se menciona",
  "totalUnits": "Number, cantidad total de unidades o departamentos",
  "floors": "Number, cantidad de pisos o niveles",
  "description": "String, una descripción persuasiva y altamente detallada del proyecto. Debes incluir las características premium, ventajas de preventa, plusvalía esperada y detalles comerciales relevantes para un inversor.",
  "status": "String, debe ser uno de: EVALUACION, PLANIFICACION, EN_CONSTRUCCION, TERMINADO",
  "dealType": "String, el tipo de trato o acuerdo (Ej: 'Renovación Urbana', 'Preventa', 'Combinación')",
  "ownershipShare": "Number, porcentaje de participación o plusvalía si se menciona (Ej: 40 para 40%)",
  "estimatedCost": "Number, costo estimado o precio base (si hay algún valor de inversión requerido. Ej: 27000)",
  "expectedRevenue": "Number, retorno esperado o rentabilidad total (Ej: 10 o 75 para porcentajes si tiene sentido)",
  "notes": "String, notas adicionales financieras o datos clave que no encajan en otro lado (Ej: 'Rendimiento Anual: 10% a 11%. Bono de descuento: 6000 ILS/m2')",
  "fileCategorization": {
    "images": ["Array de números con los índices de los archivos que son fotos de la propiedad (ej: [0, 2])"],
    "presentations": ["Array de números con los índices de archivos que son presentaciones en PDF, folletos informativos, planos o catálogos"],
    "videos": ["Array de números con los índices de los archivos que son videos (ej: recorridos virtuales, formato mp4)"],
    "posters": ["Array de números con los índices de los archivos que sean afiches gráficos publicitarios, flyers, banners o material promocional de marketing"],
    "legalDocs": ["Array de números con los índices de los archivos que sean documentos legales, contratos, escrituras, tabu, etc."]
  }
}

Presta especial atención a extraer toda la información de INVERSIÓN, RENTABILIDAD Y ESTRUCTURA FINANCIERA para agregarla en la 'description' y 'notes'.
Mapea CADA archivo subido (usando su índice basado en el orden provisto arriba) en la categoría CORRECTA dentro de 'fileCategorization'. Si es un afiche publicitario con texto o render de venta con promoción, inclúyelo en 'images' y 'posters' al mismo tiempo o sólo en 'images' (si es el póster principal del proyecto).
Responde SOLO con el JSON válido.
`;

    contents.push({ text: promptText });

    // 3. Llamar al modelo de Gemini
    const response = await generateAiContent({
      operationType: "ProjectDataExtraction",
      contents: contents,
      config: {
        responseMimeType: "application/json",
        temperature: 0.2
      }
    });

    // 4. Leer de vuelta los archivos para enviarlos al cliente como data URIs
    const categorizedDataURIs: Record<string, string> = {};
    for (const f of uploadedAiFiles) {
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
    
    const responseData = { 
      success: true, 
      data: aiData, 
      filesData: categorizedDataURIs,
      fileNames: uploadedAiFiles.map(f => f.originalName)
    };

    return NextResponse.json(responseData);

  } catch (error: any) {
    console.error("Error en AI Extract Endpoint para Proyectos:", error);
    return NextResponse.json(
      { error: "Hubo un error procesando la extracción de proyecto con IA.", details: error.message },
      { status: 500 }
    );
  }
}
