import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { ArrowLeft, User, Phone, Mail, Building, Tag, Banknote, Edit3 } from 'lucide-react';
import CallCard from '@/components/CallCard';
import UploadAudioTest from '@/components/UploadAudioTest';
import { notFound } from 'next/navigation';

export default async function ProspectoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const lead = await prisma.lead.findUnique({
    where: { id: id },
    include: {
      calls: {
        orderBy: { createdAt: 'desc' }
      },
      tasks: {
        orderBy: { createdAt: 'desc' }
      },
      appointments: {
        orderBy: { date: 'asc' }
      },
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 10
      },
      property: true,
      agent: true,
    }
  });

  if (!lead) {
    notFound();
  }

  const getStatusBadge = (status: string) => {
    return (
      <span className="bg-blue-100 text-blue-800 border border-blue-200 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
        {status.replace('_', ' ')}
      </span>
    );
  };

  return (
    <div className="p-8 overflow-auto">
      {/* Back Button */}
      <Link href="/prospectos" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-6 text-sm font-medium">
        <ArrowLeft size={16} />
        Volver a Prospectos
      </Link>

      {/* Header Profile */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8 flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-slate-800 flex items-center justify-center text-white text-3xl font-bold shadow-md">
            {lead.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-slate-900">{lead.name}</h1>
              {getStatusBadge(lead.status)}
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-slate-600">
              <span className="flex items-center gap-1.5"><Phone size={16} className="text-slate-400" /> {lead.phone}</span>
              {lead.email && <span className="flex items-center gap-1.5"><Mail size={16} className="text-slate-400" /> {lead.email}</span>}
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-medium transition-colors border border-slate-200">
            <Edit3 size={18} />
            Editar
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Details */}
        <div className="space-y-6">
          {/* Info Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <User size={18} className="text-blue-500" />
              Detalles del Cliente
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Presupuesto</p>
                <p className="text-slate-900 font-medium flex items-center gap-2 mt-1">
                  <Banknote size={16} className="text-green-600" />
                  {lead.budget ? `$${Number(lead.budget).toLocaleString()}` : 'No definido'}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Origen</p>
                <p className="text-slate-900 flex items-center gap-2 mt-1">
                  <Tag size={16} className="text-amber-500" />
                  {lead.source || 'Desconocido'}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Propiedad de Interés</p>
                <p className="text-slate-900 flex items-center gap-2 mt-1">
                  <Building size={16} className="text-purple-500" />
                  {lead.property ? lead.property.title : 'Ninguna seleccionada'}
                </p>
              </div>
              
              <div className="pt-4 border-t border-slate-100">
                <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Requiere Hipoteca (Mashkanta)</p>
                <p className="text-slate-900 font-medium mt-1">
                  {lead.requiresMortgage ? 'Sí' : 'No'}
                </p>
              </div>
              
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Preferencias</p>
                <p className="text-slate-900 text-sm mt-1 whitespace-pre-wrap bg-slate-50 p-3 rounded-lg border border-slate-100">
                  {lead.preferences ? JSON.parse(lead.preferences) : 'No especificadas'}
                </p>
              </div>
            </div>
          </div>

          {/* Notes Card */}
          <div className="bg-amber-50 rounded-xl border border-amber-200 p-6">
            <h3 className="font-semibold text-amber-900 mb-2">Notas Rápidas</h3>
            <p className="text-amber-800 text-sm whitespace-pre-wrap">
              {lead.notes || "No hay notas adicionales para este prospecto."}
            </p>
          </div>
        </div>

        {/* Right Column: AI Calls, WhatsApp & Activity */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Appointments Box */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Citas Agendadas</h2>
            {lead.appointments && lead.appointments.length > 0 ? (
              <div className="space-y-3">
                {lead.appointments.map(apt => (
                  <div key={apt.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <div>
                      <p className="font-semibold text-slate-900">{apt.title}</p>
                      <p className="text-sm text-slate-500">{new Date(apt.date).toLocaleString()}</p>
                    </div>
                    <span className="text-xs font-bold uppercase px-2 py-1 bg-slate-200 rounded text-slate-700">{apt.status}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-sm">No hay citas registradas.</p>
            )}
          </div>
          
          {/* Messages Box */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Últimos Mensajes (WhatsApp)</h2>
            {lead.messages && lead.messages.length > 0 ? (
              <div className="space-y-3">
                {lead.messages.map(msg => (
                  <div key={msg.id} className={`p-3 rounded-lg max-w-[80%] ${msg.fromBot ? 'bg-green-100 ml-auto' : 'bg-slate-100'}`}>
                    <p className="text-sm text-slate-800">{msg.content}</p>
                    <p className="text-[10px] text-slate-500 mt-1">{new Date(msg.createdAt).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-sm">No hay mensajes registrados.</p>
            )}
          </div>
          
          {/* Simulator Box */}
          <UploadAudioTest leadId={lead.id} leadPhone={lead.phone} />

          {/* Calls List */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Phone className="text-blue-500" />
              Historial de Llamadas ({lead.calls.length})
            </h2>

            {lead.calls.length === 0 ? (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center text-slate-500">
                Aún no hay llamadas registradas o procesadas por la IA para este prospecto.
              </div>
            ) : (
              <div className="space-y-6">
                {lead.calls.map((call) => (
                  <CallCard key={call.id} call={call} />
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
