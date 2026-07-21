"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, Smartphone, Loader2, QrCode, X, CheckCircle2, AlertCircle, Star } from "lucide-react";
import { toast } from "sonner";
import { QRCodeSVG } from "qrcode.react";
import { motion, AnimatePresence } from "framer-motion";

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
  const [newPhoneName, setNewPhoneName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [usePairingCode, setUsePairingCode] = useState(true);
  const [isLinking, setIsLinking] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [pairingCode, setPairingCode] = useState<string | null>(null);
  const [pollingActive, setPollingActive] = useState(false);

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

  // --- QR & Linking Logic ---
  const handleLinkPhone = async () => {
    if (!newPhoneName.trim()) {
      toast.error("Por favor ingresa un nombre para el dispositivo");
      return;
    }
    if (usePairingCode && !phoneNumber.trim()) {
      toast.error("Por favor ingresa tu número de teléfono (ej. 56912345678)");
      return;
    }

    const safeName = newPhoneName.trim().replace(/[^a-zA-Z0-9_-]/g, "");
    setIsLinking(true);
    setQrCode(null);
    setPairingCode(null);

    try {
      if (usePairingCode) {
        await fetch(`/api/whatsapp/sessions/${safeName}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phoneNumber: phoneNumber.trim() })
        });
      } else {
        await fetch(`/api/whatsapp/sessions/${safeName}`);
      }
      setPollingActive(true);
    } catch (error) {
      toast.error("Error contactando al bot.");
      setIsLinking(false);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (pollingActive && newPhoneName) {
      const safeName = newPhoneName.trim().replace(/[^a-zA-Z0-9_-]/g, "");
      
      const poll = async () => {
        try {
          const res = await fetch(`/api/whatsapp/sessions/${safeName}/qr`);
          const data = await res.json();

          if (data.isConnected) {
            toast.success("¡Teléfono vinculado exitosamente!");
            setPollingActive(false);
            setIsLinking(false);
            setIsModalOpen(false);
            setNewPhoneName("");
            setPhoneNumber("");
            fetchSessions();
            return;
          }

          if (data.qr) {
            setQrCode(data.qr);
          }
          if (data.pairingCode) {
            setPairingCode(data.pairingCode);
          }
        } catch (error) {
          console.error("Error polling QR:", error);
        }
      };

      interval = setInterval(poll, 3000);
    }
    return () => clearInterval(interval);
  }, [pollingActive, newPhoneName]);

  const closeModal = () => {
    setPollingActive(false);
    setIsModalOpen(false);
    setIsLinking(false);
    setQrCode(null);
    setPairingCode(null);
    setNewPhoneName("");
    setPhoneNumber("");
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
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
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

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-card w-full max-w-md rounded-2xl shadow-xl border overflow-hidden"
            >
              <div className="flex items-center justify-between p-4 border-b bg-muted/30">
                <h3 className="font-semibold flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-primary" />
                  Vincular Dispositivo
                </h3>
                <button onClick={closeModal} className="p-1 rounded-md hover:bg-muted">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">
                {!isLinking ? (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Asigna un nombre a este teléfono para identificarlo (Ej. "Ventas Central", "Soporte").
                    </p>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="Nombre del dispositivo"
                      value={newPhoneName}
                      onChange={(e) => setNewPhoneName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleLinkPhone()}
                    />

                    <div className="flex items-center gap-2 pt-2">
                      <input 
                        type="checkbox" 
                        id="usePairing" 
                        checked={usePairingCode} 
                        onChange={(e) => setUsePairingCode(e.target.checked)} 
                        className="rounded border-gray-300 w-4 h-4 text-primary" 
                      />
                      <label htmlFor="usePairing" className="text-sm font-medium cursor-pointer">
                        Vincular con Código de 8 Dígitos (Recomendado)
                      </label>
                    </div>

                    {usePairingCode && (
                      <input
                        type="text"
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="Ej: 56912345678 (Sin el +)"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleLinkPhone()}
                      />
                    )}

                    <button
                      onClick={handleLinkPhone}
                      className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                    >
                      Generar {usePairingCode ? "Código" : "QR"}
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-4 space-y-6">
                    <div className="text-center space-y-2">
                      <h4 className="font-medium text-lg">{usePairingCode ? "Ingresa este Código" : "Escanea el Código QR"}</h4>
                      <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                        {usePairingCode 
                          ? "Abre WhatsApp, ve a Dispositivos Vinculados -> Vincular con el número de teléfono, e ingresa este código." 
                          : "Abre WhatsApp en tu celular, ve a Dispositivos Vinculados y escanea este código."}
                      </p>
                    </div>

                    <div className="bg-white p-4 rounded-xl shadow-inner border min-h-[250px] min-w-[250px] flex items-center justify-center">
                      {usePairingCode ? (
                        pairingCode ? (
                          <div className="text-4xl font-mono font-bold tracking-widest text-primary">{pairingCode}</div>
                        ) : (
                          <div className="flex flex-col items-center gap-3 text-muted-foreground">
                            <Loader2 className="w-8 h-8 animate-spin text-primary/50" />
                            <span className="text-sm animate-pulse">Generando código...</span>
                          </div>
                        )
                      ) : (
                        qrCode ? (
                          <QRCodeSVG value={qrCode} size={220} />
                        ) : (
                          <div className="flex flex-col items-center gap-3 text-muted-foreground">
                            <Loader2 className="w-8 h-8 animate-spin text-primary/50" />
                            <span className="text-sm animate-pulse">Generando código QR...</span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
