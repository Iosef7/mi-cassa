import { prisma } from '@/lib/prisma';
import TareasClient from './TareasClient';

export default async function TareasFetcher() {
  const [tasks, lists, users, leads, properties] = await Promise.all([
    prisma.task.findMany({
      take: 50,
      include: {
        agent: true,
        lead: true,
        list: true,
        property: true,
        subtasks: true,
        comments: {
          include: { user: true }
        },
        attachments: true,
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.taskList.findMany(),
    prisma.user.findMany({ select: { id: true, name: true, email: true, role: true } }),
    prisma.lead.findMany({ select: { id: true, name: true, email: true } }),
    prisma.property.findMany({
      select: { id: true, title: true } 
    })
  ]);

  const serializedTasks = tasks.map(task => ({
    ...task,
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
    dueDate: task.dueDate?.toISOString() || null,
    comments: task.comments.map(c => ({
      ...c,
      createdAt: c.createdAt.toISOString()
    }))
  }));

  return (
    <TareasClient 
      initialTasks={serializedTasks} 
      initialLists={lists} 
      initialAgents={users} 
      initialLeads={leads} 
      initialProperties={properties} 
    />
  );
}
