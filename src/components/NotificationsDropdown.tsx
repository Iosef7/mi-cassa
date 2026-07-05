"use client";

import React, { useState, useEffect } from 'react';
import { Bell, Check, Loader2, Info } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NotificationsDropdown({ 
  align = "right", 
  direction = "down" 
}: { 
  align?: "left" | "right", 
  direction?: "up" | "down" 
} = {}) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown on navigation
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const markAsRead = async (id?: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(id ? { id } : {}), // if no id, marks all as read
      });
      if (res.ok) {
        if (id) {
          setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
        } else {
          setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        }
      }
    } catch (error) {
      console.error("Failed to mark notification as read", error);
    } finally {
      setIsLoading(false);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-full transition-colors relative ${isOpen ? 'bg-primary/10 text-primary' : 'hover:bg-border text-foreground'}`}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-background animate-pulse"></span>
        )}
      </button>

      {isOpen && (
        <div className={`absolute ${align === 'left' ? 'left-0' : 'right-0'} ${direction === 'up' ? 'bottom-full mb-2 origin-bottom' : 'mt-2 origin-top'} w-80 sm:w-96 bg-card border border-border shadow-xl rounded-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95`}>
          <div className="flex items-center justify-between p-4 border-b border-border bg-muted/20">
            <h3 className="font-bold text-foreground flex items-center gap-2">
              Notificaciones {unreadCount > 0 && <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">{unreadCount} nuevas</span>}
            </h3>
            {unreadCount > 0 && (
              <button 
                onClick={() => markAsRead()} 
                disabled={isLoading}
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                Marcar todas leídas
              </button>
            )}
          </div>
          
          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center flex flex-col items-center text-muted-foreground">
                <Bell className="w-8 h-8 opacity-20 mb-3" />
                <p className="text-sm">No tienes notificaciones aún</p>
              </div>
            ) : (
              <div className="flex flex-col">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`p-4 border-b border-border last:border-b-0 hover:bg-muted/50 transition-colors flex gap-4 ${!notification.read ? 'bg-primary/5' : ''}`}
                  >
                    <div className="shrink-0 mt-1">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${!notification.read ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-muted text-muted-foreground'}`}>
                        <Info className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2 mb-1">
                        <p className={`text-sm font-bold truncate ${!notification.read ? 'text-foreground' : 'text-foreground/80'}`}>
                          {notification.title}
                        </p>
                        <span className="text-[10px] text-muted-foreground shrink-0 whitespace-nowrap">
                          {new Date(notification.createdAt).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })}
                        </span>
                      </div>
                      {notification.message && (
                        <p className={`text-xs line-clamp-2 mb-2 ${!notification.read ? 'text-foreground/90' : 'text-muted-foreground'}`}>
                          {notification.message}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between mt-2">
                        {notification.link ? (
                          <Link 
                            href={notification.link}
                            onClick={() => { if(!notification.read) markAsRead(notification.id); }}
                            className="text-xs text-primary font-medium hover:underline"
                          >
                            Ver detalle
                          </Link>
                        ) : <div></div>}
                        
                        {!notification.read && (
                          <button 
                            onClick={() => markAsRead(notification.id)}
                            className="text-[10px] bg-background hover:bg-border border border-border px-2 py-1 rounded-md text-foreground transition-colors"
                          >
                            Marcar leída
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
      )}
    </div>
  );
}
