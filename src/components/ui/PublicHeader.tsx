"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import Image from "next/image";

export default function PublicHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const navItems = [
    { name: "Inicio", href: "/" },
    { name: "Proyectos", href: "/propiedades" },
    { name: "Venta", href: "/propiedades?tipo=venta" },
    { name: "Renta", href: "/propiedades?tipo=renta" },
    { name: "Asesoria legal", href: "/asesoria-legal" },
    { name: "Hipoteca", href: "/hipoteca" },
    { name: "Decoración", href: "/decoracion" },
  ];

  const checkIsActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href.includes("?")) {
      const [path, query] = href.split("?");
      const tipo = query.split("=")[1];
      return pathname === path && searchParams.get("tipo") === tipo;
    }
    return pathname === href;
  };

  return (
    <header className="w-full bg-white relative z-50 shadow-sm">
      <div className="mx-auto w-full max-w-[1400px] flex justify-between items-center py-4 px-4">
        <div className="flex-shrink-0">
          <Link href="/" className="flex items-center">
            <span className="text-[#214953] font-bold text-2xl tracking-tight">Mi</span>
            <span className="text-[#5280A4] font-bold text-2xl tracking-tight">CASSA</span>
          </Link>
        </div>
        <div className="hidden lg:flex flex-row items-center space-x-6">
          <nav className="flex items-center space-x-1">
            {navItems.map((item, idx) => {
              const isActive = checkIsActive(item.href);
              return (
                <Link 
                  key={idx} 
                  href={item.href} 
                  className={`whitespace-nowrap text-[14px] xl:text-[16px] font-normal px-2 xl:px-4 py-2 transition-colors ${isActive ? "text-[#5280A4] border-b-[3px] border-[#5280A4]" : "text-[#5280A4] hover:text-[#214953]"}`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center space-x-2 border-l border-gray-200 pl-4">
            <Image src="https://flagcdn.com/w40/es.png" alt="ES" width={24} height={16} className="cursor-pointer shadow-sm hover:opacity-80" />
            <Image src="https://flagcdn.com/w40/us.png" alt="EN" width={24} height={16} className="cursor-pointer shadow-sm hover:opacity-80 opacity-60" />
            <Image src="https://flagcdn.com/w40/fr.png" alt="FR" width={24} height={16} className="cursor-pointer shadow-sm hover:opacity-80 opacity-60" />
            <Image src="https://flagcdn.com/w40/il.png" alt="HE" width={24} height={16} className="cursor-pointer shadow-sm hover:opacity-80 opacity-60" />
          </div>
          <form className="flex">
            <div className="flex">
              <input type="search" placeholder="Buscar..." className="w-[180px] xl:w-[260px] h-[36px] bg-[#214953] text-white px-3 text-[14px] border-none outline-none placeholder-gray-300" />
              <button type="submit" className="h-[36px] w-[36px] bg-[#5280A4] flex items-center justify-center text-white hover:bg-[#3d6986] transition-colors border-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </button>
            </div>
          </form>
        </div>
        <div className="lg:hidden flex items-center">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-[#214953] focus:outline-none">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMenuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
