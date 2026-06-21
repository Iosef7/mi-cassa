import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { pipeline } from 'stream/promises';

// This handles both Twilio Webhook (URL) and our manual test upload (File).
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    let recordingUrl = formData.get('RecordingUrl') as string;
    const audioFile = formData.get('audioFile') as File;
    const callSid = formData.get('CallSid') as string;
    const fromNumber = formData.get('From') as string;
    const manualLeadId = formData.get('leadId') as string;

    if (!recordingUrl && !audioFile) {
      return NextResponse.json({ error: "Missing RecordingUrl or audioFile" }, { status: 400 });
    }

    const tempFilePath = path.join(os.tmpdir(), `call_${callSid || Date.now()}.mp3`);

    // 1. Obtener el archivo (ya sea descargando la URL de Twilio o guardando el archivo subido)
    if (audioFile) {
      console.log("Processing manual file upload:", audioFile.name);
      const buffer = Buffer.from(await audioFile.arrayBuffer());
      fs.writeFileSync(tempFilePath, buffer);
    } else {
      // Twilio recordings can be fetched as MP3 by appending .mp3
      if (!recordingUrl.endsWith('.mp3')) {
        recordingUrl += '.mp3';
      }

      console.log("Downloading recording from:", recordingUrl);
      const audioRes = await fetch(recordingUrl);
      if (!audioRes.ok) throw new Error("Failed to fetch audio from Twilio");
      if (!audioRes.body) throw new Error("No body in audio response");
      
      const fileStream = fs.createWriteStream(tempFilePath);
      // @ts-expect-error - node stream pipeline works with web streams in modern node
      await pipeline(audioRes.body, fileStream);
      console.log("Audio downloaded to:", tempFilePath);
    }

    // 2. Initialize Gemini API
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY is not set.");
      return NextResponse.json({ error: "API Key missing" }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });

    // 3. Upload file to Gemini
    console.log("Uploading to Gemini...");
    const uploadResult = await ai.files.upload({
      file: tempFilePath,
      config: {
        mimeType: 'audio/mp3',
      }
    });

    console.log("Uploaded file URI:", uploadResult.uri);

    // 4. Generate Content with structured JSON prompt
    const prompt = `
Escucha esta grabación de una llamada telefónica de nuestra agencia de bienes raíces.
Tu tarea es analizar detalladamente la llamada y extraer la siguiente información en formato JSON estricto.

Estructura del JSON requerida:
{
  "transcription": "La transcripción completa de la llamada identificando a los hablantes (Agente: ..., Cliente: ...)",
  "summary": "Un resumen ejecutivo corto de 1 párrafo de la llamada.",
  "mainTopic": "El motivo principal de la llamada en una oración.",
  "keyPoints": ["punto 1", "punto 2"],
  "commitments": ["acción 1", "acción 2"],
  "sentiment": "Positivo|Neutro|Negativo"
}

Asegúrate de devolver ÚNICAMENTE el objeto JSON sin markdown adicional.
`;

    console.log("Analyzing with Gemini...");
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          fileData: {
            mimeType: 'audio/mp3',
            fileUri: uploadResult.uri
          }
        },
        { text: prompt }
      ],
      config: {
        responseMimeType: 'application/json',
      }
    });

    const responseText = response.text || "{}";
    console.log("Gemini Response:", responseText);

    // Parse the JSON
    let analysis;
    try {
      analysis = JSON.parse(responseText);
    } catch (e) {
      console.error("Failed to parse JSON", e);
      throw new Error("Invalid JSON response from Gemini");
    }

    // 5. Cleanup the temporary file and Gemini remote file
    fs.unlinkSync(tempFilePath);
    try {
      if (uploadResult?.name) {
        await ai.files.delete({ name: uploadResult.name });
      }
    } catch (e) {
      console.error("Failed to delete remote file", e);
    }

    // 6. Save to Database
    let lead;
    
    if (manualLeadId) {
      lead = await prisma.lead.findUnique({ where: { id: manualLeadId }});
    }

    if (!lead) {
      lead = await prisma.lead.findFirst({
        where: { phone: fromNumber || "Desconocido" }
      });
    }

    if (!lead) {
      lead = await prisma.lead.create({
        data: {
          name: "Nuevo Prospecto (Llamada)",
          phone: fromNumber || "Desconocido",
          status: "NUEVO",
          notes: "Creado automáticamente desde una llamada entrante."
        }
      });
    }

    const savedCall = await prisma.call.create({
      data: {
        leadId: lead.id,
        duration: 0, // We could parse duration from twilio
        audioUrl: recordingUrl || "",
        transcription: analysis.transcription,
        summary: analysis.summary,
        mainTopic: analysis.mainTopic,
        keyPoints: JSON.stringify(analysis.keyPoints || []),
        commitments: JSON.stringify(analysis.commitments || []),
        sentiment: analysis.sentiment
      }
    });

    console.log("Call saved successfully:", savedCall.id);

    return NextResponse.json({ success: true, callId: savedCall.id });

  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
