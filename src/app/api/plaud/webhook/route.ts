import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { GoogleGenAI } from '@google/genai';

// Instanciar Gemini
// El SDK usa la variable GEMINI_API_KEY del entorno automáticamente si está disponible.
const ai = new GoogleGenAI({});

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
        "commitments": ["tarea 1 acordada", "tarea 2 acordada"]
      }
      
      Solo devuelve el JSON puro, sin marcadores de markdown.
    `;

    // Medir uso de tokens
    let aiUsageRecord = null;
    let aiResponseText = '';

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: promptText,
        config: {
          temperature: 0.2, // Baja temperatura para mayor precisión y JSON determinista
        }
      });
      
      // Limpiar texto para asegurar que es JSON
      aiResponseText = response.text || '{}';
      const cleanJsonStr = aiResponseText.replace(/^```json\n?/, '').replace(/```$/m, '').trim();
      
      // Registrar el uso en la BD
      // Nota: El SDK nuevo de @google/genai puede que no exponga los usage metadata directamente en la forma fácil, 
      // así que estimaremos el token count basándonos en caracteres o si lo trae el response.
      const promptTokens = response.usageMetadata?.promptTokenCount || Math.floor(promptText.length / 4);
      const completionTokens = response.usageMetadata?.candidatesTokenCount || Math.floor(aiResponseText.length / 4);
      
      // Costo estimado Gemini 2.5 Flash: $0.075 / 1M prompt tokens, $0.30 / 1M completion tokens
      const costUSD = (promptTokens / 1000000) * 0.075 + (completionTokens / 1000000) * 0.3;

      aiUsageRecord = await prisma.aiUsage.create({
        data: {
          provider: 'Google',
          model: 'gemini-2.5-flash',
          operationType: 'CallSummaryAndExtraction',
          promptTokens,
          completionTokens,
          costUSD,
          status: 'SUCCESS'
        }
      });
      
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
              notes: 'Leads no identificados provenientes de llamadas automáticas.'
            }
          });
        }
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
      
      // Registrar error
      await prisma.aiUsage.create({
        data: {
          provider: 'Google',
          model: 'gemini-2.5-flash',
          operationType: 'CallSummaryAndExtraction',
          status: 'ERROR',
          errorMessage: String(aiError)
        }
      });
      
      return NextResponse.json({ error: 'Error procesando la IA' }, { status: 500 });
    }

  } catch (error) {
    console.error('Error Webhook:', error);
    return NextResponse.json({ error: 'Error procesando el Webhook' }, { status: 500 });
  }
}
