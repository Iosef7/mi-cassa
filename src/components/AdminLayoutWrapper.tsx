"use client";

import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import SectionGuard from "@/components/SectionGuard";
import { SectionSettingsMap } from "@/actions/settings";
import { Menu, Building } from "lucide-react";
import Image from "next/image";

interface AdminLayoutWrapperProps {
  children: React.ReactNode;
  settings: SectionSettingsMap;
  userRole?: string;
  siteLogo?: string | null;
}

function MobileLogo({ siteLogo }: { siteLogo?: string | null }) {
  const [imgError, setImgError] = React.useState(false);
  const validLogo = siteLogo && siteLogo !== "null" && !imgError ? siteLogo : null;

  if (imgError) {
    return (
      <div className="flex items-center gap-2 text-primary font-bold text-lg tracking-tight">
        <Building className="w-5 h-5" />
      </div>
    );
  }

  return (
    <Image 
      src={validLogo || "/logo.png"} 
      alt="Mi Cassa Logo" 
      width={128} 
      height={32} 
      className="object-contain" 
      onError={() => setImgError(true)}
    />
  );
}

export default function AdminLayoutWrapper({ children, settings, userRole, siteLogo }: AdminLayoutWrapperProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <Sidebar settings={settings} userRole={userRole} siteLogo={siteLogo} />

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
             <Sidebar isMobile onClose={() => setIsMobileMenuOpen(false)} settings={settings} userRole={userRole} siteLogo={siteLogo} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden shrink-0 flex items-center justify-between p-4 border-b border-border bg-card z-40">
          <div className="flex items-center gap-3">
             <MobileLogo siteLogo={siteLogo} />
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
        <div className="flex-1 flex flex-col overflow-y-auto bg-muted/20">
          <SectionGuard settings={settings} userRole={userRole}>
            {children}
          </SectionGuard>
        </div>
      </div>
    </div>
  );
}
