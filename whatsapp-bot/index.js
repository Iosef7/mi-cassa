const express = require('express');
const cors = require('cors');
const { 
    default: makeWASocket, 
    DisconnectReason,
    delay,
    fetchLatestBaileysVersion,
    Browsers
} = require('@whiskeysockets/baileys');
const pino = require('pino');
const qrcodeLib = require('qrcode');
const { PrismaClient } = require('../prisma/generated/client');
const usePostgresAuthState = require('./postgresAuthState');
const { initScheduler } = require('./cron');

const prisma = new PrismaClient();
const app = express();
const port = process.env.BOT_PORT || 3001;
const NEXT_PUBLIC_URL = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Sessions management (in-memory tracker for active sockets)
const sessions = new Map();

// Message Queue for Anti-Ban (Jitter)
const messageQueue = [];
let isProcessingQueue = false;

async function processMessageQueue() {
    if (isProcessingQueue || messageQueue.length === 0) return;
    isProcessingQueue = true;

    while (messageQueue.length > 0) {
        const task = messageQueue.shift();
        try {
            const sessionData = sessions.get(task.sessionId);
            if (sessionData && sessionData.isConnected && sessionData.sock) {
                // Jitter: Random delay between 1000ms and 3000ms
                const jitterMs = Math.floor(Math.random() * 2000) + 1000;
                await delay(jitterMs);
                
                if (task.type === 'text') {
                    await sessionData.sock.sendMessage(task.to, { text: task.content });
                } else if (task.type === 'status') {
                    const statusObj = {
                        statusJidList: sessionData.contacts
                    };
                    if (task.mediaPath) {
                        // Media status
                        const ext = task.mediaPath.split('.').pop().toLowerCase();
                        if (['jpg', 'jpeg', 'png'].includes(ext)) {
                            statusObj.image = { url: task.mediaPath };
                            if (task.content) statusObj.caption = task.content;
                        } else if (['mp4', 'mov'].includes(ext)) {
                            statusObj.video = { url: task.mediaPath };
                            if (task.content) statusObj.caption = task.content;
                        }
                    } else if (task.content) {
                        // Text status
                        statusObj.text = task.content;
                        // Add background color logic if needed
                    }
                    await sessionData.sock.sendMessage('status@broadcast', statusObj);
                }
                console.log(`[Queue] Successfully sent message/status to ${task.to || 'status'}`);
            } else {
                console.log(`[Queue] Session ${task.sessionId} is not connected, dropping message.`);
            }
        } catch (error) {
            console.error(`[Queue] Error sending message:`, error);
        }
    }
    isProcessingQueue = false;
}

