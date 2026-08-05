'use client';

import { useState, useEffect } from 'react';
import { GeminiIcon } from '@/components/icons/GeminiIcon';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

/**
 * Barra flotante global de progreso de IA.
 * Se muestra en todas las páginas del admin cuando hay un proceso activo.
 * Lee el propertyId activo desde localStorage.
 */
export default function AiProgressFloat() {
  const [activePropertyId, setActivePropertyId] = useState<string | null>(null);
  const [propertyTitle, setPropertyTitle] = useState<string>('');
  const [progressPercent, setProgressPercent] = useState(0);
  const [progressMsg, setProgressMsg] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  // Check localStorage for active AI process
  useEffect(() => {
    const checkActive = () => {
      const data = localStorage.getItem('ai_active_process');
      if (data) {
        try {
          const parsed = JSON.parse(data);
          setActivePropertyId(parsed.propertyId);
          setPropertyTitle(parsed.title || 'Propiedad');
          setIsDismissed(false);
        } catch {
          setActivePropertyId(null);
        }
      } else {
        setActivePropertyId(null);
      }
    };

    checkActive();
    // Listen for storage events (cross-tab) and custom events (same-tab)
    window.addEventListener('storage', checkActive);
    window.addEventListener('ai-process-started', checkActive);
    window.addEventListener('ai-process-ended', checkActive);
    return () => {
      window.removeEventListener('storage', checkActive);
      window.removeEventListener('ai-process-started', checkActive);
      window.removeEventListener('ai-process-ended', checkActive);
    };
  }, []);

  // Poll progress when there's an active process
  useEffect(() => {
    if (!activePropertyId) {
      setIsVisible(false);
      return;
    }

    setIsVisible(true);
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/ai-progress/${activePropertyId}`);
        if (!res.ok) return;
        const data = await res.json();
        if (data && data.percent > 0) {
          setProgressPercent(data.percent);
          setProgressMsg(data.message);

          if (data.percent >= 100) {
            // Process completed or cancelled
            setTimeout(() => {
              localStorage.removeItem('ai_active_process');
              window.dispatchEvent(new Event('ai-process-ended'));
              setIsVisible(false);
              setActivePropertyId(null);
              setIsCancelling(false);
            }, 3000);
          }
        } else if (!data) {
          // Si el servidor responde null (proceso no existe en DB), verificamos si está colgado
          const localData = localStorage.getItem('ai_active_process');
          if (localData) {
            const parsed = JSON.parse(localData);
            // Si pasaron más de 30 segundos y no hay datos, está huérfano
            if (parsed.startedAt && Date.now() - parsed.startedAt > 30 * 1000) {
               localStorage.removeItem('ai_active_process');
               window.dispatchEvent(new Event('ai-process-ended'));
               setIsVisible(false);
               setActivePropertyId(null);
            }
          }
        }
      } catch {
        // Silent
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [activePropertyId]);

  // Don't render if nothing active, dismissed, or not visible
  if (!activePropertyId || !isVisible || isDismissed) return null;

  const isCompleted = progressPercent >= 100;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
        className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-[9999] w-[95%] max-w-lg
          ${isCompleted
            ? 'bg-gradient-to-r from-emerald-600 to-green-600'
            : 'bg-gradient-to-r from-violet-700 to-fuchsia-700'
          }
          rounded-2xl shadow-2xl shadow-violet-900/30 border border-white/10 backdrop-blur-xl`}
      >
        <div className="px-4 py-3 flex items-center gap-3">
          {/* Icon */}
          <div className={`flex-shrink-0 p-2 rounded-xl ${isCompleted ? 'bg-white/20' : 'bg-white/10'}`}>
            <GeminiIcon className={`w-5 h-5 ${!isCompleted ? 'animate-spin' : ''}`} colorful />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <p className="text-white text-xs font-bold truncate">
                {isCompleted ? '✅ ¡Completado!' : '🧠 IA Procesando'} — {propertyTitle}
              </p>
              <span className="text-white/80 text-[10px] font-mono ml-2 flex-shrink-0">
                {progressPercent}%
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${isCompleted ? 'bg-emerald-300' : 'bg-white/80'}`}
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              />
            </div>

            <p className="text-white/70 text-[10px] mt-1 truncate">
              {progressMsg}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {!isCompleted && (
              <button
                onClick={async () => {
                  if (isCancelling || !activePropertyId) return;
                  setIsCancelling(true);
                  try {
                    await fetch(`/api/ai-progress/${activePropertyId}/cancel`, { method: 'POST' });
                  } catch (e) {
                    console.error("Failed to cancel", e);
                    setIsCancelling(false);
                  }
                }}
                disabled={isCancelling}
                className={`text-[10px] px-2 py-1 rounded bg-red-500/20 text-red-100 hover:bg-red-500/40 transition-colors ${isCancelling ? 'opacity-50' : ''}`}
              >
                {isCancelling ? 'Cancelando...' : 'Cancelar'}
              </button>
            )}
            <button
              onClick={() => setIsDismissed(true)}
              className="p-1 rounded-lg hover:bg-white/10 transition-colors"
              title="Ocultar"
            >
              <X className="w-4 h-4 text-white/60" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
