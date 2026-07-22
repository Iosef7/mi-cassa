"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { randomBytes } from "crypto";
import type { PDFFont } from "pdf-lib";
import { Resend } from "resend";
import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const t: Record<string, any> = {
  es: {
    otpMsg: "🏠 Mi Cassa\nTu código de verificación para firmar el acuerdo de corretaje es: *{otpCode}*",
    emailSubject: "Firma requerida: Acuerdo de Corretaje - Mi Cassa",
    emailGreeting: "Hola {name},",
    emailBody1: "Se ha generado el acuerdo de corretaje para la propiedad <strong>{title}</strong>.",
    emailBody2: "Para revisar y firmar el documento, haz clic en el siguiente enlace:",
    emailBtn: "Revisar y Firmar Acuerdo",
    emailFooter: "Si el botón no funciona, copia y pega este enlace en tu navegador:",
    contractTitle: "ACUERDO DE CORRETAJE / הסכם תיווך",
    date: "Fecha:",
    agent: "Agente Inmobiliario:",
    clientData: "DATOS DEL CLIENTE",
    name: "Nombre:",
    phone: "Teléfono (WhatsApp):",
    id: "Teudat Zehut / Pasaporte:",
    propData: "DATOS DE LA PROPIEDAD",
    prop: "Propiedad:",
    address: "Dirección:",
    price: "Precio Listado:",
    fees: "HONORARIOS Y CONDICIONES",
    commission: "Comisión Acordada:",
    defaultTerms: "El cliente se compromete a abonar los honorarios de corretaje si adquiere o alquila la propiedad mencionada, o si la adquiere a través de un tercero relacionado, de acuerdo con la Ley de Corredores de Bienes Raíces de 1996.",
    auditTitle: "CERTIFICADO DE AUDITORIA DE FIRMA",
    signedBy: "Firmado electrónicamente por:",
    verifiedPhone: "Teléfono Verificado por OTP:",
    ip: "Dirección IP:",
    timestamp: "Timestamp:",
    agentNotif: "✅ ¡Notificación Mi Cassa!\nEl cliente *{name}* acaba de firmar digitalmente el acuerdo de corretaje para la propiedad *{title}*.\n\nPuedes ver el PDF aquí: {url}"
  },
  en: {
    otpMsg: "🏠 Mi Cassa\nYour verification code to sign the brokerage agreement is: *{otpCode}*",
    emailSubject: "Signature required: Brokerage Agreement - Mi Cassa",
    emailGreeting: "Hello {name},",
    emailBody1: "The brokerage agreement for the property <strong>{title}</strong> has been generated.",
    emailBody2: "To review and sign the document, click the link below:",
    emailBtn: "Review and Sign Agreement",
    emailFooter: "If the button doesn't work, copy and paste this link into your browser:",
    contractTitle: "BROKERAGE AGREEMENT / הסכם תיווך",
    date: "Date:",
    agent: "Real Estate Agent:",
    clientData: "CLIENT DETAILS",
    name: "Name:",
    phone: "Phone (WhatsApp):",
    id: "ID / Passport:",
    propData: "PROPERTY DETAILS",
    prop: "Property:",
    address: "Address:",
    price: "Listed Price:",
    fees: "FEES AND CONDITIONS",
    commission: "Agreed Commission:",
    defaultTerms: "The client agrees to pay the brokerage fees if they acquire or rent the mentioned property, or if they acquire it through a related third party, in accordance with the Real Estate Brokers Law of 1996.",
    auditTitle: "SIGNATURE AUDIT CERTIFICATE",
    signedBy: "Electronically signed by:",
    verifiedPhone: "Phone Verified by OTP:",
    ip: "IP Address:",
    timestamp: "Timestamp:",
    agentNotif: "✅ Mi Cassa Notification!\nThe client *{name}* has just digitally signed the brokerage agreement for the property *{title}*.\n\nYou can view the PDF here: {url}"
  },
  he: {
    otpMsg: "🏠 Mi Cassa\nקוד האימות שלך לחתימה על הסכם התיווך הוא: *{otpCode}*",
    emailSubject: "נדרשת חתימה: הסכם תיווך - Mi Cassa",
    emailGreeting: "שלום {name},",
    emailBody1: "נוצר הסכם התיווך עבור הנכס <strong>{title}</strong>.",
    emailBody2: "כדי לעיין ולחתום על המסמך, לחץ על הקישור למטה:",
    emailBtn: "עיין וחתום על ההסכם",
    emailFooter: "אם הכפתור לא עובד, העתק והדבק את הקישור הזה בדפדפן שלך:",
    contractTitle: "הסכם תיווך / BROKERAGE AGREEMENT",
    date: ":תאריך",
    agent: ":סוכן נדל\"ן",
    clientData: "פרטי לקוח",
    name: ":שם",
    phone: ":(WhatsApp) טלפון",
    id: ":תעודת זהות / דרכון",
    propData: "פרטי הנכס",
    prop: ":נכס",
    address: ":כתובת",
    price: ":מחיר מבוקש",
    fees: "עמלות ותנאים",
    commission: ":עמלה מוסכמת",
    defaultTerms: "הלקוח מתחייב לשלם את דמי התיווך אם ירכוש או ישכור את הנכס האמור, או אם ירכוש אותו באמצעות צד שלישי קשור, בהתאם לחוק המתווכים במקרקעין התשנ\"ו-1996.",
    auditTitle: "תעודת ביקורת חתימה",
    signedBy: ":נחתם אלקטרונית על ידי",
    verifiedPhone: ":OTP טלפון אומת על ידי",
    ip: ":כתובת IP",
    timestamp: ":חותמת זמן",
    agentNotif: "✅ התראת Mi Cassa!\nהלקוח *{name}* הרגע חתם דיגיטלית על הסכם התיווך עבור הנכס *{title}*.\n\nתוכל לצפות ב-PDF כאן: {url}"
  }
};

