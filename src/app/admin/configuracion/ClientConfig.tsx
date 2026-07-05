"use client";

import React, { useState } from "react";
import { SectionSettingsMap, updateSectionSettings, SectionStatus } from "@/actions/settings";
import { motion } from "framer-motion";
import { Save, CheckCircle2, Lock, EyeOff, LayoutDashboard, Construction } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ClientConfig({ initialSettings }: { initialSettings: SectionSettingsMap }) {
  const [settings, setSettings] = useState<SectionSettingsMap>(initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const router = useRouter();

  const handleStatusChange = (key: string, newStatus: SectionStatus) => {
    setSettings(prev => ({
      ...prev,
      [key]: { ...prev[key], status: newStatus }
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);
    try {
      const result = await updateSectionSettings(settings);
      if (result.success) {
        setMessage({ type: 'success', text: 'Configuración guardada exitosamente' });
        router.refresh();
      } else {
        setMessage({ type: 'error', text: 'Error al guardar la configuración' });
      }
    } catch (e) {
      setMessage({ type: 'error', text: 'Error inesperado al guardar' });
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusIcon = (status: SectionStatus) => {
    switch (status) {
      case "active": return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case "maintenance": return <Construction className="w-4 h-4 text-amber-500" />;
      case "hidden": return <EyeOff className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusLabel = (status: SectionStatus) => {
    switch (status) {
      case "active": return "Activo";
      case "maintenance": return "Mantenimiento";
      case "hidden": return "Oculto";
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto w-full">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <LayoutDashboard className="w-8 h-8 text-primary" />
          Control de Accesos
        </h1>
        <p className="text-muted-foreground mt-2">
          Administra qué secciones están disponibles para el equipo. Las secciones en mantenimiento u ocultas solo son accesibles para administradores.
        </p>
      </motion.div>

      {message && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`p-4 mb-6 rounded-xl border flex items-center gap-3 ${
            message.type === 'success' 
              ? 'bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400' 
              : 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400'
          }`}
        >
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
          <span className="font-medium">{message.text}</span>
        </motion.div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
        {Object.entries(settings).map(([path, config], idx) => (
          <motion.div
            key={path}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="glass p-5 rounded-2xl border border-border shadow-sm flex flex-col gap-4 relative overflow-hidden group"
          >
            {/* Background indicator */}
            <div className={`absolute top-0 left-0 w-1 h-full transition-colors ${
              config.status === 'active' ? 'bg-green-500' :
              config.status === 'maintenance' ? 'bg-amber-500' : 'bg-red-500'
            }`} />

            <div>
              <h3 className="font-semibold text-lg text-foreground flex items-center gap-2">
                {config.name}
              </h3>
              <p className="text-xs text-muted-foreground font-mono mt-1 truncate" title={path}>
                {path}
              </p>
            </div>

            <div className="flex gap-2 bg-muted/50 p-1 rounded-lg mt-auto">
              {(["active", "maintenance", "hidden"] as SectionStatus[]).map((s) => (
                <button
                  key={s}
                  onClick={() => handleStatusChange(path, s)}
                  className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-md text-xs font-medium transition-all ${
                    config.status === s 
                      ? 'bg-background shadow-sm text-foreground scale-100' 
                      : 'text-muted-foreground hover:bg-background/50 hover:text-foreground scale-95 opacity-70'
                  }`}
                >
                  {getStatusIcon(s)}
                  {getStatusLabel(s)}
                </button>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex justify-end"
      >
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-medium shadow-md shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-70 disabled:pointer-events-none"
        >
          {isSaving ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
            />
          ) : (
            <Save className="w-5 h-5" />
          )}
          Guardar Cambios
        </button>
      </motion.div>
    </div>
  );
}
