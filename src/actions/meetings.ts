'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { generateAiContent } from '@/lib/ai-service';
import { createGoogleMeetEvent } from '@/actions/google-meet';
import { sendMeetingInvitationEmail } from '@/lib/email-service';
import { sendWhatsAppMessage } from '@/lib/whatsapp';

const DEFAULT_HEBREW_GLOSSARY = `
- Tabu: Registro de la Propiedad en Israel (Registro Inmobiliario)
- Mas Shevach: Impuesto sobre la plusvalía inmobiliaria / Ganancia de capital
- Shtar Macar: Escritura pública de compraventa
- Irushah: Herencia / Sucesión inmobiliaria
- Vaad Bayit: Cuota / Junta de administración del edificio
- Arnona: Impuesto municipal sobre bienes raíces
- Kene: Comprador / Adquirente
- Machar: Vendedor
- Heskem Macar: Contrato de compraventa
- Tik Binyan: Expediente municipal de construcción / Permiso de edificación
`;

export interface CreateMeetingInput {
  title: string;
  description?: string;
  scheduledAt: string | Date;
  durationMinutes: number;
  timezone?: string;
  category?: string;
  isPrivate?: boolean;
  leadId?: string;
  participantUserIds: string[];
  customGlossary?: string;
}

export async function createMeetingAction(input: CreateMeetingInput, createdById: string) {
  try {
    const {
      title,
      description,
      scheduledAt,
      durationMinutes,
      timezone = 'America/Santiago',
      category = 'VENTA',
      isPrivate = false,
      leadId,
      participantUserIds,
      customGlossary = DEFAULT_HEBREW_GLOSSARY
    } = input;

    // 1. Obtener correos de los usuarios participantes
    const users = await prisma.user.findMany({
      where: { id: { in: participantUserIds } },
      select: { id: true, email: true, name: true, phone: true }
    });

    let lead: any = null;
    if (leadId) {
      lead = await prisma.lead.findUnique({
        where: { id: leadId },
        select: { id: true, name: true, email: true, phone: true }
      });
    }

    const attendeesEmails: string[] = [];
    users.forEach(u => { if (u.email) attendeesEmails.push(u.email); });
    if (lead?.email) attendeesEmails.push(lead.email);

    // 2. Generar evento de Google Meet
    const meetResult = await createGoogleMeetEvent({
      title,
      description,
      scheduledAt,
      durationMinutes,
      timezone,
      attendeesEmails
    });

    // 3. Crear registro en Prisma
    const meeting = await prisma.meeting.create({
      data: {
        title,
        description,
        scheduledAt: new Date(scheduledAt),
        durationMinutes,
        timezone,
        category,
        isPrivate,
        meetUrl: meetResult.meetUrl,
        googleEventId: meetResult.googleEventId,
        customGlossary,
        createdById,
        leadId: leadId || null,
        participants: {
          create: participantUserIds.map(userId => ({ userId }))
        }
      },
      include: {
        participants: { include: { user: true } },
        lead: true,
        createdBy: true
      }
    });

    // 4. Si hay Lead asociado, crear Appointment en Prisma
    if (leadId) {
      await prisma.appointment.create({
        data: {
          title: `Reunión: ${title}`,
          date: new Date(scheduledAt),
          leadId,
          agentId: createdById,
          notes: `Meet URL: ${meetResult.meetUrl}`
        }
      });
    }

    // 5. Enviar notificaciones por Email y WhatsApp al prospecto y staff
    for (const u of users) {
      if (u.email) {
        await sendMeetingInvitationEmail({
          toEmail: u.email,
          recipientName: u.name || 'Miembro del Equipo',
          meetingTitle: title,
          meetingDescription: description,
          scheduledAt,
          durationMinutes,
          meetUrl: meetResult.meetUrl
        });
      }

      await prisma.notification.create({
        data: {
          title: `Invitaron a reunión: ${title}`,
          message: `Programada para el ${new Date(scheduledAt).toLocaleString()}`,
          link: `/admin/reuniones/${meeting.id}`,
          userId: u.id
        }
      });
    }

    if (lead && lead.email) {
      await sendMeetingInvitationEmail({
        toEmail: lead.email,
        recipientName: lead.name,
        meetingTitle: title,
        meetingDescription: description,
        scheduledAt,
        durationMinutes,
        meetUrl: meetResult.meetUrl
      });
    }

    if (lead && lead.phone) {
      const dateStr = new Date(scheduledAt).toLocaleString('es-ES', { dateStyle: 'medium', timeStyle: 'short' });
      const wsMessage = `Hola ${lead.name}, tu reunión con el equipo de Mi Cassa "${title}" ha sido agendada para el ${dateStr}. Puedes unirte a la llamada con este enlace de Google Meet: ${meetResult.meetUrl}`;
      try {
        await sendWhatsAppMessage(lead.phone, wsMessage);
      } catch (wsErr) {
        console.error('Error enviando invitación por WhatsApp:', wsErr);
      }
    }

    revalidatePath('/admin/reuniones');
    return { success: true, meeting: JSON.parse(JSON.stringify(meeting)) };
  } catch (error: any) {
    console.error('Error al crear reunión:', error);
    return { success: false, error: error?.message || 'Error al agendar la reunión' };
  }
}

