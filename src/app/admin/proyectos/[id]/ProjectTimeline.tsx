"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Clock, CircleDashed, FileSearch, HardHat, FileSignature, Sparkles, Building, Play } from "lucide-react";

interface ProjectTimelineProps {
  currentStatus: string;
}

const timelineSteps = [
  { id: "EVALUACION", label: "Evaluación", icon: FileSearch, desc: "Análisis de viabilidad inicial" },
  { id: "PLANIFICACION", label: "Planos y T.B.A.", icon: FileSignature, desc: "Aprobación de comité local" },
  { id: "PERMISOS", label: "Permiso de Construcción", icon: Clock, desc: "Trámites y derechos" },
  { id: "DEMOLICION", label: "Demolición y Evacuación", icon: HardHat, desc: "Preparación del terreno" },
  { id: "EN_CONSTRUCCION", label: "En Construcción", icon: Building, desc: "Ejecución de obra" },
  { id: "TERMINADO", label: "Entrega de Llaves", icon: Sparkles, desc: "Proyecto completado" },
];

export default function ProjectTimeline({ currentStatus }: ProjectTimelineProps) {
  // Encontramos el índice actual para saber qué pasos ya pasaron
  const currentIndex = timelineSteps.findIndex(step => step.id === currentStatus);
  const activeIndex = currentIndex === -1 ? 0 : currentIndex; // Fallback si el status no coincide exacto

  return (
    <div className="py-8 animate-in fade-in">
      <div className="relative">
        {/* Línea conectora de fondo */}
        <div className="absolute top-[28px] left-[5%] right-[5%] h-1 bg-border rounded-full" />
        
        {/* Línea conectora de progreso (animada) */}
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${(activeIndex / (timelineSteps.length - 1)) * 90 + 5}%` }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute top-[28px] left-0 h-1 bg-primary rounded-full z-0"
        />

        <div className="relative z-10 flex justify-between items-start">
          {timelineSteps.map((step, index) => {
            const isCompleted = index < activeIndex;
            const isCurrent = index === activeIndex;
            const Icon = step.icon;

            return (
              <div key={step.id} className="flex flex-col items-center w-32 relative">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.15, type: "spring", stiffness: 200 }}
                  className={`w-14 h-14 rounded-full flex items-center justify-center border-4 border-background transition-colors duration-500 shadow-md
                    ${isCompleted ? 'bg-primary text-primary-foreground' : 
                      isCurrent ? 'bg-background border-primary text-primary ring-4 ring-primary/20' : 
                      'bg-muted text-muted-foreground border-border'
                    }
                  `}
                >
                  {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : 
                   isCurrent ? <Play className="w-6 h-6 fill-primary ml-1" /> : 
                   <Icon className="w-6 h-6" />}
                </motion.div>
                
                <div className="mt-4 text-center">
                  <h5 className={`text-sm font-bold transition-colors ${isCurrent ? 'text-primary' : isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {step.label}
                  </h5>
                  <p className="text-xs text-muted-foreground mt-1 opacity-80 leading-tight">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
