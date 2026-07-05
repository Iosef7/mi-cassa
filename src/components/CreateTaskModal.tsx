import React, { useState } from 'react';
import { X, CheckSquare, Calendar as CalendarIcon, User, Home, Users, List, Flag, FileText } from 'lucide-react';

interface CreateTaskModalProps {
  onClose: () => void;
  onTaskCreated: (task: any) => void;
  agents: any[];
  leads: any[];
  lists: any[];
  properties: any[];
  defaultListId?: string;
  defaultPropertyId?: string;
  defaultLeadId?: string;
}

export default function CreateTaskModal({ onClose, onTaskCreated, agents, leads, lists, properties, defaultListId, defaultPropertyId, defaultLeadId }: CreateTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [listId, setListId] = useState(defaultListId || '');
  const [propertyId, setPropertyId] = useState(defaultPropertyId || '');
  const [leadId, setLeadId] = useState(defaultLeadId || '');
  const [status, setStatus] = useState('PENDIENTE');
  const [isImportant, setIsImportant] = useState(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          assignedTo: assignedTo || null,
          dueDate: dueDate || null,
          listId: listId || null,
          propertyId: propertyId || null,
          leadId: leadId || null,
          status,
          isImportant
        })
      });

      if (res.ok) {
        const newTask = await res.json();
        onTaskCreated(newTask);
        onClose();
      }
    } catch (error) {
      console.error('Error creating task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card w-full max-w-2xl rounded-2xl shadow-2xl border border-border flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-muted/30">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <CheckSquare className="text-primary w-6 h-6" />
            Creación Avanzada de Tarea
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <form id="create-task-form" onSubmit={handleSubmit} className="space-y-6">
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5 text-foreground">Título de la Tarea <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Ej. Llamar al cliente para agendar visita..."
                  className="w-full bg-background border border-border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5 text-foreground flex items-center gap-2">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  Descripción / Objetivo
                </label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Detalles adicionales sobre lo que se debe hacer..."
                  rows={3}
                  className="w-full bg-background border border-border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground resize-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium mb-1.5 text-foreground flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  Asignar a
                </label>
                <select
                  value={assignedTo}
                  onChange={e => setAssignedTo(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="">Sin asignar</option>
                  {agents.map(agent => (
                    <option key={agent.id} value={agent.id}>{agent.name || agent.email || 'Agente sin nombre'}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5 text-foreground flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                  Fecha límite (Opcional)
                </label>
                <input
                  type="datetime-local"
                  value={dueDate}
                  onChange={e => setDueDate(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5 text-foreground flex items-center gap-2">
                  <Home className="w-4 h-4 text-muted-foreground" />
                  Propiedad involucrada
                </label>
                <select
                  value={propertyId}
                  onChange={e => setPropertyId(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="">Ninguna propiedad</option>
                  {properties.map(p => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5 text-foreground flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  Cliente involucrado (Lead)
                </label>
                <select
                  value={leadId}
                  onChange={e => setLeadId(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="">Ningún cliente</option>
                  {leads.map(l => (
                    <option key={l.id} value={l.id}>{l.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5 text-foreground flex items-center gap-2">
                  <List className="w-4 h-4 text-muted-foreground" />
                  Lista de Tareas
                </label>
                <select
                  value={listId}
                  onChange={e => setListId(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="">Inbox (Sin Lista)</option>
                  {lists.map(list => (
                    <option key={list.id} value={list.id}>{list.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col justify-end">
                <label className="flex items-center gap-3 p-3 border border-border rounded-xl cursor-pointer hover:bg-muted/50 transition-colors">
                  <input
                    type="checkbox"
                    checked={isImportant}
                    onChange={e => setIsImportant(e.target.checked)}
                    className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <div className="flex items-center gap-2">
                    <Flag className={`w-4 h-4 ${isImportant ? 'text-red-500 fill-red-500' : 'text-muted-foreground'}`} />
                    <span className="font-medium text-sm">Marcar como Importante</span>
                  </div>
                </label>
              </div>
            </div>

          </form>
        </div>

        <div className="p-4 border-t border-border bg-muted/10 flex justify-end gap-3">
          <button 
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl font-medium text-muted-foreground hover:bg-muted transition-colors"
          >
            Cancelar
          </button>
          <button 
            type="submit"
            form="create-task-form"
            disabled={isSubmitting || !title.trim()}
            className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-bold shadow-md shadow-primary/20 hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? 'Guardando...' : 'Crear Tarea'}
          </button>
        </div>
      </div>
    </div>
  );
}
