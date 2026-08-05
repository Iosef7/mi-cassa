"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic,
  Sparkles,
  UploadCloud,
  RefreshCw,
  FileAudio,
  CheckCircle2,
  Copy,
  User,
  Calendar,
  DollarSign,
  ListTodo,
  AlertCircle,
  FileText,
  Clock,
  Play,
  Volume2,
  FolderSync
} from "lucide-react";
import { toast } from "sonner";

interface PlaudLog {
  id: string;
  title: string;
  source: string;
  processedAt: string;
  leadName: string;
  leadId: string;
  summaryPreview: string;
  commitmentsCount: number;
  audioUrl?: string;
  status: string;
}

interface PlaudMeeting {
  id: string;
  title: string;
  description?: string;
  scheduledAt: string;
  transcription?: string;
  summary?: string;
  keyPoints?: string;
  audioUrl?: string;
  lead?: { id: string; name: string; phone: string };
}

export default function PlaudAdminView() {
  const [logs, setLogs] = useState<PlaudLog[]>([]);
  const [meetings, setMeetings] = useState<PlaudMeeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncingDrive, setSyncingDrive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [driveFolderId, setDriveFolderId] = useState("");
  const [selectedMeeting, setSelectedMeeting] = useState<PlaudMeeting | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [transcriptionInput, setTranscriptionInput] = useState("");
  const [activeTab, setActiveTab] = useState<"auto" | "upload" | "history">("auto");

  const originUrl = typeof window !== "undefined" ? window.location.origin : "";
  const webhookUrl = `${originUrl}/api/plaud/webhook`;

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/plaud/logs");
      const data = await res.json();
      if (data.success) {
        setLogs(data.logs || []);
        setMeetings(data.meetings || []);
      }
    } catch (err) {
      console.error("Error al cargar historial:", err);
      toast.error("No se pudo cargar el historial de Plaud Pro.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleCopyWebhook = () => {
    navigator.clipboard.writeText(webhookUrl);
    toast.success("URL del Webhook copiada al portapapeles");
  };

  const handleDriveSync = async () => {
    try {
      setSyncingDrive(true);
      const res = await fetch("/api/plaud/drive-sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folderId: driveFolderId.trim() || undefined }),
      });
      const data = await res.json();
      if (data.success) {
        if (data.processedCount > 0) {
          toast.success(`¡Sincronización completada! ${data.processedCount} grabaciones procesadas con Gemini IA.`);
        } else {
          toast.info(data.message || "No se encontraron audios nuevos pendientes.");
        }
        fetchLogs();
      } else {
        toast.error(data.error || "Error al sincronizar con Google Drive");
      }
    } catch (err) {
      toast.error("Error conectando con el servidor");
    } finally {
      setSyncingDrive(false);
    }
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      toast.loading("Enviando audio a Gemini IA para transcripción y extracción...", { id: "uploading" });

      const res = await fetch("/api/plaud/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      toast.dismiss("uploading");

      if (data.success) {
        toast.success(`¡Audio procesado con éxito! Lead: ${data.leadName}`);
        fetchLogs();
        setActiveTab("history");
      } else {
        toast.error(data.error || "Error al procesar el audio");
      }
    } catch (err) {
      toast.dismiss("uploading");
      toast.error("Error subiendo el archivo");
    } finally {
      setUploading(false);
    }
  };

  const handleTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transcriptionInput.trim()) return;

    const formData = new FormData();
    formData.append("transcription", transcriptionInput);
    formData.append("title", "Transcripción Manual Plaud Pro");

    try {
      setUploading(true);
      toast.loading("Procesando transcripción con Gemini IA...", { id: "text-proc" });

      const res = await fetch("/api/plaud/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      toast.dismiss("text-proc");

      if (data.success) {
        toast.success(`¡Transcripción analizada! Cliente: ${data.leadName}`);
        setTranscriptionInput("");
        fetchLogs();
        setActiveTab("history");
      } else {
        toast.error(data.error || "Error al analizar la transcripción");
      }
    } catch (err) {
      toast.dismiss("text-proc");
      toast.error("Error al enviar");
    } finally {
      setUploading(false);
    }
  };

  const totalProcessed = logs.length;
  const totalTasks = logs.reduce((acc, curr) => acc + (curr.commitmentsCount || 0), 0);
  const estimatedSavingsUSD = (totalProcessed * 0.5).toFixed(2); // Estimated savings vs Plaud AI subscription

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass p-6 rounded-3xl border border-border shadow-xl bg-gradient-to-r from-primary/10 via-background to-secondary/10"
      >
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-primary/20 text-primary border border-primary/30 shadow-inner">
            <Mic className="w-8 h-8 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                Plaud Pro AI Hub
              </h1>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/10 text-green-500 border border-green-500/20 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Gemini 2.5 Audio AI
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Conexión directa del grabador Plaud Pro con Mi Cassa CRM (100% IA propia sin suscripciones)
            </p>
          </div>
        </div>

        <button
          onClick={fetchLogs}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-muted/60 hover:bg-muted text-foreground text-sm font-medium transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Actualizar
        </button>
      </motion.div>

      {/* METRICS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass p-5 rounded-2xl border border-border flex items-center gap-4 shadow-sm"
        >
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20">
            <FileAudio className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Audios Procesados</p>
            <p className="text-2xl font-bold text-foreground">{totalProcessed}</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass p-5 rounded-2xl border border-border flex items-center gap-4 shadow-sm"
        >
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Ahorro Est. Plaud AI</p>
            <p className="text-2xl font-bold text-emerald-500">${estimatedSavingsUSD} USD</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass p-5 rounded-2xl border border-border flex items-center gap-4 shadow-sm"
        >
          <div className="p-3 rounded-xl bg-purple-500/10 text-purple-500 border border-purple-500/20">
            <ListTodo className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Tareas Generadas</p>
            <p className="text-2xl font-bold text-foreground">{totalTasks}</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass p-5 rounded-2xl border border-border flex items-center gap-4 shadow-sm"
        >
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <User className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Leads Inmobiliarios</p>
            <p className="text-2xl font-bold text-foreground">Auto-Asignados</p>
          </div>
        </motion.div>
      </div>

      {/* TABS NAVIGATION */}
      <div className="flex border-b border-border gap-2">
        <button
          onClick={() => setActiveTab("auto")}
          className={`pb-3 px-4 font-semibold text-sm transition-all flex items-center gap-2 border-b-2 ${
            activeTab === "auto"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <FolderSync className="w-4 h-4" /> Sincronización Automática (Drive & Webhook)
        </button>
        <button
          onClick={() => setActiveTab("upload")}
          className={`pb-3 px-4 font-semibold text-sm transition-all flex items-center gap-2 border-b-2 ${
            activeTab === "upload"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <UploadCloud className="w-4 h-4" /> Carga Directa (Audio / Transcripción)
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`pb-3 px-4 font-semibold text-sm transition-all flex items-center gap-2 border-b-2 ${
            activeTab === "history"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Clock className="w-4 h-4" /> Historial de Grabaciones ({meetings.length})
        </button>
      </div>

      {/* TAB CONTENT: AUTO SYNC */}
      {activeTab === "auto" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid md:grid-cols-2 gap-6"
        >
          {/* Google Drive Scanner */}
          <div className="glass p-6 rounded-3xl border border-border space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500">
                <FolderSync className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-bold text-lg text-foreground">Sincronización con Google Drive</h2>
                <p className="text-xs text-muted-foreground">
                  Escanea la carpeta compartida donde Plaud guarda audios
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground">
                ID o Nombre de la Carpeta de Google Drive (Opcional)
              </label>
              <input
                type="text"
                value={driveFolderId}
                onChange={(e) => setDriveFolderId(e.target.value)}
                placeholder="Ejemplo: 1A2b3C4d5E6f... o deja en blanco"
                className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <button
              onClick={handleDriveSync}
              disabled={syncingDrive}
              className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-xl font-medium shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-98 transition-all disabled:opacity-50"
            >
              {syncingDrive ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <FolderSync className="w-5 h-5" />
              )}
              {syncingDrive ? "Escaneando Google Drive..." : "Escanear y Procesar Audios Nuevos"}
            </button>
          </div>

          {/* Webhook Configuration */}
          <div className="glass p-6 rounded-3xl border border-border space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-500">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-bold text-lg text-foreground">Endpoint Webhook API</h2>
                <p className="text-xs text-muted-foreground">
                  URL para conectar Zapier, Make o Webhooks automáticos
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground">
                URL de Webhook en Mi Cassa
              </label>
              <div className="flex items-center gap-2 bg-muted/60 p-2.5 rounded-xl border border-border">
                <code className="text-xs font-mono truncate text-foreground flex-1">
                  {webhookUrl}
                </code>
                <button
                  onClick={handleCopyWebhook}
                  className="p-2 rounded-lg bg-background text-foreground hover:bg-muted transition-colors shadow-sm"
                  title="Copiar URL"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 text-xs space-y-1 text-muted-foreground">
              <p className="font-semibold text-foreground">💡 ¿Cómo funciona?</p>
              <p>
                Cualquier payload enviado con transcripción o archivo de audio a esta URL será analizado instantáneamente por Gemini IA para actualizar el cliente en Mi Cassa.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* TAB CONTENT: DIRECT UPLOAD */}
      {activeTab === "upload" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid md:grid-cols-2 gap-6"
        >
          {/* Drag & Drop Audio File */}
          <div className="glass p-6 rounded-3xl border border-border space-y-4">
            <h2 className="font-bold text-lg text-foreground flex items-center gap-2">
              <FileAudio className="w-5 h-5 text-primary" />
              Subir Archivo de Audio RAW (.mp3, .wav, .m4a)
            </h2>
            <p className="text-xs text-muted-foreground">
              Arrastra el audio exportado desde Plaud Pro. Gemini IA lo procesará directamente.
            </p>

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragActive(false);
                handleFileUpload(e.dataTransfer.files);
              }}
              className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center gap-3 transition-all text-center ${
                dragActive
                  ? "border-primary bg-primary/10 scale-[1.02]"
                  : "border-border hover:border-primary/50 bg-muted/20"
              }`}
            >
              <UploadCloud className="w-12 h-12 text-primary animate-bounce" />
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Arrastra tu audio de Plaud Pro aquí
                </p>
                <p className="text-xs text-muted-foreground mt-1">Soporta .mp3, .wav, .m4a, .aac</p>
              </div>

              <label className="cursor-pointer bg-primary text-primary-foreground px-4 py-2 rounded-xl text-xs font-semibold shadow-md hover:scale-105 transition-all mt-2">
                Seleccionar Archivo
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            </div>
          </div>

          {/* Direct Text Transcription Input */}
          <div className="glass p-6 rounded-3xl border border-border space-y-4">
            <h2 className="font-bold text-lg text-foreground flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Pegar Transcripción en Texto
            </h2>
            <p className="text-xs text-muted-foreground">
              Si ya exportaste la transcripción en texto, pégala aquí para análisis inmediato.
            </p>

            <form onSubmit={handleTextSubmit} className="space-y-3">
              <textarea
                value={transcriptionInput}
                onChange={(e) => setTranscriptionInput(e.target.value)}
                placeholder="Pega el texto de la llamada o reunión aquí..."
                rows={6}
                className="w-full p-4 rounded-2xl bg-muted/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />

              <button
                type="submit"
                disabled={uploading || !transcriptionInput.trim()}
                className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-xl font-medium shadow-md hover:scale-[1.01] transition-all disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                Analizar con Gemini IA
              </button>
            </form>
          </div>
        </motion.div>
      )}

      {/* TAB CONTENT: HISTORY & MEETINGS */}
      {activeTab === "history" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h2 className="font-bold text-xl text-foreground flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Grabaciones y Reuniones Procesadas
          </h2>

          {meetings.length === 0 ? (
            <div className="glass p-12 rounded-3xl text-center border border-border text-muted-foreground space-y-2">
              <Mic className="w-12 h-12 mx-auto text-muted-foreground/50" />
              <p className="font-medium text-foreground">No hay grabaciones procesadas aún</p>
              <p className="text-xs">
                Escanea Google Drive o sube un audio en la pestaña de Carga Directa para comenzar.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {meetings.map((m) => (
                <motion.div
                  key={m.id}
                  whileHover={{ y: -3 }}
                  className="glass p-5 rounded-2xl border border-border shadow-sm flex flex-col justify-between gap-4 relative overflow-hidden"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                        Plaud Pro
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(m.scheduledAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="font-bold text-base text-foreground line-clamp-1">{m.title}</h3>

                    {m.lead && (
                      <div className="flex items-center gap-2 text-xs font-semibold text-primary bg-primary/5 p-2 rounded-xl">
                        <User className="w-3.5 h-3.5" />
                        {m.lead.name} ({m.lead.phone})
                      </div>
                    )}

                    <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                      {m.summary || m.description || "Resumen generado con Gemini IA"}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-border/50">
                    <button
                      onClick={() => setSelectedMeeting(m)}
                      className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                    >
                      <FileText className="w-3.5 h-3.5" /> Ver Transcripción Completa
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* MEETING DETAIL MODAL */}
      <AnimatePresence>
        {selectedMeeting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-background border border-border p-6 rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto space-y-4 shadow-2xl relative"
            >
              <button
                onClick={() => setSelectedMeeting(null)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground p-2"
              >
                ✕
              </button>

              <div className="flex items-center gap-2">
                <Mic className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-bold text-foreground">{selectedMeeting.title}</h2>
              </div>

              {selectedMeeting.audioUrl && (
                <div className="p-3 rounded-2xl bg-muted/50 border border-border">
                  <p className="text-xs font-semibold text-muted-foreground mb-1 flex items-center gap-1">
                    <Volume2 className="w-3.5 h-3.5" /> Audio Grabado
                  </p>
                  <audio controls className="w-full h-8">
                    <source src={selectedMeeting.audioUrl} />
                    Tu navegador no soporta reproductor de audio.
                  </audio>
                </div>
              )}

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Resumen Ejecutivo (Gemini IA)
                </h3>
                <p className="text-sm bg-muted/30 p-3 rounded-xl border border-border text-foreground">
                  {selectedMeeting.summary || selectedMeeting.description || "Sin resumen disponible"}
                </p>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Transcripción Completa
                </h3>
                <div className="text-xs font-mono bg-muted/50 p-4 rounded-2xl border border-border max-h-60 overflow-y-auto whitespace-pre-wrap leading-relaxed text-foreground">
                  {selectedMeeting.transcription || "Sin transcripción"}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
