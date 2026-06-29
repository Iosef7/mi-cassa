import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
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

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const uploadedAiFiles = [];
    const tempFilePaths = [];

    // 1. Guardar archivos temporalmente y subirlos a Gemini
    if (files && files.length > 0) {
      for (const file of files) {
        const buffer = Buffer.from(await file.arrayBuffer());
        // Crear un nombre único para evitar colisiones
        const tempPath = join(tmpdir(), `${Date.now()}_${file.name}`);
        await writeFile(tempPath, buffer);
        tempFilePaths.push(tempPath);

        try {
          const uploadResult = await ai.files.upload({
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
            const metaRes = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?fields=name,mimeType`, {
              headers: { Authorization: `Bearer ${driveToken}` }
            });
            const meta = await metaRes.json();
            
            if (meta.name) {
              const contentRes = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
                headers: { Authorization: `Bearer ${driveToken}` }
              });
              const buffer = Buffer.from(await contentRes.arrayBuffer());
              
              const tempPath = join(tmpdir(), `${Date.now()}_drive_${meta.name}`);
              await writeFile(tempPath, buffer);
              tempFilePaths.push(tempPath);
              
              const uploadResult = await ai.files.upload({
                file: tempPath,
                mimeType: meta.mimeType || "application/octet-stream",
              });
              uploadedAiFiles.push({
                fileUri: uploadResult.uri,
                mimeType: uploadResult.mimeType,
                originalName: url, // Pasamos el URL como nombre original para que la IA devuelva el URL
                type: meta.mimeType,
                localTempPath: tempPath
              });
            }
          } catch (e) {
            console.error("Error downloading Drive file for AI:", url, e);
          }
        }
      }
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
  "dynamicFeatures": "Objeto JSON con características extra tipo clave-valor (ej: {'piscina': 'si'})",
  "fileCategorization": {
    "images": ["String con los 'originalName' exactos de los archivos que son fotos de la propiedad"],
    "presentations": ["String con los 'originalName' exactos que son PDFs, presentaciones o planos"],
    "videos": ["String con los 'originalName' exactos que son videos"],
    "posters": ["String con los 'originalName' exactos que sean afiches promocionales gráficos"],
    "legalDocs": ["String con los 'originalName' exactos que parezcan documentos legales o contratos"]
  }
}

Presta especial atención a mapear cada archivo subido (usando su nombre original provisto arriba) en la categoría correcta dentro de 'fileCategorization'.
Responde SOLO con el JSON válido.
`;

    contents.push({ text: promptText });

    // 3. Llamar al modelo de Gemini
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
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
       if (!f.originalName.startsWith('http') || f.mimeType.startsWith('image/')) {
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
    
    const aiData = JSON.parse(aiResultText.trim());
    
    // Inyectar los Data URIs en la respuesta mapeando originalName -> data URI
    return NextResponse.json({ success: true, data: aiData, filesData: categorizedDataURIs });

  } catch (error: any) {
    console.error("Error en AI Extract Endpoint:", error);
    return NextResponse.json(
      { error: "Hubo un error procesando la extracción con IA.", details: error.message },
      { status: 500 }
    );
  }
}
