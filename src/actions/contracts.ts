"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { randomBytes } from "crypto";
import type { PDFFont } from "pdf-lib";

// 1. Create a new contract link
export async function createContract(leadId: string, propertyId: string, agentId: string, commissionRate: number) {
  try {
    const token = randomBytes(16).toString("hex");

    const contract = await prisma.brokerageContract.create({
      data: {
        token,
        leadId,
        propertyId,
        agentId,
        commissionRate,
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

// 2. Fetch contract by token (for the public signing page)
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

// 3. Send WhatsApp OTP
export async function sendWhatsappOTP(token: string, phoneNumber: string) {
  try {
    const otpCode = Math.floor(1000 + Math.random() * 9000).toString(); // 4 digits
    const identifier = `otp_${token}_${phoneNumber}`;

    // Upsert verification token
    const record = await prisma.verificationToken.findFirst({
      where: { identifier }
    });

    if (record) {
      await prisma.verificationToken.update({
        where: { identifier_token: { identifier: record.identifier, token: record.token } },
        data: { token: otpCode, expires: new Date(Date.now() + 10 * 60 * 1000) }
      });
    } else {
      await prisma.verificationToken.create({
        data: { identifier, token: otpCode, expires: new Date(Date.now() + 10 * 60 * 1000) }
      });
    }

    const BOT_URL = process.env.WHATSAPP_BOT_URL || "http://localhost:3001";
    
    // Buscar el sender por defecto en la base de datos
    const defaultSession = await prisma.whatsAppSession.findFirst({
      where: { isDefaultSender: true }
    });

    // Fallback: usar el primero que esté conectado, o 'Iosef' si no hay ninguno en BD
    let sessionId = "Iosef";
    if (defaultSession) {
      sessionId = defaultSession.sessionId;
    } else {
      const anySession = await prisma.whatsAppSession.findFirst({ where: { isConnected: true }});
      if (anySession) sessionId = anySession.sessionId;
    }

    const messageText = `🏠 Mi Cassa\nTu código de verificación para firmar el acuerdo de corretaje es: *${otpCode}*`;

    const response = await fetch(`${BOT_URL}/send-message`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        phoneNumber,
        message: messageText,
      }),
    });

    // Log this message directly into CRM history so the agent sees the OTP was sent
    try {
      const lead = await prisma.lead.findFirst({ where: { phone: phoneNumber }});
      await prisma.whatsAppMessage.create({
        data: {
          sessionId,
          remoteJid: `${phoneNumber}@s.whatsapp.net`,
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

    return { success: true };
  } catch (error: any) {
    console.error("Error sending OTP:", error);
    return { success: false, error: error.message };
  }
}

// 4. Verify OTP
export async function verifyWhatsappOTP(token: string, phoneNumber: string, code: string) {
  try {
    const identifier = `otp_${token}_${phoneNumber}`;
    
    const record = await prisma.verificationToken.findFirst({
      where: { identifier },
      orderBy: { expires: 'desc' }
    });

    if (!record || record.token !== code) {
      return { success: false, error: "Código incorrecto." };
    }

    if (record.expires < new Date()) {
      return { success: false, error: "El código ha expirado." };
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// 5. Submit signature and generate PDF
export async function signContract(token: string, signatureBase64: string, idNumber: string, ip: string, verifiedPhone?: string) {
  try {
    const contract = await prisma.brokerageContract.findUnique({
      where: { token },
      include: { lead: true, property: true, agent: true }
    });

    if (!contract) return { success: false, error: "Contrato no encontrado" };
    if (contract.status === "FIRMADO") return { success: false, error: "El contrato ya fue firmado" };

    const signedAt = new Date();

    // 1. Generate PDF
    const { PDFDocument, rgb } = require('pdf-lib');
    const fontkitModule = require('@pdf-lib/fontkit');
    const fontkit = fontkitModule.default || fontkitModule;
    const fs = require('fs');

    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit);
    
    const arialBytes = fs.readFileSync('C:\\Windows\\Fonts\\arial.ttf');
    const arialBoldBytes = fs.readFileSync('C:\\Windows\\Fonts\\arialbd.ttf');
    
    const font = await pdfDoc.embedFont(arialBytes);
    const boldFont = await pdfDoc.embedFont(arialBoldBytes);

    // Page 1: The Contract
    let page = pdfDoc.addPage([595.28, 841.89]); // A4 size
    const { width, height } = page.getSize();
    let y = height - 50;

    const drawText = (text: string, fontType: PDFFont, size: number, x: number = 50) => {
      page.drawText(text, { x, y, size, font: fontType, color: rgb(0,0,0) });
      y -= (size + 10);
    };

    drawText('ACUERDO DE CORRETAJE / הסכם תיווך', boldFont, 18);
    y -= 20;
    
    drawText(`Fecha: ${signedAt.toLocaleDateString()}`, font, 12);
    drawText(`Agente Inmobiliario: ${contract.agent.name || contract.agent.email}`, font, 12);
    y -= 10;
    
    drawText('DATOS DEL CLIENTE', boldFont, 14);
    drawText(`Nombre: ${contract.lead.name}`, font, 12);
    drawText(`Teléfono (WhatsApp): ${contract.lead.phone}`, font, 12);
    drawText(`Teudat Zehut / Pasaporte: ${idNumber}`, font, 12);
    y -= 10;

    drawText('DATOS DE LA PROPIEDAD', boldFont, 14);
    drawText(`Propiedad: ${contract.property.title}`, font, 12);
    drawText(`Dirección: ${contract.property.location}`, font, 12);
    drawText(`Precio Listado: ${contract.property.price} ${contract.lead.currency}`, font, 12);
    y -= 10;

    drawText('HONORARIOS Y CONDICIONES', boldFont, 14);
    drawText(`Comisión Acordada: ${contract.commissionRate || 2}% + IVA`, font, 12);
    y -= 10;
    
    const terms = contract.terms || "El cliente se compromete a abonar los honorarios de corretaje si adquiere o alquila la propiedad mencionada, o si la adquiere a través de un tercero relacionado, de acuerdo con la Ley de Corredores de Bienes Raíces de 1996.";
    // Simple text wrapping for terms
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

    // Page 2: Audit Trail
    y = height - 50;
    page = pdfDoc.addPage([595.28, 841.89]);
    page.drawText('CERTIFICADO DE AUDITORIA DE FIRMA', { x: 50, y, size: 16, font: boldFont, color: rgb(0,0,0) });
    y -= 40;

    page.drawText(`Firmado electrónicamente por: ${contract.lead.name}`, { x: 50, y, size: 12, font });
    y -= 20;
    page.drawText(`Teudat Zehut: ${idNumber}`, { x: 50, y, size: 12, font });
    y -= 20;
    if (verifiedPhone) {
      page.drawText(`Teléfono Verificado por OTP: ${verifiedPhone}`, { x: 50, y, size: 12, font });
      y -= 20;
    }
    page.drawText(`Dirección IP: ${ip}`, { x: 50, y, size: 12, font });
    y -= 20;
    page.drawText(`Timestamp: ${signedAt.toISOString()}`, { x: 50, y, size: 12, font });
    y -= 40;

    // Embed Signature Image
    try {
      const imgBase64 = signatureBase64.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");
      const imageBytes = Buffer.from(imgBase64, 'base64');
      const pngImage = await pdfDoc.embedPng(imageBytes);
      const pngDims = pngImage.scale(0.5);
      
      page.drawImage(pngImage, {
        x: 50,
        y: y - pngDims.height,
        width: pngDims.width,
        height: pngDims.height,
      });
      y -= (pngDims.height + 20);
    } catch (e) {
      console.error("Error embedding signature image", e);
      page.drawText('[Error al cargar imagen de la firma]', { x: 50, y, size: 12, font });
    }

    const pdfBytes = await pdfDoc.save();

    // 2. Save PDF to local public folder (Fallback)
    const path = require('path');
    const dir = path.join(process.cwd(), 'public', 'uploads', 'contracts');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    
    const fileName = `contrato_${contract.token}_${Date.now()}.pdf`;
    const filePath = path.join(dir, fileName);
    fs.writeFileSync(filePath, pdfBytes);
    
    const pdfUrl = `/uploads/contracts/${fileName}`;

    // 3. Update DB
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

    // 4. Send Notification to Agent via WhatsApp
    if (contract.agent.phone) {
      const BOT_URL = process.env.WHATSAPP_BOT_URL || "http://localhost:3001";
      const sessionId = process.env.WHATSAPP_BOT_SESSION_ID || "default";
      const agentCleanPhone = contract.agent.phone.replace(/[^0-9]/g, '');
      
      try {
        await fetch(`${BOT_URL}/send-message`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            phoneNumber: agentCleanPhone,
            message: `✅ ¡Notificación Mi Cassa!\nEl cliente *${contract.lead.name}* acaba de firmar digitalmente el acuerdo de corretaje para la propiedad *${contract.property.title}*.\n\nPuedes ver el PDF aquí: ${process.env.NEXTAUTH_URL || "http://localhost:3000"}${pdfUrl}`,
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
