"use client";

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2, Circle } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

export default function TaskCalendar({ tasks, onTaskClick, onTaskDateChange }: { tasks: any[], onTaskClick: (task: any) => void, onTaskDateChange?: (taskId: string, newDate: Date) => void }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const onDragEnd = (result: DropResult) => {
    if (!result.destination || !onTaskDateChange) return;
    const taskId = result.draggableId;
    const newDateStr = result.destination.droppableId; // e.g. "2026-07-25"
    // Mantener la hora original si es posible, o simplemente establecer la nueva fecha
    const task = tasks.find(t => t.id === taskId);
    let newDate = new Date(newDateStr + 'T12:00:00'); // set to noon to avoid timezone shift issues
    if (task && task.dueDate) {
      const originalDate = new Date(task.dueDate);
      newDate.setHours(originalDate.getHours(), originalDate.getMinutes());
    }
    onTaskDateChange(taskId, newDate);
  };

  const rows = [];
  let days = [];
  let day = startDate;

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      const cloneDay = day;
      const formattedDate = format(cloneDay, "d");
      const dayKey = format(cloneDay, "yyyy-MM-dd");
      
      const dayTasks = tasks.filter(t => t.dueDate && isSameDay(new Date(t.dueDate), cloneDay));
      
      days.push(
        <Droppable droppableId={dayKey} key={dayKey}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`min-h-[120px] p-2 border-r border-b border-border transition-colors ${
                !isSameMonth(cloneDay, monthStart)
                  ? "bg-muted/30 text-muted-foreground"
                  : isSameDay(cloneDay, new Date())
                  ? "bg-primary/5 font-semibold"
                  : "bg-background"
              } ${snapshot.isDraggingOver ? 'bg-primary/10' : ''}`}
            >
              <div className={`text-right text-xs mb-2 ${isSameDay(cloneDay, new Date()) ? 'text-primary font-bold' : 'text-foreground'}`}>
                {formattedDate}
              </div>
              <div className="space-y-1 min-h-[40px]">
                {dayTasks.map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id} index={index}>
                    {(provided, snapshot) => (
                      <div 
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        onClick={() => onTaskClick(task)}
                        className={`text-[10px] px-2 py-1 rounded truncate cursor-pointer transition-colors ${
                          task.status === 'COMPLETADO' 
                            ? 'bg-muted text-muted-foreground line-through' 
                            : task.isImportant
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500'
                              : 'bg-primary/10 text-primary hover:bg-primary/20'
                        } ${snapshot.isDragging ? 'shadow-lg ring-2 ring-primary rotate-2 z-50' : ''}`}
                        title={task.title}
                      >
                        {task.title}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            </div>
          )}
        </Droppable>
      );
      day = addDays(day, 1);
    }
    rows.push(
      <div className="grid grid-cols-7" key={day.toString()}>
        {days}
      </div>
    );
    days = [];
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="bg-card border border-border rounded-3xl shadow-sm overflow-hidden flex flex-col h-full">
        <div className="p-4 border-b border-border flex items-center justify-between bg-muted/30">
          <h2 className="text-lg font-bold capitalize text-foreground">
            {format(currentDate, 'MMMM yyyy', { locale: es })}
          </h2>
          <div className="flex gap-2">
            <button onClick={prevMonth} className="p-2 bg-background border border-border rounded-xl hover:bg-muted transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={nextMonth} className="p-2 bg-background border border-border rounded-xl hover:bg-muted transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-7 border-b border-border bg-muted/50">
          {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(d => (
            <div key={d} className="py-3 text-center text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {d}
            </div>
          ))}
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {rows}
        </div>
      </div>
    </DragDropContext>
  );
}
