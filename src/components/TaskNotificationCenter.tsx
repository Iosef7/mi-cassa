"use client";

import { useEffect, useRef } from 'react';

export default function TaskNotificationCenter({ currentUserId, onNewTask }: { currentUserId: string, onNewTask?: () => void }) {
  const lastCheckRef = useRef<string>(new Date().toISOString());

  // Synthesize a nice "ding" notification sound
  const playNotificationSound = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.exponentialRampToValueAtTime(1046.50, ctx.currentTime + 0.1); // C6

      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 1);
    } catch (e) {
      console.error('Audio playback failed', e);
    }
  };

  const showPushNotification = (title: string, body: string) => {
    if (!('Notification' in window)) return;

    if (Notification.permission === 'granted') {
      new Notification(title, { body, icon: '/icon-192x192.png' }); // Usaría un icono real si existiera
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification(title, { body });
        }
      });
    }
  };

  useEffect(() => {
    // Solicitar permisos al montar si no se han denegado
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/tasks?since=${lastCheckRef.current}`);
        if (res.ok) {
          const newTasks = await res.json();
          let notified = false;
          
          newTasks.forEach((task: any) => {
            if (task.assignedTo === currentUserId && task.status !== 'COMPLETADO') {
              showPushNotification('¡Nueva tarea asignada!', `Te han asignado: ${task.title}`);
              if (!notified) {
                playNotificationSound();
                notified = true;
              }
            }
          });

          if (newTasks.length > 0) {
            lastCheckRef.current = new Date().toISOString();
            if (onNewTask) onNewTask(); // Recargar datos en la UI
          }
        }
      } catch (e) {
        console.error('Error fetching new tasks for notifications', e);
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [currentUserId, onNewTask]);

  return null; // Componente invisible
}
