import { prisma } from '@/lib/prisma';
import { generateAiContent } from '@/lib/ai-service';

export interface ProcessPlaudAudioInput {
  audioBuffer?: Buffer;
  mimeType?: string;
  transcriptionText?: string;
  title?: string;
  audioUrl?: string;
  source?: 'UPLOAD' | 'WEBHOOK' | 'DRIVE' | 'USB';
}

export async function processPlaudRecording(input: ProcessPlaudAudioInput) {
  const { audioBuffer, mimeType, transcriptionText, title, audioUrl, source = 'WEBHOOK' } = input;

  if (!audioBuffer && !transcriptionText) {
    throw new Error('Se requiere un archivo de audio o una transcripción en texto.');
  }

  // Build content array for Gemini Multimodal
  const promptInstruction = `
    Eres un asistente de IA avanzado especializado en Bienes Raíces y gestión de clientes inmobiliarios (CRM).
    Analiza a fondo la siguiente grabación o transcripción de voz proveniente de un dispositivo Plaud Pro.

    Tu tarea es:
    1. Transcribir el audio detalladamente identificando hablantes si hay audio ("Agente Inmobiliario:" y "Cliente:").
    2. Resumir los puntos clave de la conversación.
    3. Identificar el sentimiento de la interacción (POSITIVO, NEUTRO o NEGATIVO).
    4. Extraer compromisos y tareas concretas acordadas (ej: "Enviar catálogo de departamentos", "Agendar visita para el viernes").
    5. Extraer la información del cliente para actualizar el CRM en formato JSON estricto:

    Formato JSON requerido (Responde ÚNICAMENTE con el objeto JSON puro):
    {
      "title": "Título descriptivo de la llamada o reunión",
      "transcription": "Texto completo de la transcripción con nombres de hablantes si se identifican",
      "summary": "Resumen ejecutivo claro y conciso para el agente inmobiliario",
      "leadNameOrPhone": "Nombre completo o número telefónico del cliente o prospecto mencionado, o null si no se identifica",
      "sentiment": "POSITIVO",
      "keyPoints": ["Punto clave 1", "Punto clave 2"],
      "commitments": ["Tarea 1 acordada", "Tarea 2 acordada"],
      "extractedFields": {
        "type": "CLIENTE",
        "budget": 1500000,
        "urgency": "Alta",
        "propertyTypeOfInterest": "Casa o Departamento o Terreno",
        "targetLocations": "Ubicación o zonas de interés",
        "reasonForSelling": "Razón de venta si aplica",
        "hasPropertyToSell": true,
        "requiresMortgage": true,
        "isLegalClear": true
      }
    }
  `;

  let geminiContents: any[] = [];

  if (audioBuffer) {
    const base64Audio = audioBuffer.toString('base64');
    const validMime = mimeType || 'audio/mp3';
    geminiContents = [
      {
        inlineData: {
          mimeType: validMime,
          data: base64Audio,
        },
      },
      { text: promptInstruction },
    ];
  } else {
    geminiContents = [
      { text: `Transcripción recibida:\n"${transcriptionText}"\n\n${promptInstruction}` },
    ];
  }

  // Execute Gemini AI
  const response = await generateAiContent({
    operationType: 'PlaudAudioExtraction',
    contents: geminiContents,
    config: {
      temperature: 0.2,
    },
  });

  const aiText = response.text || '{}';
  const cleanJson = aiText.replace(/^```json\n?/, '').replace(/```$/m, '').trim();
  let extracted: any = {};

  try {
    extracted = JSON.parse(cleanJson);
  } catch (err) {
    console.error('Error parseando JSON de Gemini:', err, 'Texto de respuesta:', aiText);
    extracted = {
      title: title || 'Grabación Plaud Pro',
      transcription: transcriptionText || 'Transcripción no disponible',
      summary: 'Procesamiento de audio completado',
      sentiment: 'NEUTRO',
      keyPoints: [],
      commitments: [],
      extractedFields: {},
    };
  }

  const finalTitle = extracted.title || title || 'Grabación Plaud Pro';
  const finalTranscription = extracted.transcription || transcriptionText || 'Audio procesado con Gemini AI';
  const finalSummary = extracted.summary || 'Resumen de la reunión procesada con Plaud Pro';
  const commitments: string[] = Array.isArray(extracted.commitments) ? extracted.commitments : [];
  const keyPoints: string[] = Array.isArray(extracted.keyPoints) ? extracted.keyPoints : [];
  const fields = extracted.extractedFields || {};

  // Find or Create Lead in CRM
  let targetLead = null;
  if (extracted.leadNameOrPhone && extracted.leadNameOrPhone !== 'null') {
    targetLead = await prisma.lead.findFirst({
      where: {
        OR: [
          { name: { contains: String(extracted.leadNameOrPhone), mode: 'insensitive' } },
          { phone: { contains: String(extracted.leadNameOrPhone) } },
        ],
      },
    });
  }

  const leadUpdateData: any = {};
  if (fields.type && ['CLIENTE', 'PROPIETARIO'].includes(fields.type)) leadUpdateData.type = fields.type;
  if (typeof fields.budget === 'number' && !isNaN(fields.budget)) leadUpdateData.budget = fields.budget;
  if (fields.urgency && ['Alta', 'Media', 'Baja'].includes(fields.urgency)) leadUpdateData.urgency = fields.urgency;
  if (fields.propertyTypeOfInterest && typeof fields.propertyTypeOfInterest === 'string') {
    leadUpdateData.propertyTypeOfInterest = fields.propertyTypeOfInterest;
  }
  if (fields.targetLocations && typeof fields.targetLocations === 'string') {
    leadUpdateData.targetLocations = fields.targetLocations;
  }
  if (fields.reasonForSelling && typeof fields.reasonForSelling === 'string') {
    leadUpdateData.reasonForSelling = fields.reasonForSelling;
  }
  if (typeof fields.hasPropertyToSell === 'boolean') leadUpdateData.hasPropertyToSell = fields.hasPropertyToSell;
  if (typeof fields.requiresMortgage === 'boolean') leadUpdateData.requiresMortgage = fields.requiresMortgage;
  if (typeof fields.isLegalClear === 'boolean') leadUpdateData.isLegalClear = fields.isLegalClear;

  if (!targetLead) {
    targetLead = await prisma.lead.findFirst({
      where: { name: 'Llamadas por Asignar' },
    });

    if (!targetLead) {
      targetLead = await prisma.lead.create({
        data: {
          name: extracted.leadNameOrPhone || 'Llamadas por Asignar (Plaud Pro)',
          phone: '0000000000',
          status: 'NUEVO',
          notes: `Creado automáticamente desde grabación Plaud Pro (${source})`,
          ...leadUpdateData,
        },
      });
    } else if (Object.keys(leadUpdateData).length > 0) {
      targetLead = await prisma.lead.update({
        where: { id: targetLead.id },
        data: leadUpdateData,
      });
    }
  } else if (Object.keys(leadUpdateData).length > 0) {
    targetLead = await prisma.lead.update({
      where: { id: targetLead.id },
      data: leadUpdateData,
    });
  }

  // Create Call Record
  const newCall = await prisma.call.create({
    data: {
      leadId: targetLead.id,
      duration: 0,
      audioUrl: audioUrl || null,
      transcription: finalTranscription,
      summary: finalSummary,
      mainTopic: finalTitle,
      keyPoints: JSON.stringify(keyPoints),
      commitments: JSON.stringify(commitments),
      sentiment: extracted.sentiment || 'NEUTRO',
    },
  });

  // Also Create Meeting Record so it shows up in /admin/reuniones
  let firstAgent = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
  if (!firstAgent) {
    firstAgent = await prisma.user.findFirst();
  }

  let createdMeeting = null;
  if (firstAgent) {
    createdMeeting = await prisma.meeting.create({
      data: {
        title: `[Plaud Pro] ${finalTitle}`,
        description: finalSummary,
        scheduledAt: new Date(),
        durationMinutes: 30,
        status: 'FINALIZADA',
        category: 'SEGUIMIENTO',
        audioUrl: audioUrl || null,
        transcription: finalTranscription,
        summary: finalSummary,
        keyPoints: JSON.stringify(keyPoints),
        sentimentTimeline: extracted.sentiment || 'NEUTRO',
        crmSuggestions: JSON.stringify(fields),
        createdById: firstAgent.id,
        leadId: targetLead.id,
      },
    });
  }

  // Create Follow-up Tasks automatically for commitments
  const createdTasks = [];
  if (commitments.length > 0) {
    for (const itemText of commitments) {
      const newTask = await prisma.task.create({
        data: {
          title: itemText.substring(0, 80),
          description: `Compromiso extraído automáticamente desde Plaud Pro (${source}):\n"${itemText}"`,
          leadId: targetLead.id,
          status: 'PENDIENTE',
          dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
      });
      createdTasks.push(newTask);
    }
  }

  // Save audit log to SystemSettings
  try {
    const existingLogsSetting = await prisma.systemSettings.findUnique({
      where: { key: 'plaud_processing_logs' },
    });
    const logs = existingLogsSetting ? JSON.parse(existingLogsSetting.value) : [];

    const newLog = {
      id: `plaud_${Date.now()}`,
      title: finalTitle,
      source,
      processedAt: new Date().toISOString(),
      leadName: targetLead.name,
      leadId: targetLead.id,
      callId: newCall.id,
      meetingId: createdMeeting?.id || null,
      summaryPreview: finalSummary.substring(0, 150),
      commitmentsCount: commitments.length,
      audioUrl: audioUrl || null,
      status: 'SUCCESS',
    };

    logs.unshift(newLog);
    const trimmedLogs = logs.slice(0, 50);

    await prisma.systemSettings.upsert({
      where: { key: 'plaud_processing_logs' },
      create: { key: 'plaud_processing_logs', value: JSON.stringify(trimmedLogs) },
      update: { value: JSON.stringify(trimmedLogs) },
    });
  } catch (logErr) {
    console.error('Error guardando log de Plaud:', logErr);
  }

  return {
    success: true,
    title: finalTitle,
    callId: newCall.id,
    meetingId: createdMeeting?.id || null,
    leadId: targetLead.id,
    leadName: targetLead.name,
    summary: finalSummary,
    transcription: finalTranscription,
    keyPoints,
    commitments,
    createdTasksCount: createdTasks.length,
  };
}