export async function getMeetingsAction() {
  try {
    const meetings = await prisma.meeting.findMany({
      orderBy: { scheduledAt: 'desc' },
      include: {
        createdBy: { select: { id: true, name: true, image: true, email: true } },
        lead: { select: { id: true, name: true, phone: true, email: true } },
        participants: {
          include: {
            user: { select: { id: true, name: true, image: true, email: true, role: true } }
          }
        },
        tasks: {
          select: { id: true, title: true, status: true, assignedTo: true }
        }
      }
    });

    return { success: true, meetings: JSON.parse(JSON.stringify(meetings)) };
  } catch (error: any) {
    console.error('Error obteniendo reuniones:', error);
    return { success: false, meetings: [] };
  }
}

export async function getMeetingByIdAction(id: string) {
  try {
    const meeting = await prisma.meeting.findUnique({
      where: { id },
      include: {
        createdBy: { select: { id: true, name: true, image: true, email: true } },
        lead: { select: { id: true, name: true, phone: true, email: true, budget: true, preferences: true, urgency: true } },
        participants: {
          include: {
            user: { select: { id: true, name: true, image: true, email: true, role: true } }
          }
        },
        tasks: {
          include: {
            agent: { select: { id: true, name: true, image: true } },
            property: { select: { id: true, title: true, location: true, price: true } },
            lead: { select: { id: true, name: true, phone: true } }
          }
        }
      }
    });

    if (!meeting) return { success: false, error: 'Reunión no encontrada' };

    return { success: true, meeting: JSON.parse(JSON.stringify(meeting)) };
  } catch (error: any) {
    console.error('Error obteniendo reunión por ID:', error);
    return { success: false, error: error?.message };
  }
}

