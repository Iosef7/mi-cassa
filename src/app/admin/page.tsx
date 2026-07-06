import React from 'react';
import { Home, Building, Users, Calendar, Phone, TrendingUp, Search, Plus, MoreHorizontal, MapPin } from 'lucide-react';
import Image from 'next/image';
import NotificationsDropdown from '@/components/NotificationsDropdown';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { DriveImagePreview } from '@/components/DriveImagePreview';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic'; // Ensure dashboard always fetches fresh data

export default async function Dashboard() {
  const session = await auth();
  const userName = session?.user?.name || 'Equipo';

  // Fetch real data in parallel
  const [
    activePropertiesCount,
    newLeadsCount,
    scheduledAppointmentsCount,
    closedSalesAggregate,
    pipelineLeads,
    recentCalls,
    featuredProperties
  ] = await Promise.all([
    prisma.property.count({ where: { status: 'DISPONIBLE' } }),
    prisma.lead.count({ where: { status: 'NUEVO' } }),
    prisma.appointment.count({ where: { status: 'PENDIENTE' } }),
    prisma.lead.aggregate({
      where: { status: 'CERRADO_GANADO' },
      _sum: { budget: true }
    }),
    prisma.lead.findMany({
      where: { status: { notIn: ['CERRADO_GANADO', 'PERDIDO'] } },
      take: 4,
      orderBy: { updatedAt: 'desc' },
      include: { property: true }
    }),
    prisma.call.findMany({
      take: 3,
      orderBy: { createdAt: 'desc' },
      include: { lead: true }
    }),
    prisma.property.findMany({
      take: 3,
      orderBy: { createdAt: 'desc' }
    })
  ]);

  const closedSalesAmount = Number(closedSalesAggregate._sum.budget || 0);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(val);
  };

  const getProgressByStatus = (status: string) => {
    switch (status) {
      case 'NUEVO': return 10;
      case 'CONTACTADO': return 25;
      case 'VISITA': return 50;
      case 'NEGOCIACION': return 75;
      case 'CERRADO_GANADO': return 100;
      default: return 0;
    }
  };

  const todayStr = new Intl.DateTimeFormat('es-MX', { dateStyle: 'long' }).format(new Date());

  return (
    <>
      {/* Top Navbar */}
      <header className="h-16 border-b border-border bg-background/80 backdrop-blur-md flex items-center justify-between px-8 z-10 sticky top-0 shrink-0">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50" />
          <input 
            type="text" 
            placeholder="Buscar clientes, propiedades, teléfonos..." 
            className="w-full pl-10 pr-4 py-2 rounded-full bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>
        <div className="flex items-center gap-4">
          <NotificationsDropdown />
          <Link href="/admin/propiedades/new" className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2 hover-lift">
            <Plus className="w-4 h-4" /> Nueva Propiedad
          </Link>
        </div>
      </header>

      {/* Dashboard Content */}
      <div className="flex-1 overflow-auto p-8">
        
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold">Hola, {userName} 👋</h2>
            <p className="text-foreground/60 mt-1">Aquí está el resumen de la inmobilaria para hoy.</p>
          </div>
          <div className="text-sm px-3 py-1 rounded-full bg-card border border-border capitalize">
            {todayStr}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard title="Propiedades Activas" value={activePropertiesCount.toString()} trend="En inventario" />
          <StatCard title="Nuevos Leads" value={newLeadsCount.toString()} trend="Sin contactar" />
          <StatCard title="Citas Pendientes" value={scheduledAppointmentsCount.toString()} trend="Próximos días" />
          <StatCard title="Ventas Cerradas" value={formatCurrency(closedSalesAmount)} trend="Valor total histórico" highlight />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Pipeline CRM Preview */}
          <div className="col-span-2 bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Pipeline Activo (CRM)</h3>
              <Link href="/admin/prospectos" className="text-primary text-sm font-medium hover:underline">Ver todo</Link>
            </div>
            <div className="space-y-4">
              {pipelineLeads.length > 0 ? pipelineLeads.map(lead => (
                <PipelineItem 
                  key={lead.id}
                  name={lead.name} 
                  status={lead.status} 
                  property={lead.property?.title || 'Sin propiedad asignada'} 
                  amount={lead.budget ? formatCurrency(Number(lead.budget)) : 'TBD'} 
                  progress={getProgressByStatus(lead.status)} 
                />
              )) : (
                <p className="text-sm text-foreground/50 py-4 text-center border border-dashed border-border rounded-xl">No hay prospectos activos.</p>
              )}
            </div>
          </div>

          {/* AI Calls Transcription preview */}
          <div className="col-span-1 bg-card border border-border rounded-2xl p-6 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Llamadas Recientes
              </h3>
            </div>
            
            <div className="flex-1 space-y-4">
              {recentCalls.length > 0 ? recentCalls.map(call => {
                const timeDiff = Math.floor((new Date().getTime() - new Date(call.createdAt).getTime()) / 1000 / 60);
                const timeStr = timeDiff < 60 ? `Hace ${timeDiff} min` : `Hace ${Math.floor(timeDiff/60)} h`;
                return (
                  <CallItem 
                    key={call.id}
                    caller={call.lead?.name || 'Desconocido'} 
                    time={timeStr} 
                    summary={call.summary || 'Sin resumen'}
                    aiAction={call.commitments ? "Compromiso Guardado" : "Resumen Guardado"}
                  />
                )
              }) : (
                <p className="text-sm text-foreground/50 py-4 text-center border border-dashed border-border rounded-xl">No hay llamadas recientes.</p>
              )}
            </div>

            <button className="w-full mt-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-background transition-colors">
              Ver todas las transcripciones
            </button>
          </div>
          
        </div>
        
        {/* Properties Showcase */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">Propiedades Recientes</h3>
            <Link href="/admin/propiedades" className="text-primary text-sm font-medium hover:underline">Ver catálogo completo</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProperties.length > 0 ? featuredProperties.map(prop => {
              let imageStr = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=600';
              try {
                const parsed = JSON.parse(prop.images || '[]');
                if (parsed.length > 0) imageStr = parsed[0];
              } catch(e) {}
              
              return (
                <PropertyCard 
                  key={prop.id}
                  title={prop.title} 
                  location={prop.location} 
                  price={formatCurrency(Number(prop.price))}
                  image={imageStr}
                />
              )
            }) : (
              <div className="col-span-3">
                <p className="text-sm text-foreground/50 py-8 text-center border border-dashed border-border rounded-xl">No hay propiedades registradas aún.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </>
  );
}

