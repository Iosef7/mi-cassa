'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, Clock, Calendar, User, LogIn, LogOut, CheckCircle2, 
  Activity, Shield, TrendingUp, Loader2, Sparkles, Filter 
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface AttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: any[];
  initialUserId?: string | null;
}

export default function TeamAttendanceModal({
  isOpen,
  onClose,
  users,
  initialUserId = null
}: AttendanceModalProps) {
  const [selectedUserId, setSelectedUserId] = useState<string>(initialUserId || 'ALL');
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (initialUserId) {
      setSelectedUserId(initialUserId);
    } else {
      setSelectedUserId('ALL');
    }
  }, [initialUserId, isOpen]);

  useEffect(() => {
    if (isOpen) {
      fetchAttendanceLogs();
    }
  }, [isOpen, selectedUserId]);

  const fetchAttendanceLogs = async () => {
    setIsLoading(true);
    try {
      const url = selectedUserId && selectedUserId !== 'ALL' 
        ? `/api/team/attendance?userId=${selectedUserId}&limit=60`
        : `/api/team/attendance?limit=60`;
      
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setLogs(data);
      }
    } catch (err) {
      console.error("Error fetching attendance logs:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const formatTime = (dateStr?: string | Date | null) => {
    if (!dateStr) return '--:--';
    const date = new Date(dateStr);
    return date.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const formatDate = (dateStr: string | Date) => {
    const date = new Date(dateStr);
    return format(date, "EEEE d 'de' MMMM, yyyy", { locale: es });
  };

  // Compute overall summary stats
  const totalLogsCount = logs.length;
  const totalMinutesSum = logs.reduce((acc, curr) => acc + (curr.durationMinutes || 0), 0);
  const totalHoursFormatted = `${Math.floor(totalMinutesSum / 60)}h ${totalMinutesSum % 60}m`;
  const selectedUserObj = users.find(u => u.id === selectedUserId);

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-card border border-border shadow-2xl rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-border flex items-center justify-between bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold shadow-sm">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                Horarios de Entrada y Salida
              </h2>
              <p className="text-xs text-muted-foreground">
                {selectedUserObj 
                  ? `Historial de accesos y actividad de ${selectedUserObj.name}`
                  : 'Registro de asistencia y horas de todos los integrantes del equipo'}
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter bar & Summary Cards */}
        <div className="p-6 border-b border-border bg-card space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            
            {/* User Selector Dropdown */}
            <div className="flex items-center gap-2 bg-muted/60 p-1.5 rounded-2xl border border-border flex-1 max-w-xs">
              <Filter className="w-4 h-4 text-muted-foreground ml-2" />
              <select 
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="bg-transparent text-sm font-medium text-foreground outline-none w-full cursor-pointer pr-2"
              >
                <option value="ALL">Todos los integrantes</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.name} ({u.role === 'ADMIN' ? 'Admin' : 'Asesor'})</option>
                ))}
              </select>
            </div>

            {/* Quick Metrics */}
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 text-primary px-4 py-2 rounded-2xl flex items-center gap-2 border border-primary/20">
                <TrendingUp className="w-4 h-4" />
                <div className="text-left">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground leading-tight">Total Registros</p>
                  <p className="text-sm font-black">{totalLogsCount} días</p>
                </div>
              </div>

              <div className="bg-green-500/10 text-green-600 dark:text-green-400 px-4 py-2 rounded-2xl flex items-center gap-2 border border-green-500/20">
                <Activity className="w-4 h-4" />
                <div className="text-left">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground leading-tight">Horas Acumuladas</p>
                  <p className="text-sm font-black">{totalHoursFormatted}</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Log Table / List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-muted/10">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <Loader2 className="w-8 h-8 animate-spin mb-2 text-primary" />
              <p className="text-sm font-medium">Cargando historial de entradas y salidas...</p>
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-border rounded-3xl p-8">
              <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-40" />
              <h3 className="text-base font-bold text-foreground">Sin registros de entrada aún</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Los horarios de entrada y salida se guardan automáticamente cada día cuando los integrantes ingresan al sistema.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {logs.map((log) => {
                const now = new Date();
                const logDate = new Date(log.date);
                const isToday = logDate.toDateString() === now.toDateString();
                const isOnlineNow = isToday && log.userStatus !== 'INVISIBLE' && (now.getTime() - new Date(log.lastSeenAt).getTime()) < 10 * 60 * 1000;

                return (
                  <div 
                    key={log.id} 
                    className="bg-card border border-border rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold shrink-0">
                        {log.userName ? log.userName.charAt(0) : 'U'}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-foreground text-sm truncate">{log.userName}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-muted text-muted-foreground uppercase">
                            {log.userRole === 'ADMIN' ? 'Admin' : 'Asesor'}
                          </span>
                          {isOnlineNow && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20 flex items-center gap-1 animate-pulse">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> En Línea
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5 capitalize">
                          <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                          {formatDate(log.date)}
                        </p>
                      </div>
                    </div>

                    {/* Time Details Grid */}
                    <div className="flex items-center gap-3 sm:gap-6 bg-muted/40 p-3 rounded-xl border border-border/50 w-full sm:w-auto justify-around sm:justify-end">
                      
                      {/* Entry Time */}
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-green-500/10 text-green-600 dark:text-green-400 flex items-center justify-center shrink-0">
                          <LogIn className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Entrada</p>
                          <p className="text-xs font-black text-foreground">{formatTime(log.firstSeenAt)}</p>
                        </div>
                      </div>

                      <div className="w-px h-7 bg-border"></div>

                      {/* Exit Time / Last Active */}
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                          <LogOut className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Salida / Última</p>
                          <p className="text-xs font-black text-foreground">
                            {isOnlineNow ? 'Activo ahora' : formatTime(log.lastSeenAt)}
                          </p>
                        </div>
                      </div>

                      <div className="w-px h-7 bg-border"></div>

                      {/* Duration */}
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Tiempo</p>
                        <p className="text-xs font-black text-primary">{log.durationFormatted}</p>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-border bg-card flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-foreground text-background font-bold text-sm hover:bg-foreground/90 transition-colors shadow-sm"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
}
