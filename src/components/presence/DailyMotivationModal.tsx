"use client";

import { useState, useEffect } from "react";
import { X, Target } from "lucide-react";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";

export function DailyMotivationModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [goal, setGoal] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const askedDate = localStorage.getItem('dailyGoalAskedDate');
    
    if (askedDate !== today) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/team/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dailyGoal: goal })
      });
      
      if (res.ok) {
        const today = new Date().toISOString().split('T')[0];
        localStorage.setItem('dailyGoalAskedDate', today);
        setIsOpen(false);
        
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#22c55e', '#3b82f6', '#f59e0b', '#ec4899']
        });
        toast.success("¡Meta registrada! A cumplirla hoy.");
      }
    } catch (error) {
      toast.error("Error al guardar la meta");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-neutral-200 dark:border-neutral-800"
          >
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-2xl text-blue-600 dark:text-blue-400">
                  <Target size={28} />
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
                ¿Cuál es tu enfoque principal para hoy?
              </h2>
              <p className="text-neutral-500 dark:text-neutral-400 mb-6">
                Define una meta clara. Al final del día revisaremos tu progreso.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <textarea
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="Ej: Cerrar el contrato de la casa en el centro y contactar a 5 nuevos prospectos..."
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] resize-none"
                  autoFocus
                />
                
                <button
                  type="submit"
                  disabled={isSubmitting || !goal.trim()}
                  className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 dark:disabled:bg-blue-800 text-white font-semibold rounded-xl transition-all shadow-md shadow-blue-500/20 active:scale-[0.98]"
                >
                  {isSubmitting ? "Guardando..." : "Comenzar mi día"}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