function reverseHebrew(str: string, lang: string) {
  if (lang === 'he') {
    return str.split('').reverse().join('');
  }
  return str;
}

export async function getContractTemplates() {
  try {
    const templates = await prisma.contractTemplate.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return { success: true, templates };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createContractTemplate(name: string, language: string, pdfBase64: string) {
  try {
    const dir = path.join(process.cwd(), 'public', 'uploads', 'templates');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    
    const fileName = `template_${Date.now()}.pdf`;
    const filePath = path.join(dir, fileName);
    
    const base64Data = pdfBase64.replace(/^data:application\/pdf;base64,/, "");
    fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));
    
    const pdfUrl = `/uploads/templates/${fileName}`;

    const template = await prisma.contractTemplate.create({
      data: {
        name,
        language,
        pdfUrl
      }
    });
    return { success: true, template };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createContract(
  leadId: string, 
  propertyId: string, 
  agentId: string, 
  commissionRate: number, 
  language: string = "es", 
  templatePdfUrl?: string, 
  pdfBase64?: string
) {
  try {
    const token = randomBytes(16).toString("hex");

    let finalPdfUrl = templatePdfUrl || null;
    
    if (pdfBase64 && !finalPdfUrl) {
      const dir = path.join(process.cwd(), 'public', 'uploads', 'contracts_base');
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      const fileName = `base_${token}.pdf`;
      const filePath = path.join(dir, fileName);
      const base64Data = pdfBase64.replace(/^data:application\/pdf;base64,/, "");
      fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));
      finalPdfUrl = `/uploads/contracts_base/${fileName}`;
    }

    const contract = await prisma.brokerageContract.create({
      data: {
        token,
        leadId,
        propertyId,
        agentId,
        commissionRate,
        language,
        templatePdfUrl: finalPdfUrl,
        status: "PENDIENTE",
      },
    });

    revalidatePath(`/admin/leads/${leadId}`);
    return { success: true, contract };
  } catch (error: any) {
    console.error("Error creating contract:", error);
    return { success: false, error: error.message };
  }
}

