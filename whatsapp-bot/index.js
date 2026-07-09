const express = require('express');
const cors = require('cors');
const { 
    default: makeWASocket, 
    useMultiFileAuthState, 
    DisconnectReason
} = require('@whiskeysockets/baileys');
const pino = require('pino');
const qrcode = require('qrcode-terminal');
const qrcodeLib = require('qrcode');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3001;

let globalContacts = [];

app.use(cors());
// Increase payload limit to handle base64 images
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

let sock;
let isConnected = false;
let currentQr = null;

async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');

    sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
        logger: pino({ level: 'silent' }) // set to 'info' for debugging
    });

    sock.ev.on('contacts.upsert', (contacts) => {
        for (const contact of contacts) {
            if (contact.id && contact.id.endsWith('@s.whatsapp.net') && !globalContacts.includes(contact.id)) {
                globalContacts.push(contact.id);
            }
        }
    });
    
    sock.ev.on('contacts.update', (contacts) => {
        for (const contact of contacts) {
            if (contact.id && contact.id.endsWith('@s.whatsapp.net') && !globalContacts.includes(contact.id)) {
                globalContacts.push(contact.id);
            }
        }
    });

    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;
        
        if (qr) {
            currentQr = qr;
            console.log('SCAN THIS QR CODE WITH YOUR WHATSAPP (Linked Devices):');
            qrcode.generate(qr, { small: true });
        }

        if (connection === 'close') {
            const shouldReconnect = lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log('Connection closed due to ', lastDisconnect.error, ', reconnecting ', shouldReconnect);
            isConnected = false;
            
            if (shouldReconnect) {
                connectToWhatsApp();
            } else {
                console.log('You are logged out. Please delete the auth_info_baileys folder and scan again.');
                try {
                    fs.rmSync('auth_info_baileys', { recursive: true, force: true });
                } catch (err) {
                    console.error('Error deleting auth_info_baileys:', err.message);
                }
                setTimeout(() => connectToWhatsApp(), 2000); // Wait a bit before restarting flow
            }
        } else if (connection === 'open') {
            console.log('✅ WhatsApp Bot Connected!');
            isConnected = true;
            currentQr = null;
        }
    });

    sock.ev.on('creds.update', saveCreds);
}

// Endpoint para ver el QR code en el navegador
app.get('/qr', async (req, res) => {
    if (isConnected) {
        return res.send('<h2 style="text-align:center; margin-top:50px; font-family:sans-serif; color:green;">✅ El bot ya está conectado a WhatsApp.</h2>');
    }
    if (!currentQr) {
        return res.send('<h2 style="text-align:center; margin-top:50px; font-family:sans-serif; color:gray;">⏳ Generando código QR, por favor recarga la página en unos segundos...</h2>');
    }
    try {
        const qrImage = await qrcodeLib.toDataURL(currentQr);
        res.send(`
            <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; font-family:sans-serif; background-color:#f0f2f5;">
                <h2 style="color:#333;">Escanea este código con WhatsApp</h2>
                <div style="background:white; padding:20px; border-radius:15px; box-shadow:0 4px 6px rgba(0,0,0,0.1);">
                    <img src="${qrImage}" style="width:300px; height:300px;" alt="QR Code" />
                </div>
                <p style="color:#666; margin-top:20px;">Ve a WhatsApp > Dispositivos Vinculados > Vincular un dispositivo</p>
                <button onclick="window.location.reload()" style="margin-top:20px; padding:10px 20px; background:#25D366; color:white; border:none; border-radius:5px; cursor:pointer; font-size:16px;">Recargar QR</button>
            </div>
        `);
    } catch (e) {
        res.status(500).send('Error generando QR');
    }
});

// Endpoint to send status
app.post('/status', async (req, res) => {
    try {
        if (!isConnected) {
            return res.status(500).json({ error: 'WhatsApp is not connected. Scan the QR code first.' });
        }

        const { caption, imageBase64 } = req.body;

        const myJid = sock.user.id.split(':')[0] + '@s.whatsapp.net';
        
        // Obtener todos los contactos para que puedan ver el estado
        const contacts = [...globalContacts];
            
        if (!contacts.includes(myJid)) {
            contacts.push(myJid);
        }
        
        if (imageBase64) {
            // Remove the data:image/jpeg;base64, prefix to get the raw base64 string
            const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
            const buffer = Buffer.from(base64Data, 'base64');
            
            // Send media status
            await sock.sendMessage('status@broadcast', {
                image: buffer,
                caption: caption || ''
            }, {
                statusJidList: contacts,
                broadcast: true,
                backgroundColor: '#000000'
            });
            console.log('Media status uploaded successfully.');
        } else if (caption) {
            // Send text status
            await sock.sendMessage('status@broadcast', {
                text: caption,
                backgroundColor: '#000000'
            }, {
                statusJidList: contacts,
                broadcast: true
            });
            console.log('Text status uploaded successfully.');
        } else {
            return res.status(400).json({ error: 'Either imageBase64 or caption must be provided.' });
        }

        return res.status(200).json({ success: true, message: 'Status uploaded' });

    } catch (error) {
        console.error('Error sending status:', error);
        return res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
});

// Start Express and WhatsApp Connection
app.listen(port, () => {
    console.log(`🚀 Bot API running on http://localhost:${port}`);
    connectToWhatsApp();
});
