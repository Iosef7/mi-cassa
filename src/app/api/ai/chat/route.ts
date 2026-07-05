import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateAiContent } from '@/lib/ai-service';
import { google } from 'googleapis';

export async function POST(req: Request) {
  try {
    const { text, audioBase64, mimeType, history, currentUserId } = await req.json();

    if (!currentUserId) {
      return NextResponse.json({ error: 'Usuario no autenticado' }, { status: 401 });
    }

    // Fetch limited users, properties, and leads to prevent OOM / Token limits
    const users = await prisma.user.findMany({ 
      take: 50, 
      select: { id: true, name: true, role: true } 
    });
    const usersContext = users.map(u => `- ID: ${u.id}, Nombre: ${u.name}, Rol: ${u.role}`).join('\n');

    const properties = await prisma.property.findMany({ 
      take: 50, 
      orderBy: { createdAt: 'desc' }, 
      select: { id: true, title: true, location: true, status: true } 
    });
    const propertiesContext = properties.map(p => `- ID: ${p.id}, Título: ${p.title}, Ubicación: ${p.location}, Estado: ${p.status}`).join('\n');

    const leads = await prisma.lead.findMany({ 
      take: 50, 
      orderBy: { createdAt: 'desc' }, 
      select: { id: true, name: true, phone: true } 
    });
    const leadsContext = leads.map(l => `- ID: ${l.id}, Nombre: ${l.name}, Teléfono: ${l.phone}`).join('\n');

    const systemInstruction = `
      Eres el asistente de delegación de tareas de la plataforma Mi Cassa.
      Tu objetivo es conversar con el usuario para entender qué tareas quiere asignar, a quién y cuándo.
      
      Usuarios disponibles en el sistema:
      ${usersContext}

      Propiedades en el sistema:
      ${propertiesContext}

      Leads (Clientes) en el sistema:
      ${leadsContext}
      
      Reglas:
      1. Si el usuario te pide asignar una tarea pero falta información clave, pregúntale amablemente.
      2. Antes de crear la tarea definitivamente, ofrécele al usuario añadir detalles adicionales mediante categorías (ej. ["Prioridad y Etiquetas", "Recordatorios", "Logística y Ubicación", "Archivos Adjuntos", "Notas Internas"]).
      3. Si el usuario selecciona categorías, hazle las preguntas necesarias para rellenar los datos.
      4. Una vez que tengas la información completa, genera la(s) tarea(s) en el arreglo 'createTasks'. Puedes incluir la información extra concatenada en el campo 'description'.
      5. Si el usuario menciona una propiedad o un cliente, asócialos a la tarea usando los campos "propertyId" y "leadId" basándote en las listas proporcionadas. SI LA PROPIEDAD ESTÁ VENDIDA, informa en tu respuesta ("reply") pero crea la tarea igual.
      6. SIEMPRE debes responder en formato JSON estrictamente válido con esta estructura:
      {
        "reply": "Tu respuesta conversacional hacia el usuario",
        "suggestedCategories": ["Categoría 1", "Categoría 2", ...],
        "createTasks": [
          {
            "title": "Título corto y claro de la tarea",
            "description": "Descripción detallada",
            "assignedToId": "El ID exacto del usuario asignado",
            "dueDate": "Fecha de vencimiento en formato ISO 8601 (opcional)",
            "propertyId": "El ID exacto de la propiedad si se mencionó (opcional)",
            "leadId": "El ID exacto del lead si se mencionó (opcional)"
          }
        ]
      }
      
      Nota: Hoy es ${new Date().toISOString()}. Usa esta fecha como referencia.
    `;

    // Construct Gemini contents array
    const contents: any[] = [];
    
    // Add history
    if (history && history.length > 0) {
      for (const msg of history) {
        if (msg.role === 'model' && msg.text.startsWith('✅')) continue; // Skip success messages
        contents.push({
          role: msg.role,
          parts: [{ text: msg.text }]
        });
      }
    }

    // Add current user message
    const currentParts: any[] = [];
    if (text) {
      currentParts.push({ text });
    }
    if (audioBase64) {
      if (!text) {
        currentParts.push({ text: 'Por favor analiza este mensaje de voz y responde:' });
      }
      currentParts.push({
        inlineData: {
          data: audioBase64,
          mimeType: mimeType || 'audio/webm'
        }
      });
    }
    
    if (currentParts.length > 0) {
      contents.push({ role: 'user', parts: currentParts });
    }

    const response = await generateAiContent({
      operationType: 'DelegationChat',
      contents: contents,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("No response from AI");
    }

    const parsed = JSON.parse(resultText);
    const createdTasks = [];

    // Execute task creation if AI decided to create tasks
    if (parsed.createTasks && Array.isArray(parsed.createTasks) && parsed.createTasks.length > 0) {
      for (const taskData of parsed.createTasks) {
        if (!taskData.assignedToId || !taskData.title) continue;

        const task = await prisma.task.create({
          data: {
            title: taskData.title,
            description: taskData.description,
            assignedTo: taskData.assignedToId,
            dueDate: taskData.dueDate ? new Date(taskData.dueDate) : null,
            propertyId: taskData.propertyId || null,
            leadId: taskData.leadId || null,
          }
        });
        createdTasks.push(task);

        // Create notification
        await prisma.notification.create({
          data: {
            title: 'Nueva tarea asignada',
            message: `Te han asignado la tarea: "${taskData.title}" mediante IA`,
            userId: taskData.assignedToId,
            link: '/admin/tareas'
          }
        });
        
        // Insert into Google Calendar if dueDate exists
        if (taskData.dueDate) {
          try {
            // Find the user's google account
            const account = await prisma.account.findFirst({
              where: {
                userId: taskData.assignedToId,
                provider: 'google'
              }
            });

            if (account && account.access_token) {
              const oauth2Client = new google.auth.OAuth2(
                process.env.GOOGLE_CLIENT_ID,
                process.env.GOOGLE_CLIENT_SECRET
              );
              
              oauth2Client.setCredentials({
                access_token: account.access_token,
                refresh_token: account.refresh_token,
                expiry_date: account.expires_at ? account.expires_at * 1000 : null
              });

              const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
              
              const startDate = new Date(taskData.dueDate);
              const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hour duration by default

              let locationString = '';
              if (taskData.propertyId) {
                const prop = properties.find(p => p.id === taskData.propertyId);
                if (prop) {
                  locationString = prop.location;
                }
              }

              await calendar.events.insert({
                calendarId: 'primary',
                requestBody: {
                  summary: `Tarea: ${taskData.title}`,
                  location: locationString || undefined,
                  description: taskData.description || 'Tarea asignada desde Mi Cassa',
                  start: {
                    dateTime: startDate.toISOString(),
                    timeZone: 'America/Mexico_City',
                  },
                  end: {
                    dateTime: endDate.toISOString(),
                    timeZone: 'America/Mexico_City',
                  },
                }
              });
              console.log("Evento de Google Calendar creado con éxito.");
            }
          } catch (calError) {
            console.error("Error al crear evento en Google Calendar:", calError);
            // Non-blocking error, we still created the task successfully
          }
        }
      }
    }

    return NextResponse.json({ 
      reply: parsed.reply,
      suggestedCategories: parsed.suggestedCategories,
      tasksCreated: createdTasks
    });

  } catch (error: any) {
    console.error("AI Chat Error:", error);
    return NextResponse.json({ error: 'Error processing AI chat', details: error.message }, { status: 500 });
  }
}
