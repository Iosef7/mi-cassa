"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Phone, CheckCircle, Users, Plus, Trash2 } from 'lucide-react';
import ProspectActionMenu from './ProspectActionMenu';
import ProspectPagination from './ProspectPagination';
import { showConfirm, showToast } from '@/lib/alerts';

interface Lead {
  id: string;
  name: string;
  phone: string;
  status: string;
  budget: any;
  _count: { calls: number; tasks: number };
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

export default function ProspectTableView({ leads, query, statusFilter, currentPage, totalPages }: ProspectTableViewProps) {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);

  const toggleSelectAll = () => {
    if (selectedIds.size === leads.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(leads.map(l => l.id)));
    }
  };

  const toggleSelect = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

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
    <div className="bg-card rounded-xl shadow-sm border border-border flex flex-col relative overflow-hidden">
      
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

      <div className={`overflow-x-auto transition-opacity duration-300 ${isDeleting ? 'opacity-50 pointer-events-none' : ''}`}>
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
              <th className="px-6 py-4 font-medium">Presupuesto</th>
              <th className="px-6 py-4 font-medium">Actividad</th>
              <th className="px-6 py-4 font-medium text-right">Acciones</th>
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
              leads.map((lead) => {
                const isSelected = selectedIds.has(lead.id);
                return (
                  <tr 
                    key={lead.id} 
                    onClick={() => toggleSelect(lead.id)}
                    className={`transition-colors group cursor-pointer ${isSelected ? 'bg-primary/5' : 'hover:bg-muted/30'}`}
                  >
                    <td className="px-4 py-4 w-12 text-center" onClick={(e) => e.stopPropagation()}>
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer"
                        checked={isSelected}
                        onChange={() => toggleSelect(lead.id)}
                      />
                    </td>
                    <td className="px-2 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-bold border border-border shrink-0">
                          {lead.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{lead.name}</p>
                          <p className="text-sm text-muted-foreground">{lead.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(lead.status)}`}>
                        {lead.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                      <p className="text-foreground font-medium">
                        {lead.budget ? `$${Number(lead.budget).toLocaleString()}` : '--'}
                      </p>
                    </td>
                    <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5" title="Llamadas registradas">
                          <Phone size={14} className={lead._count.calls > 0 ? "text-blue-500 dark:text-blue-400" : ""} />
                          <span>{lead._count.calls}</span>
                        </div>
                        <div className="flex items-center gap-1.5" title="Tareas pendientes">
                          <CheckCircle size={14} className={lead._count.tasks > 0 ? "text-amber-500 dark:text-amber-400" : ""} />
                          <span>{lead._count.tasks}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          href={`/admin/prospectos/${lead.id}`}
                          className="hidden md:inline-block text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 px-3 py-1.5 rounded-md transition-colors"
                        >
                          Ver Perfil
                        </Link>
                        <ProspectActionMenu leadId={lead.id} />
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      <div className={isDeleting ? 'opacity-50 pointer-events-none' : ''}>
        <ProspectPagination currentPage={currentPage} totalPages={totalPages} />
      </div>
    </div>
  );
}
