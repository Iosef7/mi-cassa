'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MoreVertical, User, Phone, Edit, Trash2 } from 'lucide-react';
import { showAlert, showConfirm, showToast } from '@/lib/alerts';

interface ProspectActionMenuProps {
  leadId: string;
}

export default function ProspectActionMenu({ leadId }: ProspectActionMenuProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors focus:outline-none"
      >
        <MoreVertical size={18} />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-[#151b23] shadow-lg ring-1 ring-black ring-opacity-5 dark:ring-slate-700 focus:outline-none overflow-hidden">
          <div className="py-1">
            <Link
              href={`/admin/prospectos/${leadId}`}
              className="group flex items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <User className="mr-3 h-4 w-4 text-slate-400 group-hover:text-blue-500" />
              Ver Perfil
            </Link>
            
            <button
              onClick={() => {
                showAlert('Función en desarrollo', 'El registro rápido de llamadas estará disponible pronto.', 'info');
                setIsOpen(false);
              }}
              className="group flex w-full items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Phone className="mr-3 h-4 w-4 text-slate-400 group-hover:text-green-500" />
              Registrar Llamada
            </button>

            <button
              onClick={() => {
                setIsOpen(false);
                router.push(`/admin/prospectos/${leadId}/editar`);
              }}
              className="group flex w-full items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Edit className="mr-3 h-4 w-4 text-slate-400 group-hover:text-amber-500" />
              Editar Rápido
            </button>
            
            <div className="border-t border-slate-100 dark:border-slate-800 my-1"></div>
            
            <button
              onClick={async () => {
                setIsOpen(false);
                if(await showConfirm('¿Eliminar prospecto?', '¿Estás seguro de que deseas eliminar este prospecto? Esta acción no se puede deshacer.', 'Sí, eliminar')) {
                  try {
                    const res = await fetch(`/api/leads/${leadId}`, { method: 'DELETE' });
                    if (!res.ok) {
                      const data = await res.json().catch(() => ({}));
                      throw new Error(data.error || 'Error al eliminar');
                    }
                    showToast('Prospecto eliminado exitosamente', 'success');
                    router.refresh(); // Fast refresh without full reload
                  } catch (e: any) {
                    showToast(e.message || 'Ocurrió un error al eliminar', 'error');
                  }
                }
              }}
              className="group flex w-full items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
            >
              <Trash2 className="mr-3 h-4 w-4 text-red-400 group-hover:text-red-500" />
              Eliminar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