export async function getContractByToken(token: string) {
  try {
    const contract = await prisma.brokerageContract.findUnique({
      where: { token },
      include: {
        lead: true,
        property: true,
        agent: true,
      },
    });
    return { success: true, contract };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function sendVerificationOTP(token: string, method: "whatsapp" | "email", identifier: string) {
  try {
    const contract = await prisma.brokerageContract.findUnique({ where: { token } });
    const lang = contract?.language || 'es';
    const dict = t[lang] || t['es'];

    const otpCode = Math.floor(1000 + Math.random() * 9000).toString(); // 4 digits
    const tokenIdentifier = `otp_${token}_${identifier}`;

    const record = await prisma.verificationToken.findFirst({
      where: { identifier: tokenIdentifier }
    });

    if (record) {
      await prisma.verificationToken.update({
        where: { identifier_token: { identifier: record.identifier, token: record.token } },
        data: { token: otpCode, expires: new Date(Date.now() + 10 * 60 * 1000) }
      });
    } else {
      await prisma.verificationToken.create({
        data: { identifier: tokenIdentifier, token: otpCode, expires: new Date(Date.now() + 10 * 60 * 1000) }
      });
    }

    const messageText = dict.otpMsg.replace('{otpCode}', otpCode);

    if (method === "whatsapp") {
      const BOT_URL = process.env.WHATSAPP_BOT_URL || "http://localhost:3001";
      const defaultSession = await prisma.whatsAppSession.findFirst({
        where: { isDefaultSender: true }
      });

      let sessionId = "Iosef";
      if (defaultSession) {
        sessionId = defaultSession.sessionId;
      } else {
        const anySession = await prisma.whatsAppSession.findFirst({ where: { isConnected: true }});
        if (anySession) sessionId = anySession.sessionId;
      }

      const response = await fetch(`${BOT_URL}/send-message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          phoneNumber: identifier,
          message: messageText,
        }),
      });

      try {
        const lead = await prisma.lead.findFirst({ where: { phone: identifier }});
        await prisma.whatsAppMessage.create({
          data: {
            sessionId,
            remoteJid: `${identifier}@s.whatsapp.net`,
            fromMe: true,
            messageId: `otp-${Date.now()}`,
            content: messageText,
            status: "SENT",
            leadId: lead ? lead.id : null
          }
        });
      } catch (logError) {
        console.error("Failed to log OTP message to CRM:", logError);
      }

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to send WhatsApp message");
      }
    } else if (method === "email") {
      if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
        throw new Error("Servicio de correo no configurado (faltan credenciales SMTP).");
      }
      
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.SMTP_EMAIL,
          pass: process.env.SMTP_PASSWORD,
        },
      });

      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px; direction: ${lang === 'he' ? 'rtl' : 'ltr'};">
          <h2 style="color: #2563eb; text-align: center;">${dict.contractTitle || "Mi Cassa CRM"}</h2>
          <p style="color: #374151; font-size: 16px;">${messageText}</p>
        </div>
      `;

      await transporter.sendMail({
        from: `"Mi Cassa CRM" <micassaisrael@gmail.com>`,
        to: identifier,
        subject: `OTP: ${otpCode} - Mi Cassa`,
        html: htmlContent,
      });
    }

    return { success: true };
  } catch (error: any) {
    console.error("Error sending OTP:", error);
    return { success: false, error: error.message };
  }
}
export async function verifyOTP(token: string, identifier: string, code: string) {
  try {
    const tokenIdentifier = `otp_${token}_${identifier}`;
    
    const record = await prisma.verificationToken.findFirst({
      where: { identifier: tokenIdentifier },
      orderBy: { expires: 'desc' }
    });

    if (!record || record.token !== code) {
      return { success: false, error: "Código incorrecto." };
    }

    if (new Date() > record.expires) {
      return { success: false, error: "El código ha expirado." };
    }

    await prisma.verificationToken.delete({
      where: { identifier_token: { identifier: record.identifier, token: record.token } }
    });

    return { success: true };
  } catch (error: any) {
    console.error("Error verifying OTP:", error);
    return { success: false, error: error.message };
  }
}

export async function signContract(token: string, signatureBase64: string, idNumber: string, ip: string, verifiedPhone?: string) {
  try {
    const contract = await prisma.brokerageContract.findUnique({
      where: { token },
      include: { lead: true, property: true, agent: true }
    });

    if (!contract) return { success: false, error: "Contrato no encontrado" };
    if (contract.status === "FIRMADO") return { success: false, error: "El contrato ya fue firmado" };

    const lang = contract.language || 'es';
    const dict = t[lang] || t['es'];
    const signedAt = new Date();

    const { PDFDocument, rgb } = require('pdf-lib');
    const fontkitModule = require('@pdf-lib/fontkit');
    const fontkit = fontkitModule.default || fontkitModule;

    let pdfDoc;
    
    if (contract.templatePdfUrl) {
      let existingPdfBytes;
      if (contract.templatePdfUrl.startsWith('/')) {
        const fullPath = path.join(process.cwd(), 'public', contract.templatePdfUrl);
        existingPdfBytes = fs.readFileSync(fullPath);
      } else {
        const res = await fetch(contract.templatePdfUrl);
        const arrayBuffer = await res.arrayBuffer();
        existingPdfBytes = Buffer.from(arrayBuffer);
      }
      pdfDoc = await PDFDocument.load(existingPdfBytes);
      pdfDoc.registerFontkit(fontkit);
    } else {
      pdfDoc = await PDFDocument.create();
      pdfDoc.registerFontkit(fontkit);
      
      const arialBytes = fs.readFileSync('C:\\Windows\\Fonts\\arial.ttf');
      const arialBoldBytes = fs.readFileSync('C:\\Windows\\Fonts\\arialbd.ttf');
      
      const font = await pdfDoc.embedFont(arialBytes);
      const boldFont = await pdfDoc.embedFont(arialBoldBytes);

      let page = pdfDoc.addPage([595.28, 841.89]);
      const { width, height } = page.getSize();
      let y = height - 50;

      const drawText = (text: string, fontType: PDFFont, size: number, x: number = 50) => {
        page.drawText(reverseHebrew(text, lang), { x: lang === 'he' ? width - 50 - fontType.widthOfTextAtSize(text, size) : x, y, size, font: fontType, color: rgb(0,0,0) });
        y -= (size + 10);
      };

      drawText(dict.contractTitle, boldFont, 18);
      y -= 20;
      
      drawText(`${dict.date} ${signedAt.toLocaleDateString()}`, font, 12);
      drawText(`${dict.agent} ${contract.agent.name || contract.agent.email}`, font, 12);
      y -= 10;
      
      drawText(dict.clientData, boldFont, 14);
      drawText(`${dict.name} ${contract.lead.name}`, font, 12);
      drawText(`${dict.phone} ${contract.lead.phone}`, font, 12);
      drawText(`${dict.id} ${idNumber}`, font, 12);
      y -= 10;

      drawText(dict.propData, boldFont, 14);
      drawText(`${dict.prop} ${contract.property.title}`, font, 12);
      drawText(`${dict.address} ${contract.property.location}`, font, 12);
      drawText(`${dict.price} ${contract.property.price} ${contract.lead.currency}`, font, 12);
      y -= 10;

      drawText(dict.fees, boldFont, 14);
      drawText(`${dict.commission} ${contract.commissionRate || 2}% + IVA`, font, 12);
      y -= 10;
      
      const terms = dict.defaultTerms;
      const words = terms.split(' ');
      let line = '';
      words.forEach((word: string) => {
        if (line.length + word.length > 70) {
          drawText(line, font, 10);
          line = word + ' ';
        } else {
          line += word + ' ';
        }
      });
      if (line.length > 0) drawText(line, font, 10);
    }

    const arialBytes = fs.readFileSync('C:\\Windows\\Fonts\\arial.ttf');
    const arialBoldBytes = fs.readFileSync('C:\\Windows\\Fonts\\arialbd.ttf');
    const font = await pdfDoc.embedFont(arialBytes);
    const boldFont = await pdfDoc.embedFont(arialBoldBytes);

    let page = pdfDoc.addPage([595.28, 841.89]);
    const { width, height } = page.getSize();
    let y = height - 50;

    const drawAuditText = (text: string, fontType: PDFFont, size: number, x: number = 50) => {
      page.drawText(reverseHebrew(text, lang), { x: lang === 'he' ? width - 50 - fontType.widthOfTextAtSize(text, size) : x, y, size, font: fontType, color: rgb(0,0,0) });
      y -= (size + 10);
    };

    drawAuditText(dict.auditTitle, boldFont, 16);
    y -= 20;

    drawAuditText(`${dict.signedBy} ${contract.lead.name}`, font, 12);
    drawAuditText(`${dict.id} ${idNumber}`, font, 12);
    if (verifiedPhone) {
      drawAuditText(`${dict.verifiedPhone} ${verifiedPhone}`, font, 12);
    }
    drawAuditText(`${dict.ip} ${ip}`, font, 12);
    drawAuditText(`${dict.timestamp} ${signedAt.toISOString()}`, font, 12);
    y -= 20;

    try {
      const imgBase64 = signatureBase64.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");
      const imageBytes = Buffer.from(imgBase64, 'base64');
      const pngImage = await pdfDoc.embedPng(imageBytes);
      const pngDims = pngImage.scale(0.5);
      
      const sigX = lang === 'he' ? width - 50 - pngDims.width : 50;
      page.drawImage(pngImage, {
        x: sigX,
        y: y - pngDims.height,
        width: pngDims.width,
        height: pngDims.height,
      });
      y -= (pngDims.height + 20);
    } catch (e) {
      console.error("Error embedding signature image", e);
      drawAuditText('[Error al cargar imagen de la firma]', font, 12);
    }

    const pdfBytes = await pdfDoc.save();

    const dir = path.join(process.cwd(), 'public', 'uploads', 'contracts');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    
    const fileName = `contrato_${contract.token}_${Date.now()}.pdf`;
    const filePath = path.join(dir, fileName);
    fs.writeFileSync(filePath, pdfBytes);
    
    const pdfUrl = `/uploads/contracts/${fileName}`;

    await prisma.brokerageContract.update({
      where: { id: contract.id },
      data: {
        status: "FIRMADO",
        signatureImage: signatureBase64,
        signedAt,
        signerIp: ip,
        signerIdNumber: idNumber,
        signerPhone: verifiedPhone || null,
        pdfUrl,
      }
    });

    if (contract.agent.phone) {
      const BOT_URL = process.env.WHATSAPP_BOT_URL || "http://localhost:3001";
      const sessionId = process.env.WHATSAPP_BOT_SESSION_ID || "default";
      const agentCleanPhone = contract.agent.phone.replace(/[^0-9]/g, '');
      
      const headersList = await headers();
      const host = headersList.get('host') || 'localhost:3000';
      const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || `${protocol}://${host}`;
      
      const finalPdfUrl = baseUrl + pdfUrl;
      
      let notifMsg = dict.agentNotif
        .replace('{name}', contract.lead.name)
        .replace('{title}', contract.property.title)
        .replace('{url}', finalPdfUrl);

      try {
        await fetch(`${BOT_URL}/send-message`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            phoneNumber: agentCleanPhone,
            message: notifMsg,
          }),
        });
      } catch (e) {
        console.error("Could not notify agent", e);
      }
    }

    revalidatePath(`/admin/leads/${contract.leadId}`);
    return { success: true, pdfUrl };
  } catch (error: any) {
    console.error("Error signing contract:", error);
    return { success: false, error: error.message };
  }
}

