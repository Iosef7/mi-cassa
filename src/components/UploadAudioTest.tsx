'use client';

import { useState } from 'react';
import { UploadCloud, Loader2, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function UploadAudioTest({ leadId, leadPhone }: { leadId: string, leadPhone: string }) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append('audioFile', file);
      formData.append('From', leadPhone); // Para simular Twilio
      formData.append('leadId', leadId); // Extra param para este modo test
      
      const response = await fetch('/api/webhooks/twilio', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al procesar el audio');
      }

      setSuccess(true);
      router.refresh(); // Refrescar la página para ver la nueva llamada

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsUploading(false);
      // Reset input
      e.target.value = '';
    }
  };

  return (
    <div className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center text-center">
      <div className="bg-white p-3 rounded-full shadow-sm border border-slate-100 mb-4 text-blue-500">
        <UploadCloud size={24} />
      </div>
      <h3 className="text-slate-900 font-semibold mb-1">Simulador de Llamadas (IA)</h3>
      <p className="text-slate-500 text-sm mb-6 max-w-sm">
        Sube un archivo de audio (.mp3 o .wav) para simular una llamada entrante de Twilio y probar el análisis de Gemini.
      </p>

      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm mb-4 border border-red-100 w-full">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 text-green-700 px-4 py-2 rounded-lg text-sm mb-4 border border-green-200 flex items-center justify-center gap-2 w-full">
          <CheckCircle size={16} />
          Llamada procesada con éxito.
        </div>
      )}

      <label className={`relative flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all ${
        isUploading 
          ? 'bg-slate-200 text-slate-500 cursor-not-allowed' 
          : 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer shadow-sm hover:shadow'
      }`}>
        {isUploading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            <span>Procesando con Gemini...</span>
          </>
        ) : (
          <>
            <span>Seleccionar Archivo de Audio</span>
            <input 
              type="file" 
              accept="audio/mp3,audio/wav,audio/mpeg" 
              className="hidden" 
              onChange={handleFileChange}
              disabled={isUploading}
            />
          </>
        )}
      </label>
    </div>
  );
}
