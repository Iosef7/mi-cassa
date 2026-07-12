const express = require('express');
const cors = require('cors');
const { 
    default: makeWASocket, 
    useMultiFileAuthState, 
    DisconnectReason
} = require('@whiskeysockets/baileys');
const pino = require('pino');
const qrcodeLib = require('qrcode');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.BOT_PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Sessions management
const sessions = new Map();

// Helper to delete session folder
const deleteSessionFolder = (sessionId) => {
    const folderPath = path.join(__dirname, `auth_info_baileys_${sessionId}`);
    if (fs.existsSync(folderPath)) {
        try {
            fs.rmSync(folderPath, { recursive: true, force: true });
        } catch (err) {
            console.error(`Error deleting folder ${folderPath}:`, err.message);
        }
    }
};

async function connectToWhatsApp(sessionId) {
    if (sessions.has(sessionId)) {
        const existingSession = sessions.get(sessionId);
        if (existingSession.isConnected) return existingSession;
        sessions.delete(sessionId);
    }

    let sessionData = {
        sock: null,
        isConnected: false,
        currentQr: null,
        contacts: []
    };
    
    sessions.set(sessionId, sessionData);

    const folderPath = path.join(__dirname, `auth_info_baileys_${sessionId}`);
    const { state, saveCreds } = await useMultiFileAuthState(folderPath);

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: false,
        logger: pino({ level: 'silent' })
    });

    sessionData.sock = sock;

    sock.ev.on('contacts.upsert', (contacts) => {
        for (const contact of contacts) {
            if (contact.id && contact.id.endsWith('@s.whatsapp.net') && !sessionData.contacts.includes(contact.id)) {
                sessionData.contacts.push(contact.id);
            }
        }
    });
    
    sock.ev.on('contacts.update', (contacts) => {
        for (const contact of contacts) {
            if (contact.id && contact.id.endsWith('@s.whatsapp.net') && !sessionData.contacts.includes(contact.id)) {
                sessionData.contacts.push(contact.id);
            }
        }
    });

    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;
        
        if (qr) {
            sessionData.currentQr = qr;
        }

        if (connection === 'close') {
            const shouldReconnect = lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log(`[${sessionId}] Connection closed, reconnecting: ${shouldReconnect}`);
            sessionData.isConnected = false;
            
            if (shouldReconnect) {
                setTimeout(() => connectToWhatsApp(sessionId), 2000);
            } else {
                console.log(`[${sessionId}] Logged out. Deleting session folder.`);
                sessions.delete(sessionId);
                deleteSessionFolder(sessionId);
            }
        } else if (connection === 'open') {
            console.log(`[${sessionId}] ✅ WhatsApp Bot Connected!`);
            sessionData.isConnected = true;
            sessionData.currentQr = null;
        }
    });

    sock.ev.on('creds.update', saveCreds);
    return sessionData;
}

// Endpoint: Initialize or get status of a session
app.get('/session/:sessionId', async (req, res) => {
    const { sessionId } = req.params;
    
    let session = sessions.get(sessionId);
    
    if (!session) {
        // Start a new session
        session = await connectToWhatsApp(sessionId);
    }
    
    res.json({
        sessionId,
        isConnected: session.isConnected,
        hasQr: !!session.currentQr
    });
});

// Endpoint: Get QR Code image URL for a session
app.get('/session/:sessionId/qr', async (req, res) => {
    const { sessionId } = req.params;
    const session = sessions.get(sessionId);
    
    if (!session) {
        return res.status(404).json({ error: 'Session not found. Initialize it first.' });
    }
    
    if (session.isConnected) {
        return res.json({ connected: true });
    }
    
    if (!session.currentQr) {
        return res.json({ waiting: true });
    }
    
    try {
        const qrImage = await qrcodeLib.toDataURL(session.currentQr);
        res.json({ qr: qrImage });
    } catch (e) {
        res.status(500).json({ error: 'Error generating QR' });
    }
});

// Endpoint: List all active sessions
app.get('/sessions', (req, res) => {
    const activeSessions = [];
    sessions.forEach((data, id) => {
        activeSessions.push({
            id,
            isConnected: data.isConnected
        });
    });
    res.json({ sessions: activeSessions });
});

// Endpoint: Logout / Delete session
app.delete('/session/:sessionId', (req, res) => {
    const { sessionId } = req.params;
    const session = sessions.get(sessionId);
    
    if (session) {
        if (session.sock) {
            session.sock.logout().catch(() => {});
        }
        sessions.delete(sessionId);
    }
    
    deleteSessionFolder(sessionId);
    res.json({ success: true, message: `Session ${sessionId} deleted.` });
});