export async function processMeetingWithAiAction({
  meetingId,
  transcriptionText,
  customGlossary
}: {
  meetingId: string;
  transcriptionText: string;
  customGlossary?: string;
}) {
  try {
    const meeting = await prisma.meeting.findUnique({
      where: { id: meetingId },
      include: {
        participants: { include: { user: true } },
        lead: true,
        createdBy: true
      }
    });

    if (!meeting) throw new Error('Reunión no encontrada');

    // 1. Obtener catálogo de propiedades y prospectos para auto-matching
    const properties = await prisma.property.findMany({
      select: { id: true, title: true, location: true, price: true }
    });

    const leads = await prisma.lead.findMany({
      select: { id: true, name: true, phone: true, email: true }
    });

    const usersList = meeting.participants.map(p => ({
      id: p.user.id,
      name: p.user.name || 'Sin nombre',
      email: p.user.email,
      role: p.user.role
    }));

    const glossary = customGlossary || meeting.customGlossary || DEFAULT_HEBREW_GLOSSARY;

    const systemInstruction = `
Eres la Inteligencia Artificial especialista de "Mi Cassa Real Estate". Tu tarea es procesar el texto de la transcripción de una reunión de negocios/equipo inmobiliario.

GLOSARIO DE TÉRMINOS EN HEBREO Y TÉCNICOS (RESPETA ESTAS DEFINICIONES SIN CAMBIARLAS POR FONÉTICA EN ESPAÑOL):
${glossary}

LISTA DE PARTICIPANTES DEL EQUIPO EN LA REUNIÓN:
${JSON.stringify(usersList)}

LISTA DE PROPIEDADES DISPONIBLES EN EL SISTEMA (Para auto-matching):
${JSON.stringify(properties.map(p => ({ id: p.id, title: p.title, location: p.location })))}

LISTA DE PROSPECTOS/CLIENTES REGISTRADOS EN EL CRM:
${JSON.stringify(leads.map(l => ({ id: l.id, name: l.name, phone: l.phone })))}

INSTRUCCIONES:
1. Realiza la Diarización de Hablantes y resume la reunión en una Minuta Ejecutiva en formato Markdown claro.
2. Identifica todos los puntos clave y compromisos hablados.
3. Extrae TAREAS concretas asignándoselas estrictamente a los IDs de los usuarios del equipo según quién se comprometió o a quién se le asignó la tarea.
4. Para cada tarea, indica si se menciona una propiedad específica de la lista (usando su propertyId exacto) o un prospecto (usando su leadId exacto).
5. Extrae SUGERENCIAS DE ACTUALIZACIÓN DE CRM para el prospecto si mencionó presupuesto nuevo, preferencia o urgencia.
6. Genera la línea de tiempo de sentimiento (Sentiment Timeline).

RESPONDE EXCLUSIVAMENTE EN FORMATO JSON CON ESTA ESTRUCTURA EXACTA:
{
  "summary": "Resumen ejecutivo en markdown...",
  "keyPoints": "Puntos clave en formato de viñetas...",
  "sentimentTimeline": [
    { "timestamp": "00:05", "sentiment": "POSITIVO", "note": "Interés en la propiedad X" }
  ],
  "crmSuggestions": {
    "hasSuggestions": true,
    "suggestedBudget": 700000,
    "suggestedPreferences": "3 dormitorios en zona norte",
    "suggestedUrgency": "ALTA",
    "reason": "El cliente mencionó que vendió su casa previa."
  },
  "extractedTasks": [
    {
      "title": "Enviar propuesta formal",
      "description": "Detalle de lo que habló la persona",
      "assignedToUserId": "id_del_usuario_del_equipo",
      "propertyId": "id_de_la_propiedad_o_null",
      "leadId": "id_del_lead_o_null",
      "dueDateDays": 2,
      "meetingExcerpt": "Segmento exacto donde se habló de esto"
    }
  ]
}
`;

    // 2. Llamada a IA mediante generateAiContent (registra consumo en AiUsage para /admin/ia)
    const aiResponse = await generateAiContent({
      operationType: 'MeetingTranscriptionAndDiarization',
      contents: transcriptionText,
      config: {
        systemInstruction,
        responseMimeType: 'application/json'
      }
    });

    const parsedData = JSON.parse(aiResponse.text || '{}');

    // 3. Actualizar la reunión con transcripción, resumen y sugerencias CRM
    await prisma.meeting.update({
      where: { id: meetingId },
      data: {
        transcription: transcriptionText,
        summary: parsedData.summary || 'Resumen procesado.',
        keyPoints: parsedData.keyPoints || 'Puntos clave procesados.',
        sentimentTimeline: JSON.stringify(parsedData.sentimentTimeline || []),
        crmSuggestions: JSON.stringify(parsedData.crmSuggestions || {}),
        status: 'FINALIZADA'
      }
    });

    // 4. Crear las tareas extraídas en la base de datos vinculadas a la reunión
    if (Array.isArray(parsedData.extractedTasks)) {
      for (const t of parsedData.extractedTasks) {
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + (t.dueDateDays || 2));

        const newTask = await prisma.task.create({
          data: {
            title: t.title || 'Tarea de reunión',
            description: t.description || 'Tarea generada automáticamente desde la reunión.',
            dueDate,
            assignedTo: t.assignedToUserId || meeting.createdById,
            meetingId,
            propertyId: t.propertyId || null,
            leadId: t.leadId || meeting.leadId || null,
            meetingExcerpt: t.meetingExcerpt || null,
            status: 'PENDIENTE'
          }
        });

        if (t.assignedToUserId) {
          await prisma.notification.create({
            data: {
              title: `Nueva tarea asignada de reunión: ${newTask.title}`,
              message: `Revisa las instrucciones del Copiloto de IA para esta tarea.`,
              link: `/admin/tareas`,
              userId: t.assignedToUserId
            }
          });
        }
      }
    }

    revalidatePath(`/admin/reuniones/${meetingId}`);
    revalidatePath('/admin/tareas');
    return { success: true, meetingId };

  } catch (error: any) {
    console.error('Error procesando reunión con IA:', error);
    return { success: false, error: error?.message || 'Error al analizar la reunión' };
  }
}

