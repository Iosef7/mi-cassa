"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Home, Building, Users, Calendar, Phone, TrendingUp, Sparkles, Moon, Sun, CheckSquare, Shield, X, Calculator } from 'lucide-react';

interface SidebarProps {
  className?: string;
  isMobile?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ className = "", isMobile = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <aside className={`w-64 bg-card border-r border-border flex-col h-full shrink-0 glass relative z-10 ${!isMobile ? 'hidden md:flex' : 'flex'} ${className}`}>
      <div className="p-6 flex justify-between items-center">
        <img src="/logo.png" alt="Mi Cassa Logo" className="h-16 w-auto object-contain mx-auto" />
        {isMobile && (
          <button onClick={onClose} className="p-2 -mr-4 text-muted-foreground hover:text-foreground">
            <X size={24} />
          </button>
        )}
      </div>
      <nav className="flex-1 px-4 space-y-1.5 mt-2 overflow-y-auto">
        <NavItem href="/admin" icon={<Home />} label="Dashboard" active={pathname === "/admin"} />
        <NavItem href="/admin/propiedades" icon={<Building />} label="Proyectos (Propiedades)" active={pathname?.startsWith("/admin/propiedades")} />
        <NavItem href="/admin/prospectos" icon={<Users />} label="Clientes (CRM)" active={pathname?.startsWith("/admin/prospectos")} />
        <NavItem href="/admin/tareas" icon={<CheckSquare />} label="Gestión de Tareas" active={pathname?.startsWith("/admin/tareas")} />
        <NavItem href="/admin/ia" icon={<Sparkles />} label="Control IA" active={pathname?.startsWith("/admin/ia")} />
        <NavItem href="/admin/ai-match" icon={<Sparkles />} label="IA Matchmaker" active={pathname === "/admin/ai-match"} />
        <NavItem href="/admin/tabulador" icon={<Calculator />} label="Tabulador / Simulador" active={pathname?.startsWith("/admin/tabulador")} />
        <NavItem href="#" icon={<Calendar />} label="Agenda y Citas" active={pathname === "/admin/agenda"} />
        <NavItem href="#" icon={<Phone />} label="Registro de Llamadas" active={pathname === "/admin/llamadas"} />
        <NavItem href="#" icon={<TrendingUp />} label="Marketing y Meta" active={pathname === "/admin/marketing"} />
        <NavItem href="/admin/equipo" icon={<Shield />} label="Equipo y Permisos" active={pathname?.startsWith("/admin/equipo")} />
      </nav>
      <div className="p-4 border-t border-border mt-auto">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shadow-inner">
            AG
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">Agente Principal</p>
            <p className="text-xs text-muted-foreground">agente@micassa.com</p>
          </div>
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-full hover:bg-muted text-muted-foreground transition-colors hover-lift"
              aria-label="Toggle Dark Mode"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}

function NavItem({ href, icon, label, active = false }: { href: string, icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <Link href={href}>
      <button className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
        active 
          ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-[1.02]' 
          : 'text-muted-foreground hover:bg-muted hover:text-foreground hover:scale-[1.02]'
      }`}>
        {React.cloneElement(icon as React.ReactElement<any>, { className: "w-5 h-5" })}
        {label}
      </button>
    </Link>
  );
}
