"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import { Home, Building, Users, Calendar, Phone, TrendingUp, Sparkles, Moon, Sun, CheckSquare, Shield, X, Calculator, LogOut, ChevronLeft, ChevronRight, Lock, Settings } from 'lucide-react';
import { SectionSettingsMap, updateSiteLogo } from '@/actions/settings';
import { useSession, signOut } from 'next-auth/react';
import { toast } from 'sonner';
import NotificationsDropdown from './NotificationsDropdown';
import ProfileModal from './ProfileModal';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';

interface SidebarProps {
  className?: string;
  isMobile?: boolean;
  onClose?: () => void;
  settings?: SectionSettingsMap;
  userRole?: string;
  siteLogo?: string | null;
}

export default function Sidebar({ className = "", isMobile = false, onClose, settings, userRole, siteLogo: initialSiteLogo }: SidebarProps) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { data: session } = useSession();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [currentLogo, setCurrentLogo] = useState<string | null>(initialSiteLogo || null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { dict } = useLanguage();

  const [logoError, setLogoError] = useState(false);

  // Prevent hydration mismatch & load collapse state
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('sidebarCollapsed');
    if (saved === 'true') setIsCollapsed(true);
  }, []);

  const toggleCollapse = () => {
    setIsCollapsed(prev => {
      const next = !prev;
      localStorage.setItem('sidebarCollapsed', String(next));
      return next;
    });
  };

  const getStatus = (path: string) => {
    if (!settings) return "active";
    const setting = settings[path];
    if (setting) return setting.status;
    return "active";
  };

  const isLocked = (path: string) => getStatus(path) === "maintenance";
  const getRole = () => userRole || session?.user?.role;

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error(dict.common?.error || 'Error');
      return;
    }

    setIsUploadingLogo(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      
      const res = await updateSiteLogo(base64);
      if (res.success) {
        setCurrentLogo(base64);
        setLogoError(false); // Reset error state on new upload
        toast.success(dict.common?.success || "Logo actualizado");
      } else {
        toast.error(dict.common?.error || "Error");
      }
      setIsUploadingLogo(false);
    };
    reader.onerror = () => {
      toast.error(dict.common?.error || "Error");
      setIsUploadingLogo(false);
    };
    reader.readAsDataURL(file);
  };

  const validLogo = currentLogo && currentLogo !== "null" && !logoError ? currentLogo : null;

  return (
    <aside className={`transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'} bg-card border-r border-border flex-col h-full shrink-0 glass relative z-30 ${!isMobile ? 'hidden md:flex' : 'flex'} ${className}`}>
      
      {!isMobile && mounted && (
        <button 
          onClick={toggleCollapse} 
          className="absolute -right-4 top-10 bg-primary border-[3px] border-background text-primary-foreground rounded-full p-1 z-50 shadow-lg hover:scale-110 transition-transform flex items-center justify-center cursor-pointer"
          style={{ width: "32px", height: "32px" }}
        >
          {isCollapsed ? <ChevronRight size={18} strokeWidth={3} /> : <ChevronLeft size={18} strokeWidth={3} />}
        </button>
      )}

      <div className={`p-6 flex ${isCollapsed ? 'justify-center' : 'justify-between'} items-center`}>
        {!isCollapsed ? (
          <div className="relative group w-full flex justify-center items-center min-h-[48px]">
            {!logoError ? (
               <Image 
                  src={validLogo || "/logo.png"} 
                  alt="Mi Cassa Logo" 
                  width={160} 
                  height={48} 
                  className="object-contain transition-all mx-auto drop-shadow-sm" 
                  onError={() => setLogoError(true)}
                  priority
               />
            ) : (
               <div className="flex items-center gap-2 text-primary font-bold text-xl tracking-tight">
                 <Building className="w-6 h-6" />
                 <span>Mi Cassa</span>
               </div>
            )}
            
            {getRole() === 'ADMIN' && (
              <>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingLogo}
                  className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg text-sm font-semibold backdrop-blur-sm z-10"
                >
                  {isUploadingLogo ? (dict.common?.loading || 'Cargando...') : (dict.common?.edit || 'Cambiar')}
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleLogoUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
              </>
            )}
          </div>
        ) : (
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shadow-sm">
            <Building className="w-6 h-6 text-primary" />
          </div>
        )}
        {isMobile && !isCollapsed && (
          <button onClick={onClose} className="p-2 -mr-4 text-muted-foreground hover:text-foreground">
            <X size={24} />
          </button>
        )}
      </div>
      <nav className="flex-1 px-3 space-y-2 mt-2 overflow-y-auto overflow-x-hidden custom-scrollbar pb-4">
        <NavItem isCollapsed={isCollapsed} href="/admin" icon={<Home />} label={dict.sidebar.dashboard} active={pathname === "/admin"} />
        <NavItem isCollapsed={isCollapsed} href="/admin/proyectos" icon={<Building />} label={dict.sidebar.projects} active={pathname?.startsWith("/admin/proyectos")} status={getStatus("/admin/proyectos")} isLocked={isLocked("/admin/proyectos")} userRole={getRole()} />
        <NavItem isCollapsed={isCollapsed} href="/admin/propiedades" icon={<Building />} label={dict.sidebar.properties} active={pathname?.startsWith("/admin/propiedades")} status={getStatus("/admin/propiedades")} isLocked={isLocked("/admin/propiedades")} userRole={getRole()} />
        <NavItem isCollapsed={isCollapsed} href="/admin/prospectos" icon={<Users />} label={dict.sidebar.prospects} active={pathname?.startsWith("/admin/prospectos")} status={getStatus("/admin/prospectos")} isLocked={isLocked("/admin/prospectos")} userRole={getRole()} />
        <NavItem isCollapsed={isCollapsed} href="/admin/tareas" icon={<CheckSquare />} label={dict.sidebar.tasks} active={pathname?.startsWith("/admin/tareas")} status={getStatus("/admin/tareas")} isLocked={isLocked("/admin/tareas")} userRole={getRole()} />
        <NavItem isCollapsed={isCollapsed} href="/admin/ai-match" icon={<Sparkles />} label={dict.sidebar.aiMatch} active={pathname === "/admin/ai-match"} status={getStatus("/admin/ai-match")} isLocked={isLocked("/admin/ai-match")} userRole={getRole()} />
        <NavItem isCollapsed={isCollapsed} href="/admin/tabulador" icon={<Calculator />} label={dict.sidebar.tabulator} active={pathname?.startsWith("/admin/tabulador")} status={getStatus("/admin/tabulador")} isLocked={isLocked("/admin/tabulador")} userRole={getRole()} />
        <NavItem isCollapsed={isCollapsed} href="/admin/whatsapp" icon={<Phone />} label="WhatsApp" active={pathname?.startsWith("/admin/whatsapp")} />
        
        {getRole() === 'ADMIN' && (
          <div className="pt-4 pb-2">
            {!isCollapsed ? (
              <p className="px-4 mb-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">{dict.sidebar.settings}</p>
            ) : (
              <div className="h-px bg-border w-10 mx-auto my-3" />
            )}
            <NavItem isCollapsed={isCollapsed} href="/admin/ia" icon={<Sparkles />} label={dict.sidebar.ai} active={pathname?.startsWith("/admin/ia")} status={getStatus("/admin/ia")} isLocked={isLocked("/admin/ia")} userRole={getRole()} />
            <NavItem isCollapsed={isCollapsed} href="/admin/equipo" icon={<Shield />} label={dict.sidebar.team} active={pathname?.startsWith("/admin/equipo")} />
            <NavItem isCollapsed={isCollapsed} href="/admin/configuracion" icon={<Settings />} label={dict.sidebar.settings} active={pathname?.startsWith("/admin/configuracion")} />
          </div>
        )}
      </nav>
      <div className="p-4 border-t border-border mt-auto flex flex-col gap-4">
        {mounted && <ProfileModalWrapper session={session} isCollapsed={isCollapsed} />}
        
        {!isCollapsed && <LanguageSwitcher />}

        <div className={`flex items-center ${isCollapsed ? 'flex-col gap-4 mt-2' : 'justify-between gap-1 px-2'}`}>
          <NotificationsDropdown align="left" direction="up" />
          <button
            title={isCollapsed ? "Cambiar Tema" : undefined}
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-full hover:bg-muted text-muted-foreground transition-colors hover-lift"
            aria-label="Toggle Dark Mode"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            onClick={async () => {
              await import('@/actions/auth').then(m => m.logoutAction());
            }}
            className={`p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-full transition-colors ${isCollapsed ? '' : 'ml-auto'}`}
            title={dict.sidebar.logout}
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
}

