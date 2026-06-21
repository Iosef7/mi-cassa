"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Building, Users, Calendar, Phone, TrendingUp } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-border bg-card hidden md:flex flex-col h-screen shrink-0">
      <div className="p-6 flex justify-center">
        <img src="/logo.png" alt="Mi Cassa Logo" className="h-20 w-auto object-contain" />
      </div>
      <nav className="flex-1 px-4 space-y-2 mt-4">
        <NavItem href="/" icon={<Home />} label="Dashboard" active={pathname === "/"} />
        <NavItem href="/propiedades" icon={<Building />} label="Propiedades" active={pathname?.startsWith("/propiedades")} />
        <NavItem href="/prospectos" icon={<Users />} label="Clientes (CRM)" active={pathname?.startsWith("/prospectos")} />
        <NavItem href="#" icon={<Calendar />} label="Agenda y Citas" active={pathname === "/agenda"} />
        <NavItem href="#" icon={<Phone />} label="Registro de Llamadas" active={pathname === "/llamadas"} />
        <NavItem href="#" icon={<TrendingUp />} label="Marketing y Meta" active={pathname === "/marketing"} />
      </nav>
      <div className="p-4 border-t border-border mt-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
            AG
          </div>
          <div>
            <p className="text-sm font-medium">Agente Principal</p>
            <p className="text-xs text-foreground/60">agente@micassa.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

function NavItem({ href, icon, label, active = false }: { href: string, icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <Link href={href}>
      <button className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${active ? 'bg-primary text-primary-foreground' : 'text-foreground/70 hover:bg-background hover:text-foreground'}`}>
        {React.cloneElement(icon as React.ReactElement, { className: "w-5 h-5" })}
        {label}
      </button>
    </Link>
  );
}
