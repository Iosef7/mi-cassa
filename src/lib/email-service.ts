import nodemailer from 'nodemailer';

interface SendMeetingEmailParams {
  toEmail: string;
  recipientName: string;
  meetingTitle: string;
  meetingDescription?: string;
  scheduledAt: Date | string;
  durationMinutes: number;
  meetUrl: string;
}

export async function sendMeetingInvitationEmail({
  toEmail,
  recipientName,
  meetingTitle,
  meetingDescription,
  scheduledAt,
  durationMinutes,
  meetUrl
}: SendMeetingEmailParams) {
  if (!toEmail || !toEmail.includes('@')) return false;

  const dateObj = new Date(scheduledAt);
  const endDateObj = new Date(dateObj.getTime() + durationMinutes * 60 * 1000);

  const formattedDate = dateObj.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const formattedTime = dateObj.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const smtpUser = process.env.SMTP_USER || process.env.SMTP_EMAIL;
  const smtpPass = process.env.SMTP_PASSWORD;
  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
  const smtpPort = Number(process.env.SMTP_PORT) || 465;

  const htmlContent = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; padding: 30px; color: #1e293b;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0;">
        <div style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); padding: 32px 24px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; tracking: -0.5px;">Mi Cassa Real Estate</h1>
          <p style="color: #93c5fd; margin: 6px 0 0 0; font-size: 14px;">Invitación Oficial a Reunión Google Meet</p>
        </div>
        
        <div style="padding: 32px 24px;">
          <p style="font-size: 16px; margin-top: 0;">Hola <strong>${recipientName}</strong>,</p>
          <p style="font-size: 15px; color: #475569; line-height: 1.6;">
            Has sido invitado a la reunión <strong>"${meetingTitle}"</strong> organizada por el equipo de Mi Cassa.
          </p>
          
          <div style="background-color: #f1f5f9; border-radius: 12px; padding: 20px; margin: 24px 0;">
            <div style="margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
              <span style="font-weight: 600; color: #334155; min-width: 80px;">📅 Fecha:</span>
              <span style="color: #0f172a; font-weight: 500;">${formattedDate}</span>
            </div>
            <div style="margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
              <span style="font-weight: 600; color: #334155; min-width: 80px;">⏰ Hora:</span>
              <span style="color: #0f172a; font-weight: 500;">${formattedTime} (${durationMinutes} minutos)</span>
            </div>
            ${meetingDescription ? `
              <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #cbd5e1;">
                <span style="font-weight: 600; color: #334155; display: block;">📝 Notas:</span>
                <p style="margin: 4px 0 0 0; color: #475569; font-size: 14px;">${meetingDescription}</p>
              </div>
            ` : ''}
          </div>
          
          <div style="text-align: center; margin: 32px 0 24px 0;">
            <a href="${meetUrl}" target="_blank" style="background-color: #2563eb; color: #ffffff; padding: 14px 32px; border-radius: 10px; font-weight: 600; text-decoration: none; display: inline-block; font-size: 16px; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);">
              🎥 Unirse a Google Meet
            </a>
          </div>
          
          <p style="font-size: 13px; color: #94a3b8; text-align: center; margin-bottom: 0;">
            Enlace directo de acceso: <a href="${meetUrl}" style="color: #2563eb; word-break: break-all;">${meetUrl}</a>
          </p>
        </div>
        
        <div style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 16px 24px; text-align: center; font-size: 12px; color: #64748b;">
          © ${new Date().getFullYear()} Mi Cassa Real Estate. Todos los derechos reservados.
        </div>
      </div>
    </div>
  `;

  // Formato iCalendar (.ics) para que Google/Outlook/Apple agenden la reunión automáticamente
  const formatIcsDate = (d: Date) => d.toISOString().replace(/-|:|\.\d+/g, '');
  const csContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Mi Cassa//Real Estate Calendar//ES',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:meet-${Date.now()}@micassa.com`,
    `DTSTAMP:${formatIcsDate(new Date())}`,
    `DTSTART:${formatIcsDate(dateObj)}`,
    `DTEND:${formatIcsDate(endDateObj)}`,
    `SUMMARY:${meetingTitle}`,
    `DESCRIPTION:${meetingDescription || 'Reunión comercial de Mi Cassa'}\\nEnlace Meet: ${meetUrl}`,
    `LOCATION:${meetUrl}`,
    `ORGANIZER;CN="Mi Cassa Real Estate":mailto:${smtpUser}`,
    `ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;RSVP=TRUE;CN=${recipientName}:mailto:${toEmail}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  try {
    if (smtpUser && smtpPass) {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      await transporter.sendMail({
        from: `"${process.env.SMTP_FROM_NAME || 'Mi Cassa Real Estate'}" <${smtpUser}>`,
        to: toEmail,
        subject: `📅 Invitación a Reunión: ${meetingTitle} - Mi Cassa`,
        html: htmlContent,
        icalEvent: {
          filename: 'invitacion-reunion.ics',
          method: 'REQUEST',
          content: csContent
        }
      });

      console.log(`[EMAIL REAL ENVIADO] Correo enviado exitosamente a ${toEmail} para: ${meetingTitle}`);
      return true;
    } else {
      console.warn(`[EMAIL WARN] SMTP no configurado para ${toEmail}`);
      return false;
    }
  } catch (error) {
    console.error(`[EMAIL ERROR] Falla al enviar correo a ${toEmail}:`, error);
    return false;
  }
}
