'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, CheckCircle2, Circle, Star, Calendar, Search, Plus, 
  Sparkles, Shield, UserCircle2, Loader2, Target, Briefcase, ChevronRight, Edit, X, Save, Trash2, Mail, Copy, Check
} from 'lucide-react';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import AiTaskChat from '@/components/AiTaskChat';

export default function EquipoPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [allTasks, setAllTasks] = useState<any[]>([]);
  const [recentCompletedTasks, setRecentCompletedTasks] = useState<any[]>([]);
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResult, setAiResult] = useState<{text: string, type: 'success' | 'error'} | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [editFormData, setEditFormData] = useState({ name: '', email: '', password: '', role: 'AGENT' });
  const [isSavingUser, setIsSavingUser] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [isDeletingUser, setIsDeletingUser] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('auto');
  
  // Invitation states
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('AGENT');
  const [inviteLink, setInviteLink] = useState('');
  const [isGeneratingInvite, setIsGeneratingInvite] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  
  const recognitionRef = React.useRef<any>(null);
  const silenceTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
    }
    setIsListening(false);
  };

  const resetSilenceTimeout = () => {
    if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
    silenceTimeoutRef.current = setTimeout(() => {
      stopListening();
    }, 10000);
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
      return;
    }
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error('Tu navegador no soporta reconocimiento de voz.');
      return;
    }
    
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'es-ES';
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      resetSilenceTimeout();
    };
    recognition.onresult = (event: any) => {
      let currentTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        currentTranscript += event.results[i][0].transcript;
      }
      setAiPrompt(prev => prev ? `${prev} ${currentTranscript}` : currentTranscript);
      resetSilenceTimeout();
    };
    recognition.onerror = (event: any) => {
      if (event.error !== 'aborted') {
        console.error('Speech recognition error', event.error);
      }
      stopListening();
    };
    recognition.onend = () => {
      stopListening();
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const { data: session } = useSession();
  const currentUserId = session?.user?.id;

  useEffect(() => {
    fetchData();
    return () => {
      stopListening();
    };
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
        const tasks = await tasksRes.json();
        setAllTasks(tasks);
        const completed = tasks.filter((t: any) => t.status === 'COMPLETADO')
          .sort((a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
          .slice(0, 5); // top 5 recent
        setRecentCompletedTasks(completed);
      }
    } catch (error) {
      console.error(error);
    }
  };


  
  useEffect(() => {
    fetchData();
  }, []);

  const handleEditUser = (user: any) => {
    setEditingUser(user);
    setEditFormData({ name: user.name, email: user.email, password: '', role: user.role || 'AGENT' });
  };

  const saveUser = async () => {
    if (!editingUser) return;
    setIsSavingUser(true);
    try {
      const res = await fetch(`/api/users/${editingUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editFormData.name,
          email: editFormData.email,
          role: editFormData.role,
          ...(editFormData.password ? { password: editFormData.password } : {})
        })
      });
      if (res.ok) {
        toast.success("Cuenta actualizada exitosamente");
        setEditingUser(null);
        fetchData();
      } else {
        toast.error("Error al actualizar la cuenta");
      }
    } catch (e) {
      toast.error("Error de conexión");
    } finally {
      setIsSavingUser(false);
    }
  };

  const handleDeleteUser = (id: string) => {
    setUserToDelete(id);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;
    setIsDeletingUser(true);
    try {
      const res = await fetch(`/api/users/${userToDelete}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success("Cuenta eliminada correctamente");
        fetchData();
      } else {
        toast.error("Error al eliminar la cuenta");
      }
    } catch (e) {
      toast.error("Error de conexión");
    } finally {
      setIsDeletingUser(false);
      setUserToDelete(null);
    }
  };

  const generateInvite = async () => {
    if (!inviteEmail) {
      toast.error("Ingresa un correo electrónico");
      return;
    }
    
    setIsGeneratingInvite(true);
    setInviteLink('');
    setCopiedLink(false);
    
    try {
      const res = await fetch('/api/invitations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inviteEmail, role: inviteRole })
      });
      const data = await res.json();
      
      if (res.ok) {
        const url = `${window.location.origin}/register?token=${data.token}`;
        setInviteLink(url);
        toast.success("Invitación enviada exitosamente al correo.");
      } else {
        toast.error(data.error || "Error al generar invitación");
      }
    } catch (e) {
      toast.error("Error de conexión");
    } finally {
      setIsGeneratingInvite(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopiedLink(true);
    toast.success("Enlace copiado al portapapeles");
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (session?.user?.role && session.user.role !== 'ADMIN') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-background h-full p-8 text-center">
        <Shield className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-foreground">Acceso Restringido</h1>
        <p className="text-muted-foreground mt-2">Solo los administradores pueden gestionar el equipo y los permisos.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-background h-[calc(100vh-theme(spacing.16))] overflow-y-auto">
      <div className="max-w-6xl w-full mx-auto p-8 space-y-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Members Grid */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Users className="w-5 h-5 text-muted-foreground" /> Miembros del Equipo
              </h2>
              <button onClick={() => setShowInviteModal(true)} className="flex items-center gap-2 bg-foreground text-background hover:bg-foreground/90 px-4 py-2 rounded-xl text-sm font-bold transition-colors">
                <Plus className="w-4 h-4" /> Invitar Miembro
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {users.map(user => (
                <div key={user.id} className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-lg ring-2 ring-background shadow-sm">
                      {user.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-foreground truncate pr-2">{user.name}</h3>
                        <div className="flex gap-1 shrink-0">
                          <button onClick={() => handleEditUser(user)} className="text-muted-foreground hover:text-primary transition-colors p-1 rounded-md hover:bg-primary/10" title="Editar">
                            <Edit className="w-4 h-4" />
                          </button>
                          {user.id !== currentUserId && (
                            <button onClick={() => handleDeleteUser(user.id)} className="text-muted-foreground hover:text-red-500 transition-colors p-1 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30" title="Eliminar">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
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
                  
                  <button 
                    onClick={() => setExpandedUserId(expandedUserId === user.id ? null : user.id)}
                    className="w-full flex items-center justify-center gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 py-2 rounded-lg text-sm font-bold transition-colors mt-2"
                  >
                    Ver Tareas de {user.name.split(' ')[0]} <ChevronRight className={`w-4 h-4 transition-transform ${expandedUserId === user.id ? 'rotate-90' : ''}`} />
                  </button>

                  {expandedUserId === user.id && (
                    <div className="pt-2 border-t border-border mt-2 space-y-2 animate-in slide-in-from-top-2">
                      {allTasks.filter(t => t.assignedTo === user.id && t.status !== 'COMPLETADO').length === 0 ? (
                        <p className="text-xs text-muted-foreground text-center py-3">No tiene tareas pendientes.</p>
                      ) : (
                        allTasks.filter(t => t.assignedTo === user.id && t.status !== 'COMPLETADO').map(task => (
                          <div key={task.id} className="bg-background rounded-lg p-3 text-sm border border-border shadow-sm flex items-start gap-2">
                            <Circle className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-foreground truncate">{task.title}</p>
                              {task.dueDate && <p className="text-[10px] text-muted-foreground font-semibold mt-1 uppercase tracking-wider">Vence: {new Date(task.dueDate).toLocaleDateString('es-MX', { month: 'short', day: 'numeric'})}</p>}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Side Panel: AI Chat & Recent Activity */}
          <div className="space-y-6">
            <AiTaskChat users={users} currentUserId={currentUserId} onTaskCreated={fetchData} />

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

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-card border border-border shadow-lg rounded-3xl w-full max-w-md p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2"><UserCircle2 className="w-5 h-5 text-primary" /> Editar Cuenta</h2>
              <button onClick={() => setEditingUser(null)} className="p-2 hover:bg-muted rounded-full transition-colors"><X className="w-5 h-5 text-muted-foreground" /></button>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Nombre</label>
                <input 
                  type="text" 
                  className="w-full p-3 bg-muted border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  value={editFormData.name}
                  onChange={e => setEditFormData({...editFormData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Correo Electrónico</label>
                <input 
                  type="email" 
                  className="w-full p-3 bg-muted border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  value={editFormData.email}
                  onChange={e => setEditFormData({...editFormData, email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Cargo / Rol</label>
                <select 
                  className="w-full p-3 bg-muted border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all cursor-pointer"
                  value={editFormData.role}
                  onChange={e => setEditFormData({...editFormData, role: e.target.value})}
                  disabled={editingUser?.id === currentUserId}
                  title={editingUser?.id === currentUserId ? "No puedes cambiar tu propio rol" : ""}
                >
                  <option value="AGENT">Asesor (Ventas / Agente)</option>
                  <option value="ADMIN">Administrador (CEO / Gerente)</option>
                  <option value="MARKETING">Marketing (Difusión)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Nueva Contraseña (Opcional)</label>
                <input 
                  type="password" 
                  placeholder="Dejar en blanco para no cambiarla"
                  className="w-full p-3 bg-muted border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  value={editFormData.password}
                  onChange={e => setEditFormData({...editFormData, password: e.target.value})}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <button onClick={() => setEditingUser(null)} className="px-5 py-2.5 text-sm font-bold text-muted-foreground hover:bg-muted rounded-xl transition-colors">Cancelar</button>
              <button onClick={saveUser} disabled={isSavingUser} className="px-5 py-2.5 text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl transition-colors flex items-center gap-2">
                {isSavingUser ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-card border border-border shadow-lg rounded-3xl w-full max-w-sm p-6 space-y-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 text-red-500 rounded-full flex items-center justify-center">
                <Trash2 className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-foreground">¿Eliminar cuenta?</h2>
              <p className="text-sm text-muted-foreground">
                ¿Estás seguro de que quieres eliminar esta cuenta? Esta acción no se puede deshacer y el usuario perderá acceso al sistema permanentemente.
              </p>
            </div>
            
            <div className="flex gap-3 pt-4 border-t border-border">
              <button 
                onClick={() => setUserToDelete(null)} 
                disabled={isDeletingUser}
                className="flex-1 px-4 py-2.5 text-sm font-bold text-muted-foreground hover:bg-muted rounded-xl transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmDeleteUser} 
                disabled={isDeletingUser} 
                className="flex-1 px-4 py-2.5 text-sm font-bold bg-red-500 text-white hover:bg-red-600 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50 shadow-md shadow-red-500/20"
              >
                {isDeletingUser ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sí, Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invite Member Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-card border border-border shadow-lg rounded-3xl w-full max-w-md p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2"><Mail className="w-5 h-5 text-primary" /> Invitar Miembro</h2>
              <button onClick={() => { setShowInviteModal(false); setInviteLink(''); }} className="p-2 hover:bg-muted rounded-full transition-colors"><X className="w-5 h-5 text-muted-foreground" /></button>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Correo del Invitado</label>
                <input 
                  type="email" 
                  className="w-full p-3 bg-muted border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  placeholder="ejemplo@micassa.com"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Cargo / Rol</label>
                <select 
                  className="w-full p-3 bg-muted border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all cursor-pointer"
                  value={inviteRole}
                  onChange={e => setInviteRole(e.target.value)}
                >
                  <option value="AGENT">Asesor (Ventas / Agente)</option>
                  <option value="ADMIN">Administrador (CEO / Gerente)</option>
                  <option value="MARKETING">Marketing (Difusión)</option>
                </select>
              </div>
            </div>

            {!inviteLink ? (
              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <button onClick={() => setShowInviteModal(false)} className="px-5 py-2.5 text-sm font-bold text-muted-foreground hover:bg-muted rounded-xl transition-colors">Cancelar</button>
                <button onClick={generateInvite} disabled={isGeneratingInvite || !inviteEmail} className="px-5 py-2.5 text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl transition-colors flex items-center gap-2 disabled:opacity-50 shadow-md shadow-primary/20">
                  {isGeneratingInvite ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                  {isGeneratingInvite ? 'Enviando Invitación...' : 'Generar y Enviar Correo'}
                </button>
              </div>
            ) : (
              <div className="pt-4 border-t border-border space-y-4 animate-in slide-in-from-bottom-2">
                <div className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 p-3 rounded-lg text-sm text-center font-medium border border-green-200 dark:border-green-900/50 flex flex-col items-center gap-2">
                  <CheckCircle2 className="w-8 h-8 text-green-500" />
                  <span>¡Invitación enviada automáticamente a <strong>{inviteEmail}</strong>!</span>
                  <span className="text-xs opacity-80">El enlace es válido por 24 horas.</span>
                </div>
                <div className="mt-4">
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">O copia el enlace manualmente:</label>
                  <div className="flex items-center gap-2 bg-muted p-2 rounded-xl border border-border">
                    <input type="text" readOnly value={inviteLink} className="w-full bg-transparent border-none text-xs text-muted-foreground outline-none px-2" />
                    <button onClick={copyToClipboard} className="p-2 bg-background hover:bg-muted border border-border rounded-lg text-foreground transition-colors shrink-0">
                      {copiedLink ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <button 
                  onClick={() => { setShowInviteModal(false); setInviteLink(''); setInviteEmail(''); }}
                  className="w-full py-3 mt-2 flex items-center justify-center gap-2 bg-foreground text-background hover:bg-foreground/90 rounded-xl font-bold text-sm transition-colors shadow-md shadow-foreground/10"
                >
                  Cerrar
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
