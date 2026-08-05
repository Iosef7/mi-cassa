'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Video, Calendar, Clock, User,  FileText, CheckCircle2, ArrowLeft, UploadCloud, Loader2, Building, MessageSquare, ShieldCheck, Check, Play, Settings, Globe, Tag, Users } from 'lucide-react';
import { GeminiIcon } from '@/components/icons/GeminiIcon';
import Link from 'next/link';
import MeetingMediaPlayer from '@/components/MeetingMediaPlayer';
import TaskMeetingCopilotModal from '@/components/TaskMeetingCopilotModal';
import EditMeetingModal from '@/components/EditMeetingModal';
import { processMeetingWithAiAction, applyCrmSuggestionsAction } from '@/actions/meetings';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface MeetingDetailClientViewProps {
  initialMeeting: any;
  users: any[];
  leads: any[];
  currentUserId: string;
}

export default function MeetingDetailClientView({ initialMeeting, users, leads, currentUserId }: MeetingDetailClientViewProps) {
  const router = useRouter();
  const [meeting, setMeeting] = useState(initialMeeting);
  const [transcriptionInput, setTranscriptionInput] = useState(meeting.transcription || '');
  const [customGlossary, setCustomGlossary] = useState(meeting.customGlossary || '');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedTaskForCopilot, setSelectedTaskForCopilot] = useState<any | null>(null);
  const [isApplyingCrm, setIsApplyingCrm] = useState(false);
  const [crmApplied, setCrmApplied] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const dateObj = new Date(meeting.scheduledAt);
  const formattedDate = dateObj.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const formattedTime = dateObj.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

  // Parse crmSuggestions
  let crmSuggestionsData: any = null;
  try {
    if (meeting.crmSuggestions) {
      crmSuggestionsData = JSON.parse(meeting.crmSuggestions);
    }
  } catch (e) {}

  const handleProcessAi = async () => {
    if (!transcriptionInput.trim()) {
      toast.error('Por favor ingresa o pega el texto de la transcripción');
      return;
    }

    setIsProcessing(true);
    const res = await processMeetingWithAiAction({
      meetingId: meeting.id,
      transcriptionText: transcriptionInput,
      customGlossary
    });
    setIsProcessing(false);

    if (res.success) {
      toast.success('Reunión analizada con IA. Tareas y minuta generadas.');
      router.refresh();
    } else {
      toast.error(res.error || 'Error procesando la reunión');
    }
  };

  const handleApplyCrm = async () => {
    if (!meeting.leadId || !crmSuggestionsData) return;

    setIsApplyingCrm(true);
    const res = await applyCrmSuggestionsAction({
      leadId: meeting.leadId,
      suggestedBudget: crmSuggestionsData.suggestedBudget,
      suggestedPreferences: crmSuggestionsData.suggestedPreferences,
      suggestedUrgency: crmSuggestionsData.suggestedUrgency
    });
    setIsApplyingCrm(false);

    if (res.success) {
      setCrmApplied(true);
      toast.success('Ficha del prospecto actualizada en el CRM con éxito');
    } else {
      toast.error(res.error || 'Error actualizando CRM');
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Navigation & Edit Action */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/reuniones"
          className="flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Volver al Hub de Reuniones</span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowEditModal(true)}
            className="px-4 py-2 bg-muted hover:bg-muted/80 text-foreground font-semibold text-xs rounded-xl flex items-center gap-2 transition-colors border border-border"
          >
            <Settings size={15} />
            <span>Editar Configuración</span>
          </button>

          {meeting.meetUrl && (
            <a
              href={meeting.meetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow flex items-center gap-2 transition-colors"
            >
              <Video size={16} />
              <span>Unirse a Google Meet</span>
            </a>
          )}
        </div>
      </div>

      {/* Header Card */}
      <div className="bg-card border border-border p-6 rounded-3xl shadow-sm glass space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-wider mb-1">
              <Calendar size={14} /> {formattedDate} a las {formattedTime} ({meeting.durationMinutes} min)
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-foreground">{meeting.title}</h1>
            {meeting.description && (
              <p className="text-sm text-muted-foreground mt-2">{meeting.description}</p>
            )}
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <span className="text-xs font-bold text-muted-foreground bg-muted px-3 py-1 rounded-full uppercase">
              {meeting.category || 'VENTA'}
            </span>

            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              meeting.status === 'FINALIZADA'
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
            }`}>
              {meeting.status}
            </span>
          </div>
        </div>

        {/* Ficha de Configuración y Detalles Rápidos */}
        <div className="pt-4 border-t border-border grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Globe size={15} className="text-indigo-500 shrink-0" />
            <span className="font-semibold text-foreground">Zona Horaria:</span>
            <span className="truncate">{meeting.timezone || 'America/Santiago'}</span>
          </div>

          {meeting.lead ? (
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium">
              <User size={15} className="shrink-0" />
              <span>Cliente: {meeting.lead.name} {meeting.lead.email ? `(${meeting.lead.email})` : ''} {meeting.lead.phone ? `[${meeting.lead.phone}]` : ''}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-muted-foreground">
              <User size={15} className="shrink-0" />
              <span>Sin Cliente Asociado (Reunión Interna)</span>
            </div>
          )}

          <div className="flex items-center gap-2 text-muted-foreground">
            <Users size={15} className="text-primary shrink-0" />
            <span className="font-semibold text-foreground">Equipo Staff:</span>
            <div className="flex items-center -space-x-2 overflow-hidden">
              {meeting.participants && meeting.participants.map((p: any) => {
                const uName = p.user?.name || p.user?.email || 'Staff';
                const initials = uName.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase();

                return (
                  <div
                    key={p.id}
                    title={uName}
                    className="relative w-7 h-7 rounded-full bg-primary/20 text-primary border-2 border-background flex items-center justify-center font-bold text-[10px] uppercase shadow-sm"
                  >
                    {p.user?.image ? (
                      <Image src={p.user.image} alt={uName} fill className="object-cover rounded-full" sizes="28px" />
                    ) : (
                      <span>{initials}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Left (Media & Transcripción), Right (Minuta, CRM & Tareas) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Media Player */}
          <MeetingMediaPlayer
            audioUrl={meeting.audioUrl}
            videoUrl={meeting.videoUrl}
            title={meeting.title}
          />

          {/* Transcripción & Glosario Editor */}
          <div className="bg-card border border-border p-6 rounded-3xl shadow-sm glass space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                <FileText size={18} className="text-primary" /> Transcripción & Glosario
              </h3>
              <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded">
                Glosario en Hebreo Activo
              </span>
            </div>

            {/* Glosario Editor */}
            <div>
              <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                Glosario de Términos en Hebreo
              </label>
              <textarea
                rows={4}
                value={customGlossary}
                onChange={e => setCustomGlossary(e.target.value)}
                className="w-full p-3 bg-muted/30 border border-border rounded-xl text-xs font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Textarea Transcripción */}
            <div>
              <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                Texto de la Transcripción de la Reunión
              </label>
              <textarea
                rows={10}
                value={transcriptionInput}
                onChange={e => setTranscriptionInput(e.target.value)}
                placeholder="Pega aquí el texto completo o la transcripción de Google Meet..."
                className="w-full p-3 bg-muted/30 border border-border rounded-xl text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <button
              onClick={handleProcessAi}
              disabled={isProcessing}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm rounded-xl shadow flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Diarizando y Analizando con Gemini 3.6...</span>
                </>
              ) : (
                <>
                  <GeminiIcon size={18} />
                  <span>Procesar Transcripción con IA</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Executive Summary */}
          {meeting.summary && (
            <div className="bg-card border border-border p-6 rounded-3xl shadow-sm glass space-y-3">
              <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                <GeminiIcon size={18} className="text-indigo-500" /> Minuta Ejecutiva y Acuerdos
              </h3>
              <p className="text-xs text-foreground leading-relaxed whitespace-pre-line bg-muted/30 p-4 rounded-2xl border border-border">
                {meeting.summary}
              </p>
            </div>
          )}

          {/* Sugerencias de CRM (Confirmación Humana) */}
          {crmSuggestionsData && (
            <div className="bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-blue-500/10 border border-emerald-500/30 p-6 rounded-3xl shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={20} className="text-emerald-500" />
                  <h3 className="font-bold text-base text-foreground">Sugerencias Extraídas para el CRM</h3>
                </div>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/20 px-2.5 py-0.5 rounded-full uppercase">
                  Revisión Humana 1-Click
                </span>
              </div>

              <p className="text-xs text-muted-foreground">
                La IA detectó nueva información sobre el cliente durante la conversación. Puedes revisar y confirmar estos cambios con un solo clic:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                {crmSuggestionsData.suggestedBudget && (
                  <div className="bg-card/80 p-3 rounded-xl border border-border">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Presupuesto Detectado</span>
                    <p className="font-bold text-foreground mt-0.5">${crmSuggestionsData.suggestedBudget.toLocaleString()}</p>
                  </div>
                )}

                {crmSuggestionsData.suggestedUrgency && (
                  <div className="bg-card/80 p-3 rounded-xl border border-border">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Nivel de Urgencia</span>
                    <p className="font-bold text-foreground mt-0.5">{crmSuggestionsData.suggestedUrgency}</p>
                  </div>
                )}

                {crmSuggestionsData.suggestedPreferences && (
                  <div className="bg-card/80 p-3 rounded-xl border border-border sm:col-span-3">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Preferencias de Propiedad</span>
                    <p className="font-medium text-foreground mt-0.5">{crmSuggestionsData.suggestedPreferences}</p>
                  </div>
                )}
              </div>

              {!crmApplied ? (
                <button
                  onClick={handleApplyCrm}
                  disabled={isApplyingCrm}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {isApplyingCrm ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Check size={16} />
                  )}
                  <span>Aprobar y Actualizar CRM del Cliente (1-Click)</span>
                </button>
              ) : (
                <div className="p-3 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-xl flex items-center justify-center gap-2">
                  <CheckCircle2 size={16} />
                  <span>Sugerencias aplicadas al CRM con éxito</span>
                </div>
              )}
            </div>
          )}

          {/* Tareas Asignadas de la Reunión */}
          <div className="bg-card border border-border p-6 rounded-3xl shadow-sm glass space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                <CheckCircle2 size={18} className="text-primary" /> Tareas Asignadas de la Reunión ({meeting.tasks?.length || 0})
              </h3>
            </div>

            {!meeting.tasks || meeting.tasks.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-6">
                No hay tareas asociadas a esta reunión. Procesa la transcripción para extraer compromisos automáticamente.
              </p>
            ) : (
              <div className="space-y-3">
                {meeting.tasks.map((task: any) => (
                  <div
                    key={task.id}
                    className="p-4 bg-muted/20 border border-border rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-muted/40 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                          task.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'
                        }`}>
                          {task.status}
                        </span>
                        <h4 className="font-bold text-sm text-foreground">{task.title}</h4>
                      </div>

                      {task.meetingExcerpt && (
                        <p className="text-xs text-muted-foreground italic">
                          "{task.meetingExcerpt}"
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground pt-1">
                        {task.agent && (
                          <span>Asignado a: <strong className="text-foreground">{task.agent.name}</strong></span>
                        )}
                        {task.property && (
                          <span>Propiedad: <strong className="text-foreground">{task.property.title}</strong></span>
                        )}
                      </div>
                    </div>

                    {/* Copiloto AI launcher */}
                    <button
                      onClick={() => setSelectedTaskForCopilot(task)}
                      className="px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors shrink-0"
                    >
                      <GeminiIcon size={14} />
                      <span>Asistente Copiloto IA</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Copiloto IA */}
      {selectedTaskForCopilot && (
        <TaskMeetingCopilotModal
          task={selectedTaskForCopilot}
          onClose={() => setSelectedTaskForCopilot(null)}
        />
      )}

      {/* Modal de Edición de Configuración */}
      {showEditModal && (
        <EditMeetingModal
          meeting={meeting}
          users={users}
          leads={leads}
          onClose={() => setShowEditModal(false)}
          onUpdated={() => {
            router.refresh();
          }}
        />
      )}
    </div>
  );
}
