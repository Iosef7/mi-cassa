"use client";

import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { Menu } from "lucide-react";

export default function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          
          {/* Sidebar Drawer */}
          <div className="relative z-10 w-64 max-w-[80%] h-full flex-shrink-0 animate-in slide-in-from-left-full duration-200">
             <Sidebar isMobile onClose={() => setIsMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden shrink-0 flex items-center justify-between p-4 border-b border-border bg-card z-40">
          <div className="flex items-center gap-3">
             <img src="/logo.png" alt="Mi Cassa Logo" className="h-8 w-auto object-contain" />
             <span className="font-bold text-lg text-foreground tracking-tight">Mi Cassa</span>
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(true)} 
            className="p-2 -mr-2 text-foreground hover:bg-muted rounded-full transition-colors"
            aria-label="Abrir menú"
          >
            <Menu size={24} />
          </button>
        </header>

        {/* Page Content */}
        <div className="flex-1 flex flex-col overflow-hidden bg-muted/20">
          {children}
        </div>
      </div>
    </div>
  );
}
