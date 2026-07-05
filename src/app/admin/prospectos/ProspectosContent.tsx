import { prisma } from '@/lib/prisma';
import { Users, Target, CheckSquare, Inbox } from 'lucide-react';
import ProspectKanbanBoard from './ProspectKanbanBoard';
import ProspectTableView from './ProspectTableView';

export default async function ProspectosContent({
  query,
  status,
  page,
  view,
  tab = 'clientes',
}: {
  query: string;
  status: string;
  page: number;
  view: string;
  tab?: string;
}) {
  const limit = 10;
  
  // Base where clause
  const where: any = {};
  
  if (query) {
    where.OR = [
      { name: { contains: query, mode: 'insensitive' } },
      { email: { contains: query, mode: 'insensitive' } },
      { phone: { contains: query, mode: 'insensitive' } },
    ];
  }
  if (status) {
    where.status = status;
  }

  // Fetch paginated leads (only if view is list, if view is board we might need all matching leads without pagination, or maybe keep pagination?)
  const take = view === 'board' ? 200 : limit;
  const skip = view === 'board' ? 0 : (page - 1) * limit;

  // Parallelize the queries
  const [leads, totalLeads, allLeadsStats] = await Promise.all([
    prisma.lead.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take,
      include: {
        _count: {
          select: { calls: true, tasks: true }
        }
      }
    }),
    prisma.lead.count({ where }),
    prisma.lead.groupBy({
      by: ['status'],
      _count: { id: true },
      _sum: { budget: true }
    })
  ]);

  const totalPages = Math.ceil(totalLeads / limit);

  // KPIs
  const totalActivos = allLeadsStats.reduce((acc, curr) => acc + curr._count.id, 0);
  const totalNuevos = allLeadsStats.find(s => s.status === 'NUEVO')?._count.id || 0;
  const enNegociacion = allLeadsStats.find(s => s.status === 'NEGOCIACION')?._count.id || 0;
  const pipelineValue = allLeadsStats
    .filter(s => s.status !== 'CERRADO_GANADO')
    .reduce((acc, curr) => acc + Number(curr._sum.budget || 0), 0);

  const plainLeads = leads.map(lead => ({
    ...lead,
    budget: lead.budget ? Number(lead.budget) : null
  }));

  return (
    <>
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both">
        <div className="bg-card p-5 rounded-xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Prospectos</p>
            <h3 className="text-2xl font-bold text-foreground">{totalActivos}</h3>
          </div>
        </div>
        <div className="bg-card p-5 rounded-xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <Inbox size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Nuevos</p>
            <h3 className="text-2xl font-bold text-foreground">{totalNuevos}</h3>
          </div>
        </div>
        <div className="bg-card p-5 rounded-xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400">
            <Target size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">En Negociación</p>
            <h3 className="text-2xl font-bold text-foreground">{enNegociacion}</h3>
          </div>
        </div>
        <div className="bg-card p-5 rounded-xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <CheckSquare size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Valor Pipeline</p>
            <h3 className="text-2xl font-bold text-foreground">${pipelineValue.toLocaleString()}</h3>
          </div>
        </div>
      </div>

      {/* Content Area */}
      {view === 'board' ? (
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 fill-mode-both">
          <ProspectKanbanBoard initialLeads={plainLeads as any} tab={tab} />
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 fill-mode-both">
          <ProspectTableView leads={plainLeads as any} query={query} statusFilter={status} currentPage={page} totalPages={totalPages} />
        </div>
      )}
    </>
  );
}
