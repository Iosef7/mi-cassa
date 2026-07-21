import { prisma } from '@/lib/prisma';
import { Users, Target, CheckSquare, Inbox } from 'lucide-react';
import ProspectKanbanBoard from './ProspectKanbanBoard';
import ProspectTableView from './ProspectTableView';
import { cookies } from 'next/headers';
import { getDictionary } from '@/lib/i18n/dictionaries';

export default async function ProspectosContent({
  query,
  status,
  page,
  view,
  tab = 'compradores',
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
  
  if (tab === 'propietarios') {
    where.type = 'PROPIETARIO';
  } else if (tab === 'inquilinos') {
    where.type = 'INQUILINO';
  } else {
    where.type = { in: ['COMPRADOR', 'CLIENTE'] };
  }

  // Fetch paginated leads (only if view is list, if view is board we might need all matching leads without pagination, or maybe keep pagination?)
  const take = view === 'board' ? 200 : limit;
  const skip = view === 'board' ? 0 : (page - 1) * limit;

  // Parallelize the queries
  const [leads, totalLeads] = await Promise.all([
    prisma.lead.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        status: true,
        budget: true,
        source: true,
        urgency: true,
        createdAt: true,
        _count: {
          select: { calls: true, tasks: true }
        },
        agent: { select: { name: true, image: true } },
        property: { select: { id: true, title: true } },
        tasks: { where: { status: 'PENDIENTE' }, orderBy: { dueDate: 'asc' }, take: 1, select: { id: true, title: true, dueDate: true } },
        calls: { orderBy: { createdAt: 'desc' }, take: 1, select: { summary: true, commitments: true } }
      }
    }),
    prisma.lead.count({ where })
  ]);

  const totalPages = Math.ceil(totalLeads / limit);

  const plainLeads = leads.map(lead => ({
    ...lead,
    budget: lead.budget ? Number(lead.budget) : null
  }));

  const cookieStore = await cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value;
  const dict = getDictionary(locale);

  return (
    <>

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
