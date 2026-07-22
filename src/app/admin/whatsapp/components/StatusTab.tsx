"use client";

import React, { useState, useEffect, useCallback } from "react";
import { 
  Calendar, 
  Clock, 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  Edit2,
  CheckCircle2,
  Loader2,
  X,
  ChevronRight,
  ChevronLeft
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";
import Image from "next/image";

interface Session {
  id: string;
  isConnected: boolean;
}

export default function StatusTab() {
  const [scheduledStatuses, setScheduledStatuses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sessions, setSessions] = useState<Session[]>([]);

  // Stepper State
  const [currentStep, setCurrentStep] = useState(1);

  // Form state
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<{url: string, type: string}[]>([]);
  const [caption, setCaption] = useState("");
  const [dateStr, setDateStr] = useState("");
  const [timeStr, setTimeStr] = useState("");
  const [expiresAtStr, setExpiresAtStr] = useState("");
  
  type ScheduleType = "now" | "once" | "multiple" | "recurring";
  const [scheduleType, setScheduleType] = useState<ScheduleType>("now");
  const [multipleSchedules, setMultipleSchedules] = useState<{date: string, time: string}[]>([{ date: "", time: "" }]);
  const [weeklySchedule, setWeeklySchedule] = useState<{dayOfWeek: number, time: string}[]>([]);
  const daysOfWeek = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  
  // Selection
  const [sendToAll, setSendToAll] = useState(true);
  const [selectedSessions, setSelectedSessions] = useState<string[]>([]);

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

  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length > 0) {
      setFiles(prev => [...prev, ...selectedFiles]);
      const newPreviews = selectedFiles.map(file => ({
        url: URL.createObjectURL(file),
        type: file.type || ""
      }));
      setPreviews(prev => [...prev, ...newPreviews]);
    }
    e.target.value = "";
  }, []);

  const removeFile = useCallback((index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  }, []);

  const toggleSessionSelection = useCallback((id: string) => {
    setSelectedSessions(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  }, []);

  const handleNextStep = () => {
    if (currentStep === 1) {
       if (files.length === 0 && !caption.trim()) {
         toast.error("Añade al menos una imagen, video o texto.");
         return;
       }
       setCurrentStep(2);
    } else if (currentStep === 2) {
       if (!sendToAll && selectedSessions.length === 0) {
         toast.error("Debes seleccionar al menos un teléfono para enviar.");
         return;
       }
       setCurrentStep(3);
    }
  }

  const handleSubmit = async () => {
    if (scheduleType === "once" && (!dateStr || !timeStr)) {
      toast.error("Selecciona fecha y hora.");
      return;
    }

    if (scheduleType === "multiple") {
      const valid = multipleSchedules.filter(s => s.date && s.time);
      if (valid.length === 0) {
        toast.error("Añade al menos una fecha y hora válida.");
        return;
      }
    }

    if (scheduleType === "recurring") {
      const valid = weeklySchedule.filter(w => w.time);
      if (valid.length === 0) {
        toast.error("Selecciona al menos un día y hora.");
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
      
      formData.append("scheduleType", scheduleType);
      
      if (expiresAtStr) {
        formData.append("expiresAt", expiresAtStr);
      }

      if (scheduleType === "once") {
        formData.append("dateStr", dateStr);
        formData.append("timeStr", timeStr);
      } else if (scheduleType === "multiple") {
        const valid = multipleSchedules.filter(s => s.date && s.time);
        formData.append("schedules", JSON.stringify(valid));
      } else if (scheduleType === "recurring") {
        const valid = weeklySchedule.filter(w => w.time);
        formData.append("weeklySchedule", JSON.stringify(valid));
      }

      const res = await fetch("/api/whatsapp/status", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        toast.success(scheduleType === "now" ? "Estado enviado con éxito." : "Estado programado con éxito.");
        setFiles([]);
        setPreviews([]);
        setCaption("");
        setDateStr("");
        setTimeStr("");
        setExpiresAtStr("");
        setMultipleSchedules([{ date: "", time: "" }]);
        setWeeklySchedule([]);
        setCurrentStep(1);
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
    const isConfirmed = window.confirm("¿Estás seguro?\nSe cancelará la publicación de este estado.");
    if (isConfirmed) {
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
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Formulario de Programación (Stepper) */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 border-b border-neutral-100 dark:border-neutral-800 pb-4 gap-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Plus className="w-5 h-5 text-green-600" />
            Crear Estado
          </h2>
          <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 hide-scrollbar">
            <span className={`whitespace-nowrap px-2.5 py-1 rounded-full transition-colors ${currentStep === 1 ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400' : 'text-neutral-400'}`}>1. Contenido</span>
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-neutral-300 flex-shrink-0" />
            <span className={`whitespace-nowrap px-2.5 py-1 rounded-full transition-colors ${currentStep === 2 ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400' : 'text-neutral-400'}`}>2. Destinos</span>
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-neutral-300 flex-shrink-0" />
            <span className={`whitespace-nowrap px-2.5 py-1 rounded-full transition-colors ${currentStep === 3 ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400' : 'text-neutral-400'}`}>3. Horario</span>
          </div>
        </div>
        
        <div className="space-y-6">
          {/* STEP 1: Contenido */}
          {currentStep === 1 && (
            <div className="animate-in slide-in-from-right-4 duration-300">
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Imágenes o Videos (Opcional)</label>
                {previews.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mb-4">
                    {previews.map((prev, index) => (
                      <div key={index} className="relative w-full aspect-[9/16] rounded-lg overflow-hidden shadow-md border border-neutral-200 bg-black group">
                        {prev?.type?.startsWith('video/') ? (
                          <video src={prev.url} className="w-full h-full object-cover" controls={false} />
                        ) : prev.type.startsWith('image/') ? (
                          <Image src={prev.url} alt={`Preview ${index}`} fill className="object-cover" />
                        ) : null}
                        <button 
                          type="button" 
                          onClick={(e) => { e.preventDefault(); removeFile(index); }}
                          className="absolute top-2 right-2 bg-black/50 p-1.5 rounded-full text-white hover:bg-red-500 opacity-0 group-hover:opacity-100 transition-all z-10"
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

              <div>
                <label className="block text-sm font-medium mb-2">Texto (Caption)</label>
                <textarea 
                  className="w-full p-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-transparent focus:ring-2 focus:ring-green-500 outline-none transition-all min-h-[100px]"
                  placeholder="Escribe el texto del estado..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                ></textarea>
              </div>

              <div className="mt-6 flex justify-end">
                <button 
                  onClick={handleNextStep}
                  className="px-6 py-2.5 bg-neutral-900 dark:bg-white text-white dark:text-black rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
                >
                  Siguiente <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Destinos */}
          {currentStep === 2 && (
            <div className="animate-in slide-in-from-right-4 duration-300">
              <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-lg">
                <label className="block text-sm font-medium mb-3">¿A qué teléfonos se enviará el estado?</label>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                  <label className="flex items-center gap-2 cursor-pointer text-sm">
                    <input 
                      type="radio" 
                      checked={sendToAll} 
                      onChange={() => setSendToAll(true)} 
                      className="text-green-600 focus:ring-green-600 accent-green-600 w-4 h-4"
                    />
                    A todos los vinculados
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-sm">
                    <input 
                      type="radio" 
                      checked={!sendToAll} 
                      onChange={() => setSendToAll(false)}
                      className="text-green-600 focus:ring-green-600 accent-green-600 w-4 h-4"
                    />
                    Seleccionar específicos
                  </label>
                </div>
                
                {!sendToAll && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-3 p-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-md">
                    {sessions.map(s => (
                      <label key={s.id} className="flex items-center gap-2 text-sm cursor-pointer p-1.5 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-md transition-colors">
                        <input 
                          type="checkbox" 
                          checked={selectedSessions.includes(s.id)}
                          onChange={() => toggleSessionSelection(s.id)}
                          className="rounded text-green-600 focus:ring-green-600 accent-green-600 w-4 h-4"
                        />
                        {s.id}
                      </label>
                    ))}
                    {sessions.length === 0 && (
                      <span className="text-xs text-neutral-500 col-span-3">No hay teléfonos vinculados.</span>
                    )}
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-between">
                <button 
                  onClick={() => setCurrentStep(1)}
                  className="px-6 py-2.5 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" /> Atrás
                </button>
                <button 
                  onClick={handleNextStep}
                  className="px-6 py-2.5 bg-neutral-900 dark:bg-white text-white dark:text-black rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
                >
                  Siguiente <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Horario */}
          {currentStep === 3 && (
            <div className="animate-in slide-in-from-right-4 duration-300">
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Cuándo enviar</label>
                <select 
                  value={scheduleType} 
                  onChange={(e) => setScheduleType(e.target.value as any)}
                  className="w-full p-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:ring-2 focus:ring-green-500 outline-none"
                >
                  <option value="now">Enviar inmediatamente</option>
                  <option value="once">Programar una fecha y hora única</option>
                  <option value="multiple">Programar varias fechas específicas</option>
                  <option value="recurring">Programación semanal recurrente</option>
                </select>
              </div>

              {scheduleType === "once" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
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

              {scheduleType === "multiple" && (
                <div className="space-y-3 mb-6">
                  {multipleSchedules.map((item, index) => (
                    <div key={index} className="flex flex-col sm:flex-row sm:items-end gap-3 p-3 sm:p-0 bg-neutral-50 dark:bg-neutral-800/30 sm:bg-transparent rounded-lg">
                      <div className="flex-1 w-full">
                        <label className="block text-xs font-medium mb-1">Fecha {index + 1}</label>
                        <input type="date" value={item.date} onChange={e => {
                          const newScheds = [...multipleSchedules];
                          newScheds[index].date = e.target.value;
                          setMultipleSchedules(newScheds);
                        }} className="w-full p-2 rounded-md border border-neutral-200 dark:border-neutral-700 bg-transparent" />
                      </div>
                      <div className="flex-1 w-full">
                        <label className="block text-xs font-medium mb-1">Hora {index + 1}</label>
                        <input type="time" value={item.time} onChange={e => {
                          const newScheds = [...multipleSchedules];
                          newScheds[index].time = e.target.value;
                          setMultipleSchedules(newScheds);
                        }} className="w-full p-2 rounded-md border border-neutral-200 dark:border-neutral-700 bg-transparent" />
                      </div>
                      {multipleSchedules.length > 1 && (
                        <button type="button" onClick={() => setMultipleSchedules(multipleSchedules.filter((_, i) => i !== index))} className="p-2 sm:mb-0.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md mt-2 sm:mt-0 w-full sm:w-auto flex justify-center">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button type="button" onClick={() => setMultipleSchedules([...multipleSchedules, {date: "", time: ""}])} className="text-sm text-green-600 font-medium flex items-center gap-1 hover:text-green-700">
                    <Plus className="w-4 h-4" /> Añadir otro día
                  </button>
                </div>
              )}

              {scheduleType === "recurring" && (
                <div className="space-y-3 mb-6">
                  <p className="text-sm text-neutral-500">Selecciona los días de la semana y a qué hora quieres que se envíe.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {daysOfWeek.map((dayName, dayIndex) => {
                      const isSelected = weeklySchedule.some(w => w.dayOfWeek === dayIndex);
                      const selectedTime = weeklySchedule.find(w => w.dayOfWeek === dayIndex)?.time || "";
                      return (
                        <div key={dayIndex} className="flex items-center gap-3 p-2 rounded-lg border border-neutral-100 dark:border-neutral-800">
                          <input type="checkbox" id={`day-${dayIndex}`} checked={isSelected} onChange={(e) => {
                            if (e.target.checked) setWeeklySchedule([...weeklySchedule, { dayOfWeek: dayIndex, time: "10:00" }]);
                            else setWeeklySchedule(weeklySchedule.filter(w => w.dayOfWeek !== dayIndex));
                          }} className="w-4 h-4 text-green-600 rounded accent-green-600" />
                          <label htmlFor={`day-${dayIndex}`} className="text-sm font-medium flex-1 cursor-pointer">{dayName}</label>
                          {isSelected && (
                            <input type="time" value={selectedTime} onChange={e => {
                              setWeeklySchedule(weeklySchedule.map(w => w.dayOfWeek === dayIndex ? { ...w, time: e.target.value } : w));
                            }} className="p-1.5 text-sm rounded-md border border-neutral-200 dark:border-neutral-700 bg-transparent w-24" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div className="pt-4 mt-4 border-t border-neutral-100 dark:border-neutral-800">
                    <label className="block text-sm font-medium mb-1">Fecha de Caducidad (Opcional)</label>
                    <p className="text-xs text-neutral-500 mb-2">Si dejas esto en blanco, se repetirá infinitamente.</p>
                    <input type="date" value={expiresAtStr} onChange={e => setExpiresAtStr(e.target.value)} className="w-full max-w-xs p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-transparent text-sm" />
                  </div>
                </div>
              )}

              <div className="mt-6 flex justify-between">
                <button 
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-2.5 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" /> Atrás
                </button>
                <button 
                  type="button" 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                  {scheduleType === "now" ? "Enviar Ahora" : "Guardar y Programar"}
                </button>
              </div>
            </div>
          )}
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
                          <div className="relative w-full h-full">
                            <Image src={imgUrl} alt="Preview" fill className="object-cover" />
                          </div>
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
