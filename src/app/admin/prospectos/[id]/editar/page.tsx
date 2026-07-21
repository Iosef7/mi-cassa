import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import EditarProspectoForm from './EditarProspectoForm';

export default async function EditarProspectoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const lead = await prisma.lead.findUnique({
    where: { id: id }
  });

  if (!lead) {
    notFound();
  }

  const plainLead = {
    ...lead,
    budget: lead.budget ? lead.budget.toNumber() : null,
  };

  const users = await prisma.user.findMany({
    select: { id: true, name: true, role: true },
    orderBy: { name: 'asc' }
  });

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <EditarProspectoForm lead={plainLead} users={users} />
    </div>
  );
}