// Endpoint: Rename a session
app.put('/session/:sessionId/rename', async (req, res) => {
    const { sessionId } = req.params;
    const { newId } = req.body;
    
    console.log(`Rename request: ${sessionId} -> ${newId}`);
    console.log(`Available sessions:`, Array.from(sessions.keys()));

    if (!newId || newId === sessionId) {
        return res.status(400).json({ error: 'Invalid new name' });
    }

    const session = sessions.get(sessionId);
    if (!session) {
        console.log(`Session ${sessionId} not found in map!`);
        return res.status(404).json({ error: 'Session not found' });
    }

    // Disconnect temporarily if connected
    if (session.sock) {
        session.sock.end(undefined);
    }
    
    sessions.delete(sessionId);
    
    const oldFolder = path.join(__dirname, `auth_info_baileys_${sessionId}`);
    const newFolder = path.join(__dirname, `auth_info_baileys_${newId}`);
    
    if (fs.existsSync(oldFolder)) {
        try {
            fs.renameSync(oldFolder, newFolder);
        } catch (err) {
            console.error('Error renaming folder:', err);
            return res.status(500).json({ error: 'Error renaming folder' });
        }
    }
    
    // Reconnect with new ID
    await connectToWhatsApp(newId);
    
    res.json({ success: true, newId });
});

// Endpoint to send status to multiple sessions
app.post('/status', async (req, res) => {
    try {
        const { caption, imageBase64, sessionIds } = req.body;
        
        let targetSessions = [];
        
        if (sessionIds && Array.isArray(sessionIds) && sessionIds.length > 0) {
            sessionIds.forEach(id => {
                const s = sessions.get(id);
                if (s && s.isConnected) targetSessions.push(s);
            });
        } else {
            // Default: broadcast to all connected sessions
            sessions.forEach((s) => {
                if (s.isConnected) targetSessions.push(s);
            });
        }
        
        if (targetSessions.length === 0) {
            return res.status(400).json({ error: 'No connected WhatsApp sessions available to send status.' });
        }

        if (!imageBase64 && !caption) {
            return res.status(400).json({ error: 'Either imageBase64 or caption must be provided.' });
        }

        let base64Data, buffer;
        if (imageBase64) {
            base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
            buffer = Buffer.from(base64Data, 'base64');
        }

        let successCount = 0;
        let errors = [];

        for (const session of targetSessions) {
            try {
                const myJid = session.sock.user.id.split(':')[0] + '@s.whatsapp.net';
                const contacts = [...session.contacts];
                if (!contacts.includes(myJid)) contacts.push(myJid);
                
                if (buffer) {
                    await session.sock.sendMessage('status@broadcast', {
                        image: buffer,
                        caption: caption || ''
                    }, {
                        statusJidList: contacts,
                        broadcast: true,
                        backgroundColor: '#000000'
                    });
                } else {
                    await session.sock.sendMessage('status@broadcast', {
                        text: caption,
                        backgroundColor: '#000000'
                    }, {
                        statusJidList: contacts,
                        broadcast: true
                    });
                }
                successCount++;
            } catch (err) {
                errors.push(err.message);
            }
        }

        if (successCount === 0) {
            return res.status(500).json({ error: 'Failed to send to any session', details: errors });
        }

        return res.status(200).json({ 
            success: true, 
            message: `Status uploaded to ${successCount} session(s).`,
            errors: errors.length > 0 ? errors : undefined
        });

    } catch (error) {
        console.error('Error sending status:', error);
        return res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
});

// Load existing sessions on startup
const loadExistingSessions = () => {
    try {
        const files = fs.readdirSync(__dirname);
        const sessionFolders = files.filter(f => f.startsWith('auth_info_baileys_'));
        
        sessionFolders.forEach(folder => {
            const sessionId = folder.replace('auth_info_baileys_', '');
            console.log(`Starting existing session: ${sessionId}`);
            connectToWhatsApp(sessionId);
        });
        
        // Also support old legacy auth_info_baileys folder for backwards compatibility
        if (fs.existsSync(path.join(__dirname, 'auth_info_baileys'))) {
            console.log(`Migrating legacy session to session_default`);
            fs.renameSync(path.join(__dirname, 'auth_info_baileys'), path.join(__dirname, 'auth_info_baileys_default'));
            connectToWhatsApp('default');
        }
    } catch (e) {
        console.log('Error loading existing sessions:', e.message);
    }
};

// Start Express and WhatsApp Connection
app.listen(port, () => {
    console.log(`🚀 Bot API running on http://localhost:${port}`);
    loadExistingSessions();
});