// Helper Components
const StatCard = React.memo(function StatCard({ title, value, trend, highlight = false }: { title: string, value: string, trend: string, highlight?: boolean }) {
  return (
    <div className={`p-6 rounded-2xl border ${highlight ? 'border-primary bg-primary/5' : 'border-border bg-card'} hover-lift`}>
      <p className="text-sm text-foreground/60 font-medium mb-1">{title}</p>
      <h4 className={`text-3xl font-bold ${highlight ? 'text-primary' : ''}`}>{value}</h4>
      <p className="text-xs text-foreground/50 mt-2">{trend}</p>
    </div>
  );
});

const PipelineItem = React.memo(function PipelineItem({ name, status, property, amount, progress }: { name: string, status: string, property: string, amount: string, progress: number }) {
  return (
    <div className="p-4 rounded-xl border border-border/50 bg-background/50 hover:bg-background transition-colors flex items-center justify-between">
      <div className="flex flex-col gap-1 w-1/3">
        <span className="font-semibold">{name}</span>
        <span className="text-xs text-foreground/60 truncate">{property}</span>
      </div>
      <div className="w-1/3 px-4">
        <div className="flex justify-between text-xs mb-1">
          <span className="truncate max-w-[80%]">{status}</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full bg-border rounded-full h-1.5">
          <div className="bg-primary h-1.5 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
      <div className="w-1/4 text-right">
        <span className="font-bold">{amount}</span>
      </div>
      <button className="p-2 hover:bg-border rounded-full transition-colors text-foreground/50">
        <MoreHorizontal className="w-4 h-4" />
      </button>
    </div>
  );
});

const CallItem = React.memo(function CallItem({ caller, time, summary, aiAction }: { caller: string, time: string, summary: string, aiAction: string }) {
  return (
    <div className="p-4 rounded-xl bg-background border border-border/50 text-sm relative">
      <div className="flex justify-between items-start mb-2">
        <span className="font-bold">{caller}</span>
        <span className="text-xs text-foreground/50">{time}</span>
      </div>
      <p className="text-foreground/70 text-xs mb-3 leading-relaxed line-clamp-2">{summary}</p>
      <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium">
        ✨ IA: {aiAction}
      </div>
    </div>
  );
});

const PropertyCard = React.memo(function PropertyCard({ title, location, price, image }: { title: string, location: string, price: string, image: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden hover-lift group cursor-pointer">
      <div className="h-48 overflow-hidden relative">
        <DriveImagePreview url={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute top-3 left-3 bg-card/80 backdrop-blur-md px-2 py-1 rounded text-xs font-bold">
          {price}
        </div>
      </div>
      <div className="p-4">
        <h4 className="font-bold text-lg mb-1 truncate">{title}</h4>
        <p className="text-foreground/60 text-sm flex items-center gap-1 truncate">
          <MapPin className="w-3 h-3 shrink-0" /> {location}
        </p>
      </div>
    </div>
  );
});
