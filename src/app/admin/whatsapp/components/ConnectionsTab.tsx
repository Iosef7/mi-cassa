"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, Smartphone, Loader2, QrCode, X, CheckCircle2, AlertCircle, Star } from "lucide-react";
import { toast } from "sonner";
import { QRCodeSVG } from "qrcode.react";
import { motion, AnimatePresence } from "framer-motion";
import LinkDeviceModal from "./LinkDeviceModal";

interface Session {
  id: string; // db id
  sessionId: string; // The whatsapp name
  name: string;
  isConnected: boolean;
  isDefaultSender: boolean;
  createdAt: string;
}

export default function ConnectionsTab() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // New Phone Modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/whatsapp/sessions");
      const data = await res.json();
      if (data.sessions) {
        setSessions(data.sessions);
      }
    } catch (error) {
      toast.error("Error al cargar conexiones.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetDefault = async (sessionId: string) => {
    try {
      const res = await fetch("/api/whatsapp/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId })
      });
      if (res.ok) {
        toast.success("Teléfono principal actualizado.");
        fetchSessions();
      } else {
        toast.error("No se pudo actualizar el teléfono principal.");
      }
    } catch (error) {
      toast.error("Error de conexión.");
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    const isConfirmed = window.confirm("¿Eliminar conexión?\nEl bot se desconectará de este número.");

    if (isConfirmed) {
      try {
        const res = await fetch(`/api/whatsapp/sessions/${sessionId}`, { method: 'DELETE' });
        if (res.ok) {
          toast.success("Conexión eliminada.");
          fetchSessions();
        } else {
          toast.error("Error al eliminar la conexión.");
        }
      } catch (error) {
        toast.error("Error de red.");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Dispositivos Conectados</h2>
          <p className="text-sm text-muted-foreground">Administra los números que el bot puede usar.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Vincular Nuevo
        </button>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-5 rounded-xl border bg-card/50 shadow-sm flex flex-col h-[140px] animate-pulse">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-muted flex-shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              </div>
              <div className="mt-auto border-t pt-4">
                <div className="h-8 bg-muted rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : sessions.length === 0 ? (
        <div className="text-center py-16 border border-dashed rounded-xl bg-card/50">
          <Smartphone className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium">Ningún teléfono vinculado</h3>
          <p className="text-muted-foreground mt-1 max-w-sm mx-auto">
            Vincula un número de WhatsApp escaneando el código QR para empezar a automatizar tus mensajes.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sessions.map((s) => (
            <motion.div
              key={s.sessionId}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative p-5 rounded-xl border bg-card shadow-sm flex flex-col justify-between group overflow-hidden"
            >
              {/* Glassmorphism Background Effect */}
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />

              <div>
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${s.isConnected ? 'bg-green-100 dark:bg-green-900/30 text-green-600' : 'bg-red-100 dark:bg-red-900/30 text-red-600'}`}>
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-base">{s.name}</h4>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <div className={`w-2 h-2 rounded-full ${s.isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                        <span className="text-xs font-medium text-muted-foreground">
                          {s.isConnected ? 'Conectado' : 'Desconectado'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleDeleteSession(s.sessionId)}
                    className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-md transition-colors"
                    title="Eliminar conexión"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="pt-4 mt-2 border-t flex items-center justify-between relative z-10">
                <button
                  onClick={() => handleSetDefault(s.sessionId)}
                  disabled={!s.isConnected}
                  className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-md transition-colors ${
                    s.isDefaultSender 
                      ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' 
                      : 'hover:bg-muted text-muted-foreground disabled:opacity-50 disabled:hover:bg-transparent'
                  }`}
                >
                  <Star className={`w-4 h-4 ${s.isDefaultSender ? 'fill-current' : ''}`} />
                  {s.isDefaultSender ? 'Línea Principal' : 'Hacer Principal'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <LinkDeviceModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchSessions} 
      />
    </div>
  );
}
