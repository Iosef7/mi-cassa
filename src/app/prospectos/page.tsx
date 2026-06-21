import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Search, Plus, Phone, Calendar, CheckCircle, Clock } from 'lucide-react';

export default async function ProspectosPage() {
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { calls: true, tasks: true }
      }
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NUEVO': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'CONTACTADO': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'VISITA_AGENDADA': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'NEGOCIACION': return 'bg-pink-100 text-pink-800 border-pink-200';
      case 'CERRADO_GANADO': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="p-8 overflow-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Prospectos</h1>
          <p className="text-slate-500 mt-1">Gestiona tus clientes potenciales y llamadas.</p>
        </div>
        <button className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors shadow-sm">
          <Plus size={18} />
          <span>Nuevo Prospecto</span>
        </button>
      </div>

      {/* Stats/Filters Bar */}
      <div className="flex flex-wrap items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-8 gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por nombre, teléfono o email..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all"
          />
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 px-3 py-1.5 rounded-md border border-slate-200">
            <span className="font-semibold text-slate-900">{leads.length}</span> Total
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm">
                <th className="px-6 py-4 font-medium">Nombre y Contacto</th>
                <th className="px-6 py-4 font-medium">Estado</th>
                <th className="px-6 py-4 font-medium">Presupuesto</th>
                <th className="px-6 py-4 font-medium">Actividad</th>
                <th className="px-6 py-4 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    No hay prospectos registrados aún.
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold border border-slate-200">
                          {lead.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{lead.name}</p>
                          <p className="text-sm text-slate-500">{lead.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(lead.status)}`}>
                        {lead.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-900 font-medium">
                        {lead.budget ? `$${Number(lead.budget).toLocaleString()}` : '--'}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <div className="flex items-center gap-1.5" title="Llamadas registradas">
                          <Phone size={14} className={lead._count.calls > 0 ? "text-blue-500" : ""} />
                          <span>{lead._count.calls}</span>
                        </div>
                        <div className="flex items-center gap-1.5" title="Tareas pendientes">
                          <CheckCircle size={14} className={lead._count.tasks > 0 ? "text-amber-500" : ""} />
                          <span>{lead._count.tasks}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link 
                        href={`/prospectos/${lead.id}`}
                        className="inline-block text-sm font-medium text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md transition-colors"
                      >
                        Ver Perfil
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
