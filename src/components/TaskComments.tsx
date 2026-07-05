"use client";

import React, { useState } from 'react';
import { Send, UserCircle2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import Image from 'next/image';

export default function TaskComments({ taskId, initialComments = [], onUpdate }: { taskId: string, initialComments: any[], onUpdate: (comments: any[]) => void }) {
  const [comments, setComments] = useState<any[]>(initialComments);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    setIsLoading(true);
    try {
      const res = await fetch(`/api/tasks/${taskId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newComment })
      });
      if (res.ok) {
        const added = await res.json();
        const updated = [...comments, added];
        setComments(updated);
        onUpdate(updated);
        setNewComment('');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex-1 overflow-y-auto space-y-4 min-h-[150px] max-h-[300px] pr-2">
        {comments.length === 0 ? (
          <p className="text-sm text-muted-foreground italic text-center py-4">No hay comentarios aún.</p>
        ) : (
          comments.map(comment => (
            <div key={comment.id} className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden">
                {comment.user?.image ? (
                  <Image src={comment.user.image} alt={comment.user.name} fill className="object-cover" sizes="32px" />
                ) : (
                  <UserCircle2 className="w-5 h-5 text-primary" />
                )}
              </div>
              <div className="flex-1 bg-muted/30 rounded-2xl rounded-tl-none p-3 border border-border">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs font-bold">{comment.user?.name || 'Usuario'}</span>
                  <span className="text-[10px] text-muted-foreground">
                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: es })}
                  </span>
                </div>
                <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleAdd} className="flex items-end gap-2 mt-auto pt-2 border-t border-border">
        <textarea 
          value={newComment} 
          onChange={(e) => setNewComment(e.target.value)} 
          placeholder="Escribe un comentario..."
          className="flex-1 bg-muted/50 border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none h-[40px] max-h-[120px]"
          disabled={isLoading}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleAdd(e);
            }
          }}
        />
        <button 
          type="submit" 
          disabled={!newComment.trim() || isLoading}
          className="bg-primary text-primary-foreground h-[40px] px-3 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
