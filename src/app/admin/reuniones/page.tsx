import React from 'react';
import { prisma } from '@/lib/prisma';
import MeetingsClientView from './MeetingsClientView';
import { auth } from '@/auth';

export const revalidate = 0;

export default async function ReunionesPage() {
  const session = await auth();
  const currentUserId = session?.user?.id || '';

  const meetings = await prisma.meeting.findMany({
    orderBy: { scheduledAt: 'desc' },
    include: {
      createdBy: { select: { id: true, name: true, image: true, email: true } },
      lead: { select: { id: true, name: true, phone: true, email: true } },
      participants: {
        include: {
          user: { select: { id: true, name: true, image: true, email: true, role: true } }
        }
      },
      tasks: {
        select: { id: true, title: true, status: true, assignedTo: true }
      }
    }
  });

  const users = await prisma.user.findMany({
    where: { isActive: true },
    select: { id: true, name: true, email: true, role: true, image: true }
  });

  const leads = await prisma.lead.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true, email: true, phone: true }
  });

  return (
    <MeetingsClientView
      initialMeetings={JSON.parse(JSON.stringify(meetings))}
      users={JSON.parse(JSON.stringify(users))}
      leads={JSON.parse(JSON.stringify(leads))}
      currentUserId={currentUserId}
    />
  );
}
