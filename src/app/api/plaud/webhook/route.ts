import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateAiContent } from '@/lib/ai-service';

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const { title, transcription, summary, audioUrl } = payload;

    if (!transcription) {
      return NextResponse.json({ error: 'Falta transcripción' }, { status: 400 });
    }

    // --- 1. Usar IA (Gemini) para extraer datos de la llamada ---
    const promptText = `
      Eres un asistente experto en bienes raíces. Analiza la siguiente transcripción de una llamada telefónica con un cliente.
      
      Transcripción:
      "${transcription}"

      Extrae la siguiente información en formato JSON estrictamente válido:
      {
        "leadNameOrPhone": "Nombre o número de teléfono del cliente si se menciona. Si no hay indicios, devuelve nulo",
        "sentiment": "POSITIVO, NEUTRO o NEGATIVO (qué tan buena fue la interacción)",
        "keyPoints": ["punto 1", "punto 2"],
        "commitments": ["tarea 1 acordada", "tarea 2 acordada"],
        "extractedFields": {
          "type": "CLIENTE o PROPIETARIO",
          "budget": "numero (float) o nulo",
          "urgency": "Alta, Media, Baja o nulo",
          "propertyTypeOfInterest": "string o nulo",
          "targetLocations": "string o nulo",
          "reasonForSelling": "string o nulo",
          "hasPropertyToSell": "booleano o nulo",
          "requiresMortgage": "booleano o nulo",
          "isLegalClear": "booleano o nulo"
        }
      }
      
      Solo devuelve el JSON puro, sin marcadores de markdown.
    `;

    let aiResponseText = '';

    try {
      const response = await generateAiContent({
        operationType: 'CallSummaryAndExtraction',
        contents: promptText,
        config: {
          temperature: 0.2, // Baja temperatura para mayor precisión y JSON determinista
        }
      });
      
      // Limpiar texto para asegurar que es JSON
      aiResponseText = response.text || '{}';
      const cleanJsonStr = aiResponseText.replace(/^```json\n?/, '').replace(/```$/m, '').trim();
      
      const extractedData = JSON.parse(cleanJsonStr);
      
      // --- 2. Asignar al Lead ---
      // Si la IA encontró un nombre, buscamos en la BD
      let targetLead = null;
      if (extractedData.leadNameOrPhone && extractedData.leadNameOrPhone !== 'nulo') {
        targetLead = await prisma.lead.findFirst({
          where: {
            OR: [
              { name: { contains: extractedData.leadNameOrPhone, mode: 'insensitive' } },
              { phone: { contains: extractedData.leadNameOrPhone } }
            ]
          }
        });
      }

      const extracted = extractedData.extractedFields || {};
      const leadDataToUpdate: any = {};
      if (extracted.type && ["CLIENTE", "PROPIETARIO"].includes(extracted.type)) leadDataToUpdate.type = extracted.type;
      if (typeof extracted.budget === 'number') leadDataToUpdate.budget = extracted.budget;
      if (extracted.urgency && ["Alta", "Media", "Baja"].includes(extracted.urgency)) leadDataToUpdate.urgency = extracted.urgency;
      if (extracted.propertyTypeOfInterest && typeof extracted.propertyTypeOfInterest === 'string') leadDataToUpdate.propertyTypeOfInterest = extracted.propertyTypeOfInterest;
      if (extracted.targetLocations && typeof extracted.targetLocations === 'string') leadDataToUpdate.targetLocations = extracted.targetLocations;
      if (extracted.reasonForSelling && typeof extracted.reasonForSelling === 'string') leadDataToUpdate.reasonForSelling = extracted.reasonForSelling;
      if (typeof extracted.hasPropertyToSell === 'boolean') leadDataToUpdate.hasPropertyToSell = extracted.hasPropertyToSell;
      if (typeof extracted.requiresMortgage === 'boolean') leadDataToUpdate.requiresMortgage = extracted.requiresMortgage;
      if (typeof extracted.isLegalClear === 'boolean') leadDataToUpdate.isLegalClear = extracted.isLegalClear;

      // Si no encontró Lead específico, asignamos a un Lead Genérico de "Llamadas por Asignar"
      if (!targetLead) {
        targetLead = await prisma.lead.findFirst({
          where: { name: 'Llamadas por Asignar' }
        });
        
        // Si no existe el genérico, lo creamos
        if (!targetLead) {
          targetLead = await prisma.lead.create({
            data: {
              name: 'Llamadas por Asignar',
              phone: '0000000000',
              status: 'NUEVO',
              notes: 'Leads no identificados provenientes de llamadas automáticas.',
              ...leadDataToUpdate
            }
          });
        } else if (Object.keys(leadDataToUpdate).length > 0) {
          targetLead = await prisma.lead.update({
            where: { id: targetLead.id },
            data: leadDataToUpdate
          });
        }
      } else if (Object.keys(leadDataToUpdate).length > 0) {
        // Actualizar el lead existente encontrado
        targetLead = await prisma.lead.update({
          where: { id: targetLead.id },
          data: leadDataToUpdate
        });
      }

      // --- 3. Guardar la Llamada ---
      const newCall = await prisma.call.create({
        data: {
          leadId: targetLead.id,
          duration: 0, // Para webhooks de Plaud que no incluyen duración
          audioUrl: audioUrl || null,
          transcription: transcription,
          summary: summary || 'Resumen generado de llamada',
          mainTopic: title || 'Llamada grabada',
          keyPoints: JSON.stringify(extractedData.keyPoints || []),
          commitments: JSON.stringify(extractedData.commitments || []),
          sentiment: extractedData.sentiment || 'NEUTRO'
        }
      });

      // --- 4. Crear Tareas Automáticas (Commitments) ---
      if (extractedData.commitments && Array.isArray(extractedData.commitments)) {
        for (const taskText of extractedData.commitments) {
          await prisma.task.create({
            data: {
              title: taskText.substring(0, 50),
              description: taskText,
              leadId: targetLead.id,
              status: 'PENDIENTE',
              // Asignar al día siguiente
              dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000)
            }
          });
        }
      }

      return NextResponse.json({ success: true, callId: newCall.id, leadId: targetLead.id });

    } catch (aiError) {
      console.error('Error de IA:', aiError);
      
      // Registrar error se encarga ai-service
      
      return NextResponse.json({ error: 'Error procesando la IA' }, { status: 500 });
    }

  } catch (error) {
    console.error('Error Webhook:', error);
    return NextResponse.json({ error: 'Error procesando el Webhook' }, { status: 500 });
  }
}