async function connectToWhatsApp(sessionId, phoneNumber = null) {
    if (sessions.has(sessionId)) {
        const existingSession = sessions.get(sessionId);
        if (existingSession.isConnected) return existingSession;
        // Keep existing data to allow pairing code logic to persist
    }

    let sessionData = sessions.get(sessionId) || {
        sock: null,
        isConnected: false,
        currentQr: null,
        contacts: [],
        pairingCode: null
    };
    
    sessions.set(sessionId, sessionData);

    // Sync state with DB
    await prisma.whatsAppSession.upsert({
        where: { sessionId },
        create: { sessionId, name: sessionId, isConnected: false },
        update: { isConnected: false, currentQr: null }
    });

    const { state, saveCreds } = await usePostgresAuthState(prisma, sessionId);
    
    // Load contacts from DB
    const dbSession = await prisma.whatsAppSession.findUnique({ where: { sessionId } });
    if (dbSession && dbSession.contacts) {
        try {
            sessionData.contacts = JSON.parse(dbSession.contacts);
        } catch(e) {}
    }

    const saveContacts = async () => {
        try {
            await prisma.whatsAppSession.update({
                where: { sessionId },
                data: { contacts: JSON.stringify(sessionData.contacts) }
            });
        } catch(e) {
            console.error(`Error saving contacts for ${sessionId}`, e);
        }
    };

    console.log(`[${sessionId}] Initializing WASocket...`);

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: false,
        logger: pino({ level: 'info' }),
        browser: ['Ubuntu', 'Chrome', '20.0.04'],
        keepAliveIntervalMs: 30000,
        syncFullHistory: false,
        markOnlineOnConnect: true,
        generateHighQualityLinkPreview: true,
        getMessage: async (key) => {
            return { conversation: 'hello' }
        }
    });

    sessionData.sock = sock;

    // Contact Sync
    const handleContacts = (contacts) => {
        let changed = false;
        if (contacts) {
            for (const contact of contacts) {
                if (contact.id && contact.id.endsWith('@s.whatsapp.net') && !sessionData.contacts.includes(contact.id)) {
                    sessionData.contacts.push(contact.id);
                    changed = true;
                }
            }
        }
        if (changed) saveContacts();
    };

    sock.ev.on('messaging-history.set', ({ contacts }) => handleContacts(contacts));
    sock.ev.on('contacts.upsert', handleContacts);
    sock.ev.on('contacts.update', handleContacts);

    // Connection Updates
    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;
        
        if (qr) {
            sessionData.currentQr = qr;
            await prisma.whatsAppSession.update({
                where: { sessionId },
                data: { currentQr: qr }
            });
        }

        if (connection === 'close') {
            const shouldReconnect = lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log(`[${sessionId}] Connection closed, reconnecting: ${shouldReconnect}`);
            sessionData.isConnected = false;
            sessionData.pairingCode = null; // Clear pairing code on disconnect
            
            await prisma.whatsAppSession.update({
                where: { sessionId },
                data: { isConnected: false, currentQr: null, pairingCode: null }
            });

            if (shouldReconnect) {
                setTimeout(() => connectToWhatsApp(sessionId), 5000); // 5s delay before reconnect
            } else {
                console.log(`[${sessionId}] Logged out. Deleting session data.`);
                sessions.delete(sessionId);
                await prisma.whatsAppSession.delete({ where: { sessionId } }).catch(() => {});
                await prisma.whatsAppAuth.deleteMany({ where: { sessionId } });
            }
        } else if (connection === 'open') {
            console.log(`[${sessionId}] ✅ WhatsApp Bot Connected!`);
            sessionData.isConnected = true;
            sessionData.currentQr = null;
            await prisma.whatsAppSession.update({
                where: { sessionId },
                data: { isConnected: true, currentQr: null }
            });
        }
    });

    // Incoming Messages Webhook
    sock.ev.on('messages.upsert', async (m) => {
        if (m.type !== 'notify') return;
        
        for (const msg of m.messages) {
            if (!msg.message) continue;
            
            const remoteJid = msg.key.remoteJid;
            // Ignore status broadcasts
            if (remoteJid === 'status@broadcast') continue;

            // Extract text
            let text = '';
            if (msg.message.conversation) {
                text = msg.message.conversation;
            } else if (msg.message.extendedTextMessage) {
                text = msg.message.extendedTextMessage.text;
            }

            if (!text) continue;

            // Forward to Next.js Webhook
            try {
                await fetch(`${NEXT_PUBLIC_URL}/api/whatsapp/webhook`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        sessionId,
                        messageId: msg.key.id,
                        remoteJid: remoteJid,
                        fromMe: msg.key.fromMe,
                        content: text,
                        pushName: msg.pushName
                    })
                });
            } catch (error) {
                console.error(`[Webhook Error] Failed to send to Next.js:`, error.message);
            }
        }
    });

    sock.ev.on('creds.update', saveCreds);

    // Attempt to request pairing code if phoneNumber is provided
    if (phoneNumber) {
        const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
        try {
            setTimeout(async () => {
                try {
                    const code = await sock.requestPairingCode(cleanNumber);
                    console.log(`[${sessionId}] Pairing code for ${cleanNumber}: ${code}`);
                    sessionData.pairingCode = code;
                    await prisma.whatsAppSession.update({
                        where: { sessionId },
                        data: { pairingCode: code }
                    });
                } catch (pairErr) {
                    console.error(`[${sessionId}] Failed to request pairing code:`, pairErr);
                }
            }, 3000);
        } catch (e) {
            console.error(`[${sessionId}] Error requesting pairing code:`, e);
        }
    }

    return sessionData;
}

