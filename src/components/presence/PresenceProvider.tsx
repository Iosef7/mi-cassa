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
      } catch (error) {
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
    events.forEach(e => document.addEventListener(e, resetIdleTimer));
    resetIdleTimer(); // Inicializar timer

    return () => {
      clearInterval(intervalId);
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
      events.forEach(e => document.removeEventListener(e, resetIdleTimer));
    };
  }, [pathname, isIdle]);

  return <>{children}</>;
}
