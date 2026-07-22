"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, CheckCircle2, Moon, EyeOff, Coffee, Crosshair } from "lucide-react";

type Status = 'ONLINE' | 'AWAY' | 'DND' | 'BREAK' | 'INVISIBLE' | 'FOCUS';

interface StatusSelectorProps {
  initialStatus?: Status;
  initialFocus?: string;
  direction?: 'up' | 'down';
}

export function StatusSelector({ initialStatus = 'ONLINE', initialFocus = '', direction = 'up' }: StatusSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<Status>(initialStatus);
  const [focusText, setFocusText] = useState(initialFocus);
  const [isEditingFocus, setIsEditingFocus] = useState(false);

  const statuses: { value: Status; label: string; icon: React.ReactNode; colorClass: string }[] = [
    { value: 'ONLINE', label: 'Conectado', icon: <CheckCircle2 size={16} />, colorClass: 'text-green-500 bg-green-500' },
    { value: 'FOCUS', label: 'Enfocado', icon: <Crosshair size={16} />, colorClass: 'text-blue-500 bg-blue-500' },
    { value: 'DND', label: 'No Molestar', icon: <Moon size={16} />, colorClass: 'text-red-500 bg-red-500' },
    { value: 'BREAK', label: 'Descanso', icon: <Coffee size={16} />, colorClass: 'text-yellow-500 bg-yellow-500' },
    { value: 'INVISIBLE', label: 'Invisible', icon: <EyeOff size={16} />, colorClass: 'text-neutral-500 bg-neutral-500' },
  ];

  const currentStatusConfig = statuses.find(s => s.value === status) || statuses[0];

  const handleStatusChange = async (newStatus: Status) => {
    setStatus(newStatus);
    setIsOpen(false);
    if (newStatus === 'FOCUS') {
      setIsEditingFocus(true);
    } else {
      setFocusText('');
      setIsEditingFocus(false);
      updateStatus(newStatus, '');
    }
  };

  const updateStatus = async (newStatus: Status, focus: string) => {
    try {
      await fetch('/api/team/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, currentFocus: focus })
      });
    } catch (error) {
      console.error("Error updating status");
    }
  };

  const handleFocusSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setIsEditingFocus(false);
      updateStatus('FOCUS', focusText);
    }
  };

  return (
    <div className="relative z-30">
      <div className="flex items-center gap-2">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 px-3 py-1.5 rounded-full shadow-sm hover:shadow transition-all cursor-pointer"
        >
          <div className={`w-2.5 h-2.5 rounded-full ${currentStatusConfig.colorClass}`}></div>
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            {currentStatusConfig.label}
          </span>
          <ChevronDown size={14} className={`text-neutral-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {status === 'FOCUS' && (
          isEditingFocus ? (
            <input 
              type="text"
              value={focusText}
              onChange={(e) => setFocusText(e.target.value)}
              onKeyDown={handleFocusSubmit}
              onBlur={() => {
                setIsEditingFocus(false);
                updateStatus('FOCUS', focusText);
              }}
              placeholder="¿En qué te enfocas?"
              className="text-sm px-3 py-1.5 border rounded-full outline-none focus:ring-1 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-700 w-48"
              autoFocus
            />
          ) : (
            <div 
              onClick={() => setIsEditingFocus(true)}
              className="text-sm text-neutral-500 dark:text-neutral-400 italic cursor-text hover:text-neutral-700"
            >
              {focusText || "¿En qué te enfocas?"}
            </div>
          )
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
            <motion.div 
              initial={{ opacity: 0, y: direction === 'up' ? 10 : -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: direction === 'up' ? 10 : -10, scale: 0.95 }}
              className={`absolute ${direction === 'up' ? 'bottom-full mb-2' : 'top-full mt-2'} left-0 w-48 bg-white dark:bg-neutral-900 rounded-xl shadow-2xl border border-neutral-200 dark:border-neutral-700 z-50 overflow-hidden`}
            >
              {statuses.map((s) => (
                <button
                  key={s.value}
                  onClick={() => handleStatusChange(s.value)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800 ${status === s.value ? 'bg-neutral-100 dark:bg-neutral-800 font-semibold text-neutral-900 dark:text-white' : 'text-neutral-600 dark:text-neutral-300'}`}
                >
                  <div className={`w-2.5 h-2.5 rounded-full ${s.colorClass}`}></div>
                  {s.label}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