export async function sendContractEmail(contractToken: string, email: string) {
  try {
    if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
      return { success: false, error: "Servicio de correo no configurado (faltan credenciales SMTP)." };
    }

    const contract = await prisma.brokerageContract.findUnique({
      where: { token: contractToken },
      include: { lead: true, property: true },
    });

    if (!contract) return { success: false, error: "Contrato no encontrado" };

    const lang = contract.language || 'es';
    const dict = t[lang] || t['es'];

    const headersList = await headers();
    const host = headersList.get('host') || 'localhost:3000';
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || `${protocol}://${host}`;
    
    const contractUrl = `${baseUrl}/firma/${contract.token}`;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px; direction: ${lang === 'he' ? 'rtl' : 'ltr'};">
        <h2 style="color: #2563eb; text-align: center;">${dict.contractTitle} - Mi Cassa</h2>
        <p style="color: #374151; font-size: 16px;">${dict.emailGreeting.replace('{name}', contract.lead.name)}</p>
        <p style="color: #374151; font-size: 16px;">${dict.emailBody1.replace('{title}', contract.property.title)}</p>
        <p style="color: #374151; font-size: 16px;">${dict.emailBody2}</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${contractUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">${dict.emailBtn}</a>
        </div>
        <p style="color: #6b7280; font-size: 14px;">${dict.emailFooter}</p>
        <p style="color: #6b7280; font-size: 12px; word-break: break-all;">${contractUrl}</p>
      </div>
    `;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"Mi Cassa CRM" <${process.env.SMTP_EMAIL}>`,
      to: email,
      subject: dict.emailSubject,
      html: htmlContent,
    });

    return { success: true };
  } catch (error: any) {
    console.error("Error sending contract email:", error);
    return { success: false, error: error.message };
  }
}
