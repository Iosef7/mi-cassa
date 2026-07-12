'use client';

import { useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Phone, CheckCircle, Calendar, Clock, Building, Globe, MessageCircle } from 'lucide-react';
import { updateLeadStatus } from './actions';
import Image from 'next/image';

interface Lead {
  id: string;
  name: string;
  phone: string;
  budget: any;
  status: string;
  source?: string;
  urgency?: string;
  _count: {
    calls: number;
    tasks: number;
  };
  agent?: { name: string; image: string | null } | null;
  property?: { id: string; title: string } | null;
  tasks?: { id: string; title: string; dueDate: Date | null }[];
}

interface KanbanBoardProps {
  initialLeads: Lead[];
  tab?: string;
}

const CLIENT_STATUSES = [
  { id: 'NUEVO', label: 'NUEVO', color: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20' },
  { id: 'CONTACTADO', label: 'CONTACTADO', color: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20' },
  { id: 'VISITA_AGENDADA', label: 'VISITA', color: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20' },
  { id: 'NEGOCIACION', label: 'NEGOCIACIÓN', color: 'bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-500/10 dark:text-pink-400 dark:border-pink-500/20' },
  { id: 'FIRMA', label: 'FIRMA', color: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20' },
  { id: 'CERRADO_GANADO', label: 'GANADO', color: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20' },
];

const PROPIETARIO_STATUSES = [
  { id: 'NUEVO', label: 'NUEVO', color: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20' },
  { id: 'CONTACTADO', label: 'CONTACTADO', color: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20' },
  { id: 'VALORACION_PROPIEDAD', label: 'VALORACIÓN', color: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20' },
  { id: 'NEGOCIACION_MANDATO', label: 'NEG. MANDATO', color: 'bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-500/10 dark:text-pink-400 dark:border-pink-500/20' },
  { id: 'MANDATO_FIRMADO', label: 'MANDATO', color: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20' },
  { id: 'PUBLICADO', label: 'PUBLICADO', color: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20' },
];

export default function ProspectKanbanBoard({ initialLeads, tab = 'clientes' }: KanbanBoardProps) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

  const STATUSES = tab === 'propietarios' ? PROPIETARIO_STATUSES : CLIENT_STATUSES;

  const handleDragStart = useCallback((e: React.DragEvent, id: string) => {
    setDraggedLeadId(id);
    e.dataTransfer.effectAllowed = 'move';
    // Firefox requires some data to be set
    e.dataTransfer.setData('text/plain', id);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, statusId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverColumn(prev => prev !== statusId ? statusId : prev);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOverColumn(null);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent, statusId: string) => {
    e.preventDefault();
    setDragOverColumn(null);
    
    if (!draggedLeadId) return;

    const leadToMove = leads.find(l => l.id === draggedLeadId);
    if (!leadToMove || leadToMove.status === statusId) {
      setDraggedLeadId(null);
      return;
    }

    // Optimistic update
    setLeads(prev => prev.map(l => l.id === draggedLeadId ? { ...l, status: statusId } : l));
    
    // Server update
    const result = await updateLeadStatus(draggedLeadId, statusId);
    if (!result.success) {
      // Revert if failed (simple version, ideally we'd show a toast)
      setLeads(initialLeads);
    }
    
    setDraggedLeadId(null);
  }, [draggedLeadId, leads, initialLeads]);

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 h-[calc(100vh-200px)] min-h-[500px] items-start">
      {STATUSES.map((status, colIndex) => {
        const columnLeads = leads.filter(l => l.status === status.id);
        const isDragOver = dragOverColumn === status.id;

        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: colIndex * 0.1, duration: 0.4 }}
            key={status.id}
            className={`flex-shrink-0 w-80 bg-slate-50 dark:bg-[#0d1117] rounded-xl flex flex-col max-h-full border-2 transition-colors ${
              isDragOver ? 'border-blue-400 dark:border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-transparent dark:border-slate-800'
            }`}
            onDragOver={(e) => handleDragOver(e, status.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, status.id)}
          >
            <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${status.color}`}>
                {status.label}
              </span>
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400 bg-white dark:bg-[#151b23] px-2 py-0.5 rounded-full shadow-sm border border-slate-200 dark:border-slate-700">
                {columnLeads.length}
              </span>
            </div>
            
            <div className="p-3 overflow-y-auto flex-1 flex flex-col gap-3">
              {columnLeads.map(lead => (
                <div
                  key={lead.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, lead.id)}
                  className="bg-white dark:bg-[#151b23] p-3 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 cursor-grab active:cursor-grabbing hover:border-blue-300 dark:hover:border-blue-500/50 transition-colors group"
                >
                  <div className="flex justify-between items-start mb-2 relative">
                    <div className="flex flex-col">
                      <Link href={`/admin/prospectos/${lead.id}`} className="font-medium text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        {lead.name}
                      </Link>
                      {lead.source && (
                        <span className="inline-flex items-center text-[9px] uppercase font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-sm mt-1 w-fit">
                          {lead.source.includes('whatsapp') ? <MessageCircle size={8} className="mr-1 text-green-500" /> : null}
                          {lead.source.includes('web') ? <Globe size={8} className="mr-1 text-blue-500" /> : null}
                          {lead.source}
                        </span>
                      )}
                    </div>
                    
                    <div className="relative shrink-0">
                      {lead.agent ? (
                        <div title={`Agente: ${lead.agent.name}`}>
                          {lead.agent.image ? (
                            <Image src={lead.agent.image} alt={lead.agent.name} width={28} height={28} className="rounded-full border border-slate-200 dark:border-slate-700 shadow-sm" />
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-xs text-indigo-700 dark:text-indigo-400 font-bold border border-indigo-200 dark:border-indigo-800 shadow-sm">
                              {lead.agent.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs text-slate-600 dark:text-slate-300 font-bold border border-slate-200 dark:border-slate-700">
                          {lead.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      
                      {/* Urgency Badge */}
                      {lead.urgency === 'Alta' && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-900" title="Urgencia Alta"></span>}
                      {lead.urgency === 'Media' && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full border-2 border-white dark:border-slate-900" title="Urgencia Media"></span>}
                    </div>
                  </div>
                  
                  {lead.property ? (
                    <div className="text-xs text-slate-600 dark:text-slate-400 mb-2 flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/50 p-1.5 rounded-md border border-slate-100 dark:border-slate-800">
                      <Building size={12} className="shrink-0" />
                      <span className="truncate">{lead.property.title}</span>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{lead.phone}</p>
                  )}

                  {lead.tasks && lead.tasks.length > 0 && (
                    <div className="mb-3 bg-amber-50 dark:bg-amber-500/10 rounded-md p-2 border border-amber-100 dark:border-amber-500/20">
                      <div className="flex items-start gap-1.5">
                        <Calendar size={12} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-medium text-amber-800 dark:text-amber-300 truncate">{lead.tasks[0].title}</p>
                          {lead.tasks[0].dueDate && (
                            <p className="text-[10px] text-amber-600/80 dark:text-amber-400/80 mt-0.5 flex items-center gap-1">
                              <Clock size={8} /> {new Date(lead.tasks[0].dueDate).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-100 dark:border-slate-800/50">
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      {lead.budget ? `$${Number(lead.budget).toLocaleString()}` : '--'}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1" title="Llamadas registradas">
                        <Phone size={12} className={lead._count.calls > 0 ? "text-blue-500 dark:text-blue-400" : ""} />
                        <span>{lead._count.calls}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
