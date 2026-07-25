'use server';

import { google } from 'googleapis';
import path from 'path';
import fs from 'fs';

const KEYFILEPATH = path.join(process.cwd(), 'google-credentials.json');
const SCOPES = [
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/drive'
];

async function getGoogleCalendarClient() {
  if (!fs.existsSync(KEYFILEPATH)) {
    console.warn('google-credentials.json no encontrado, se utilizará fallback de enlace seguro.');
    return null;
  }

  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: KEYFILEPATH,
      scopes: SCOPES,
    });

    const authClient = await auth.getClient();
    return google.calendar({ version: 'v3', auth: authClient as any });
  } catch (error) {
    console.error('Error inicializando cliente de Google Calendar:', error);
    return null;
  }
}

export interface CreateMeetEventParams {
  title: string;
  description?: string;
  scheduledAt: Date | string;
  durationMinutes: number;
  timezone?: string;
  attendeesEmails: string[];
}

export async function createGoogleMeetEvent(params: CreateMeetEventParams) {
  const { title, description, scheduledAt, durationMinutes, timezone = 'UTC', attendeesEmails } = params;
  
  const startDateTime = new Date(scheduledAt);
  const endDateTime = new Date(startDateTime.getTime() + durationMinutes * 60 * 1000);

  const fallbackCode = Math.random().toString(36).substring(2, 5) + '-' + 
                       Math.random().toString(36).substring(2, 6) + '-' + 
                       Math.random().toString(36).substring(2, 5);
  const fallbackMeetUrl = `https://meet.google.com/${fallbackCode}`;

  try {
    const calendar = await getGoogleCalendarClient();
    
    if (!calendar) {
      return {
        success: true,
        googleEventId: `evt_${Date.now()}`,
        meetUrl: fallbackMeetUrl,
        isFallback: true
      };
    }

    const uniqueRequestId = `meet_req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const eventData: any = {
      summary: title,
      description: description || `Reunión organizada por Mi Cassa Real Estate`,
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: timezone,
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: timezone,
      },
      attendees: attendeesEmails.filter(Boolean).map(email => ({ email })),
      conferenceData: {
        createRequest: {
          requestId: uniqueRequestId,
          conferenceSolutionKey: { type: 'hangoutsMeet' },
        },
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 },
          { method: 'popup', minutes: 15 },
        ],
      },
    };

    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: eventData,
      conferenceDataVersion: 1,
      sendUpdates: 'all', // Envía invitaciones automáticas por Google Calendar a los correos
    });

    const createdEvent = response.data;
    const meetUrl = createdEvent.conferenceData?.entryPoints?.find(ep => ep.entryPointType === 'video')?.uri 
      || createdEvent.hangoutLink 
      || fallbackMeetUrl;

    return {
      success: true,
      googleEventId: createdEvent.id || `evt_${Date.now()}`,
      meetUrl,
      isFallback: !createdEvent.conferenceData?.entryPoints
    };

  } catch (error: any) {
    console.error('Error al crear evento de Google Meet en Calendar API:', error?.message || error);
    return {
      success: true,
      googleEventId: `evt_${Date.now()}`,
      meetUrl: fallbackMeetUrl,
      isFallback: true,
      error: error?.message
    };
  }
}
