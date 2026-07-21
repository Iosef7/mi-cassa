"use client";

import React, { useState, memo, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Phone, CheckCircle, Users, Plus, Trash2, Calendar, Building, Bot, ArrowRight, Clock, AlertCircle, Home, Globe, MessageCircle } from 'lucide-react';
import ProspectActionMenu from './ProspectActionMenu';
import ProspectPagination from './ProspectPagination';
import dynamic from 'next/dynamic';
import { showConfirm, showToast } from '@/lib/alerts';
import Image from 'next/image';

const SmartMatchModal = dynamic(() => import('./SmartMatchModal'), { ssr: false });

interface Lead {
  id: string;
  name: string;
  phone: string;
  status: string;
  budget: any;
  source?: string;
  urgency?: string;
  propertyTypeOfInterest?: string;
  _count: { calls: number; tasks: number };
  agent?: { name: string; image: string | null } | null;
  property?: { id: string; title: string } | null;
  tasks?: { id: string; title: string; dueDate: Date | null }[];
  calls?: { summary: string | null; commitments: string | null }[];
}

interface ProspectTableViewProps {
  leads: Lead[];
  query: string;
  statusFilter: string;
  currentPage: number;
  totalPages: number;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'NUEVO': return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20';
    case 'CONTACTADO': return 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20';
    case 'VISITA_AGENDADA': 
    case 'VALORACION_PROPIEDAD': return 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20';
    case 'NEGOCIACION': 
    case 'NEGOCIACION_MANDATO': return 'bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-500/10 dark:text-pink-400 dark:border-pink-500/20';
    case 'FIRMA':
    case 'MANDATO_FIRMADO': return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20';
    case 'CERRADO_GANADO': 
    case 'PUBLICADO': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20';
    default: return 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20';
  }
};

