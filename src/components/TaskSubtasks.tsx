"use client";

import React, { useState } from 'react';
import { Plus, CheckSquare, Square, Trash2 } from 'lucide-react';

export default function TaskSubtasks({ taskId, initialSubtasks = [], onUpdate }: { taskId: string, initialSubtasks: any[], onUpdate: (subtasks: any[]) => void }) {
  const [subtasks, setSubtasks] = useState<any[]>(initialSubtasks);
  const [newSubtask, setNewSubtask] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtask.trim()) return;
    
    setIsLoading(true);
    try {
      const res = await fetch(`/api/tasks/${taskId}/subtasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newSubtask })
      });
      if (res.ok) {
        const added = await res.json();
        const updated = [...subtasks, added];
        setSubtasks(updated);
        onUpdate(updated);
        setNewSubtask('');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = async (subtaskId: string, currentStatus: boolean) => {
    const updated = subtasks.map(s => s.id === subtaskId ? { ...s, isCompleted: !currentStatus } : s);
    setSubtasks(updated);
    onUpdate(updated);

    await fetch(`/api/tasks/${taskId}/subtasks?subtaskId=${subtaskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isCompleted: !currentStatus })
    });
  };

  const handleDelete = async (subtaskId: string) => {
    const updated = subtasks.filter(s => s.id !== subtaskId);
    setSubtasks(updated);
    onUpdate(updated);

    await fetch(`/api/tasks/${taskId}/subtasks?subtaskId=${subtaskId}`, {
      method: 'DELETE'
    });
  };

  const completedCount = subtasks.filter(s => s.isCompleted).length;
  const progress = subtasks.length > 0 ? (completedCount / subtasks.length) * 100 : 0;

  return (
    <div className="flex flex-col gap-3">
      {subtasks.length > 0 && (
        <div className="flex items-center gap-3 text-xs font-semibold text-muted-foreground mb-1">
          <span>{completedCount}/{subtasks.length} completadas</span>
          <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      <ul className="space-y-2">
        {subtasks.map(subtask => (
          <li key={subtask.id} className="flex items-start gap-2 group">
            <button 
              onClick={() => handleToggle(subtask.id, subtask.isCompleted)}
              className="mt-0.5 text-muted-foreground hover:text-primary transition-colors shrink-0"
            >
              {subtask.isCompleted ? <CheckSquare className="w-4 h-4 text-primary" /> : <Square className="w-4 h-4" />}
            </button>
            <span className={`text-sm flex-1 ${subtask.isCompleted ? 'line-through text-muted-foreground/50' : 'text-foreground'}`}>
              {subtask.title}
            </span>
            <button 
              onClick={() => handleDelete(subtask.id)}
              className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-500 transition-all shrink-0"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </li>
        ))}
      </ul>

      <form onSubmit={handleAdd} className="mt-2 flex items-center gap-2">
        <input 
          type="text" 
          value={newSubtask} 
          onChange={(e) => setNewSubtask(e.target.value)} 
          placeholder="Añadir una subtarea..."
          className="flex-1 bg-muted/50 border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          disabled={isLoading}
        />
        <button 
          type="submit" 
          disabled={!newSubtask.trim() || isLoading}
          className="bg-primary/10 text-primary p-1.5 rounded-lg hover:bg-primary/20 transition-colors disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
