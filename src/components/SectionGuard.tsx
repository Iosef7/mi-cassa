"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { SectionSettingsMap } from "@/actions/settings";
import { Lock, Construction } from "lucide-react";
import { motion } from "framer-motion";

interface SectionGuardProps {
  children: React.ReactNode;
  settings: SectionSettingsMap;
  userRole?: string;
}

export default function SectionGuard({ children, settings, userRole }: SectionGuardProps) {
  const pathname = usePathname();

  // Encontrar si la ruta actual está restringida
  let isRestricted = false;
  let status = "active";

  if (settings) {
    for (const [pathPrefix, setting] of Object.entries(settings)) {
      if (pathname?.startsWith(pathPrefix)) {
        if (setting.status !== "active") {
          isRestricted = true;
          status = setting.status;
        }
        break;
      }
    }
  }

  // Admin siempre tiene acceso a todo
  if (userRole === "ADMIN") {
    return <>{children}</>;
  }

  if (isRestricted) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 relative overflow-hidden h-full">
        {/* Fondo decorativo premium */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-background to-background" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="relative z-10 max-w-md w-full glass rounded-3xl p-10 text-center border border-border shadow-2xl flex flex-col items-center gap-6"
        >
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center shadow-inner relative">
            <motion.div 
              animate={{ rotate: status === "maintenance" ? 360 : 0 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 border-2 border-dashed border-primary/30 rounded-full"
            />
            {status === "maintenance" ? (
              <Construction className="w-10 h-10 text-primary" />
            ) : (
              <Lock className="w-10 h-10 text-primary" />
            )}
          </div>
          
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-foreground">
              {status === "maintenance" ? "Sección en Mantenimiento" : "Acceso Restringido"}
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {status === "maintenance" 
                ? "Estamos realizando mejoras en esta sección para ofrecerte una experiencia más premium. Estará disponible próximamente."
                : "Esta sección no está disponible para tu rol. Si crees que esto es un error, contacta a tu administrador."}
            </p>
          </div>

          <button 
            onClick={() => window.history.back()}
            className="mt-4 px-6 py-2.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl font-medium transition-colors hover-lift"
          >
            Regresar
          </button>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
}
