"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export function PresenceProvider({ children }: { children: React.ReactNode }) {
  const [isIdle, setIsIdle] = useState(false);
  const idleTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    // Solo monitorear presencia en la zona admin
    if (!pathname?.startsWith('/admin')) return;

    const pingPresence = async (statusOverride?: string) => {
      try {
        await fetch('/api/team/presence', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: statusOverride })
        });
      } catch (error: any) {
        if (error.name === 'AbortError' || error.message === 'Failed to fetch' || error instanceof TypeError) {
          // Ignore background polling network errors
          return;
        }
        console.error("Presence ping failed", error);
      }
    };

    // Ping inicial
    pingPresence();

    // Heartbeat cada 60 segundos
    const intervalId = setInterval(() => {
      if (!isIdle) {
        pingPresence();
      }
    }, 60000);

    const resetIdleTimer = () => {
      if (isIdle) {
        setIsIdle(false);
        // Volvemos a estar online (a menos que el usuario esté en DND/Invisible, 
        // pero el backend solo cambiará AWAY -> ONLINE. Idealmente el backend maneja esta lógica)
        pingPresence('ONLINE');
      }

      if (idleTimeoutRef.current) {
        clearTimeout(idleTimeoutRef.current);
      }

      // 5 minutos de inactividad
      idleTimeoutRef.current = setTimeout(() => {
        setIsIdle(true);
        pingPresence('AWAY');
      }, 5 * 60 * 1000);
    };

    // Eventos que indican actividad
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(e => document.addEventListener(e, resetIdleTimer, { passive: true }));
    resetIdleTimer(); // Inicializar timer

    // Detectar cuando el usuario cierra la pestaña o sale de la página
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // Usar sendBeacon para asegurar que la petición se envíe incluso si la página se está cerrando
        navigator.sendBeacon('/api/team/presence/beacon', JSON.stringify({ status: 'OFFLINE' }));
      } else {
        // Volver a reportar online cuando regresa a la pestaña
        pingPresence('ONLINE');
      }
    };
    
    const handlePageHide = () => {
      navigator.sendBeacon('/api/team/presence/beacon', JSON.stringify({ status: 'OFFLINE' }));
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pagehide', handlePageHide);

    return () => {
      clearInterval(intervalId);
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
      events.forEach(e => document.removeEventListener(e, resetIdleTimer));
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', handlePageHide);
    };
  }, [pathname, isIdle]);

  return <>{children}</>;
}