const ProspectTableRow = memo(({ 
  lead, 
  isSelected, 
  onToggleSelect, 
  onOpenMatchModal 
}: { 
  lead: Lead, 
  isSelected: boolean, 
  onToggleSelect: (id: string) => void,
  onOpenMatchModal: (lead: {id: string, name: string}) => void 
}) => {
  return (
    <tr 
      onClick={() => onToggleSelect(lead.id)}
      className={`transition-colors group cursor-pointer ${isSelected ? 'bg-primary/5' : 'hover:bg-muted/30'}`}
    >
      <td className="px-4 py-4 w-12 text-center" onClick={(e) => e.stopPropagation()}>
        <input 
          type="checkbox" 
          className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer"
          checked={isSelected}
          onChange={() => onToggleSelect(lead.id)}
        />
      </td>
      <td className="px-2 py-4 relative group/lead">
        <div className="flex items-start gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-700 dark:text-blue-400 font-bold border border-blue-200 dark:border-blue-800 shrink-0">
              {lead.name.charAt(0).toUpperCase()}
            </div>
            {lead.urgency === 'Alta' && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-slate-900" title="Urgencia Alta"></span>
            )}
            {lead.urgency === 'Media' && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full border-2 border-white dark:border-slate-900" title="Urgencia Media"></span>
            )}
            {lead.urgency === 'Baja' && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full border-2 border-white dark:border-slate-900" title="Urgencia Baja"></span>
            )}
          </div>
          <div>
            <p className="font-medium text-foreground flex items-center gap-2">
              {lead.name}
              {lead.source && (
                <span className="inline-flex items-center text-[10px] uppercase font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-sm">
                  {lead.source.includes('whatsapp') ? <MessageCircle size={10} className="mr-1 text-green-500" /> : null}
                  {lead.source.includes('web') ? <Globe size={10} className="mr-1 text-blue-500" /> : null}
                  {lead.source}
                </span>
              )}
            </p>
            <p className="text-sm text-muted-foreground">{lead.phone}</p>
          </div>
        </div>

        {/* AI HoverCard */}
        {lead.calls && lead.calls.length > 0 && (lead.calls[0].summary || lead.calls[0].commitments) && (
          <div className="absolute left-10 top-14 z-50 w-80 opacity-0 invisible group-hover/lead:opacity-100 group-hover/lead:visible transition-all duration-300 transform translate-y-2 group-hover/lead:translate-y-0">
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2 text-blue-600 dark:text-blue-400">
                <Bot size={16} />
                <span className="text-xs font-semibold uppercase tracking-wider">Resumen de IA</span>
              </div>
              {lead.calls[0].summary && (
                <p className="text-sm text-slate-700 dark:text-slate-300 mb-3 line-clamp-3">
                  {lead.calls[0].summary}
                </p>
              )}
              {lead.calls[0].commitments && (
                <div className="bg-amber-50 dark:bg-amber-500/10 rounded-lg p-2.5 border border-amber-100 dark:border-amber-500/20">
                  <p className="text-xs font-semibold text-amber-800 dark:text-amber-400 mb-1 flex items-center gap-1.5">
                    <AlertCircle size={12} /> Último Compromiso
                  </p>
                  <p className="text-xs text-amber-700 dark:text-amber-300">
                    {lead.calls[0].commitments}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </td>
      <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(lead.status)}`}>
          {lead.status.replace('_', ' ')}
        </span>
      </td>
      <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
        {lead.property ? (
          <div className="flex flex-col">
            <span className="text-sm font-medium text-foreground flex items-center gap-1.5">
              <Building size={14} className="text-slate-400" />
              {lead.property.title}
            </span>
            <span className="text-xs text-muted-foreground mt-1">Presupuesto: {lead.budget ? `$${Number(lead.budget).toLocaleString()}` : '--'}</span>
          </div>
        ) : (
          <div className="flex flex-col gap-1.5">
            <span className="text-foreground font-medium">
              {lead.budget ? `$${Number(lead.budget).toLocaleString()}` : '--'}
            </span>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onOpenMatchModal({ id: lead.id, name: lead.name });
              }}
              className="text-xs inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-500/10 dark:hover:bg-indigo-500/20 px-2 py-1 rounded-md transition-colors w-fit"
            >
              <Home size={12} />
              Smart Match
            </button>
          </div>
        )}
      </td>
      <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
        {lead.tasks && lead.tasks.length > 0 ? (
          <div className="flex items-start gap-2">
            <Calendar size={16} className="text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200 line-clamp-1">{lead.tasks[0].title}</p>
              {lead.tasks[0].dueDate && (
                <p className="text-xs flex items-center gap-1 mt-0.5 text-amber-600 dark:text-amber-400">
                  <Clock size={10} /> 
                  {new Date(lead.tasks[0].dueDate).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-400 italic">Sin tareas</span>
            <button className="w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 transition-colors">
              <Plus size={14} />
            </button>
          </div>
        )}
      </td>
      <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-end gap-3">
          {lead.agent ? (
            <div className="flex items-center gap-2 mr-2" title={`Agente: ${lead.agent.name}`}>
              {lead.agent.image ? (
                <Image src={lead.agent.image} alt={lead.agent.name} width={28} height={28} className="rounded-full border border-slate-200 dark:border-slate-700" />
              ) : (
                <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-medium">
                  {lead.agent.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          ) : null}
          <Link 
            href={`/admin/prospectos/${lead.id}`}
            className="hidden md:inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 px-3 py-1.5 rounded-md transition-colors"
          >
            Ver Perfil <ArrowRight size={14} />
          </Link>
          <ProspectActionMenu leadId={lead.id} />
        </div>
      </td>
    </tr>
  );
});

export default function ProspectTableView({ leads, query, statusFilter, currentPage, totalPages }: ProspectTableViewProps) {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [matchModalOpen, setMatchModalOpen] = useState(false);
  const [selectedMatchLead, setSelectedMatchLead] = useState<{id: string, name: string} | null>(null);

  const toggleSelectAll = () => {
    if (selectedIds.size === leads.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(leads.map(l => l.id)));
    }
  };

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds(prev => {
      const newSelected = new Set(prev);
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.add(id);
      }
      return newSelected;
    });
  }, []);

  const handleOpenMatchModal = useCallback((lead: {id: string, name: string}) => {
    setSelectedMatchLead(lead);
    setMatchModalOpen(true);
  }, []);

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    
    if (await showConfirm('¿Eliminar prospectos?', `¿Estás seguro de que deseas eliminar estos ${selectedIds.size} prospectos? Esta acción no se puede deshacer.`, 'Sí, eliminar')) {
      setIsDeleting(true);
      try {
        const res = await fetch(`/api/leads/bulk`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids: Array.from(selectedIds) })
        });
        
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || 'Error al eliminar');
        }
        
        showToast(`${selectedIds.size} prospectos eliminados`, 'success');
        setSelectedIds(new Set());
        router.refresh(); // Fast refresh without full reload
      } catch (e: any) {
        showToast(e.message || 'Ocurrió un error al eliminar', 'error');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="bg-card rounded-xl shadow-sm border border-border flex flex-col relative">
      
      {/* Action Bar for Bulk Selection */}
      {selectedIds.size > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-900/30 p-3 flex items-center justify-between animate-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="bg-blue-600 dark:bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                {selectedIds.size}
              </span>
              <span className="text-sm font-medium text-slate-800 dark:text-blue-200">
                {selectedIds.size === 1 ? 'Prospecto seleccionado' : 'Prospectos seleccionados'}
              </span>
            </div>
            <div className="h-4 w-px bg-blue-200 dark:bg-blue-800 hidden sm:block"></div>
            <button 
              onClick={() => setSelectedIds(new Set())}
              className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors hidden sm:block"
            >
              Deseleccionar
            </button>
          </div>
          <button 
            onClick={handleBulkDelete}
            disabled={isDeleting}
            className="flex items-center gap-2 text-sm bg-red-600 text-white hover:bg-red-700 px-3 py-1.5 rounded-lg shadow-sm transition-colors disabled:opacity-50"
          >
            <Trash2 size={16} />
            <span>{isDeleting ? 'Eliminando...' : 'Eliminar Selección'}</span>
          </button>
        </div>
      )}

      <div className={`overflow-x-auto lg:overflow-visible transition-opacity duration-300 ${isDeleting ? 'opacity-50 pointer-events-none' : ''}`}>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted/50 border-b border-border text-muted-foreground text-sm">
              <th className="px-4 py-4 w-12 text-center">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer"
                  checked={leads.length > 0 && selectedIds.size === leads.length}
                  onChange={toggleSelectAll}
                />
              </th>
              <th className="px-2 py-4 font-medium">Nombre y Contacto</th>
              <th className="px-6 py-4 font-medium">Estado</th>
              <th className="px-6 py-4 font-medium">Propiedad / Presupuesto</th>
              <th className="px-6 py-4 font-medium">Próxima Acción</th>
              <th className="px-6 py-4 font-medium text-right">Agente / Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {leads.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-16">
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                      <Users size={32} className="text-slate-400 dark:text-slate-500" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">No hay prospectos</h3>
                    <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-6">
                      {query || statusFilter 
                        ? 'No se encontraron prospectos que coincidan con los filtros actuales.'
                        : 'Aún no tienes ningún prospecto registrado. ¡Comienza agregando tu primer cliente potencial!'}
                    </p>
                    <Link href="/admin/prospectos/nuevo" className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                      <Plus size={18} />
                      <span>Crear Prospecto</span>
                    </Link>
                  </div>
                </td>
              </tr>
            ) : (
              leads.map((lead) => (
                <ProspectTableRow 
                  key={lead.id} 
                  lead={lead} 
                  isSelected={selectedIds.has(lead.id)} 
                  onToggleSelect={toggleSelect} 
                  onOpenMatchModal={handleOpenMatchModal}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className={isDeleting ? 'opacity-50 pointer-events-none' : ''}>
        <ProspectPagination currentPage={currentPage} totalPages={totalPages} />
      </div>
      
      {/* Smart Match Modal */}
      {selectedMatchLead && (
        <SmartMatchModal 
          isOpen={matchModalOpen} 
          onClose={() => setMatchModalOpen(false)} 
          leadId={selectedMatchLead.id} 
          leadName={selectedMatchLead.name} 
        />
      )}
    </div>
  );
}
