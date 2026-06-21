import React from 'react';
import { Home, Building, Users, Calendar, Phone, TrendingUp, Search, Plus, Bell, MoreHorizontal, MapPin } from 'lucide-react';

export default function Dashboard() {
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
          <button className="p-2 rounded-full hover:bg-border transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
          </button>
          <button className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2 hover-lift">
            <Plus className="w-4 h-4" /> Nueva Propiedad
          </button>
        </div>
      </header>

      {/* Dashboard Content */}
      <div className="flex-1 overflow-auto p-8">
        
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold">Hola, Equipo 👋</h2>
            <p className="text-foreground/60 mt-1">Aquí está el resumen de la inmobilaria para hoy.</p>
          </div>
          <div className="text-sm px-3 py-1 rounded-full bg-card border border-border">
            21 de Junio, 2026
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard title="Propiedades Activas" value="124" trend="+3 esta semana" />
          <StatCard title="Nuevos Leads (Meta)" value="45" trend="+12% vs mes pasado" />
          <StatCard title="Citas Programadas" value="12" trend="Para hoy y mañana" />
          <StatCard title="Ventas Cerradas" value="$4.2M" trend="Este trimestre" highlight />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Pipeline CRM Preview */}
          <div className="col-span-2 bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Pipeline Activo (CRM)</h3>
              <button className="text-primary text-sm font-medium hover:underline">Ver todo</button>
            </div>
            <div className="space-y-4">
              <PipelineItem name="Carlos Martínez" status="Negociación" property="Penthouse Polanco" amount="$1,200,000" progress={75} />
              <PipelineItem name="Laura Gómez" status="Firma de Contrato" property="Casa Lomas" amount="$850,000" progress={90} />
              <PipelineItem name="Roberto Sánchez" status="Visita Agendada" property="Depto Condesa" amount="$450,000" progress={30} />
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
              <CallItem 
                caller="+52 55 1234 5678" 
                time="Hace 10 min" 
                summary="Cliente interesado en la casa de zona sur. Generar tarea para enviarle fotos."
                aiAction="Tarea Creada"
              />
              <CallItem 
                caller="María Fernanda" 
                time="Hace 1 hora" 
                summary="Pregunta por comisiones de venta. Se le enviará el PDF con las políticas."
                aiAction="Resumen Guardado"
              />
            </div>

            <button className="w-full mt-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-background transition-colors">
              Ver todas las transcripciones
            </button>
          </div>
          
        </div>
        
        {/* Properties Showcase */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">Propiedades Destacadas</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <PropertyCard 
              title="Villa Contemporánea" 
              location="Jardines del Pedregal" 
              price="$1,500,000"
              image="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=600"
            />
            <PropertyCard 
              title="Departamento Luxury" 
              location="Polanco, CDMX" 
              price="$850,000"
              image="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=600"
            />
            <PropertyCard 
              title="Casa Estilo Colonial" 
              location="Coyoacán" 
              price="$1,100,000"
              image="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=600"
            />
          </div>
        </div>

      </div>
    </>
  );
}

// Helper Components
function NavItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <button className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${active ? 'bg-primary text-primary-foreground' : 'text-foreground/70 hover:bg-background hover:text-foreground'}`}>
      {React.cloneElement(icon as React.ReactElement, { className: "w-5 h-5" })}
      {label}
    </button>
  );
}

function StatCard({ title, value, trend, highlight = false }: { title: string, value: string, trend: string, highlight?: boolean }) {
  return (
    <div className={`p-6 rounded-2xl border ${highlight ? 'border-primary bg-primary/5' : 'border-border bg-card'} hover-lift`}>
      <p className="text-sm text-foreground/60 font-medium mb-1">{title}</p>
      <h4 className={`text-3xl font-bold ${highlight ? 'text-primary' : ''}`}>{value}</h4>
      <p className="text-xs text-foreground/50 mt-2">{trend}</p>
    </div>
  );
}

function PipelineItem({ name, status, property, amount, progress }: { name: string, status: string, property: string, amount: string, progress: number }) {
  return (
    <div className="p-4 rounded-xl border border-border/50 bg-background/50 hover:bg-background transition-colors flex items-center justify-between">
      <div className="flex flex-col gap-1 w-1/3">
        <span className="font-semibold">{name}</span>
        <span className="text-xs text-foreground/60">{property}</span>
      </div>
      <div className="w-1/3 px-4">
        <div className="flex justify-between text-xs mb-1">
          <span>{status}</span>
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
}

function CallItem({ caller, time, summary, aiAction }: { caller: string, time: string, summary: string, aiAction: string }) {
  return (
    <div className="p-4 rounded-xl bg-background border border-border/50 text-sm relative">
      <div className="flex justify-between items-start mb-2">
        <span className="font-bold">{caller}</span>
        <span className="text-xs text-foreground/50">{time}</span>
      </div>
      <p className="text-foreground/70 text-xs mb-3 leading-relaxed">{summary}</p>
      <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium">
        ✨ IA: {aiAction}
      </div>
    </div>
  );
}

function PropertyCard({ title, location, price, image }: { title: string, location: string, price: string, image: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden hover-lift group cursor-pointer">
      <div className="h-48 overflow-hidden relative">
        <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute top-3 left-3 bg-card/80 backdrop-blur-md px-2 py-1 rounded text-xs font-bold">
          {price}
        </div>
      </div>
      <div className="p-4">
        <h4 className="font-bold text-lg mb-1">{title}</h4>
        <p className="text-foreground/60 text-sm flex items-center gap-1">
          <MapPin className="w-3 h-3" /> {location}
        </p>
      </div>
    </div>
  );
}
