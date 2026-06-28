'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, CheckCircle2, Circle, Star, Calendar, Search, Plus, 
  Sparkles, Shield, UserCircle2, Loader2, Target, Briefcase, ChevronRight, Mic
} from 'lucide-react';

export default function EquipoPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [recentCompletedTasks, setRecentCompletedTasks] = useState<any[]>([]);
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = React.useRef<any>(null);

  const startListening = () => {
    if (isListening) return;
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Tu navegador no soporta reconocimiento de voz.');
      return;
    }
    
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'es-ES';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setAiPrompt(prev => prev ? `${prev} ${transcript}` : transcript);
    };
    recognition.onerror = (event: any) => {
      if (event.error !== 'aborted') {
        console.error('Speech recognition error', event.error);
      }
      setIsListening(false);
    };
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
  };

  // We assume the first user is the logged in user (CEO/Admin) for demo purposes
  const currentUserId = users.length > 0 ? users[0].id : null;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersRes, tasksRes] = await Promise.all([
        fetch('/api/users'),
        fetch('/api/tasks')
      ]);
      
      if(usersRes.ok) {
        setUsers(await usersRes.json());
      }
      if(tasksRes.ok) {
        const allTasks = await tasksRes.json();
        const completed = allTasks.filter((t: any) => t.status === 'COMPLETADO')
          .sort((a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
          .slice(0, 5); // top 5 recent
        setRecentCompletedTasks(completed);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleMassiveDelegate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim() || !currentUserId) return;
    
    setIsProcessingAI(true);
    setAiResult(null);
    try {
      const res = await fetch('/api/ai/delegate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt, currentUserId })
      });
      
      if (res.ok) {
        const createdTasks = await res.json();
        setAiPrompt('');
        setAiResult(`¡Éxito! Se han creado ${createdTasks.length} tareas asignadas correctamente.`);
        fetchData(); // Refresh UI
        
        setTimeout(() => setAiResult(null), 5000); // clear after 5s
      } else {
        setAiResult('Hubo un error procesando la delegación.');
      }
    } catch (e) {
      console.error(e);
      setAiResult('Error de conexión.');
    } finally {
      setIsProcessingAI(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-background h-[calc(100vh-theme(spacing.16))] overflow-y-auto">
      <div className="max-w-6xl w-full mx-auto p-8 space-y-8">
        
        {/* Header & AI Delegation */}
        <div className="bg-gradient-to-br from-primary/10 via-background to-background border border-primary/20 rounded-3xl p-8 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Sparkles className="w-48 h-48 text-primary" />
          </div>
          
          <div className="relative z-10 max-w-3xl">
            <h1 className="text-3xl font-black text-foreground flex items-center gap-3 mb-2">
              <Shield className="w-8 h-8 text-primary" /> Equipo y Delegación
            </h1>
            <p className="text-muted-foreground mb-8">Administra los roles de tu equipo y utiliza la inteligencia artificial para delegar múltiples tareas al mismo tiempo.</p>

            <form onSubmit={handleMassiveDelegate} className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  {isProcessingAI ? <Loader2 className="w-6 h-6 text-primary animate-spin" /> : <Sparkles className="w-6 h-6 text-primary" />}
                </div>
                <textarea
                  disabled={isProcessingAI}
                  placeholder="Ej. Quiero que me recuerdes mañana contactar a Pedro, que Carlos revise los contratos y María agende visita para Las Nubes..."
                  className="w-full pl-14 pr-4 py-4 min-h-[120px] bg-card border border-primary/30 rounded-2xl shadow-sm text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all disabled:opacity-50 resize-none"
                  value={aiPrompt}
                  onChange={e => setAiPrompt(e.target.value)}
                />
                <div className="absolute right-4 bottom-4 flex items-center">
                  <button
                    type="button"
                    onClick={startListening}
                    className={`p-2 rounded-full transition-colors ${isListening ? 'bg-red-100 text-red-500 animate-pulse' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
                    title="Dictar por voz"
                  >
                    <Mic className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  {aiResult && <span className="text-sm font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-lg">{aiResult}</span>}
                </div>
                <button 
                  type="submit" 
                  disabled={isProcessingAI || !aiPrompt.trim()}
                  className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-md shadow-primary/20"
                >
                  {isProcessingAI ? 'Procesando con IA...' : 'Delegar Tareas (IA)'}
                  <Sparkles className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Members Grid */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Users className="w-5 h-5 text-muted-foreground" /> Miembros del Equipo
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {users.map(user => (
                <div key={user.id} className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-lg ring-2 ring-background shadow-sm">
                      {user.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-foreground truncate">{user.name}</h3>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Briefcase className="w-3 h-3" /> {user.role === 'ADMIN' ? 'Administrador' : user.role === 'AGENT' ? 'Asesor' : user.role}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-muted/50 rounded-xl p-3">
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">Pendientes</p>
                      <p className="text-xl font-black text-foreground">{user.pendingTasksCount}</p>
                    </div>
                    <div className="w-px h-8 bg-border"></div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">Prospectos</p>
                      <p className="text-xl font-black text-foreground">{user.totalLeadsCount}</p>
                    </div>
                  </div>
                  
                  <button className="w-full flex items-center justify-center gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 py-2 rounded-lg text-sm font-bold transition-colors">
                    Ver Tareas de {user.name.split(' ')[0]} <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity (CEO View) */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Target className="w-5 h-5 text-green-500" /> Actividad Reciente
            </h2>
            
            <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-4 relative overflow-hidden">
              <div className="absolute top-0 left-4 w-px h-full bg-border -z-10"></div>
              
              {recentCompletedTasks.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No hay tareas completadas recientemente.</p>
              ) : (
                recentCompletedTasks.map((task) => (
                  <div key={task.id} className="flex gap-4 relative z-0">
                    <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 flex items-center justify-center shrink-0 ring-4 ring-card">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div className="pt-1 flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{task.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        <span className="font-semibold text-foreground">{task.agent?.name || 'Alguien'}</span> completó esto el {new Date(task.updatedAt).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