import { createPortal } from 'react-dom';

function ProfileModalWrapper({ session, isCollapsed }: { session: any, isCollapsed?: boolean }) {
  const [showProfile, setShowProfile] = useState(false);

  return (
    <>
      <button 
        title={isCollapsed ? session?.user?.name || 'Mi Perfil' : undefined}
        onClick={() => setShowProfile(true)}
        className={`w-full flex items-center ${isCollapsed ? 'justify-center p-1' : 'gap-3 p-2'} hover:bg-muted/50 rounded-xl transition-colors text-left group`}
      >
        <div className={`${isCollapsed ? 'w-10 h-10' : 'w-10 h-10'} rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shadow-inner overflow-hidden shrink-0`}>
          {session?.user?.image ? (
            <Image src={session.user.image} alt="Avatar" fill className="object-cover" sizes="40px" />
          ) : (
            <span className="uppercase">{session?.user?.name ? session.user.name.substring(0, 2) : 'AG'}</span>
          )}
        </div>
        {!isCollapsed && (
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
              {session?.user?.name || 'Usuario'}
            </p>
            <p className="text-xs text-muted-foreground truncate">Mi Perfil</p>
          </div>
        )}
      </button>

      {showProfile && session?.user && typeof document !== 'undefined' && createPortal(
        <ProfileModal user={session.user} onClose={() => setShowProfile(false)} />,
        document.body
      )}
    </>
  );
}

