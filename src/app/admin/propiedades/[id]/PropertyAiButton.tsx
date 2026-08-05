'use client';

import { useState, useEffect } from 'react';
import { autoFillProperty } from '@/actions/property-ai';
import { GeminiIcon } from '@/components/icons/GeminiIcon';
import toast from 'react-hot-toast';

export default function PropertyAiButton({ propertyId, propertyTitle, isProcessed, imageCount = 10 }: { propertyId: string, propertyTitle?: string, isProcessed?: boolean, imageCount?: number }) {
  const [isProcessing, setIsProcessing] = useState(false);

  // Sync button state with global AI process events
  useEffect(() => {
    const checkActive = () => {
      const data = localStorage.getItem('ai_active_process');
      if (data) {
        try {
          const parsed = JSON.parse(data);
          // Si el proceso lleva más de 5 minutos colgado, forzar limpieza
          if (parsed.startedAt && Date.now() - parsed.startedAt > 5 * 60 * 1000) {
            localStorage.removeItem('ai_active_process');
            setIsProcessing(false);
          } else {
            setIsProcessing(parsed.propertyId === propertyId);
          }
        } catch {
          setIsProcessing(false);
        }
      } else {
        setIsProcessing(false);
      }
    };

    checkActive();
    
    // Listen to custom events
    const handleStarted = () => checkActive();
    const handleEnded = () => setIsProcessing(false);

    window.addEventListener('ai-process-started', handleStarted);
    window.addEventListener('ai-process-ended', handleEnded);

    return () => {
      window.removeEventListener('ai-process-started', handleStarted);
      window.removeEventListener('ai-process-ended', handleEnded);
    };
  }, [propertyId]);

  const handleAiFill = async () => {
    if (!propertyId || isProcessing) return;
    
    setIsProcessing(true);

    // Signal the global floating bar
    localStorage.setItem('ai_active_process', JSON.stringify({
      propertyId,
      title: propertyTitle || 'Propiedad',
      startedAt: Date.now()
    }));
    window.dispatchEvent(new Event('ai-process-started'));

    try {
      const result = await autoFillProperty(propertyId);
      
      if (result.success) {
        toast.success('¡IA iniciada en segundo plano!');
      } else {
        toast.error(`Error de IA: ${result.error}`, { duration: 5000 });
        localStorage.removeItem('ai_active_process');
        window.dispatchEvent(new Event('ai-process-ended'));
        setIsProcessing(false);
      }
    } catch (error: any) {
      toast.error(`Error de conexión: ${error.message}`);
      localStorage.removeItem('ai_active_process');
      window.dispatchEvent(new Event('ai-process-ended'));
      setIsProcessing(false);
    }
  };

  return (
    <button
      onClick={handleAiFill}
      disabled={isProcessing}
      className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-bold transition-all shadow-md w-full
        ${isProcessed && !isProcessing
          ? 'bg-purple-100 text-purple-700 hover:bg-purple-200 border border-purple-200' 
          : 'bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white animate-pulse'
        }
        ${isProcessing ? 'opacity-80 cursor-not-allowed' : 'hover:scale-105'}`}
    >
      <GeminiIcon className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} colorful={!isProcessed || isProcessing} />
      {isProcessing ? '⏳ Procesando...' : isProcessed ? 'Re-analizar con IA' : '✨ Auto-Completar'}
    </button>
  );
}
