'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, Plus, Search, Calendar, Clock, User, Sparkles, Filter, ExternalLink, ArrowRight, Settings, Globe } from 'lucide-react';
import Link from 'next/link';
import CreateMeetingModal from '@/components/CreateMeetingModal';
import EditMeetingModal from '@/components/EditMeetingModal';
import { askGlobalMeetingsAiAction } from '@/actions/meetings';
import { toast } from 'sonner';

interface MeetingsClientViewProps {
  initialMeetings: any[];
  users: any[];
  leads: any[];
  currentUserId: string;
}

export default function MeetingsClientView({ initialMeetings, users, leads, currentUserId }: MeetingsClientViewProps) {
  const [meetings, setMeetings] = useState(initialMeetings);
  const [filterStatus, setFilterStatus] = useState<'TODAS' | 'PROGRAMADA' | 'FINALIZADA'>('TODAS');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<any | null>(null);

  // Búsqueda Semántica Global por IA
  const [aiSearchInput, setAiSearchInput] = useState('');
  const [aiSearchResult, setAiSearchResult] = useState<string | null>(null);
  const [isSearchingAi, setIsSearchingAi] = useState(false);

  const handleAiSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiSearchInput.trim() || isSearchingAi) return;

    setIsSearchingAi(true);
    setAiSearchResult(null);

    const res = await askGlobalMeetingsAiAction(aiSearchInput);
    setIsSearchingAi(false);

    if (res.success && res.answer) {
      setAiSearchResult(res.answer);
    } else {
      toast.error('Error procesando búsqueda semántica');
    }
  };

  const filteredMeetings = meetings.filter(m => {
    const matchesSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (m.lead?.name && m.lead.name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (filterStatus === 'TODAS') return matchesSearch;
    return matchesSearch && m.status === filterStatus;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card border border-border p-6 rounded-3xl shadow-sm glass">
        <div>
          <div className="flex items-center gap-2 text-primary font-semibold text-xs tracking-wider uppercase mb-1">
            <Video size={16} /> Hub de Reuniones Google Meet
          </div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Reuniones & Transcripciones IA</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Programa salas de Meet, procesa grabaciones con IA multilingüe y extrae tareas asignadas al equipo.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-blue-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all self-start md:self-auto"
        >
          <Plus size={18} />
          <span>Programar Nueva Reunión</span>
        </button>
      </div>

      {/* Búsqueda Semántica con IA */}
      <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-blue-500/10 border border-primary/20 p-5 rounded-3xl space-y-3">
        <form onSubmit={handleAiSearch} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-primary">
              <Sparkles size={18} />
            </div>
            <input
              type="text"
              value={aiSearchInput}
              onChange={e => setAiSearchInput(e.target.value)}
              placeholder='Pregúntale al historial de reuniones: "¿Qué descuento le ofrecimos a Juan?" o "¿Qué tareas quedaron pendientes del Tabu?"'
              className="w-full pl-10 pr-4 py-3 bg-background/80 backdrop-blur-md border border-border rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
            />
          </div>

          <button
            type="submit"
            disabled={isSearchingAi}
            className="w-full sm:w-auto px-5 py-3 bg-primary text-primary-foreground font-semibold text-xs sm:text-sm rounded-2xl flex items-center justify-center gap-2 shadow hover:bg-primary/90 transition-colors disabled:opacity-50 shrink-0"
          >
            {isSearchingAi ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
            <span>Buscar con IA</span>
          </button>
        </form>

        {aiSearchResult && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-card border border-border rounded-2xl text-xs text-foreground leading-relaxed shadow-sm"
          >
            <div className="font-bold text-primary mb-1 flex items-center gap-1.5">
              <Sparkles size={14} /> Respuesta de la IA:
            </div>
            <p className="whitespace-pre-line">{aiSearchResult}</p>
          </motion.div>
        )}
      </div>

      {/* Control Bar: Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Status Filters */}
        <div className="flex items-center gap-1.5 p-1 bg-muted/40 border border-border rounded-2xl w-full sm:w-auto">
          {(['TODAS', 'PROGRAMADA', 'FINALIZADA'] as const).map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                filterStatus === st
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {st === 'TODAS' ? 'Todas' : st === 'PROGRAMADA' ? 'Próximas' : 'Finalizadas'}
            </button>
          ))}
        </div>

        {/* Text Filter */}
        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Filtrar por título o cliente..."
            className="w-full pl-9 pr-4 py-2 bg-card border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
          />
        </div>
      </div>

      {/* Grid de Reuniones */}
      {filteredMeetings.length === 0 ? (
        <div className="p-12 text-center bg-card border border-border rounded-3xl">
          <Calendar size={36} className="mx-auto text-muted-foreground mb-3 opacity-40" />
          <h3 className="font-bold text-foreground text-sm">No hay reuniones encontradas</h3>
          <p className="text-xs text-muted-foreground mt-1">Prueba cambiando los filtros o programa una nueva reunión.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMeetings.map(m => {
            const isDone = m.status === 'FINALIZADA';
            const dateObj = new Date(m.scheduledAt);
            const dateStr = dateObj.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
            const timeStr = dateObj.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

            return (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border p-5 rounded-3xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between group relative overflow-hidden glass"
              >
                <div>
                  {/* Status Badge, Category & Edit Button */}
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                      isDone
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                        : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                    }`}>
                      {isDone ? 'Finalizada (Con IA)' : 'Programada'}
                    </span>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
                        {m.category || 'VENTA'}
                      </span>

                      {/* Edit Button */}
                      <button
                        onClick={() => setEditingMeeting(m)}
                        title="Editar Configuración de la Reunión"
                        className="p-1.5 rounded-lg bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Settings size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-foreground text-base group-hover:text-primary transition-colors line-clamp-2 mb-3">
                    {m.title}
                  </h3>

                  {/* Date, Timezone & Prospect */}
                  <div className="space-y-1.5 text-xs text-muted-foreground mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-primary" />
                      <span>{dateStr} a las {timeStr} ({m.durationMinutes} min)</span>
                    </div>

                    {m.timezone && (
                      <div className="flex items-center gap-2 text-[11px]">
                        <Globe size={13} className="text-indigo-500" />
                        <span>{m.timezone}</span>
                      </div>
                    )}

                    {m.lead && (
                      <div className="flex items-center gap-2 text-foreground font-medium">
                        <User size={14} className="text-emerald-500" />
                        <span>Cliente: {m.lead.name}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="pt-4 border-t border-border flex items-center justify-between gap-2 mt-2">
                  {m.meetUrl && (
                    <a
                      href={m.meetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Video size={14} />
                      <span>Meet</span>
                    </a>
                  )}

                  <Link
                    href={`/admin/reuniones/${m.id}`}
                    className="px-3.5 py-1.5 bg-muted hover:bg-muted/80 text-foreground rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ml-auto"
                  >
                    <span>Ver Ficha IA</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Modal de Creación */}
      {showCreateModal && (
        <CreateMeetingModal
          onClose={() => setShowCreateModal(false)}
          users={users}
          leads={leads}
          currentUserId={currentUserId}
        />
      )}

      {/* Modal de Edición */}
      {editingMeeting && (
        <EditMeetingModal
          meeting={editingMeeting}
          users={users}
          leads={leads}
          onClose={() => setEditingMeeting(null)}
          onUpdated={() => {
            // Actualizar reunión localmente
            setMeetings(prev => prev.map(m => m.id === editingMeeting.id ? { ...m, ...editingMeeting } : m));
          }}
        />
      )}
    </div>
  );
}