export async function applyCrmSuggestionsAction({
  leadId,
  suggestedBudget,
  suggestedPreferences,
  suggestedUrgency
}: {
  leadId: string;
  suggestedBudget?: number;
  suggestedPreferences?: string;
  suggestedUrgency?: string;
}) {
  try {
    const updateData: any = {};
    if (suggestedBudget !== undefined && suggestedBudget !== null) updateData.budget = suggestedBudget;
    if (suggestedPreferences) updateData.preferences = suggestedPreferences;
    if (suggestedUrgency) updateData.urgency = suggestedUrgency;

    await prisma.lead.update({
      where: { id: leadId },
      data: updateData
    });

    revalidatePath('/admin/prospectos');
    return { success: true };
  } catch (error: any) {
    console.error('Error aplicando sugerencias de CRM:', error);
    return { success: false, error: error?.message };
  }
}

export async function askMeetingCopilotAction({
  taskId,
  questionText
}: {
  taskId: string;
  questionText: string;
}) {
  try {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        meeting: true,
        property: true,
        lead: true,
        agent: true
      }
    });

    if (!task) throw new Error('Tarea no encontrada');

    const contextText = `
TAREA ACTUAL:
Título: ${task.title}
Descripción: ${task.description || 'Sin descripción'}
Extracto de la Reunión sobre esta tarea: ${task.meetingExcerpt || 'No especificado'}

INFORMACIÓN DE LA REUNIÓN ORIGEN:
Título de la reunión: ${task.meeting?.title || 'Reunión'}
Resumen de la reunión: ${task.meeting?.summary || 'Sin resumen'}
Transcripción completa: ${task.meeting?.transcription || 'Sin transcripción'}

PROPIEDAD VINCULADA:
${task.property ? `Título: ${task.property.title}, Ubicación: ${task.property.location}, Precio: ${task.property.price}` : 'Ninguna'}

PROSPECTO / CLIENTE VINCULADO:
${task.lead ? `Nombre: ${task.lead.name}, Teléfono: ${task.lead.phone}, Email: ${task.lead.email}` : 'Ninguno'}

PREGUNTA DEL AGENTE:
"${questionText}"
`;

    const systemInstruction = `
Eres el Copiloto de IA de Mi Cassa. Ayudas al agente inmobiliario a ejecutar una tarea nacida de una reunión de negocios.
Responde de manera ejecutiva, clara y práctica en español. Proporciona argumentos de venta, borradores de correo/WhatsApp o respuestas a dudas basándote en la transcripción de la reunión.
`;

    const aiResponse = await generateAiContent({
      operationType: 'MeetingCopilotChat',
      contents: contextText,
      config: { systemInstruction }
    });

    return { success: true, answer: aiResponse.text || 'Sin respuesta.' };

  } catch (error: any) {
    console.error('Error en Copiloto de IA:', error);
    return { success: false, error: error?.message || 'Error procesando la consulta' };
  }
}

