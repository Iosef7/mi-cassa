'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  CheckCircle2, Circle, Star, Calendar as CalendarIcon, User, Search, Plus, 
   Folder, ListTodo, Sun, CalendarDays, Inbox,
  MoreVertical, ChevronRight, Check, Loader2, UserCircle2, Mic,
  Phone, MapPin, FileText, Send, CheckSquare, Clock, LayoutList, X, Kanban, Building
} from 'lucide-react';
import AiTaskChat from '@/components/AiTaskChat';
import TaskCalendar from '@/components/TaskCalendar';
import TaskKanban from '@/components/TaskKanban';
import TaskSubtasks from '@/components/TaskSubtasks';
import TaskComments from '@/components/TaskComments';
import TaskNotificationCenter from '@/components/TaskNotificationCenter';
import CreateTaskModal from '@/components/CreateTaskModal';
import { Group as PanelGroup, Panel, Separator as PanelResizeHandle } from "react-resizable-panels";
import { MessageSquare, Paperclip, SlidersHorizontal } from 'lucide-react';
import { GeminiIcon } from '@/components/icons/GeminiIcon';
import { showAlert } from '@/lib/alerts';

export default function TareasClient({ 
  initialTasks = [], 
  initialLists = [], 
  initialAgents = [], 
  initialLeads = [], 
  initialProperties = [] 
}: { 
  initialTasks?: any[], 
  initialLists?: any[], 
  initialAgents?: any[], 
  initialLeads?: any[], 
  initialProperties?: any[] 
}) {
  const [allTasks, setAllTasks] = useState<any[]>(initialTasks);
  const [lists, setLists] = useState<any[]>(initialLists);
  const [agents, setAgents] = useState<any[]>(initialAgents);
  const [leads, setLeads] = useState<any[]>(initialLeads);
  const [properties, setProperties] = useState<any[]>(initialProperties);
  
  const [activeListId, setActiveListId] = useState<string | 'INBOX' | 'IMPORTANT' | 'TODAY' | 'ASSIGNED_TO_ME' | 'DELEGATED' | 'COMPLETED' | 'OVERDUE'>('INBOX');
  const [smartInput, setSmartInput] = useState('');
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [newListOpen, setNewListOpen] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [isAdvancedModalOpen, setIsAdvancedModalOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'calendar' | 'kanban'>('kanban');
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const recognitionRef = React.useRef<any>(null);
  
  // Panel state and refs
  const [isMini, setIsMini] = useState(false);
  const [isChatMini, setIsChatMini] = useState(false);
  const sidebarRef = React.useRef<any>(null);
  const chatRef = React.useRef<any>(null);
  const sidebarInnerRef = React.useRef<HTMLDivElement>(null);
  const chatInnerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sidebarNode = sidebarInnerRef.current;
    const chatNode = chatInnerRef.current;
    
    let sidebarObserver: ResizeObserver | null = null;
    let chatObserver: ResizeObserver | null = null;

    if (sidebarNode) {
      sidebarObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
          setIsMini(entry.contentRect.width < 150);
        }
      });
      sidebarObserver.observe(sidebarNode);
    }

    if (chatNode) {
      chatObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
          setIsChatMini(entry.contentRect.width < 150);
        }
      });
      chatObserver.observe(chatNode);
    }

    return () => {
      if (sidebarObserver) sidebarObserver.disconnect();
      if (chatObserver) chatObserver.disconnect();
    };
  }, []);
  const groupRef = React.useRef<any>(null);

  const currentUserId = agents.length > 0 ? agents[0].id : null;

  const startListening = () => {
    if (isListening) return;
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      showAlert('No soportado', 'Tu navegador no soporta reconocimiento de voz.', 'error');
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
  
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [tasksRes, listsRes, agentsRes, leadsRes, propertiesRes] = await Promise.all([
        fetch(`/api/tasks`), // Fetch all to do client-side filtering and counting
        fetch('/api/task-lists'),
        fetch('/api/users'), 
        fetch('/api/leads'),
        fetch('/api/properties')
      ]);
      
      if(tasksRes.ok) setAllTasks(await tasksRes.json());
      if(listsRes.ok) setLists(await listsRes.json());
      if(agentsRes.ok) setAgents(await agentsRes.json());
      if(leadsRes.ok) setLeads(await leadsRes.json());
      if(propertiesRes.ok) setProperties(await propertiesRes.json());
      
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
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
    setAllTasks(allTasks.map(t => t.id === task.id ? { ...t, status: newStatus } : t));
    
    await fetch(`/api/tasks/${task.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
  };

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    setAllTasks(allTasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    await fetch(`/api/tasks/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
  };

  const handleDateChange = async (taskId: string, newDate: Date) => {
    setAllTasks(allTasks.map(t => t.id === taskId ? { ...t, dueDate: newDate.toISOString() } : t));
    await fetch(`/api/tasks/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dueDate: newDate.toISOString() })
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
    try {
      const res = await fetch('/api/task-lists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newListName })
      });
      if (res.ok) {
        const newList = await res.json();
        setLists([...lists, newList]);
        setNewListName('');
        setNewListOpen(false);
      } else {
        const errorData = await res.json().catch(() => null);
        showAlert('Error', errorData?.error || 'Hubo un problema de conexión con la base de datos.', 'error');
      }
    } catch (err) {
      console.error(err);
      showAlert('Error', 'Error de red o conexión fallida.', 'error');
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
    OVERDUE: allTasks.filter(t => isOverdue(t.dueDate) && t.status !== 'COMPLETADO').length };

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
    <div className="flex h-screen bg-background text-foreground overflow-hidden font-sans">
      <TaskNotificationCenter currentUserId={currentUserId} onNewTask={fetchData} />
      {/* @ts-ignore */}
      <PanelGroup direction="horizontal">
        {/* Sidebar */}
        <Panel 
          panelRef={sidebarRef}
          defaultSize={250} 
          minSize={76} 
          collapsible={false}
          className={`border-r border-border bg-card flex flex-col`}
        >
          <div ref={sidebarInnerRef} className={`flex flex-col h-full ${isMini ? "p-2" : "p-4"}`}>
          
          {/* Progress Ring */}
          <div className={`flex items-center ${isMini ? 'justify-center p-2' : 'gap-4 p-4'} mb-6 bg-muted/50 rounded-2xl`}>
            <div className={`relative ${isMini ? 'w-8 h-8' : 'w-12 h-12'} shrink-0`} title={`Tu Día: ${progressPercent}%`}>
              <svg className={`${isMini ? 'w-8 h-8' : 'w-12 h-12'} transform -rotate-90`}>
                <circle className="text-border" strokeWidth={isMini ? "3" : "4"} stroke="currentColor" fill="transparent" r={isMini ? "14" : "20"} cx={isMini ? "16" : "24"} cy={isMini ? "16" : "24"} />
                <circle className="text-primary transition-all duration-1000 ease-out" strokeWidth={isMini ? "3" : "4"} strokeDasharray={isMini ? 87.9 : 125.6} strokeDashoffset={(isMini ? 87.9 : 125.6) - ((isMini ? 87.9 : 125.6) * progressPercent) / 100} strokeLinecap="round" stroke="currentColor" fill="transparent" r={isMini ? "14" : "20"} cx={isMini ? "16" : "24"} cy={isMini ? "16" : "24"} />
              </svg>
              {!isMini && <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black">{progressPercent}%</div>}
            </div>
            {!isMini && (
              <div className="min-w-0">
                <p className="text-sm font-bold text-foreground truncate">Tu Día</p>
                <p className="text-xs text-muted-foreground truncate">{tasksForTodayCompleted.length} de {tasksForTodayAll.length} completadas</p>
              </div>
            )}
          </div>
          
          <div className="space-y-1">
            <button title="Todo" onClick={() => setActiveListId('INBOX')} className={`w-full flex items-center ${isMini ? 'justify-center p-2' : 'justify-between px-3 py-2'} rounded-xl text-sm font-medium transition-colors ${activeListId === 'INBOX' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'}`}>
              <div className="flex items-center gap-3"><Inbox className="w-5 h-5 shrink-0" /> {!isMini && <span>Todo</span>}</div>
              {!isMini && counts.INBOX > 0 && <span className="bg-primary/20 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full">{counts.INBOX}</span>}
            </button>
            <button title="Mi Día" onClick={() => setActiveListId('TODAY')} className={`w-full flex items-center ${isMini ? 'justify-center p-2' : 'justify-between px-3 py-2'} rounded-xl text-sm font-medium transition-colors ${activeListId === 'TODAY' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'}`}>
              <div className="flex items-center gap-3"><Sun className="w-5 h-5 shrink-0" /> {!isMini && <span>Mi Día</span>}</div>
              {!isMini && counts.TODAY > 0 && <span className="bg-primary/20 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full">{counts.TODAY}</span>}
            </button>
            <button title="Importante" onClick={() => setActiveListId('IMPORTANT')} className={`w-full flex items-center ${isMini ? 'justify-center p-2' : 'justify-between px-3 py-2'} rounded-xl text-sm font-medium transition-colors ${activeListId === 'IMPORTANT' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'}`}>
              <div className="flex items-center gap-3"><Star className="w-5 h-5 shrink-0" /> {!isMini && <span>Importante</span>}</div>
              {!isMini && counts.IMPORTANT > 0 && <span className="bg-primary/20 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full">{counts.IMPORTANT}</span>}
            </button>
          </div>
        </div>

        <div className={isMini ? "p-2" : "px-4 py-2"}>
          {!isMini && <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 truncate">Filtros Inteligentes</div>}
          <div className="space-y-1">
            <button title="Asignadas a mí" onClick={() => setActiveListId('ASSIGNED_TO_ME')} className={`w-full flex items-center ${isMini ? 'justify-center p-2' : 'justify-between px-3 py-2'} rounded-xl text-sm font-medium transition-colors ${activeListId === 'ASSIGNED_TO_ME' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'}`}>
              <div className="flex items-center gap-3"><UserCircle2 className="w-5 h-5 shrink-0" /> {!isMini && <span>Asignadas a mí</span>}</div>
              {!isMini && counts.ASSIGNED_TO_ME > 0 && <span className="bg-primary/20 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full">{counts.ASSIGNED_TO_ME}</span>}
            </button>
            <button title="Delegadas a otros" onClick={() => setActiveListId('DELEGATED')} className={`w-full flex items-center ${isMini ? 'justify-center p-2' : 'justify-between px-3 py-2'} rounded-xl text-sm font-medium transition-colors ${activeListId === 'DELEGATED' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'}`}>
              <div className="flex items-center gap-3"><Send className="w-5 h-5 shrink-0" /> {!isMini && <span>Delegadas a otros</span>}</div>
              {!isMini && counts.DELEGATED > 0 && <span className="bg-primary/20 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full">{counts.DELEGATED}</span>}
            </button>
            <button title="Vencidas" onClick={() => setActiveListId('OVERDUE')} className={`w-full flex items-center ${isMini ? 'justify-center p-2' : 'justify-between px-3 py-2'} rounded-xl text-sm font-medium transition-colors ${activeListId === 'OVERDUE' ? 'bg-red-500/10 text-red-500' : 'text-muted-foreground hover:bg-red-500/10 hover:text-red-500'}`}>
              <div className="flex items-center gap-3"><Clock className="w-5 h-5 shrink-0" /> {!isMini && <span>Vencidas</span>}</div>
              {!isMini && counts.OVERDUE > 0 && <span className="bg-red-500/20 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full">{counts.OVERDUE}</span>}
            </button>
            <button title="Completadas" onClick={() => setActiveListId('COMPLETED')} className={`w-full flex items-center ${isMini ? 'justify-center p-2' : 'justify-between px-3 py-2'} rounded-xl text-sm font-medium transition-colors ${activeListId === 'COMPLETED' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'}`}>
              <div className="flex items-center gap-3"><CheckSquare className="w-5 h-5 shrink-0" /> {!isMini && <span>Completadas</span>}</div>
            </button>
          </div>
        </div>

        <div className={isMini ? "p-2 flex-1 overflow-y-auto" : "px-4 py-4 flex-1 overflow-y-auto"}>
          {!isMini && <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 truncate">Carpetas</div>}
          <div className="space-y-1">
            {lists.map(list => {
              const listCount = allTasks.filter(t => t.listId === list.id && t.status !== 'COMPLETADO').length;
              return (
                <button 
                  key={list.id} 
                  title={list.name}
                  onClick={() => setActiveListId(list.id)}
                  className={`w-full flex items-center ${isMini ? 'justify-center p-2' : 'justify-between px-3 py-2'} rounded-xl text-sm font-medium transition-colors ${activeListId === list.id ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'}`}
                >
                  <div className="flex items-center gap-3"><Folder className="w-5 h-5 shrink-0" /> {!isMini && <span className="truncate">{list.name}</span>}</div>
                  {!isMini && listCount > 0 && <span className="bg-muted text-muted-foreground text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">{listCount}</span>}
                </button>
              )
            })}
          </div>
        </div>

        <div className={`border-t border-border ${isMini ? 'p-2 flex justify-center' : 'p-4'}`}>
          {newListOpen && !isMini ? (
            <form onSubmit={createList} className="flex gap-1 w-full">
              <input 
                type="text" 
                autoFocus
                placeholder="Nombre de la lista" 
                className="flex-1 min-w-0 text-sm px-3 py-2 bg-muted rounded-lg border-none focus:ring-primary"
                value={newListName}
                onChange={e => setNewListName(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Escape') {
                    setNewListOpen(false);
                    setNewListName('');
                  }
                }}
              />
              <button 
                type="submit"
                title="Guardar lista"
                disabled={!newListName.trim()}
                className="p-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              >
                <Check className="w-4 h-4" />
              </button>
              <button 
                type="button"
                onClick={() => {
                  setNewListOpen(false);
                  setNewListName('');
                }}
                title="Cancelar"
                className="p-2 text-muted-foreground hover:bg-muted rounded-lg transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <button title="Nueva lista" onClick={() => {
              if (isMini) {
                sidebarRef.current?.resize(20);
                setTimeout(() => setNewListOpen(true), 100);
              } else {
                setNewListOpen(true);
              }
            }} className={`w-full flex items-center ${isMini ? 'justify-center p-2' : 'gap-3 px-3 py-2'} rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted transition-colors`}>
              <Plus className="w-5 h-5 shrink-0" /> {!isMini && <span>Nueva lista</span>}
            </button>
          )}
        </div>
      </Panel>
        
      <PanelResizeHandle className="w-2 hover:bg-primary/20 active:bg-primary/50 transition-colors cursor-col-resize z-10 shrink-0 flex items-center justify-center">
        <div className="w-0.5 h-8 bg-border rounded-full" />
      </PanelResizeHandle>

      {/* Main Content */}
      <Panel 
        minSize={320} 
        defaultSize={600} 
        collapsible={false}
        className="flex bg-background md:bg-muted/30 overflow-hidden h-full"
      >
        <div className="flex-1 flex flex-col min-w-0 h-full">
          <div className="p-8 pb-4 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-black text-foreground capitalize">
                {getTitle()}
              </h1>
              
              <div className="flex items-center bg-card border border-border rounded-xl p-1 shadow-sm overflow-x-auto">
                <button 
                  onClick={() => setViewMode('kanban')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold transition-colors shrink-0 ${viewMode === 'kanban' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}`}
                >
                  <Kanban className="w-4 h-4" /> Tablero
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold transition-colors shrink-0 ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}`}
                >
                  <LayoutList className="w-4 h-4" /> Lista
                </button>
                <button 
                  onClick={() => setViewMode('calendar')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold transition-colors shrink-0 ${viewMode === 'calendar' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}`}
                >
                  <CalendarDays className="w-4 h-4" /> Calendario
                </button>
              </div>
            </div>
          </div>

          <form onSubmit={async (e) => {
            e.preventDefault();
            if (!newTaskTitle.trim()) return;
            setIsCreatingTask(true);
            try {
              const res = await fetch('/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                  title: newTaskTitle, 
                  listId: activeListId && !['INBOX', 'IMPORTANT', 'TODAY', 'ASSIGNED_TO_ME', 'DELEGATED', 'COMPLETED', 'OVERDUE'].includes(activeListId) ? activeListId : null 
                })
              });
              if (res.ok) {
                const created = await res.json();
                setAllTasks([created, ...allTasks]);
                setNewTaskTitle('');
              }
            } finally {
              setIsCreatingTask(false);
            }
          }} className="px-8 pb-4">
            <div className="relative group flex items-center">
              <Plus className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                value={newTaskTitle}
                onChange={e => setNewTaskTitle(e.target.value)}
                placeholder="Añadir una nueva tarea... (Presiona Enter)" 
                className="w-full bg-card border border-border rounded-2xl pl-12 pr-14 py-4 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all hover:border-primary/30"
                disabled={isCreatingTask}
              />
              <button 
                type="button"
                onClick={() => setIsAdvancedModalOpen(true)}
                title="Creación Avanzada"
                className="absolute right-3 p-2 hover:bg-muted text-muted-foreground hover:text-foreground rounded-xl transition-colors"
              >
                <SlidersHorizontal className="w-5 h-5" />
              </button>
            </div>
          </form>

          <div className="flex-1 overflow-y-auto px-8 pb-8">
            {isLoading ? (
              <div className="flex-1 flex flex-col items-center justify-center h-full min-h-[400px]">
                <Loader2 className="w-10 h-10 animate-spin text-primary opacity-50 mb-4" />
                <p className="text-muted-foreground font-medium">Cargando tareas...</p>
              </div>
            ) : viewMode === 'calendar' ? (
              <div className="h-full min-h-[500px]">
                <TaskCalendar tasks={filteredTasks} onTaskClick={setSelectedTask} onTaskDateChange={handleDateChange} />
              </div>
            ) : viewMode === 'kanban' ? (
              <div className="h-full min-h-[500px]">
                <TaskKanban tasks={filteredTasks} onTaskClick={setSelectedTask} onTaskStatusChange={handleStatusChange} />
              </div>
            ) : (
              <div className="space-y-2 h-full">
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
                <div key={task.id} onClick={(e) => {
                  if ((e.target as HTMLElement).closest('.no-modal-click')) return;
                  setSelectedTask(task);
                }} className={`group cursor-pointer flex items-start gap-4 p-4 bg-background border ${overdue ? 'border-red-200 dark:border-red-900' : 'border-border'} rounded-2xl shadow-sm transition-all hover:shadow-md hover:border-primary/50 ${task.status === 'COMPLETADO' ? 'opacity-50' : ''}`}>
                      <button onClick={() => toggleTaskStatus(task)} className="shrink-0 text-muted-foreground hover:text-primary transition-colors no-modal-click mt-0.5">
                        {task.status === 'COMPLETADO' ? <CheckCircle2 className="w-6 h-6 text-primary" /> : <Circle className="w-6 h-6" />}
                      </button>
                      
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-semibold truncate ${task.status === 'COMPLETADO' ? 'line-through' : 'text-foreground'}`}>
                          {task.title}
                        </p>
                        {task.description && (
                          <p className={`text-xs mt-0.5 truncate ${task.status === 'COMPLETADO' ? 'text-muted-foreground/50' : 'text-muted-foreground'}`}>
                            {task.description}
                          </p>
                        )}
                        <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs">
                          {tags.map((tag, i) => (
                            <span key={i} className={`flex items-center gap-1 font-semibold px-1.5 py-0.5 rounded whitespace-nowrap shrink-0 ${tag.color}`}>
                              <tag.icon className="w-3 h-3" /> {tag.label}
                            </span>
                          ))}
                          
                          {task.dueDate && (
                            <span className={`flex items-center gap-1 font-medium whitespace-nowrap shrink-0 ${overdue ? 'text-red-500' : 'text-muted-foreground'}`}>
                              <CalendarIcon className="w-3 h-3" /> 
                              {(() => {
                                const d = new Date(task.dueDate);
                                const dateStr = d.toLocaleDateString('es-MX', { month: 'short', day: 'numeric' });
                                const hasTime = d.getHours() !== 0 || d.getMinutes() !== 0;
                                const timeStr = d.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
                                return hasTime ? `${dateStr}, ${timeStr}` : dateStr;
                              })()}
                            </span>
                          )}
                          
                          {task.lead && (
                            <span className="flex items-center gap-1 text-primary bg-primary/10 px-1.5 py-0.5 rounded font-medium whitespace-nowrap shrink-0 max-w-[150px] truncate">
                              <User className="w-3 h-3 shrink-0" /> <span className="truncate">{task.lead.name}</span>
                            </span>
                          )}
                        </div>

                        {task.property && (
                          <div className="mt-3 flex items-center gap-2 bg-muted/50 p-2 rounded-xl w-fit max-w-full border border-border cursor-pointer hover:bg-muted transition-colors no-modal-click" onClick={(e) => {
                            e.stopPropagation();
                            window.location.href = `/admin/propiedades/${task.property.id}`;
                          }}>
                            {(() => {
                              let propertyImage = null;
                              if (task.property.images) {
                                try {
                                  const images = JSON.parse(task.property.images);
                                  if (Array.isArray(images) && images.length > 0) propertyImage = images[0];
                                } catch (e) {}
                              }
                              return propertyImage ? (
                                <Image src={propertyImage} width={32} height={32} className="object-cover rounded-lg shrink-0" alt="" />
                              ) : (
                                <div className="w-8 h-8 bg-primary/10 flex items-center justify-center rounded-lg text-primary shrink-0">
                                  <Building className="w-4 h-4" />
                                </div>
                              );
                            })()}
                            <span className="text-xs font-semibold truncate pr-2">{task.property.title}</span>
                          </div>
                        )}
                      </div>

                      <div className="relative group/avatar cursor-pointer shrink-0 no-modal-click">
                        {task.agent ? (
                          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs ring-2 ring-background shadow-sm shrink-0" title={task.agent.name || task.agent.email || 'Agente'}>
                            {(task.agent.name || task.agent.email || 'A').charAt(0).toUpperCase()}
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full border border-dashed border-border flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors shrink-0" title="Asignar">
                            <UserCircle2 className="w-4 h-4" />
                          </div>
                        )}
                        {/* Dropdown Menu */}
                        <div className="absolute right-0 top-10 mt-2 w-48 bg-card border border-border rounded-xl shadow-xl opacity-0 invisible group-hover/avatar:opacity-100 group-hover/avatar:visible transition-all z-10 p-1">
                          <p className="text-[10px] font-bold text-muted-foreground uppercase px-2 py-1.5">Asignar a</p>
                          {agents.map(agent => {
                            const displayName = agent.name || agent.email || 'Agente';
                            return (
                              <button key={agent.id} onClick={() => assignTask(task.id, agent.id)} className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-left rounded-lg hover:bg-muted transition-colors">
                                <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px]">
                                  {displayName.charAt(0).toUpperCase()}
                                </div>
                                <span className="flex-1 truncate">{displayName}</span>
                                {task.assignedTo === agent.id && <Check className="w-3 h-3 text-primary" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <button onClick={() => toggleImportant(task)} className={`shrink-0 p-2 rounded-xl transition-colors no-modal-click ${task.isImportant ? 'text-yellow-500 bg-yellow-50 dark:bg-yellow-500/10' : 'text-muted-foreground hover:bg-muted'}`}>
                        <Star className={`w-5 h-5 ${task.isImportant ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </Panel>

        <PanelResizeHandle className="hidden lg:flex w-2 hover:bg-primary/20 active:bg-primary/50 transition-colors cursor-col-resize z-10 shrink-0 items-center justify-center">
          <div className="w-0.5 h-8 bg-border rounded-full" />
        </PanelResizeHandle>

        {/* AI Chat Side Panel */}
        <Panel 
          panelRef={chatRef}
          defaultSize={300} 
          minSize={76} 
          collapsible={false}
          className={`border-l border-border bg-card hidden lg:flex flex-col`}
        >
          <div ref={chatInnerRef} className="w-full h-full flex flex-col">
          {isChatMini ? (
            <div onClick={() => chatRef.current?.resize(300)} className="w-full h-full flex flex-col items-center pt-6 text-muted-foreground hover:text-primary transition-colors cursor-pointer hover:bg-muted/50">
              <GeminiIcon className="w-6 h-6 mb-4" />
            </div>
          ) : (
            <div className="flex-1 h-full pt-10 p-6 flex flex-col">
              <AiTaskChat users={agents} currentUserId={currentUserId} onTaskCreated={fetchData} />
            </div>
          )}
          </div>
        </Panel>
      </PanelGroup>

      {/* Task Detail Modal */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card w-full max-w-2xl rounded-2xl shadow-2xl border border-border overflow-hidden flex flex-col max-h-full">
            <div className="px-6 py-4 border-b border-border flex items-start justify-between bg-muted/30">
              <div className="flex items-start gap-4">
                <button onClick={() => toggleTaskStatus(selectedTask)} className="shrink-0 text-muted-foreground hover:text-primary transition-colors mt-1">
                  {selectedTask.status === 'COMPLETADO' ? <CheckCircle2 className="w-6 h-6 text-primary" /> : <Circle className="w-6 h-6" />}
                </button>
                <div>
                  <h2 className={`text-xl font-bold ${selectedTask.status === 'COMPLETADO' ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                    {selectedTask.title}
                  </h2>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className="text-xs font-semibold px-2 py-1 rounded bg-primary/10 text-primary uppercase tracking-wider">
                      {selectedTask.status}
                    </span>
                    {selectedTask.isImportant && (
                      <span className="text-xs font-semibold px-2 py-1 rounded bg-yellow-500/10 text-yellow-600 flex items-center gap-1">
                        <Star className="w-3 h-3 fill-current" /> Importante
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedTask(null)} className="p-2 text-muted-foreground hover:bg-muted rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-0 flex flex-col md:flex-row">
              {/* Main Content (Left) */}
              <div className="flex-1 p-6 space-y-8 border-r border-border">
                {/* Información General */}
                <section>
                  <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2"><CheckSquare className="w-4 h-4" /> Descripción & Subtareas</h3>
                  <div className="bg-muted/30 rounded-xl p-4 border border-border mb-6">
                    <p className="text-sm text-foreground whitespace-pre-wrap">
                      {selectedTask.description || <span className="text-muted-foreground italic">Sin descripción detallada.</span>}
                    </p>
                  </div>
                  <TaskSubtasks 
                    taskId={selectedTask.id} 
                    initialSubtasks={selectedTask.subtasks || []} 
                    onUpdate={(subtasks) => {
                      setSelectedTask({...selectedTask, subtasks});
                      setAllTasks(allTasks.map(t => t.id === selectedTask.id ? {...t, subtasks} : t));
                    }} 
                  />
                </section>

                <div className="border-t border-border my-6"></div>

                <section>
                  <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2"><Paperclip className="w-4 h-4" /> Archivos Adjuntos</h3>
                  <div className="border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-muted/30 transition-colors cursor-pointer">
                    <Paperclip className="w-6 h-6 text-muted-foreground mb-2" />
                    <p className="text-sm font-medium">Arrastra archivos aquí o haz clic para subir</p>
                    <p className="text-xs text-muted-foreground mt-1">Soporta PDF, imágenes y documentos</p>
                  </div>
                </section>

                <div className="border-t border-border my-6"></div>

                <section>
                  <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2"><MessageSquare className="w-4 h-4" /> Comentarios</h3>
                  <div className="h-[250px]">
                    <TaskComments 
                      taskId={selectedTask.id} 
                      initialComments={selectedTask.comments || []} 
                      onUpdate={(comments) => {
                        setSelectedTask({...selectedTask, comments});
                        setAllTasks(allTasks.map(t => t.id === selectedTask.id ? {...t, comments} : t));
                      }} 
                    />
                  </div>
                </section>
              </div>

              {/* Sidebar (Right) */}
              <div className="w-full md:w-[300px] p-6 space-y-6 bg-muted/10 shrink-0">
                <section>
                  <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Fechas</h3>
                  <div className="space-y-3">
                    <div className="bg-card rounded-xl p-3 border border-border flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg text-primary"><CalendarIcon className="w-4 h-4" /></div>
                      <div>
                        <p className="text-xs text-muted-foreground">Vencimiento</p>
                        <p className="text-sm font-semibold">{selectedTask.dueDate ? new Date(selectedTask.dueDate).toLocaleDateString('es-MX', { month: 'short', day: 'numeric', year: 'numeric' }) : 'No definida'}</p>
                      </div>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Relaciones</h3>
                  <div className="space-y-3">
                    <div className="bg-card rounded-xl p-3 border border-border flex flex-col gap-2">
                      <span className="text-xs text-muted-foreground">Agente asignado</span>
                      <div className="flex items-center gap-2">
                        {selectedTask.agent ? (
                          <>
                            <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px]">{(selectedTask.agent.name || selectedTask.agent.email || 'A').charAt(0).toUpperCase()}</div>
                            <span className="text-sm font-semibold">{selectedTask.agent.name || selectedTask.agent.email || 'Agente'}</span>
                          </>
                        ) : (
                          <span className="text-sm text-muted-foreground">Sin asignar</span>
                        )}
                      </div>
                    </div>
                    
                    {selectedTask.lead && (
                      <div className="bg-card rounded-xl p-3 border border-border flex flex-col gap-2">
                        <span className="text-xs text-muted-foreground">Cliente Enlazado</span>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 flex items-center justify-center rounded-lg text-blue-600 shrink-0"><User className="w-4 h-4" /></div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold truncate">{selectedTask.lead.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{selectedTask.lead.phone}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedTask.property && (
                      <div className="bg-card rounded-xl p-3 border border-border flex flex-col gap-2 cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => window.location.href = `/admin/propiedades/${selectedTask.property.id}`}>
                        <span className="text-xs text-muted-foreground">Propiedad Enlazada</span>
                        <div className="flex items-center gap-3">
                          {(() => {
                            let propertyImage = null;
                            if (selectedTask.property.images) {
                              try {
                                const images = JSON.parse(selectedTask.property.images);
                                if (Array.isArray(images) && images.length > 0) propertyImage = images[0];
                              } catch (e) {}
                            }
                            return propertyImage ? (
                              <Image src={propertyImage} width={32} height={32} className="object-cover rounded-lg shrink-0" alt="" />
                            ) : (
                              <div className="w-8 h-8 bg-primary/10 flex items-center justify-center rounded-lg text-primary shrink-0"><Building className="w-4 h-4" /></div>
                            );
                          })()}
                          <div className="min-w-0">
                            <p className="text-sm font-semibold truncate">{selectedTask.property.title}</p>
                            <p className="text-xs text-muted-foreground truncate">{selectedTask.property.location}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      )}

      {isAdvancedModalOpen && (
        <CreateTaskModal 
          onClose={() => setIsAdvancedModalOpen(false)}
          onTaskCreated={(task) => setAllTasks([task, ...allTasks])}
          agents={agents}
          leads={leads}
          lists={lists}
          properties={properties}
          defaultListId={activeListId && !['INBOX', 'IMPORTANT', 'TODAY', 'ASSIGNED_TO_ME', 'DELEGATED', 'COMPLETED', 'OVERDUE'].includes(activeListId) ? activeListId : undefined}
        />
      )}
    </div>
  );
}
