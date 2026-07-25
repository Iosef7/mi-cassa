'use client';

import React from 'react';
import { Video, Calendar, Clock, ArrowRight, User } from 'lucide-react';
import Link from 'next/link';

interface MeetingWidgetDashboardProps {
  upcomingMeeting?: {
    id: string;
    title: string;
    scheduledAt: Date | string;
    meetUrl?: string | null;
    lead?: { name: string } | null;
  } | null;
}

export default function MeetingWidgetDashboard({ upcomingMeeting }: MeetingWidgetDashboardProps) {
  if (!upcomingMeeting) return null;

  const dateObj = new Date(upcomingMeeting.scheduledAt);
  const formattedDate = dateObj.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
  const formattedTime = dateObj.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-primary text-white rounded-2xl p-5 shadow-lg relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="relative z-10 flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 text-white shadow-inner">
          <Video size={24} />
        </div>
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-blue-200">Próxima Reunión Agendada</span>
          <h4 className="text-lg font-bold truncate max-w-md">{upcomingMeeting.title}</h4>
          <div className="flex items-center gap-4 text-xs text-blue-100 mt-1">
            <span className="flex items-center gap-1"><Calendar size={13} /> {formattedDate}</span>
            <span className="flex items-center gap-1"><Clock size={13} /> {formattedTime}</span>
            {upcomingMeeting.lead && (
              <span className="flex items-center gap-1"><User size={13} /> {upcomingMeeting.lead.name}</span>
            )}
          </div>
        </div>
      </div>

      <div className="relative z-10 flex items-center gap-3 w-full md:w-auto">
        {upcomingMeeting.meetUrl && (
          <a
            href={upcomingMeeting.meetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 md:flex-initial px-5 py-2.5 bg-white text-blue-600 hover:bg-blue-50 font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Video size={16} />
            <span>Unirse a Meet</span>
          </a>
        )}
        <Link
          href={`/admin/reuniones/${upcomingMeeting.id}`}
          className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
          title="Ver detalle de la reunión"
        >
          <ArrowRight size={18} />
        </Link>
      </div>

      <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
    </div>
  );
}
