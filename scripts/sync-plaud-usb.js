/**
 * Script de Sincronización Automática para Plaud Pro mediante USB o Carpeta Local.
 * Este script monitorea unidades USB conectadas o carpetas locales de exportación de Plaud
 * y sube automáticamente los audios nuevos a Mi Cassa CRM procesándolos con Gemini IA.
 */

const fs = require('fs');
const path = require('path');

const API_ENDPOINT = process.env.MI_CASSA_API || 'http://localhost:3002/api/plaud/upload';
const WATCH_FOLDER = process.env.PLAUD_FOLDER || './plaud_sync_folder';

console.log('----------------------------------------------------');
console.log('🚀 Monitor de Sincronización Automática Plaud Pro USB');
console.log(`📁 Carpeta monitoreada: ${WATCH_FOLDER}`);
console.log(`🌐 Servidor Mi Cassa: ${API_ENDPOINT}`);
console.log('----------------------------------------------------');

if (!fs.existsSync(WATCH_FOLDER)) {
  fs.mkdirSync(WATCH_FOLDER, { recursive: true });
}

const processedFiles = new Set();

async function uploadFile(filePath) {
  const fileName = path.basename(filePath);
  if (processedFiles.has(fileName)) return;

  console.log(`🎙️ Nuevo audio detectado: ${fileName}. Enviando a Mi Cassa...`);

  try {
    const fileBuffer = fs.readFileSync(filePath);
    const blob = new Blob([fileBuffer]);

    const formData = new FormData();
    formData.append('file', blob, fileName);

    const res = await fetch(API_ENDPOINT, {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();

    if (data.success) {
      console.log(`✅ ¡Procesado con éxito por Gemini IA!`);
      console.log(`👤 Lead asignado: ${data.leadName}`);
      console.log(`📋 Tareas creadas: ${data.createdTasksCount}`);
      processedFiles.add(fileName);
    } else {
      console.error(`❌ Error del servidor:`, data.error);
    }
  } catch (err) {
    console.error(`❌ Error enviando archivo:`, err.message);
  }
}

// Escanear carpeta al inicio
fs.readdirSync(WATCH_FOLDER).forEach((file) => {
  if (file.endsWith('.mp3') || file.endsWith('.wav') || file.endsWith('.m4a') || file.endsWith('.txt')) {
    uploadFile(path.join(WATCH_FOLDER, file));
  }
});

// Monitorear cambios en vivo
fs.watch(WATCH_FOLDER, (eventType, filename) => {
  if (filename && (filename.endsWith('.mp3') || filename.endsWith('.wav') || filename.endsWith('.m4a') || filename.endsWith('.txt'))) {
    uploadFile(path.join(WATCH_FOLDER, filename));
  }
});
