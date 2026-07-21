import { prisma } from '@/lib/prisma';
import { Users, Target, CheckSquare, Inbox } from 'lucide-react';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { cookies } from 'next/headers';

export default async function ProspectosKPIs({ tab = 'compradores' }: { tab?: string }) {
  const where: any = {};
  if (tab === 'propietarios') {
    where.type = 'PROPIETARIO';
  } else if (tab === 'inquilinos') {
    where.type = 'INQUILINO';
  } else {
    where.type = { in: ['COMPRADOR', 'CLIENTE'] };
  }

  const allLeadsStats = await prisma.lead.groupBy({
    by: ['status'],
    where,
    _count: { id: true },
    _sum: { budget: true }
  });

  // KPIs
  const totalActivos = allLeadsStats.reduce((acc, curr) => acc + curr._count.id, 0);
  const totalNuevos = allLeadsStats.find(s => s.status === 'NUEVO')?._count.id || 0;
  const enNegociacion = allLeadsStats.find(s => s.status === 'NEGOCIACION')?._count.id || 0;
  const pipelineValue = allLeadsStats
    .filter(s => s.status !== 'CERRADO_GANADO')
    .reduce((acc, curr) => acc + Number(curr._sum.budget || 0), 0);

  const cookieStore = await cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value;
  const dict = getDictionary(locale);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both">
      <div className="bg-card p-5 rounded-xl border border-border shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
          <Users size={24} />
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">{dict.prospectsPage.totalProspects}</p>
          <h3 className="text-2xl font-bold text-foreground">{totalActivos}</h3>
        </div>
      </div>
      <div className="bg-card p-5 rounded-xl border border-border shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
          <Inbox size={24} />
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">{dict.prospectsPage.new}</p>
          <h3 className="text-2xl font-bold text-foreground">{totalNuevos}</h3>
        </div>
      </div>
      <div className="bg-card p-5 rounded-xl border border-border shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400">
          <Target size={24} />
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">{dict.prospectsPage.inNegotiation}</p>
          <h3 className="text-2xl font-bold text-foreground">{enNegociacion}</h3>
        </div>
      </div>
      <div className="bg-card p-5 rounded-xl border border-border shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400">
          <CheckSquare size={24} />
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">{dict.prospectsPage.pipelineValue}</p>
          <h3 className="text-2xl font-bold text-foreground">${pipelineValue.toLocaleString()}</h3>
        </div>
      </div>
    </div>
  );
}
