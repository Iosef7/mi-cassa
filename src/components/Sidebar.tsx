"use client";

import React, { useEffect, useState, useCallback, memo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import { Home, Building, Users, Calendar, Phone, TrendingUp, Moon, Sun, CheckSquare, Shield, X, Calculator, LogOut, ChevronLeft, ChevronRight, Lock, Settings, Key, ChevronDown, ChevronUp, Video, Globe, Mic } from 'lucide-react';
import { GeminiIcon } from '@/components/icons/GeminiIcon';
import { SectionSettingsMap, updateSiteLogo } from '@/actions/settings';
import { useSession, signOut } from 'next-auth/react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import NotificationsDropdown from './NotificationsDropdown';
import ProfileModal from './ProfileModal';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import { StatusSelector } from './presence/StatusSelector';

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
    <motion.aside 
      initial={false}
      animate={{ width: isCollapsed ? 80 : 256 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={`bg-card border-r border-border flex-col h-full shrink-0 glass relative z-30 ${!isMobile ? 'hidden md:flex' : 'flex'} ${className}`}
    >
      
      {!isMobile && mounted && (
        <button 
          onClick={toggleCollapse} 
          className="absolute -right-4 top-10 bg-primary border-[3px] border-background text-primary-foreground rounded-full p-1 z-50 shadow-lg hover:scale-110 transition-transform flex items-center justify-center cursor-pointer"
          style={{ width: "32px", height: "32px" }}
        >
          {isCollapsed ? <ChevronRight size={18} strokeWidth={3} /> : <ChevronLeft size={18} strokeWidth={3} />}
        </button>
      )}

      <div className="p-4 border-b border-border flex flex-col gap-3">
        {!isCollapsed ? (
          <>
            {isMobile && (
              <div className="flex justify-end">
                <button onClick={onClose} className="p-2 -mr-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted">
                  <X size={22} />
                </button>
              </div>
            )}

            {/* User Icon & Status Selector at the top */}
            {mounted && (
              <div className="flex flex-col gap-2">
                <ProfileModalWrapper session={session} isCollapsed={false} />
                <div className="px-1 relative z-30">
                  <StatusSelector direction="down" />
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center gap-3">
            {mounted && <ProfileModalWrapper session={session} isCollapsed={true} />}
          </div>
        )}
      </div>
      <nav className="flex-1 px-3 space-y-2 mt-2 overflow-y-auto overflow-x-hidden custom-scrollbar pb-4">
        <NavItem onClick={onClose} isCollapsed={isCollapsed} href="/admin" icon={<Home />} label={dict.sidebar.dashboard} active={pathname === "/admin"} />
        
        <NavGroup 
          icon={<Building />} 
          label={dict.sidebar.properties} 
          isCollapsed={isCollapsed} 
          active={pathname?.startsWith("/admin/propiedades") || pathname?.startsWith("/admin/proyectos") || pathname?.startsWith("/admin/rentas")}
          onExpand={() => setIsCollapsed(false)}
        >
          <SubNavItem onClick={onClose} href="/admin/propiedades" label="Catálogo" active={pathname === "/admin/propiedades" || pathname?.startsWith("/admin/propiedades/")} />
          <SubNavItem onClick={onClose} href="/admin/rentas" label={dict.sidebar.rentals || "Rentas"} active={pathname?.startsWith("/admin/rentas")} />
          <SubNavItem onClick={onClose} href="/admin/proyectos" label={dict.sidebar.projects || "Proyectos"} active={pathname?.startsWith("/admin/proyectos")} />
        </NavGroup>

        <NavItem onClick={onClose} isCollapsed={isCollapsed} href="/admin/prospectos" icon={<Users />} label={dict.sidebar.prospects} active={pathname?.startsWith("/admin/prospectos")} status={getStatus("/admin/prospectos")} isLocked={isLocked("/admin/prospectos")} userRole={getRole()} />
        <NavItem onClick={onClose} isCollapsed={isCollapsed} href="/admin/reuniones" icon={<Video />} label="Reuniones" active={pathname?.startsWith("/admin/reuniones")} />
        <NavItem onClick={onClose} isCollapsed={isCollapsed} href="/admin/plaud" icon={<Mic />} label="Plaud Pro AI" active={pathname?.startsWith("/admin/plaud")} />
        <NavItem onClick={onClose} isCollapsed={isCollapsed} href="/admin/tareas" icon={<CheckSquare />} label={dict.sidebar.tasks} active={pathname?.startsWith("/admin/tareas")} status={getStatus("/admin/tareas")} isLocked={isLocked("/admin/tareas")} userRole={getRole()} />
        <NavItem onClick={onClose} isCollapsed={isCollapsed} href="/admin/ai-match" icon={<GeminiIcon />} label={dict.sidebar.aiMatch} active={pathname === "/admin/ai-match"} status={getStatus("/admin/ai-match")} isLocked={isLocked("/admin/ai-match")} userRole={getRole()} />
        <NavItem onClick={onClose} isCollapsed={isCollapsed} href="/admin/tabulador" icon={<Calculator />} label={dict.sidebar.tabulator} active={pathname?.startsWith("/admin/tabulador")} status={getStatus("/admin/tabulador")} isLocked={isLocked("/admin/tabulador")} userRole={getRole()} />
        <NavItem onClick={onClose} isCollapsed={isCollapsed} href="/admin/whatsapp" icon={<Phone />} label="WhatsApp" active={pathname?.startsWith("/admin/whatsapp")} />
        <NavItem onClick={onClose} isCollapsed={isCollapsed} href="/admin/cms" icon={<Globe />} label="Editor Web (CMS)" active={pathname?.startsWith("/admin/cms")} />
        
        {getRole() === 'ADMIN' && (
          <div className="pt-4 pb-2">
            {!isCollapsed ? (
              <p className="px-4 mb-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">{dict.sidebar.settings}</p>
            ) : (
              <div className="h-px bg-border w-10 mx-auto my-3" />
            )}
            <NavItem onClick={onClose} isCollapsed={isCollapsed} href="/admin/ia" icon={<GeminiIcon />} label={dict.sidebar.ai} active={pathname?.startsWith("/admin/ia")} status={getStatus("/admin/ia")} isLocked={isLocked("/admin/ia")} userRole={getRole()} />
            <NavItem onClick={onClose} isCollapsed={isCollapsed} href="/admin/equipo" icon={<Shield />} label={dict.sidebar.team} active={pathname?.startsWith("/admin/equipo")} />
            <NavItem onClick={onClose} isCollapsed={isCollapsed} href="/admin/configuracion" icon={<Settings />} label={dict.sidebar.settings} active={pathname?.startsWith("/admin/configuracion")} />
          </div>
        )}
      </nav>
      <div className="p-4 border-t border-border mt-auto flex flex-col gap-4">
        {!isCollapsed && <LanguageSwitcher />}

        <div className={`flex items-center ${isCollapsed ? 'flex-col gap-4 mt-2' : 'justify-between gap-1 px-2'}`}>
          <NotificationsDropdown align="left" direction="up" />
          <button
            title={isCollapsed ? "Cambiar Tema" : undefined}
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-full hover:bg-muted text-muted-foreground transition-colors hover-lift"
            aria-label="Toggle Dark Mode"
          >
            {!mounted ? <div className="w-[18px] h-[18px] opacity-0" /> : theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
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
    </motion.aside>
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
        <div className={`${isCollapsed ? 'w-10 h-10' : 'w-10 h-10'} relative rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shadow-inner overflow-hidden shrink-0`}>
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

const NavItem = memo(function NavItem({ 
  href, 
  icon, 
  label, 
  active = false, 
  isCollapsed = false, 
  status = "active", 
  isLocked = false,
  userRole,
  onClick
}: { 
  href: string, 
  icon: React.ReactNode, 
  label: string, 
  active?: boolean, 
  isCollapsed?: boolean,
  status?: string,
  isLocked?: boolean,
  userRole?: string,
  onClick?: () => void
}) {
  if (status === "hidden" && userRole !== "ADMIN") return null;

  return (
    <Link 
      href={href} 
      onClick={onClick}
      title={isCollapsed ? label : undefined} 
      prefetch={true}
      className={`w-full flex items-center ${isCollapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2.5'} rounded-lg text-sm font-medium transition-colors block relative group/navitem z-10 ${
        active 
          ? 'text-primary-foreground' 
          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
      }`}
    >
      {active && (
        <motion.div
          layoutId="sidebar-active-indicator"
          className="absolute inset-0 bg-primary rounded-lg -z-10 shadow-md shadow-primary/20"
          initial={false}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
      <div className={`relative z-10 flex items-center w-full ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
        {React.cloneElement(icon as React.ReactElement<any>, { className: isCollapsed ? "w-6 h-6 shrink-0" : "w-5 h-5 shrink-0" })}
        <AnimatePresence>
          {!isCollapsed && (
            <motion.span 
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              className="truncate whitespace-nowrap"
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
        {isLocked && !isCollapsed && (
           <span className="absolute right-0 top-1/2 -translate-y-1/2 text-muted-foreground/50 group-hover/navitem:text-foreground/70 transition-colors">
             <Lock size={14} />
           </span>
        )}
        {isLocked && isCollapsed && (
           <span className="absolute right-1 top-1 text-muted-foreground/60">
             <Lock size={10} />
           </span>
        )}
      </div>
    </Link>
  );
});

function NavGroup({ 
  icon, 
  label, 
  active = false, 
  isCollapsed = false, 
  children,
  onExpand
}: { 
  icon: React.ReactNode, 
  label: string, 
  active?: boolean, 
  isCollapsed?: boolean,
  children: React.ReactNode,
  onExpand: () => void
}) {
  const [isOpen, setIsOpen] = useState(active);

  useEffect(() => {
    if (active && !isCollapsed) setIsOpen(true);
  }, [active, isCollapsed]);

  const handleClick = () => {
    if (isCollapsed) {
      onExpand();
      setIsOpen(true);
    } else {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className="w-full">
      <button 
        onClick={handleClick}
        title={isCollapsed ? label : undefined} 
        className={`w-full flex items-center justify-between ${isCollapsed ? 'justify-center p-2.5' : 'px-3 py-2.5'} rounded-lg text-sm font-medium transition-colors relative group/navitem z-10 ${
          active && isCollapsed 
            ? 'text-primary-foreground bg-primary' 
            : active 
              ? 'text-foreground font-bold' 
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
        }`}
      >
        <div className={`flex items-center w-full ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
          {React.cloneElement(icon as React.ReactElement<any>, { className: isCollapsed ? "w-6 h-6 shrink-0" : "w-5 h-5 shrink-0" })}
          {!isCollapsed && <span className="truncate whitespace-nowrap">{label}</span>}
        </div>
        {!isCollapsed && (
          <div className="shrink-0 text-muted-foreground">
            {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        )}
      </button>
      <AnimatePresence>
        {isOpen && !isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pl-9 pr-3 py-1 flex flex-col gap-1 relative before:absolute before:left-5 before:top-2 before:bottom-2 before:w-px before:bg-border">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SubNavItem({ href, label, active, onClick }: { href: string, label: string, active: boolean, onClick?: () => void }) {
  return (
    <Link 
      href={href} 
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors relative ${
        active 
          ? 'text-primary bg-primary/10 font-bold' 
          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
      }`}
    >
      <span className="truncate">{label}</span>
    </Link>
  );
}