function NavItem({ 
  href, 
  icon, 
  label, 
  active = false, 
  isCollapsed = false, 
  status = "active", 
  isLocked = false,
  userRole
}: { 
  href: string, 
  icon: React.ReactNode, 
  label: string, 
  active?: boolean, 
  isCollapsed?: boolean,
  status?: string,
  isLocked?: boolean,
  userRole?: string
}) {
  if (status === "hidden" && userRole !== "ADMIN") return null;

  return (
    <Link 
      href={href} 
      title={isCollapsed ? label : undefined} 
      prefetch={true}
      className={`w-full flex items-center ${isCollapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2.5'} rounded-lg text-sm font-medium transition-all duration-200 block relative group/navitem ${
        active 
          ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-[1.02]' 
          : 'text-muted-foreground hover:bg-muted hover:text-foreground hover:scale-[1.02]'
      }`}
    >
      {React.cloneElement(icon as React.ReactElement<any>, { className: isCollapsed ? "w-6 h-6 shrink-0" : "w-5 h-5 shrink-0" })}
      {!isCollapsed && <span className="truncate">{label}</span>}
      {isLocked && !isCollapsed && (
         <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 group-hover/navitem:text-foreground/70 transition-colors">
           <Lock size={14} />
         </span>
      )}
      {isLocked && isCollapsed && (
         <span className="absolute right-1 top-1 text-muted-foreground/60">
           <Lock size={10} />
         </span>
      )}
    </Link>
  );
}
