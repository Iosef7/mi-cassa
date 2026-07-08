import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Building2, MapPin, Users, Hammer, CheckCircle2, Clock } from "lucide-react";


function getStatusIcon(status: string) {
  switch (status) {
    case 'EVALUACION': return <Clock className="w-4 h-4 text-amber-500" />;
    case 'PLANIFICACION': return <Users className="w-4 h-4 text-blue-500" />;
    case 'EN_CONSTRUCCION': return <Hammer className="w-4 h-4 text-indigo-500" />;
    case 'TERMINADO': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
    default: return <Clock className="w-4 h-4 text-gray-500" />;
  }
}

function getStatusText(status: string) {
  switch (status) {
    case 'EVALUACION': return 'Evaluación';
    case 'PLANIFICACION': return 'Planificación';
    case 'EN_CONSTRUCCION': return 'En Construcción';
    case 'TERMINADO': return 'Terminado';
    default: return status;
  }
}

export default async function ProjectsFetcher() {
  const projects = await prisma.developmentProject.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { properties: true, tasks: true }
      }
    },
  });

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Proyectos Inmobiliarios
          </h1>
          <p className="text-muted-foreground mt-1">
            Gestiona desarrollos, acuerdos de combinación y grandes proyectos
          </p>
        </div>
        <Link href="/admin/proyectos/new">
          <button className="flex items-center bg-primary text-primary-foreground px-4 py-2 rounded-full shadow-lg hover:opacity-90 transition-all text-sm font-medium">
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Proyecto
          </button>
        </Link>
      </div>

      {/* Grid */}
      {projects.length === 0 ? (
        <div className="text-center py-20 border border-dashed rounded-2xl bg-card/50">
          <Building2 className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="text-lg font-medium">No hay proyectos</h3>
          <p className="text-muted-foreground max-w-sm mx-auto mt-2 mb-6">
            Comienza añadiendo un nuevo proyecto inmobiliario para gestionar su ciclo de vida completo.
          </p>
          <Link href="/admin/proyectos/new">
            <button className="px-4 py-2 bg-transparent border border-border rounded-full hover:bg-muted text-sm font-medium transition-colors">
              Crear el primer proyecto
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Link key={project.id} href={`/admin/proyectos/${project.id}`}>
              <div className="group rounded-2xl border border-border bg-card/40 hover:bg-card/80 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 overflow-hidden h-full flex flex-col cursor-pointer">
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-background border border-border/50 text-xs font-medium shadow-sm">
                      {getStatusIcon(project.status)}
                      <span>{getStatusText(project.status)}</span>
                    </div>
                    {project.ownershipShare && (
                      <span className="text-xs font-semibold text-muted-foreground bg-primary/10 text-primary px-2 py-1 rounded-full">
                        {project.ownershipShare}% Propiedad
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-1">
                    {project.name}
                  </h3>
                  
                  {project.location && (
                    <div className="flex items-center text-sm text-muted-foreground mb-4">
                      <MapPin className="w-3.5 h-3.5 mr-1.5 opacity-70" />
                      <span className="line-clamp-1">{project.location}</span>
                    </div>
                  )}

                  <div className="mt-auto grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Unidades</p>
                      <p className="font-medium">{project.totalUnits || '--'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Pisos</p>
                      <p className="font-medium">{project.floors || '--'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Propiedades Asociadas</p>
                      <p className="font-medium">{project._count.properties}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Tareas</p>
                      <p className="font-medium">{project._count.tasks}</p>
                    </div>
                  </div>
                </div>
                
                {/* Accent line at bottom */}
                <div className="h-1 w-full bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
