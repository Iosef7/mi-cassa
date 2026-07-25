import React from 'react';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import MeetingDetailClientView from './MeetingDetailClientView';
import { auth } from '@/auth';

export const revalidate = 0;

export default async function MeetingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();

  const meeting = await prisma.meeting.findUnique({
    where: { id },
    include: {
      createdBy: { select: { id: true, name: true, image: true, email: true } },
      lead: true,
      participants: {
        include: {
          user: { select: { id: true, name: true, image: true, email: true, role: true } }
        }
      },
      tasks: {
        include: {
          agent: { select: { id: true, name: true, image: true } },
          property: { select: { id: true, title: true, location: true, price: true } },
          lead: { select: { id: true, name: true, phone: true } },
          meeting: true
        }
      }
    }
  });

  if (!meeting) return notFound();

  const users = await prisma.user.findMany({
    where: { isActive: true },
    select: { id: true, name: true, email: true, role: true, image: true }
  });

  const leads = await prisma.lead.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true, email: true, phone: true }
  });

  // Serializar campos Prisma (Decimal, Date) a JSON plano para Next.js Client Components
  return (
    <MeetingDetailClientView
      initialMeeting={JSON.parse(JSON.stringify(meeting))}
      users={JSON.parse(JSON.stringify(users))}
      leads={JSON.parse(JSON.stringify(leads))}
      currentUserId={session?.user?.id || ''}
    />
  );
}
