"use client";

import React, { useState, useEffect } from "react";
import { 
  Calendar, 
  Clock, 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  Edit2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Smartphone,
  QrCode,
  X,
  Wifi,
  WifiOff
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";
import Swal from "sweetalert2";

interface Session {
  id: string;
  isConnected: boolean;
}

export default function WhatsAppStatusPage() {
  const [scheduledStatuses, setScheduledStatuses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sessions, setSessions] = useState<Session[]>([]);

  // Form state
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<{url: string, type: string}[]>([]);
  const [caption, setCaption] = useState("");
  const [dateStr, setDateStr] = useState("");
  const [timeStr, setTimeStr] = useState("");
  const [sendNow, setSendNow] = useState(true);
  
  // Selection
  const [sendToAll, setSendToAll] = useState(true);
  const [selectedSessions, setSelectedSessions] = useState<string[]>([]);

  // New Phone Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPhoneName, setNewPhoneName] = useState("");
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isLinking, setIsLinking] = useState(false);
  const [linkIntervalId, setLinkIntervalId] = useState<NodeJS.Timeout | null>(null);

  // Rename Session Modal
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [sessionToRename, setSessionToRename] = useState<string | null>(null);
  const [renameInput, setRenameInput] = useState("");
  const [isRenaming, setIsRenaming] = useState(false);

  useEffect(() => {
    fetchStatuses();
    fetchSessions();
  }, []);

  const fetchStatuses = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/whatsapp/status");
      const data = await res.json();
      setScheduledStatuses(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error("Error al cargar los estados programados.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSessions = async () => {
    try {
      const res = await fetch("/api/whatsapp/sessions");
      const data = await res.json();
      if (data.sessions) {
        setSessions(data.sessions);
      }
    } catch (error) {
      console.error("Error fetching sessions:", error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length > 0) {
      setFiles(prev => [...prev, ...selectedFiles]);
      const newPreviews = selectedFiles.map(file => ({
        url: URL.createObjectURL(file),
        type: file.type || ""
      }));
      setPreviews(prev => [...prev, ...newPreviews]);
    }
    // Limpiar el input para permitir seleccionar el mismo archivo de nuevo
    e.target.value = "";
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const toggleSessionSelection = (id: string) => {
    setSelectedSessions(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    if (!sendNow && (!dateStr || !timeStr)) {
      toast.error("Debes seleccionar fecha y hora de publicación o marcar Enviar Ahora.");
      return;
    }

    if (!sendToAll && selectedSessions.length === 0) {
      toast.error("Debes seleccionar al menos un teléfono para enviar.");
      return;
    }

    let publishAt = new Date();
    if (!sendNow) {
      publishAt = new Date(`${dateStr}T${timeStr}`);
      if (publishAt <= new Date()) {
        toast.error("La fecha y hora debe ser en el futuro.");
        return;
      }
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      files.forEach(file => formData.append("files", file));
      formData.append("caption", caption);
      
      if (!sendToAll) {
        formData.append("sessionIds", JSON.stringify(selectedSessions));
      }
      
      if (sendNow) {
        formData.append("publishAt", "now");
      } else {
        formData.append("publishAt", publishAt.toISOString());
      }

      const res = await fetch("/api/whatsapp/status", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        toast.success(sendNow ? "Estado enviado con éxito." : "Estado programado con éxito.");
        setFiles([]);
        setPreviews([]);
        setCaption("");
        setDateStr("");
        setTimeStr("");
        fetchStatuses();
      } else {
        const errorData = await res.json();
        toast.error(errorData.details || errorData.error || "Hubo un error al programar.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error de conexión al programar estado.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteStatus = async (id: string) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "Se cancelará la publicación de este estado.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No'
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`/api/whatsapp/status?id=${id}`, { method: 'DELETE' });
        if (res.ok) {
          toast.success("Estado cancelado.");
          fetchStatuses();
        } else {
          toast.error("No se pudo cancelar el estado.");
        }
      } catch (error) {
        toast.error("Error al cancelar.");
      }
    }
  };

  const handleDeleteSession = async (id: string) => {
    const result = await Swal.fire({
      title: '¿Desvincular teléfono?',
      text: `El teléfono "${id}" será desconectado.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, desvincular',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`/api/whatsapp/sessions/${id}`, { method: 'DELETE' });
        if (res.ok) {
          toast.success("Teléfono desvinculado.");
          fetchSessions();
        } else {
          toast.error("No se pudo desvincular.");
        }
      } catch (error) {
        toast.error("Error al desvincular.");
      }
    }
  };

  const openLinkModal = () => {
    setNewPhoneName("");
    setQrCode(null);
    setIsLinking(false);
    setIsModalOpen(true);
  };

  const closeLinkModal = () => {
    setIsModalOpen(false);
    if (linkIntervalId) clearInterval(linkIntervalId);
    setLinkIntervalId(null);
    fetchSessions(); // Refresh list when modal closes
  };

  const startLinking = async () => {
    if (!newPhoneName.trim()) {
      toast.error("Ingresa un nombre para el teléfono.");
      return;
    }
    
    // Normalize string to avoid filesystem issues
    const normalizedId = newPhoneName.trim().replace(/[^a-zA-Z0-9_-]/g, '_');
    
    setIsLinking(true);
    setQrCode(null);
    
    try {
      // Initialize session
      await fetch(`/api/whatsapp/sessions/${normalizedId}`);
      
      // Poll for QR code
      const interval = setInterval(async () => {
        try {
          const res = await fetch(`/api/whatsapp/sessions/${normalizedId}/qr`);
          const data = await res.json();
          
          if (data.connected) {
            clearInterval(interval);
            setQrCode(null);
            toast.success("¡Teléfono vinculado exitosamente!");
            closeLinkModal();
          } else if (data.qr) {
            setQrCode(data.qr);
          }
        } catch (e) {
          console.error("Polling error", e);
        }
      }, 3000);
      
      setLinkIntervalId(interval);
      
    } catch (e) {
      toast.error("Error al iniciar vinculación.");
      setIsLinking(false);
    }
  };

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (linkIntervalId) clearInterval(linkIntervalId);
    };
  }, [linkIntervalId]);

  const openRenameModal = (id: string) => {
    setSessionToRename(id);
    setRenameInput(id);
    setIsRenameModalOpen(true);
  };

  const closeRenameModal = () => {
    setIsRenameModalOpen(false);
    setSessionToRename(null);
    setRenameInput("");
  };

  const handleRenameSession = async () => {
    if (!sessionToRename || !renameInput.trim()) return;
    
    const newId = renameInput.trim().replace(/[^a-zA-Z0-9_-]/g, '_');
    
    if (newId === sessionToRename) {
      closeRenameModal();
      return;
    }

    try {
      setIsRenaming(true);
      const res = await fetch(`/api/whatsapp/sessions/${sessionToRename}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newId })
      });

      if (res.ok) {
        toast.success("Teléfono renombrado.");
        closeRenameModal();
        fetchSessions();
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || "No se pudo renombrar.");
      }
    } catch (error) {
      toast.error("Error al renombrar.");
    } finally {
      setIsRenaming(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Estados de WhatsApp</h1>
          <p className="text-muted-foreground mt-2">
            Vincula múltiples teléfonos y programa estados automáticos.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Columna Izquierda: Dispositivos Vinculados */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-blue-600" />
                Teléfonos
              </h2>
              <button 
                onClick={openLinkModal}
                className="text-sm font-medium bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
              >
                <Plus className="w-4 h-4" /> Vincular
              </button>
            </div>

            <div className="space-y-3">
              {sessions.length === 0 ? (
                <div className="text-center py-8 text-neutral-500 text-sm">
                  <Smartphone className="w-8 h-8 mx-auto mb-2 text-neutral-400 opacity-50" />
                  No hay teléfonos vinculados.
                </div>
              ) : (
                sessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-3 border border-neutral-100 dark:border-neutral-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${session.isConnected ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                        {session.isConnected ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className="font-medium text-sm flex items-center gap-2">
                          {session.id}
                          <button onClick={() => openRenameModal(session.id)} className="text-neutral-400 hover:text-blue-500 transition-colors" title="Renombrar">
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        </p>
                        <p className={`text-xs ${session.isConnected ? 'text-green-600' : 'text-red-500'}`}>
                          {session.isConnected ? 'Conectado' : 'Desconectado'}
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDeleteSession(session.id)}
                      className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
          
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-xl p-4 flex gap-3 text-amber-800 dark:text-amber-400 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold mb-1">Multi-Dispositivo Beta</p>
              <p>Puedes vincular tantos teléfonos de vendedores como quieras. Recuerda mantenerlos con internet para que envíen los estados a tiempo.</p>
            </div>
          </div>
        </div>

        {/* Columna Central y Derecha: Programación y Lista */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Formulario de Programación */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Plus className="w-5 h-5 text-green-600" />
              Enviar Nuevo Estado
            </h2>
            
            <div className="space-y-6">
              {/* Selección de Destinatarios */}
              <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-lg">
                <label className="block text-sm font-medium mb-3">¿A qué teléfonos se enviará el estado?</label>
                <div className="flex items-center gap-4 mb-4">
                  <label className="flex items-center gap-2 cursor-pointer text-sm">
                    <input 
                      type="radio" 
                      checked={sendToAll} 
                      onChange={() => setSendToAll(true)} 
                      className="text-green-600 focus:ring-green-600"
                    />
                    A todos los vinculados
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-sm">
                    <input 
                      type="radio" 
                      checked={!sendToAll} 
                      onChange={() => setSendToAll(false)}
                      className="text-green-600 focus:ring-green-600"
                    />
                    Seleccionar específicos
                  </label>
                </div>
                
                {!sendToAll && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-3 p-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-md">
                    {sessions.map(s => (
                      <label key={s.id} className="flex items-center gap-2 text-sm cursor-pointer p-1">
                        <input 
                          type="checkbox" 
                          checked={selectedSessions.includes(s.id)}
                          onChange={() => toggleSessionSelection(s.id)}
                          className="rounded text-green-600 focus:ring-green-600"
                        />
                        {s.id}
                      </label>
                    ))}
                    {sessions.length === 0 && (
                      <span className="text-xs text-neutral-500 col-span-3">No hay teléfonos para seleccionar.</span>
                    )}
                  </div>
                )}
              </div>

              {/* Imágenes y Videos */}
              <div>
                <label className="block text-sm font-medium mb-2">Imágenes o Videos (Opcional)</label>
                
                {previews.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mb-4">
                    {previews.map((prev, index) => (
                      <div key={index} className="relative w-full aspect-[9/16] rounded-lg overflow-hidden shadow-md border border-neutral-200 bg-black">
                        {prev?.type?.startsWith('video/') ? (
                          <video src={prev.url} className="w-full h-full object-cover" controls={false} />
                        ) : (
                          <img src={prev.url} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                        )}
                        <button 
                          type="button" 
                          onClick={(e) => { e.preventDefault(); removeFile(index); }}
                          className="absolute top-2 right-2 bg-black/50 p-1.5 rounded-full text-white hover:bg-red-500 transition-colors z-10"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors relative">
                  <ImageIcon className="w-8 h-8 text-neutral-400 mb-2" />
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Haz clic o arrastra para añadir {previews.length > 0 ? "más imágenes o videos" : "imágenes o videos"}
                  </p>
                  <input 
                    type="file" 
                    multiple
                    accept="image/*,video/*" 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleImageChange}
                  />
                </div>
              </div>

              {/* Texto */}
              <div>
                <label className="block text-sm font-medium mb-2">Texto (Caption)</label>
                <textarea 
                  className="w-full p-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-transparent focus:ring-2 focus:ring-green-500 outline-none transition-all min-h-[100px]"
                  placeholder="Escribe el texto del estado..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                ></textarea>
              </div>

              {/* Enviar Ahora Toggle */}
              <div className="flex items-center gap-3 bg-neutral-50 dark:bg-neutral-800/30 p-3 rounded-lg border border-neutral-100 dark:border-neutral-800">
                <input
                  type="checkbox"
                  id="sendNow"
                  checked={sendNow}
                  onChange={(e) => setSendNow(e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-600 cursor-pointer"
                />
                <label htmlFor="sendNow" className="text-sm font-medium cursor-pointer flex-1">
                  Enviar inmediatamente
                </label>
              </div>

              {/* Fecha y Hora (Condicional) */}
              {!sendNow && (
                <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center gap-1">
                      <Calendar className="w-4 h-4" /> Fecha
                    </label>
                    <input 
                      type="date" 
                      value={dateStr}
                      onChange={(e) => setDateStr(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-transparent focus:ring-2 focus:ring-green-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center gap-1">
                      <Clock className="w-4 h-4" /> Hora
                    </label>
                    <input 
                      type="time" 
                      value={timeStr}
                      onChange={(e) => setTimeStr(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-transparent focus:ring-2 focus:ring-green-500 outline-none transition-all"
                    />
                  </div>
                </div>
              )}

              <button 
                type="button" 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                {sendNow ? "Enviar Estado Ahora" : "Guardar y Programar"}
              </button>
            </div>
          </div>

          {/* Lista de Programados */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-neutral-500" />
              Historial y Programados
            </h2>
            
            <div className="space-y-4">
              {isLoading ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
                </div>
              ) : scheduledStatuses.length === 0 ? (
                <p className="text-sm text-neutral-500 text-center py-8 bg-neutral-50 dark:bg-neutral-800/30 rounded-lg">No hay estados programados.</p>
              ) : (
                scheduledStatuses.map(status => (
                  <div key={status.id} className="flex flex-col sm:flex-row items-start gap-4 p-4 border border-neutral-100 dark:border-neutral-800 rounded-lg hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors bg-neutral-50/50 dark:bg-neutral-800/10">
                    <div className="w-16 h-24 bg-neutral-200 dark:bg-neutral-800 rounded-md flex-shrink-0 overflow-hidden relative shadow-sm">
                       {(() => {
                         let imgUrl = null;
                         try {
                           const urls = JSON.parse(status.mediaUrls);
                           if (urls && urls.length > 0) imgUrl = urls[0];
                         } catch (e) {}
                         const isVideo = imgUrl && imgUrl.match(/\.(mp4|webm|ogg|mov)$/i);
                         return imgUrl ? (
                           isVideo ? (
                             <video src={imgUrl} className="w-full h-full object-cover" controls={false} />
                           ) : (
                             <img src={imgUrl} alt="Preview" className="w-full h-full object-cover" />
                           )
                         ) : (
                           <div className="w-full h-full flex items-center justify-center text-neutral-400 bg-neutral-100 dark:bg-neutral-800">
                             <ImageIcon className="w-6 h-6" />
                           </div>
                         );
                       })()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium line-clamp-2 mb-2">{status.caption || <span className="text-neutral-400 italic">Sin texto</span>}</p>
                      <div className="flex items-center gap-2 text-xs text-neutral-500 mb-3">
                        <Clock className="w-3.5 h-3.5" />
                        {status.publishAt ? format(new Date(status.publishAt), "PPP 'a las' p", { locale: es }) : format(new Date(status.createdAt || new Date()), "PPP 'a las' p", { locale: es })}
                      </div>
                      <div className="flex items-center gap-2">
                        {status.status === "SCHEDULED" ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                            Programado
                          </span>
                        ) : status.status === "FAILED" ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200" title={status.errorMessage}>
                            Error al Enviar
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                            Publicado
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <button 
                        onClick={() => handleDeleteStatus(status.id)}
                        className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal para Vincular Nuevo Teléfono */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-neutral-900 w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center justify-between p-4 border-b border-neutral-100 dark:border-neutral-800">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <QrCode className="w-5 h-5 text-green-600" />
                Vincular Teléfono
              </h3>
              <button onClick={closeLinkModal} className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              {!isLinking ? (
                <div className="space-y-4">
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Asigna un nombre descriptivo a este teléfono para identificarlo (ej. "Ventas Juan", "Soporte Central").
                  </p>
                  <div>
                    <label className="block text-sm font-medium mb-1">Nombre del Dispositivo</label>
                    <input 
                      type="text" 
                      value={newPhoneName}
                      onChange={(e) => setNewPhoneName(e.target.value)}
                      placeholder="Ej. Soporte Ventas"
                      className="w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent focus:ring-2 focus:ring-green-500 outline-none"
                    />
                  </div>
                  <button 
                    onClick={startLinking}
                    className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors mt-2"
                  >
                    Generar Código QR
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center space-y-4 py-4">
                  <h4 className="font-medium">Escanea este código con WhatsApp</h4>
                  
                  <div className="w-64 h-64 bg-white border-4 border-white rounded-xl shadow-sm flex items-center justify-center relative overflow-hidden">
                    {qrCode ? (
                      <img src={qrCode} alt="QR Code" className="w-full h-full object-contain" />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-neutral-400 gap-3">
                        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
                        <span className="text-sm">Generando QR...</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="text-sm text-neutral-500 max-w-[280px]">
                    <ol className="text-left list-decimal pl-4 space-y-1">
                      <li>Abre WhatsApp en tu teléfono</li>
                      <li>Ve a Configuración &gt; <b>Dispositivos vinculados</b></li>
                      <li>Toca <b>Vincular un dispositivo</b></li>
                      <li>Apunta la cámara a esta pantalla</li>
                    </ol>
                  </div>
                  
                  <button 
                    onClick={closeLinkModal}
                    className="text-sm text-red-500 hover:text-red-700 font-medium underline mt-2"
                  >
                    Cancelar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal para Renombrar Teléfono */}
      {isRenameModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-neutral-900 w-full max-w-sm rounded-2xl shadow-xl overflow-hidden border border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center justify-between p-4 border-b border-neutral-100 dark:border-neutral-800">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-blue-600" />
                Renombrar Teléfono
              </h3>
              <button onClick={closeRenameModal} className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Ingresa el nuevo nombre para este dispositivo. Se reconectará automáticamente.
                </p>
                <div>
                  <label className="block text-sm font-medium mb-1">Nuevo Nombre</label>
                  <input 
                    type="text" 
                    value={renameInput}
                    onChange={(e) => setRenameInput(e.target.value)}
                    placeholder="Ej. Soporte Ventas"
                    className="w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <button 
                  onClick={handleRenameSession}
                  disabled={isRenaming}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg font-medium transition-colors mt-2 flex justify-center items-center"
                >
                  {isRenaming ? <Loader2 className="w-5 h-5 animate-spin" /> : "Guardar Nombre"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
