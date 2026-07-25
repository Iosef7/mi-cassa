'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Send, Bot, User as UserIcon, Building, Phone, Mail, FileText, Loader2 } from 'lucide-react';
import { askMeetingCopilotAction } from '@/actions/meetings';
import { toast } from 'sonner';

interface TaskMeetingCopilotModalProps {
  task: any;
  onClose: () => void;
}

export default function TaskMeetingCopilotModal({ task, onClose }: TaskMeetingCopilotModalProps) {
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    {
      sender: 'ai',
      text: `Hola! Soy tu Copiloto de IA para esta tarea. Conozco todo lo que se habló en la reunión "${task.meeting?.title || 'de origen'}". ¿En qué te puedo ayudar o qué necesitas preparar?`
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userQuery = input.trim();
    setInput('');
    setMessages(prev => [...prev, { sender: 'user', text: userQuery }]);
    setIsLoading(true);

    const res = await askMeetingCopilotAction({ taskId: task.id, questionText: userQuery });
    setIsLoading(false);

    if (res.success && res.answer) {
      setMessages(prev => [...prev, { sender: 'ai', text: res.answer }]);
    } else {
      toast.error('Error procesando consulta con el Copiloto');
    }
  };

  const handleQuickPrompt = (promptText: string) => {
    setInput(promptText);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/50 backdrop-blur-sm p-4 md:p-6 animate-fadeIn">
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 50 }}
        className="bg-card border border-border w-full max-w-xl h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 border-b border-border bg-muted/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="font-bold text-foreground text-base">Copiloto de IA de la Reunión</h3>
              <p className="text-xs text-muted-foreground truncate max-w-xs">{task.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Info Context Card */}
        <div className="px-4 py-3 bg-muted/10 border-b border-border text-xs flex flex-wrap gap-3">
          {task.property && (
            <div className="flex items-center gap-1 text-primary bg-primary/10 px-2 py-1 rounded-md">
              <Building size={12} />
              <span>{task.property.title}</span>
            </div>
          )}
          {task.lead && (
            <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md">
              <UserIcon size={12} />
              <span>{task.lead.name}</span>
            </div>
          )}
          {task.meetingExcerpt && (
            <div className="w-full text-muted-foreground bg-muted/40 p-2 rounded-md italic border-l-2 border-primary">
              "{task.meetingExcerpt}"
            </div>
          )}
        </div>

        {/* Quick Prompts */}
        <div className="px-4 py-2 bg-card border-b border-border flex items-center gap-2 overflow-x-auto text-xs no-scrollbar">
          <button
            onClick={() => handleQuickPrompt('Redáctame un correo para el cliente')}
            className="shrink-0 px-2.5 py-1 bg-muted hover:bg-muted/80 rounded-full text-muted-foreground hover:text-foreground transition-colors"
          >
            ✉️ Redactar Correo
          </button>
          <button
            onClick={() => handleQuickPrompt('Borrador de mensaje de WhatsApp')}
            className="shrink-0 px-2.5 py-1 bg-muted hover:bg-muted/80 rounded-full text-muted-foreground hover:text-foreground transition-colors"
          >
            💬 Borrador WhatsApp
          </button>
          <button
            onClick={() => handleQuickPrompt('¿Cuáles eran las objeciones principales del cliente?')}
            className="shrink-0 px-2.5 py-1 bg-muted hover:bg-muted/80 rounded-full text-muted-foreground hover:text-foreground transition-colors"
          >
            ❓ Ver Objeciones
          </button>
        </div>

        {/* Chat Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  m.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'
                }`}
              >
                {m.sender === 'user' ? <UserIcon size={16} /> : <Bot size={16} />}
              </div>
              <div
                className={`max-w-[80%] p-3.5 rounded-2xl text-sm leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-primary text-primary-foreground rounded-tr-none'
                    : 'bg-muted/60 text-foreground border border-border rounded-tl-none whitespace-pre-wrap'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-3 text-muted-foreground text-sm p-3">
              <Loader2 size={18} className="animate-spin text-primary" />
              <span>Consultando la minuta de la reunión...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-3 border-t border-border bg-card flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Pregúntale al Copiloto sobre esta tarea o reunión..."
            className="flex-1 px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-2.5 bg-primary text-primary-foreground rounded-xl disabled:opacity-50 hover:opacity-90 transition-opacity"
          >
            <Send size={18} />
          </button>
        </form>
      </motion.div>
    </div>
  );
}
