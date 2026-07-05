"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Mic, Send, Sparkles, Loader2, StopCircle, User, Bot, CheckCircle2, AudioLines, X } from 'lucide-react';
import { toast } from 'sonner';

type Message = {
  role: 'user' | 'model';
  text: string;
  isSystem?: boolean;
  suggestedCategories?: string[];
  audioUrl?: string;
};

export default function AiTaskChat({ users, currentUserId, onTaskCreated }: { users: any[], currentUserId?: string, onTaskCreated?: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: '¡Hola! Soy tu asistente de delegación. Dime qué tareas quieres asignar y te ayudaré a agendarlas. También puedes enviarme notas de voz.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isDictating, setIsDictating] = useState(false);
  const [audioBlobState, setAudioBlobState] = useState<Blob | null>(null);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<any>(null);
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Cleanups
  useEffect(() => {
    return () => {
      stopDictation();
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const resetSilenceTimeout = () => {
    if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
    silenceTimeoutRef.current = setTimeout(() => {
      stopDictation();
    }, 10000);
  };

  const stopDictation = () => {
    if (recognitionRef.current) recognitionRef.current.stop();
    if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
    setIsDictating(false);
  };

  const toggleDictation = () => {
    if (isDictating) {
      stopDictation();
      return;
    }
    
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error('Tu navegador no soporta dictado por voz.');
      return;
    }
    
    const recognition = new SpeechRecognition();
    recognition.lang = 'es-ES';
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsDictating(true);
      resetSilenceTimeout();
    };
    recognition.onresult = (event: any) => {
      let currentTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        currentTranscript += event.results[i][0].transcript;
      }
      setInput(prev => prev ? `${prev} ${currentTranscript}` : currentTranscript);
      resetSilenceTimeout();
    };
    recognition.onerror = () => stopDictation();
    recognition.onend = () => stopDictation();

    recognitionRef.current = recognition;
    recognition.start();
  };

  const toggleAudioRecording = async () => {
    if (isRecording) {
      stopAudioRecording();
    } else {
      await startAudioRecording();
    }
  };

  const startAudioRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : '';
      const mediaRecorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mediaRecorder.mimeType || 'audio/webm' });
        stream.getTracks().forEach(track => track.stop());
        setAudioBlobState(audioBlob);
        setAudioPreviewUrl(URL.createObjectURL(audioBlob));
      };

      mediaRecorder.start(200);
      setIsRecording(true);
    } catch (err) {
      console.error(err);
      toast.error('Error al acceder al micrófono para grabar audio.');
    }
  };

  const stopAudioRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const processAudio = async (blob: Blob) => {
    setIsLoading(true);
    // Convert Blob to Base64
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = async () => {
      const base64Audio = reader.result?.toString().split(',')[1];
      if (!base64Audio) {
        setIsLoading(false);
        return;
      }

      const audioUrl = URL.createObjectURL(blob);
      setMessages(prev => [...prev, { role: 'user', text: '🎤 [Mensaje de Audio]', audioUrl }]);

      try {
        const res = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            audioBase64: base64Audio,
            mimeType: blob.type ? blob.type.split(';')[0] : 'audio/webm',
            history: messages.filter(m => !m.isSystem).map(m => ({ role: m.role, text: m.text })),
            currentUserId 
          })
        });
        
        await handleResponse(res);
      } catch (e) {
        toast.error('Error al enviar el audio');
      } finally {
        setIsLoading(false);
      }
    };
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isLoading || isRecording) return;

    if (audioBlobState) {
      const blob = audioBlobState;
      setAudioBlobState(null);
      setAudioPreviewUrl(null);
      await processAudio(blob);
    } else if (input.trim()) {
      const userText = input.trim();
      setInput('');
      setMessages(prev => [...prev, { role: 'user', text: userText }]);
      setIsLoading(true);

      try {
        const res = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            text: userText,
            history: messages.filter(m => !m.isSystem).map(m => ({ role: m.role, text: m.text })),
            currentUserId 
          })
        });
        await handleResponse(res);
      } catch (e) {
        toast.error('Error al comunicarse con la IA');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const sendQuickReply = async (userText: string, messageIndexToClear?: number) => {
    setMessages(prev => {
      const newMessages = [...prev];
      if (messageIndexToClear !== undefined && newMessages[messageIndexToClear]) {
        delete newMessages[messageIndexToClear].suggestedCategories;
      }
      return [...newMessages, { role: 'user', text: userText }];
    });
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: userText,
          history: messages.filter(m => !m.isSystem).map(m => ({ role: m.role, text: m.text })),
          currentUserId 
        })
      });
      await handleResponse(res);
    } catch (e) {
      toast.error('Error al comunicarse con la IA');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResponse = async (res: Response) => {
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast.error(`Error: ${data.details || 'Hubo un error en la respuesta del servidor'}`);
      return;
    }
    
    const data = await res.json();
    if (data.reply) {
      setMessages(prev => [...prev, { role: 'model', text: data.reply, suggestedCategories: data.suggestedCategories }]);
    }
    if (data.tasksCreated && data.tasksCreated.length > 0) {
      setMessages(prev => [...prev, { role: 'model', text: `✅ Se han asignado ${data.tasksCreated.length} tarea(s) correctamente en el sistema.`, isSystem: true }]);
      if (onTaskCreated) onTaskCreated();
    }
  };

  return (
    <div className="flex flex-col bg-card border border-border rounded-2xl shadow-sm h-[500px] overflow-hidden">
      <div className="bg-primary/5 p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <h3 className="font-bold text-foreground">Asistente de Delegación</h3>
        </div>
        <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full font-semibold">Gemini AI</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
              m.role === 'user' 
                ? 'bg-primary text-primary-foreground rounded-tr-none' 
                : m.isSystem 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 font-medium' 
                  : 'bg-muted text-foreground rounded-tl-none'
            }`}>
              {m.role === 'model' && !m.isSystem && <Bot className="w-4 h-4 mb-1 text-primary inline-block mr-1" />}
              {m.text}
              {m.audioUrl && (
                <div className="mt-2 rounded-xl overflow-hidden">
                  <audio src={m.audioUrl} controls className="h-10 w-[240px]" />
                </div>
              )}
            </div>
            
            {m.suggestedCategories && m.suggestedCategories.length > 0 && (
              <div className="mt-2 p-3 bg-muted/50 border border-border rounded-xl w-full max-w-[90%] self-start ml-2 shadow-sm">
                <p className="text-xs font-bold text-muted-foreground mb-2">Selecciona los detalles que quieres agregar:</p>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const formData = new FormData(form);
                  const selected = formData.getAll('category') as string[];
                  if (selected.length > 0) {
                    sendQuickReply("Quiero agregar detalles a: " + selected.join(", "), i);
                  }
                }}>
                  <div className="space-y-1 mb-3">
                    {m.suggestedCategories.map(cat => (
                      <label key={cat} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-muted p-1 rounded">
                        <input type="checkbox" name="category" value={cat} className="rounded text-primary focus:ring-primary w-4 h-4" />
                        <span className="text-foreground">{cat}</span>
                      </label>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" className="text-xs font-semibold bg-primary text-primary-foreground px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-colors">
                      Agregar detalles
                    </button>
                    <button type="button" onClick={() => sendQuickReply("No, omitir y crear la tarea así", i)} className="text-xs font-semibold bg-background border border-border text-foreground px-3 py-1.5 rounded-lg hover:bg-muted transition-colors">
                      No, omitir
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted text-muted-foreground rounded-2xl rounded-tl-none px-4 py-3.5 flex items-center gap-1 w-fit">
              <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 border-t border-border bg-background">
        <form onSubmit={handleSend} className="flex items-center gap-2">
          {!audioPreviewUrl ? (
            <>
              <button
                type="button"
                onClick={toggleDictation}
                className={`p-2.5 rounded-full shrink-0 transition-colors ${isDictating ? 'bg-red-100 text-red-500 animate-pulse' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}
                title="Dictar texto"
              >
                <Mic className="w-5 h-5" />
              </button>
              
              <button
                type="button"
                onClick={toggleAudioRecording}
                className={`px-3 py-2 rounded-full shrink-0 flex items-center gap-2 font-medium transition-colors ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-muted hover:bg-muted/80 text-foreground'}`}
                title={isRecording ? "Detener grabación" : "Grabar Nota de Voz"}
              >
                {isRecording ? <StopCircle className="w-4 h-4" /> : <AudioLines className="w-4 h-4" />}
                <span className="text-sm">Voz</span>
              </button>

              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                disabled={isLoading || isRecording}
                placeholder={isRecording ? "Grabando..." : isDictating ? "Escuchando..." : "Escribe tu tarea..."}
                className="flex-1 min-w-0 bg-muted border-none rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/50"
              />
            </>
          ) : (
            <div className="flex-1 flex items-center gap-2 bg-muted rounded-xl px-2 py-1 min-w-0">
              <audio src={audioPreviewUrl} controls className="flex-1 h-10 min-w-0" />
              <button 
                type="button" 
                onClick={() => {
                  setAudioPreviewUrl(null);
                  setAudioBlobState(null);
                }}
                className="p-2 text-muted-foreground hover:text-red-500 rounded-full hover:bg-background transition-colors shrink-0"
                title="Eliminar grabación"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
          
          <button
            type="submit"
            disabled={(!input.trim() && !audioBlobState) || isLoading || isRecording}
            className="p-2.5 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 disabled:opacity-50 transition-colors shrink-0"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
        <p className="text-[10px] text-muted-foreground text-center mt-2">
          Haz clic en el botón de Voz para empezar o detener la grabación.
        </p>
      </div>
    </div>
  );
}
