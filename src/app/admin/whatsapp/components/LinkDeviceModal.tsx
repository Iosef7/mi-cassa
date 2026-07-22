"use client";

import React, { useState, useEffect } from "react";
import { QrCode, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { QRCodeSVG } from "qrcode.react";
import { motion, AnimatePresence } from "framer-motion";
import WhatsAppLinkGuide from "./WhatsAppLinkGuide";

interface LinkDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function LinkDeviceModal({ isOpen, onClose, onSuccess }: LinkDeviceModalProps) {
  const [newPhoneName, setNewPhoneName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [usePairingCode, setUsePairingCode] = useState(true);
  const [isLinking, setIsLinking] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [pairingCode, setPairingCode] = useState<string | null>(null);
  const [pollingActive, setPollingActive] = useState(false);

  const resetState = () => {
    setNewPhoneName("");
    setPhoneNumber("");
    setUsePairingCode(true);
    setIsLinking(false);
    setQrCode(null);
    setPairingCode(null);
    setPollingActive(false);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleLinkPhone = async () => {
    if (!newPhoneName.trim()) {
      toast.error("Por favor ingresa un nombre para el dispositivo");
      return;
    }
    if (usePairingCode && !phoneNumber.trim()) {
      toast.error("Por favor ingresa tu número de teléfono (ej. 56912345678)");
      return;
    }

    const safeName = newPhoneName.trim().replace(/[^a-zA-Z0-9_-]/g, "_");
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
      const safeName = newPhoneName.trim().replace(/[^a-zA-Z0-9_-]/g, "_");
      
      const poll = async () => {
        try {
          const res = await fetch(`/api/whatsapp/sessions/${safeName}/qr`);
          const data = await res.json();

          if (data.isConnected || data.connected) {
            toast.success("¡Teléfono vinculado exitosamente!");
            setPollingActive(false);
            setIsLinking(false);
            onSuccess();
            handleClose();
            return;
          }

          if (data.qr) setQrCode(data.qr);
          if (data.pairingCode) setPairingCode(data.pairingCode);
        } catch (error) {
          console.error("Error polling QR:", error);
        }
      };

      interval = setInterval(poll, 3000);
    }
    return () => clearInterval(interval);
  }, [pollingActive, newPhoneName, onSuccess]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="bg-card w-full max-w-2xl rounded-2xl shadow-xl border overflow-hidden flex flex-col md:flex-row"
          >
            {/* Left side: Guide */}
            <div className="hidden md:block w-1/3 p-6 bg-muted/30 border-r border-border">
               <div className="h-full flex flex-col justify-center">
                 <WhatsAppLinkGuide />
               </div>
            </div>

            {/* Right side: Form / QR */}
            <div className="flex-1">
              <div className="flex items-center justify-between p-4 border-b bg-muted/10">
                <h3 className="font-semibold flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-primary" />
                  Vincular Dispositivo
                </h3>
                <button onClick={handleClose} className="p-1 rounded-md hover:bg-muted transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">
                <div className="md:hidden mb-6">
                  <WhatsAppLinkGuide />
                </div>

                {!isLinking ? (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Asigna un nombre a este teléfono para identificarlo (Ej. "Ventas Central", "Soporte").
                    </p>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
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
                        className="rounded border-gray-300 w-4 h-4 text-primary accent-primary" 
                      />
                      <label htmlFor="usePairing" className="text-sm font-medium cursor-pointer text-foreground">
                        Vincular con Código de 8 Dígitos (Recomendado)
                      </label>
                    </div>

                    <AnimatePresence>
                      {usePairingCode && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <input
                            type="text"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background mt-2"
                            placeholder="Ej: 56912345678 (Sin el +)"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleLinkPhone()}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <button
                      onClick={handleLinkPhone}
                      className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors mt-4"
                    >
                      Generar {usePairingCode ? "Código" : "QR"}
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-4 space-y-6">
                    <div className="text-center space-y-2">
                      <h4 className="font-medium text-lg">{usePairingCode ? "Ingresa este Código" : "Escanea el Código QR"}</h4>
                    </div>

                    <div className="bg-white p-4 rounded-xl shadow-inner border min-h-[220px] min-w-[220px] flex items-center justify-center">
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
                          <QRCodeSVG value={qrCode} size={200} />
                        ) : (
                          <div className="flex flex-col items-center gap-3 text-muted-foreground">
                            <Loader2 className="w-8 h-8 animate-spin text-primary/50" />
                            <span className="text-sm animate-pulse">Generando código QR...</span>
                          </div>
                        )
                      )}
                    </div>
                    
                    <button 
                      onClick={() => setIsLinking(false)}
                      className="text-sm text-muted-foreground hover:text-foreground font-medium transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
