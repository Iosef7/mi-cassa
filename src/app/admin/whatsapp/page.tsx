"use client";

import React, { useState, useEffect } from "react";
import { 
  Calendar, 
  Clock, 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  CheckCircle2,
  AlertCircle,
  Loader2
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";
import Swal from "sweetalert2";

export default function WhatsAppStatusPage() {
  const [scheduledStatuses, setScheduledStatuses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [caption, setCaption] = useState("");
  const [dateStr, setDateStr] = useState("");
  const [timeStr, setTimeStr] = useState("");
  const [sendNow, setSendNow] = useState(true);

  useEffect(() => {
    fetchStatuses();
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length > 0) {
      setFiles(prev => [...prev, ...selectedFiles]);
      const urls = selectedFiles.map(file => URL.createObjectURL(file));
      setPreviews(prev => [...prev, ...urls]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!sendNow && (!dateStr || !timeStr)) {
      toast.error("Debes seleccionar fecha y hora de publicación o marcar Enviar Ahora.");
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
        // Limpiar formulario
        setFiles([]);
        setPreviews([]);
        setCaption("");
        setDateStr("");
        setTimeStr("");
        
        // Recargar lista
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

  const handleDelete = async (id: string) => {
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

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Estados de WhatsApp</h1>
          <p className="text-muted-foreground mt-2">
            Programa la subida automática de afiches y estados a tu cuenta de WhatsApp.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulario de Programación */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Plus className="w-5 h-5 text-green-600" />
            Programar Nuevo Estado
          </h2>
          
          <div className="space-y-6">
            {/* Imágenes */}
            <div>
              <label className="block text-sm font-medium mb-2">Imágenes / Videos (Opcional)</label>
              
              {previews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  {previews.map((prev, index) => (
                    <div key={index} className="relative w-full aspect-[9/16] rounded-lg overflow-hidden shadow-md">
                      <img src={prev} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                      <button 
                        type="button" 
                        onClick={(e) => { e.preventDefault(); removeFile(index); }}
                        className="absolute top-2 right-2 bg-black/50 p-1 rounded-full text-white hover:bg-red-500 transition-colors z-10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors relative">
                <ImageIcon className="w-10 h-10 text-neutral-400 mb-3" />
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Haz clic o arrastra imágenes aquí para añadir {previews.length > 0 ? "más" : ""}
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
                placeholder="Escribe el texto que acompañará al estado..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
              ></textarea>
            </div>

            {/* Enviar Ahora Toggle */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="sendNow"
                checked={sendNow}
                onChange={(e) => setSendNow(e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-600"
              />
              <label htmlFor="sendNow" className="text-sm font-medium cursor-pointer">
                Enviar inmediatamente ahora
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
              className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
              {sendNow ? "Enviar Ahora" : "Guardar y Programar"}
            </button>
          </div>
        </div>

        {/* Lista de Programados */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Próximos Estados
            </h2>
            
            <div className="space-y-4">
              {isLoading ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
                </div>
              ) : scheduledStatuses.length === 0 ? (
                <p className="text-sm text-neutral-500 text-center py-6">No hay estados programados.</p>
              ) : (
                scheduledStatuses.map(status => (
                  <div key={status.id} className="flex items-start gap-4 p-4 border border-neutral-100 dark:border-neutral-800 rounded-lg hover:border-green-200 dark:hover:border-green-900/50 transition-colors">
                    <div className="w-16 h-24 bg-neutral-100 dark:bg-neutral-800 rounded flex-shrink-0 overflow-hidden relative">
                       {(() => {
                         let imgUrl = null;
                         try {
                           const urls = JSON.parse(status.mediaUrls);
                           if (urls && urls.length > 0) imgUrl = urls[0];
                         } catch (e) {}
                         return imgUrl ? (
                           <img src={imgUrl} alt="Preview" className="w-full h-full object-cover" />
                         ) : (
                           <div className="w-full h-full flex items-center justify-center text-neutral-400">
                             <ImageIcon className="w-6 h-6" />
                           </div>
                         );
                       })()}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium line-clamp-2 mb-2">{status.caption || "(Sin texto)"}</p>
                      <div className="flex items-center gap-2 text-xs text-neutral-500 mb-3">
                        <Clock className="w-3.5 h-3.5" />
                        {status.publishAt ? format(new Date(status.publishAt), "PPP 'a las' p", { locale: es }) : format(new Date(status.createdAt || new Date()), "PPP 'a las' p", { locale: es })}
                      </div>
                      {status.status === "SCHEDULED" ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                          Programado
                        </span>
                      ) : status.status === "FAILED" ? (
                        <div className="flex flex-col gap-1 items-start">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                            Error
                          </span>
                          {status.errorMessage && <span className="text-xs text-red-500 font-medium">{status.errorMessage}</span>}
                        </div>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                          Publicado
                        </span>
                      )}
                    </div>
                    <div className="flex-shrink-0">
                      <button 
                        onClick={() => handleDelete(status.id)}
                        className="p-2 text-neutral-400 hover:text-red-500 transition-colors"
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
          
          {/* Advertencia técnica temporal */}
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-xl p-4 flex gap-3 text-amber-800 dark:text-amber-400 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold mb-1">Aviso Técnico Importante</p>
              <p>Actualmente el bot principal usa la API Oficial de Meta (que no permite subir estados). Para que el env&iacute;o de fondo funcione, estamos integrando un motor gratuito secundario (como Baileys).</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