export async function askGlobalMeetingsAiAction(query: string) {
  try {
    const meetings = await prisma.meeting.findMany({
      take: 20,
      orderBy: { scheduledAt: 'desc' },
      select: { id: true, title: true, scheduledAt: true, summary: true, keyPoints: true }
    });

    const systemInstruction = `
Eres el Asistente Global de Reuniones de Mi Cassa. Responde preguntas del usuario sobre acuerdos pasados buscando en el historial de reuniones.
HISTORIAL DE REUNIONES RECIENTES:
${JSON.stringify(meetings)}
`;

    const aiResponse = await generateAiContent({
      operationType: 'MeetingGlobalSearch',
      contents: query,
      config: { systemInstruction }
    });

    return { success: true, answer: aiResponse.text || 'No encontré información relevante.' };
  } catch (error: any) {
    console.error('Error en Búsqueda Global:', error);
    return { success: false, error: error?.message };
  }
}

export interface UpdateMeetingInput {
  id: string;
  title?: string;
  description?: string;
  scheduledAt?: string | Date;
  durationMinutes?: number;
  timezone?: string;
  category?: string;
  status?: string;
  isPrivate?: boolean;
  leadId?: string | null;
  participantUserIds?: string[];
  customGlossary?: string;
}

export async function updateMeetingAction(input: UpdateMeetingInput) {
  try {
    const {
      id,
      title,
      description,
      scheduledAt,
      durationMinutes,
      timezone,
      category,
      status,
      isPrivate,
      leadId,
      participantUserIds,
      customGlossary
    } = input;

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (scheduledAt !== undefined) updateData.scheduledAt = new Date(scheduledAt);
    if (durationMinutes !== undefined) updateData.durationMinutes = durationMinutes;
    if (timezone !== undefined) updateData.timezone = timezone;
    if (category !== undefined) updateData.category = category;
    if (status !== undefined) updateData.status = status;
    if (isPrivate !== undefined) updateData.isPrivate = isPrivate;
    if (leadId !== undefined) updateData.leadId = leadId;
    if (customGlossary !== undefined) updateData.customGlossary = customGlossary;

    if (participantUserIds) {
      await prisma.meetingParticipant.deleteMany({ where: { meetingId: id } });
      updateData.participants = {
        create: participantUserIds.map(userId => ({ userId }))
      };
    }

    const updated = await prisma.meeting.update({
      where: { id },
      data: updateData,
      include: {
        createdBy: { select: { id: true, name: true, image: true, email: true } },
        lead: { select: { id: true, name: true, phone: true, email: true } },
        participants: {
          include: {
            user: { select: { id: true, name: true, image: true, email: true, role: true } }
          }
        }
      }
    });

    revalidatePath('/admin/reuniones');
    revalidatePath(`/admin/reuniones/${id}`);

    return { success: true, meeting: JSON.parse(JSON.stringify(updated)) };
  } catch (error: any) {
    console.error('Error actualizando reunión:', error);
    return { success: false, error: error?.message || 'Error al actualizar la reunión' };
  }
}

export async function deleteMeetingAction(id: string) {
  try {
    await prisma.meetingParticipant.deleteMany({ where: { meetingId: id } });
    await prisma.task.updateMany({ where: { meetingId: id }, data: { meetingId: null } });
    await prisma.meeting.delete({ where: { id } });

    revalidatePath('/admin/reuniones');
    return { success: true };
  } catch (error: any) {
    console.error('Error eliminando reunión:', error);
    return { success: false, error: error?.message || 'Error al eliminar la reunión' };
  }
}