// REST API Endpoints for Next.js to interact with the bot

// Initialize or get status
app.get('/session/:sessionId', async (req, res) => {
    const { sessionId } = req.params;
    console.log(`[API] GET /session/${sessionId} received`);
    try {
        let session = sessions.get(sessionId);
        if (!session) {
            session = await connectToWhatsApp(sessionId);
        }
        
        res.json({
            sessionId,
            isConnected: session.isConnected,
            hasQr: !!session.currentQr,
            pairingCode: session.pairingCode || null
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message });
    }
});

// Pair device via phone number
app.post('/session/:sessionId/pair', express.json(), async (req, res) => {
    const { sessionId } = req.params;
    const { phoneNumber } = req.body;
    
    if (!phoneNumber) {
        return res.status(400).json({ error: "phoneNumber is required" });
    }
    
    console.log(`[API] POST /session/${sessionId}/pair received for ${phoneNumber}`);
    try {
        const session = await connectToWhatsApp(sessionId, phoneNumber);
        res.json({
            sessionId,
            isConnected: session.isConnected,
            hasQr: !!session.currentQr,
            pairingCode: session.pairingCode || null
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message });
    }
});

// Delete session explicitly
app.delete('/session/:sessionId', async (req, res) => {
    const { sessionId } = req.params;
    const session = sessions.get(sessionId);
    if (session && session.sock) {
        try {
            session.sock.logout();
        } catch (e) {}
    }
    sessions.delete(sessionId);
    await prisma.whatsAppSession.delete({ where: { sessionId } }).catch(() => {});
    await prisma.whatsAppAuth.deleteMany({ where: { sessionId } });
    
    res.json({ success: true, message: 'Session deleted' });
});

// Send Message via Queue
app.post('/send-message', async (req, res) => {
    const { sessionId, to, message } = req.body;
    
    if (!sessionId || !to || !message) {
        return res.status(400).json({ error: 'Missing parameters' });
    }

    const session = sessions.get(sessionId);
    if (!session || !session.isConnected) {
        return res.status(400).json({ error: 'Session not connected' });
    }

    const jid = to.includes('@') ? to : `${to}@s.whatsapp.net`;
    
    // Push to Queue
    messageQueue.push({
        type: 'text',
        sessionId,
        to: jid,
        content: message
    });
    
    processMessageQueue();

    res.json({ success: true, queued: true });
});

// Send Status via Queue
app.post('/status', async (req, res) => {
    const { sessionIds, caption, mediaPath } = req.body;
    
    if (!sessionIds || !Array.isArray(sessionIds)) {
        return res.status(400).json({ error: 'Invalid sessionIds array' });
    }

    let queuedCount = 0;
    for (const sessionId of sessionIds) {
        const session = sessions.get(sessionId);
        if (session && session.isConnected) {
            messageQueue.push({
                type: 'status',
                sessionId,
                content: caption,
                mediaPath
            });
            queuedCount++;
        }
    }

    if (queuedCount > 0) {
        processMessageQueue();
    }

    res.json({ success: true, queued: queuedCount });
});

// Load all sessions from DB on startup
async function startup() {
    const dbSessions = await prisma.whatsAppSession.findMany();
    for (const s of dbSessions) {
        await connectToWhatsApp(s.sessionId);
    }
    console.log(`[Startup] Initialized ${dbSessions.length} sessions from DB.`);
}

app.listen(port, () => {
    console.log(`🚀 Enterprise WhatsApp Bot running on port ${port}`);
    
    // Start Cron Jobs
    initScheduler(sessions, messageQueue, processMessageQueue);
    startup();
});
