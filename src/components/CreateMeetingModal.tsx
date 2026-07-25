'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Video, X, Calendar, Clock, Globe, Users, Loader2, Check, Tag } from 'lucide-react';
import { createMeetingAction } from '@/actions/meetings';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface UserItem {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  image?: string | null;
}

interface CreateMeetingModalProps {
  onClose: () => void;
  users: UserItem[];
  leads: Array<{ id: string; name: string; email: string | null; phone: string }>;
  currentUserId: string;
}

export default function CreateMeetingModal({ onClose, users, leads, currentUserId }: CreateMeetingModalProps) {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [timezone, setTimezone] = useState('America/Santiago');
  const [category, setCategory] = useState('VENTA');
  const [isPrivate, setIsPrivate] = useState(false);
  const [leadId, setLeadId] = useState('');
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([currentUserId]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Formatear fecha por defecto a mañana a las 10:00
    const now = new Date();
    now.setDate(now.getDate() + 1);
    now.setHours(10, 0, 0, 0);
    setScheduledAt(now.toISOString().slice(0, 16));
  }, []);

  const toggleUser = (userId: string) => {
    setSelectedUserIds(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const selectAllStaff = () => {
    setSelectedUserIds(users.map(u => u.id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !scheduledAt) {
      toast.error('Por favor completa el título y la fecha');
      return;
    }

    setIsSubmitting(true);

    const res = await createMeetingAction(
      {
        title,
        description,
        scheduledAt,
        durationMinutes,
        timezone,
        category,
        isPrivate,
        leadId: leadId || undefined,
        participantUserIds: selectedUserIds
      },
      currentUserId
    );

    setIsSubmitting(false);

    if (res.success) {
      toast.success('Reunión agendada e invitaciones enviadas');
      router.refresh();
      onClose();
    } else {
      toast.error(res.error || 'Error agendando la reunión');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-3 sm:p-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-card border border-border w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] h-[85vh] my-auto relative glass"
      >
        {/* Fixed Header */}
        <div className="p-5 border-b border-border bg-card/95 backdrop-blur-md shrink-0 flex items-center justify-between z-20">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/25 shrink-0">
              <Video size={20} />
            </div>
            <div>
              <h3 className="font-bold text-lg text-foreground tracking-tight">Programar Nueva Reunión Meet</h3>
              <p className="text-xs text-muted-foreground">Sincronización en tiempo real con Google Calendar y WhatsApp</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Container with Fixed Footer */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden min-h-0">
          {/* Scrollable Content Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 custom-scrollbar">
            {/* Título */}
            <div>
              <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-2">
                Título / Asunto de la Reunión *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Ej: Presentación de Propiedad Vitacura a Cliente"
                className="w-full px-4 py-2.5 bg-muted/30 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-background text-foreground transition-all"
              />
            </div>

            {/* Categoría & Prospecto */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Tag size={13} /> Categoría de la Reunión
                </label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-muted/30 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                >
                  <option value="VENTA">💼 Presentación de Venta</option>
                  <option value="LEGAL">⚖️ Revisión Legal / Contrato</option>
                  <option value="CAPACITACION">🎓 Capacitación de Equipo</option>
                  <option value="SEGUIMIENTO">📞 Seguimiento Comercial</option>
                  <option value="INTERNA">🏢 Reunión Interna</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-2">
                  Prospecto / Cliente Asociado (Opcional)
                </label>
                <select
                  value={leadId}
                  onChange={e => setLeadId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-muted/30 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                >
                  <option value="">-- Sin prospecto (Reunión Interna) --</option>
                  {leads.map(l => (
                    <option key={l.id} value={l.id}>
                      👤 {l.name} {l.email ? `(${l.email})` : ''} {l.phone ? `[${l.phone}]` : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Fecha, Hora, Duración y Zona Horaria */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Calendar size={14} className="text-primary" /> Fecha y Hora *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={scheduledAt}
                  onChange={e => setScheduledAt(e.target.value)}
                  className="w-full px-3 py-2 bg-muted/30 border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Clock size={14} className="text-primary" /> Duración
                </label>
                <select
                  value={durationMinutes}
                  onChange={e => setDurationMinutes(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-muted/30 border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                >
                  <option value={15}>15 Minutos</option>
                  <option value={30}>30 Minutos</option>
                  <option value={45}>45 Minutos</option>
                  <option value={60}>1 Hora</option>
                  <option value={90}>1.5 Horas</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Globe size={14} className="text-primary" /> Zona Horaria
                </label>
                <select
                  value={timezone}
                  onChange={e => setTimezone(e.target.value)}
                  className="w-full px-3 py-2 bg-muted/30 border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                >
                  <option value="America/Santiago">🇨🇱 Chile (CLT)</option>
                  <option value="Asia/Jerusalem">🇮🇱 Israel (IDT/IST)</option>
                  <option value="America/Mexico_City">🇲🇽 México (CDMX / CST)</option>
                  <option value="America/Argentina/Buenos_Aires">🇦🇷 Argentina (ART)</option>
                  <option value="America/Bogota">🇨🇴 Colombia / Perú (COT)</option>
                  <option value="America/New_York">🇺🇸 EE.UU. (EST)</option>
                  <option value="Europe/Madrid">🇪🇸 España (CET)</option>
                  <option value="UTC">🌐 UTC Universal</option>
                </select>
              </div>
            </div>

            {/* Selección Visual del Equipo Staff (Avatares y Perfiles) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Users size={14} className="text-primary" /> Integrantes del Equipo Involucrados
                </label>
                <button
                  type="button"
                  onClick={selectAllStaff}
                  className="text-xs text-primary font-bold hover:underline"
                >
                  Seleccionar Todo el Equipo
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-44 overflow-y-auto border border-border rounded-2xl p-3 bg-muted/20 custom-scrollbar">
                {users.map(u => {
                  const isSelected = selectedUserIds.includes(u.id);
                  const initials = u.name
                    ? u.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
                    : 'AG';

                  return (
                    <div
                      key={u.id}
                      onClick={() => toggleUser(u.id)}
                      className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all border ${
                        isSelected
                          ? 'bg-primary/10 border-primary/40 shadow-sm'
                          : 'bg-card hover:bg-muted/50 border-border opacity-70 hover:opacity-100'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {/* Avatar */}
                        <div className="relative w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs shrink-0 overflow-hidden shadow-inner border border-primary/20">
                          {u.image ? (
                            <Image src={u.image} alt={u.name || 'Avatar'} fill className="object-cover" sizes="32px" />
                          ) : (
                            <span>{initials}</span>
                          )}
                        </div>

                        {/* Name & Role */}
                        <div className="min-w-0">
                          <p className={`text-xs font-semibold truncate ${isSelected ? 'text-foreground font-bold' : 'text-muted-foreground'}`}>
                            {u.name || u.email}
                          </p>
                          <span className={`inline-block px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase mt-0.5 ${
                            u.role === 'ADMIN' ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400' : 'bg-muted text-muted-foreground'
                          }`}>
                            {u.role || 'AGENTE'}
                          </span>
                        </div>
                      </div>

                      {/* Checkbox indicator */}
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors shrink-0 ${
                        isSelected ? 'bg-primary text-primary-foreground shadow-sm' : 'border border-border bg-muted/40'
                      }`}>
                        {isSelected && <Check size={12} strokeWidth={3} />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Objetivos / Notas */}
            <div>
              <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-2">
                Notas u Objetivos de la Reunión
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Detalla los puntos principales a tratar en la sesión..."
                className="w-full px-4 py-2 bg-muted/30 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary text-foreground resize-none"
              />
            </div>
          </div>

          {/* Fixed Footer Buttons */}
          <div className="p-4 border-t border-border bg-card/95 backdrop-blur-md shrink-0 flex items-center justify-end gap-3 z-20">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-border hover:bg-muted text-muted-foreground text-sm font-semibold transition-colors"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-blue-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Generando Google Meet...</span>
                </>
              ) : (
                <>
                  <Video size={18} />
                  <span>Agendar y Sincronizar</span>
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
