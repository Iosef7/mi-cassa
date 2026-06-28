'use client';

import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, Circle, Star, Calendar, User, Search, Plus, 
  Sparkles, Folder, ListTodo, Sun, CalendarDays, Inbox,
  MoreVertical, ChevronRight, Check, Loader2, UserCircle2, Mic,
  Phone, MapPin, FileText, Send, CheckSquare, Clock
} from 'lucide-react';

export default function TareasPage() {
  const [allTasks, setAllTasks] = useState<any[]>([]);
  const [lists, setLists] = useState<any[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  
  const [activeListId, setActiveListId] = useState<string | 'INBOX' | 'IMPORTANT' | 'TODAY' | 'ASSIGNED_TO_ME' | 'DELEGATED' | 'COMPLETED' | 'OVERDUE'>('INBOX');
  const [smartInput, setSmartInput] = useState('');
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [newListOpen, setNewListOpen] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = React.useRef<any>(null);

  const currentUserId = agents.length > 0 ? agents[0].id : null;

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
      setSmartInput(prev => prev ? `${prev} ${transcript}` : transcript);
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
  
  // Fetch initial data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tasksRes, listsRes, agentsRes, leadsRes] = await Promise.all([
        fetch(`/api/tasks`), // Fetch all to do client-side filtering and counting
        fetch('/api/task-lists'),
        fetch('/api/users'), 
        fetch('/api/leads')
      ]);
      
      if(tasksRes.ok) setAllTasks(await tasksRes.json());
      if(listsRes.ok) setLists(await listsRes.json());
      if(agentsRes.ok) setAgents(await agentsRes.json());
      if(leadsRes.ok) setLeads(await leadsRes.json());
      
    } catch (error) {
      console.error(error);
    }
  };

  const handleSmartAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!smartInput.trim()) return;
    
    setIsProcessingAI(true);
    try {
      const res = await fetch('/api/ai/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: smartInput })
      });
      
      if (res.ok) {
        setSmartInput('');
        fetchData(); // Refresh
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessingAI(false);
    }
  };

  const toggleTaskStatus = async (task: any) => {
    const newStatus = task.status === 'COMPLETADO' ? 'PENDIENTE' : 'COMPLETADO';
    // Optimistic update
    setAllTasks(allTasks.map(t => t.id === task.id ? { ...t, status: newStatus } : t));
    
    await fetch(`/api/tasks/${task.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
  };

  const toggleImportant = async (task: any) => {
    // Optimistic update
    setAllTasks(allTasks.map(t => t.id === task.id ? { ...t, isImportant: !t.isImportant } : t));
    
    await fetch(`/api/tasks/${task.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isImportant: !task.isImportant })
    });
  };

  const assignTask = async (taskId: string, agentId: string) => {
    setAllTasks(allTasks.map(t => t.id === taskId ? { ...t, assignedTo: agentId, agent: agents.find(a => a.id === agentId) } : t));
    await fetch(`/api/tasks/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assignedTo: agentId })
    });
  };

  const createList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListName.trim()) return;
    const res = await fetch('/api/task-lists', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newListName })
    });
    if (res.ok) {
      setNewListName('');
      setNewListOpen(false);
      fetchData();
    }
  };

  // ----- Filtering & Counters Logic -----
  const today = new Date();
  today.setHours(0,0,0,0);

  const isOverdue = (dateStr: string | null) => {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    d.setHours(0,0,0,0);
    return d.getTime() < today.getTime();
  };

  const isToday = (dateStr: string | null) => {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    d.setHours(0,0,0,0);
    return d.getTime() === today.getTime();
  };

  // Counters
  const counts = {
    INBOX: allTasks.filter(t => t.status !== 'COMPLETADO').length,
    TODAY: allTasks.filter(t => isToday(t.dueDate) && t.status !== 'COMPLETADO').length,
    IMPORTANT: allTasks.filter(t => t.isImportant && t.status !== 'COMPLETADO').length,
    ASSIGNED_TO_ME: allTasks.filter(t => t.assignedTo === currentUserId && t.status !== 'COMPLETADO').length,
    DELEGATED: allTasks.filter(t => t.assignedTo && t.assignedTo !== currentUserId && t.status !== 'COMPLETADO').length,
    COMPLETED: allTasks.filter(t => t.status === 'COMPLETADO').length,
    OVERDUE: allTasks.filter(t => isOverdue(t.dueDate) && t.status !== 'COMPLETADO').length,
  };

  // Active View Filter
  let filteredTasks = allTasks;
  if (activeListId === 'INBOX') filteredTasks = allTasks.filter(t => t.status !== 'COMPLETADO');
  else if (activeListId === 'TODAY') filteredTasks = allTasks.filter(t => isToday(t.dueDate) && t.status !== 'COMPLETADO');
  else if (activeListId === 'IMPORTANT') filteredTasks = allTasks.filter(t => t.isImportant && t.status !== 'COMPLETADO');
  else if (activeListId === 'ASSIGNED_TO_ME') filteredTasks = allTasks.filter(t => t.assignedTo === currentUserId && t.status !== 'COMPLETADO');
  else if (activeListId === 'DELEGATED') filteredTasks = allTasks.filter(t => t.assignedTo && t.assignedTo !== currentUserId && t.status !== 'COMPLETADO');
  else if (activeListId === 'COMPLETED') filteredTasks = allTasks.filter(t => t.status === 'COMPLETADO').sort((a,b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  else if (activeListId === 'OVERDUE') filteredTasks = allTasks.filter(t => isOverdue(t.dueDate) && t.status !== 'COMPLETADO');
  else filteredTasks = allTasks.filter(t => t.listId === activeListId && t.status !== 'COMPLETADO');

  // Progress Ring Logic
  const tasksForTodayAll = allTasks.filter(t => isToday(t.dueDate));
  const tasksForTodayCompleted = tasksForTodayAll.filter(t => t.status === 'COMPLETADO');
  const progressPercent = tasksForTodayAll.length > 0 ? Math.round((tasksForTodayCompleted.length / tasksForTodayAll.length) * 100) : 0;

  // CRM Tags Logic
  const getTags = (text: string) => {
    const t = text.toLowerCase();
    const tags = [];
    if (t.includes('llamar') || t.includes('llamada') || t.includes('contactar') || t.includes('hablar')) {
      tags.push({ label: 'Llamada', icon: Phone, color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30' });
    }
    if (t.includes('visita') || t.includes('cita') || t.includes('recorrido') || t.includes('mostrar')) {
      tags.push({ label: 'Visita', icon: MapPin, color: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30' });
    }
    if (t.includes('contrato') || t.includes('firma') || t.includes('papel') || t.includes('documento')) {
      tags.push({ label: 'Trámite', icon: FileText, color: 'text-orange-600 bg-orange-100 dark:bg-orange-900/30' });
    }
    return tags;
  };

  const getTitle = () => {
    switch(activeListId) {
      case 'INBOX': return 'Todo';
      case 'TODAY': return 'Mi Día';
      case 'IMPORTANT': return 'Importante';
      case 'ASSIGNED_TO_ME': return 'Asignadas a mí';
      case 'DELEGATED': return 'Delegadas a otros';
      case 'COMPLETED': return 'Completadas';
      case 'OVERDUE': return 'Vencidas';
      default: return lists.find(l => l.id === activeListId)?.name || 'Lista';
    }
  };

  return (
    <div className="flex h-[calc(100vh-theme(spacing.16))] bg-background">
      {/* Sidebar */}
      <div className="w-72 border-r border-border bg-card flex flex-col">
        <div className="p-4">
          
          {/* Progress Ring */}
          <div className="flex items-center gap-4 mb-6 p-4 bg-muted/50 rounded-2xl">
            <div className="relative w-12 h-12 shrink-0">
              <svg className="w-12 h-12 transform -rotate-90">
                <circle className="text-border" strokeWidth="4" stroke="currentColor" fill="transparent" r="20" cx="24" cy="24" />
                <circle className="text-primary transition-all duration-1000 ease-out" strokeWidth="4" strokeDasharray={125.6} strokeDashoffset={125.6 - (125.6 * progressPercent) / 100} strokeLinecap="round" stroke="currentColor" fill="transparent" r="20" cx="24" cy="24" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black">{progressPercent}%</div>
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">Tu Día</p>
              <p className="text-xs text-muted-foreground">{tasksForTodayCompleted.length} de {tasksForTodayAll.length} completadas</p>
            </div>
          </div>
          
          <div className="space-y-1">
            <button onClick={() => setActiveListId('INBOX')} className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-colors ${activeListId === 'INBOX' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'}`}>
              <div className="flex items-center gap-3"><Inbox className="w-4 h-4" /> Todo</div>
              {counts.INBOX > 0 && <span className="bg-primary/20 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full">{counts.INBOX}</span>}
            </button>
            <button onClick={() => setActiveListId('TODAY')} className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-colors ${activeListId === 'TODAY' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'}`}>
              <div className="flex items-center gap-3"><Sun className="w-4 h-4" /> Mi Día</div>
              {counts.TODAY > 0 && <span className="bg-primary/20 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full">{counts.TODAY}</span>}
            </button>
            <button onClick={() => setActiveListId('IMPORTANT')} className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-colors ${activeListId === 'IMPORTANT' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'}`}>
              <div className="flex items-center gap-3"><Star className="w-4 h-4" /> Importante</div>
              {counts.IMPORTANT > 0 && <span className="bg-primary/20 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full">{counts.IMPORTANT}</span>}
            </button>
          </div>
        </div>

        <div className="px-4 py-2">
          <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Filtros Inteligentes</div>
          <div className="space-y-1">
            <button onClick={() => setActiveListId('ASSIGNED_TO_ME')} className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-colors ${activeListId === 'ASSIGNED_TO_ME' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'}`}>
              <div className="flex items-center gap-3"><UserCircle2 className="w-4 h-4" /> Asignadas a mí</div>
              {counts.ASSIGNED_TO_ME > 0 && <span className="bg-primary/20 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full">{counts.ASSIGNED_TO_ME}</span>}
            </button>
            <button onClick={() => setActiveListId('DELEGATED')} className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-colors ${activeListId === 'DELEGATED' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'}`}>
              <div className="flex items-center gap-3"><Send className="w-4 h-4" /> Delegadas a otros</div>
              {counts.DELEGATED > 0 && <span className="bg-primary/20 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full">{counts.DELEGATED}</span>}
            </button>
            <button onClick={() => setActiveListId('OVERDUE')} className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-colors ${activeListId === 'OVERDUE' ? 'bg-red-500/10 text-red-500' : 'text-muted-foreground hover:bg-red-500/10 hover:text-red-500'}`}>
              <div className="flex items-center gap-3"><Clock className="w-4 h-4" /> Vencidas</div>
              {counts.OVERDUE > 0 && <span className="bg-red-500/20 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full">{counts.OVERDUE}</span>}
            </button>
            <button onClick={() => setActiveListId('COMPLETED')} className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-colors ${activeListId === 'COMPLETED' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'}`}>
              <div className="flex items-center gap-3"><CheckSquare className="w-4 h-4" /> Completadas</div>
            </button>
          </div>
        </div>

        <div className="px-4 py-4 flex-1 overflow-y-auto">
          <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Carpetas</div>
          <div className="space-y-1">
            {lists.map(list => {
              const listCount = allTasks.filter(t => t.listId === list.id && t.status !== 'COMPLETADO').length;
              return (
                <button 
                  key={list.id} 
                  onClick={() => setActiveListId(list.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-colors ${activeListId === list.id ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'}`}
                >
                  <div className="flex items-center gap-3"><Folder className="w-4 h-4" /> {list.name}</div>
                  {listCount > 0 && <span className="bg-muted text-muted-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">{listCount}</span>}
                </button>
              )
            })}
          </div>
        </div>

        <div className="p-4 border-t border-border">
          {newListOpen ? (
            <form onSubmit={createList} className="flex gap-2">
              <input 
                type="text" 
                autoFocus
                placeholder="Nombre de la lista" 
                className="w-full text-sm px-3 py-2 bg-muted rounded-lg border-none focus:ring-primary"
                value={newListName}
                onChange={e => setNewListName(e.target.value)}
                onBlur={() => !newListName && setNewListOpen(false)}
              />
            </form>
          ) : (
            <button onClick={() => setNewListOpen(true)} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted transition-colors">
              <Plus className="w-4 h-4" /> Nueva lista
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-background md:bg-muted/30">
        <div className="p-8 pb-4 flex flex-col gap-6">
          <h1 className="text-3xl font-black text-foreground capitalize">
            {getTitle()}
          </h1>

          {/* Smart Add Input */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              {isProcessingAI ? <Loader2 className="w-5 h-5 text-primary animate-spin" /> : <Sparkles className="w-5 h-5 text-primary group-focus-within:animate-pulse" />}
            </div>
            <form onSubmit={handleSmartAdd} className="relative">
              <input
                type="text"
                disabled={isProcessingAI}
                placeholder="Ej. Recordar a Carlos llamar a Sofía mañana a las 5pm..."
                className="w-full pl-12 pr-32 py-4 bg-background border border-border rounded-2xl shadow-sm text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all disabled:opacity-50"
                value={smartInput}
                onChange={e => setSmartInput(e.target.value)}
              />
              <div className="absolute inset-y-0 right-4 flex items-center gap-2">
                <button
                  type="button"
                  onClick={startListening}
                  className={`p-2 rounded-full transition-colors ${isListening ? 'bg-red-100 text-red-500 animate-pulse' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
                  title="Dictar por voz"
                >
                  <Mic className="w-5 h-5" />
                </button>
                <button 
                  type="submit"
                  disabled={isProcessingAI || !smartInput.trim()}
                  className="text-[10px] font-bold text-primary-foreground bg-primary hover:bg-primary/90 px-3 py-1.5 rounded-md uppercase hidden sm:inline-block transition-colors disabled:opacity-50"
                >
                  AI Smart Add
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-8 pb-8">
          <div className="space-y-2">
            {filteredTasks.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <ListTodo className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>No hay tareas en esta vista.</p>
              </div>
            )}
            {filteredTasks.map(task => {
              const tags = getTags(task.title);
              const overdue = isOverdue(task.dueDate) && task.status !== 'COMPLETADO';
              
              return (
                <div key={task.id} className={`group flex items-center gap-4 p-4 bg-background border ${overdue ? 'border-red-200 dark:border-red-900' : 'border-border'} rounded-2xl shadow-sm transition-all hover:shadow-md ${task.status === 'COMPLETADO' ? 'opacity-50' : ''}`}>
                  <button onClick={() => toggleTaskStatus(task)} className="shrink-0 text-muted-foreground hover:text-primary transition-colors">
                    {task.status === 'COMPLETADO' ? <CheckCircle2 className="w-6 h-6 text-primary" /> : <Circle className="w-6 h-6" />}
                  </button>
                  
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold truncate ${task.status === 'COMPLETADO' ? 'line-through' : 'text-foreground'}`}>
                      {task.title}
                    </p>
                    <div className="flex items-center gap-3 mt-1.5 text-xs">
                      {tags.map((tag, i) => (
                        <span key={i} className={`flex items-center gap-1 font-semibold px-1.5 py-0.5 rounded ${tag.color}`}>
                          <tag.icon className="w-3 h-3" /> {tag.label}
                        </span>
                      ))}
                      
                      {task.dueDate && (
                        <span className={`flex items-center gap-1 font-medium ${overdue ? 'text-red-500' : 'text-muted-foreground'}`}>
                          <Calendar className="w-3 h-3" /> 
                          {new Date(task.dueDate).toLocaleDateString('es-MX', { month: 'short', day: 'numeric'})}
                        </span>
                      )}
                      
                      {task.lead && (
                        <span className="flex items-center gap-1 text-primary bg-primary/10 px-1.5 py-0.5 rounded font-medium">
                          <User className="w-3 h-3" /> {task.lead.name}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Assignee Avatar Dropdown */}
                  <div className="relative group/avatar cursor-pointer">
                    {task.agent ? (
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs ring-2 ring-background shadow-sm" title={task.agent.name}>
                        {task.agent.name.charAt(0)}
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full border border-dashed border-border flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors" title="Asignar">
                        <UserCircle2 className="w-4 h-4" />
                      </div>
                    )}
                    {/* Dropdown Menu */}
                    <div className="absolute right-0 top-10 mt-2 w-48 bg-card border border-border rounded-xl shadow-xl opacity-0 invisible group-hover/avatar:opacity-100 group-hover/avatar:visible transition-all z-10 p-1">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase px-2 py-1.5">Asignar a</p>
                      {agents.map(agent => (
                        <button key={agent.id} onClick={() => assignTask(task.id, agent.id)} className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-left rounded-lg hover:bg-muted transition-colors">
                          <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px]">
                            {agent.name.charAt(0)}
                          </div>
                          <span className="flex-1 truncate">{agent.name}</span>
                          {task.assignedTo === agent.id && <Check className="w-3 h-3 text-primary" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button onClick={() => toggleImportant(task)} className={`shrink-0 p-2 rounded-xl transition-colors ${task.isImportant ? 'text-yellow-500 bg-yellow-50 dark:bg-yellow-500/10' : 'text-muted-foreground hover:bg-muted'}`}>
                    <Star className={`w-5 h-5 ${task.isImportant ? 'fill-current' : ''}`} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
