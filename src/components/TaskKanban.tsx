"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { CheckCircle2, Circle, Clock, Building, Calendar as CalendarIcon, User } from 'lucide-react';

type Task = any;

const COLUMNS = [
  { 
    id: 'PENDIENTE', 
    title: 'Pendientes', 
    color: 'bg-slate-100/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/50', 
    headerColor: 'text-slate-700 dark:text-slate-300',
    badgeColor: 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 shadow-sm'
  },
  { 
    id: 'EN_PROGRESO', 
    title: 'En Progreso', 
    color: 'bg-blue-50/70 dark:bg-blue-900/20 border border-blue-200/80 dark:border-blue-800/50', 
    headerColor: 'text-blue-800 dark:text-blue-300',
    badgeColor: 'bg-white dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 shadow-sm'
  },
  { 
    id: 'COMPLETADO', 
    title: 'Completados', 
    color: 'bg-emerald-50/70 dark:bg-emerald-900/20 border border-emerald-200/80 dark:border-emerald-800/50', 
    headerColor: 'text-emerald-800 dark:text-emerald-300',
    badgeColor: 'bg-white dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 shadow-sm'
  }
];

export default function TaskKanban({ tasks, onTaskClick, onTaskStatusChange }: { tasks: Task[], onTaskClick: (task: Task) => void, onTaskStatusChange: (taskId: string, newStatus: string) => void }) {
  const [columnsData, setColumnsData] = useState<Record<string, Task[]>>({
    'PENDIENTE': [],
    'EN_PROGRESO': [],
    'COMPLETADO': []
  });

  useEffect(() => {
    const newCols: Record<string, Task[]> = { 'PENDIENTE': [], 'EN_PROGRESO': [], 'COMPLETADO': [] };
    tasks.forEach(task => {
      const status = task.status || 'PENDIENTE';
      if (newCols[status]) {
        newCols[status].push(task);
      } else {
        newCols['PENDIENTE'].push(task); // fallback
      }
    });
    setColumnsData(newCols);
  }, [tasks]);

  const onDragEnd = useCallback((result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    const startColumn = source.droppableId;
    const finishColumn = destination.droppableId;

    if (startColumn === finishColumn) {
      const newColumn = Array.from(columnsData[startColumn]);
      const [movedTask] = newColumn.splice(source.index, 1);
      newColumn.splice(destination.index, 0, movedTask);

      setColumnsData(prev => ({
        ...prev,
        [startColumn]: newColumn
      }));
      return;
    }

    const startTasks = Array.from(columnsData[startColumn]);
    const finishTasks = Array.from(columnsData[finishColumn]);
    const [movedTask] = startTasks.splice(source.index, 1);
    
    // Update the task status locally before saving
    movedTask.status = finishColumn;
    
    finishTasks.splice(destination.index, 0, movedTask);

    setColumnsData(prev => ({
      ...prev,
      [startColumn]: startTasks,
      [finishColumn]: finishTasks
    }));

    onTaskStatusChange(draggableId, finishColumn);
  }, [columnsData, onTaskStatusChange]);

  const getPropertyImage = (task: any) => {
    if (task.property?.images) {
      try {
        const images = JSON.parse(task.property.images);
        if (Array.isArray(images) && images.length > 0) return images[0];
      } catch (e) {}
    }
    return null;
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-6 h-full overflow-x-auto pb-6 items-start px-2">
        {COLUMNS.map((column, colIndex) => (
          <motion.div 
            key={column.id} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: colIndex * 0.1, duration: 0.4 }}
            className={`flex-shrink-0 w-80 rounded-[24px] flex flex-col max-h-full backdrop-blur-xl shadow-sm transition-all duration-300 ${column.color}`}
          >
            <div className={`px-5 py-4 font-semibold ${column.headerColor} flex items-center justify-between border-b border-black/5 dark:border-white/5`}>
              <span className="text-base tracking-tight">{column.title}</span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${column.badgeColor}`}>
                {columnsData[column.id]?.length || 0}
              </span>
            </div>
            
            <Droppable droppableId={column.id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`flex-1 p-4 overflow-y-auto min-h-[150px] transition-all duration-300 rounded-b-[24px] ${snapshot.isDraggingOver ? 'bg-black/5 dark:bg-white/5 shadow-inner' : ''}`}
                >
                  {columnsData[column.id]?.map((task, index) => (
                    <TaskCard 
                      key={task.id} 
                      task={task} 
                      index={index} 
                      onTaskClick={onTaskClick} 
                      onTaskStatusChange={onTaskStatusChange} 
                      getPropertyImage={getPropertyImage} 
                    />
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
            </motion.div>
        ))}
      </div>
    </DragDropContext>
  );
}

const TaskCard = React.memo(function TaskCard({ task, index, onTaskClick, onTaskStatusChange, getPropertyImage }: { task: Task, index: number, onTaskClick: (task: Task) => void, onTaskStatusChange: (taskId: string, newStatus: string) => void, getPropertyImage: (task: any) => string | null }) {
  return (
    <Draggable key={task.id} draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={(e) => {
            if ((e.target as HTMLElement).closest('.no-modal-click')) return;
            onTaskClick(task);
          }}
          className={`bg-white dark:bg-slate-900/90 mb-3 p-4 rounded-2xl border ${snapshot.isDragging ? 'border-primary/50 shadow-2xl rotate-2 scale-105 ring-4 ring-primary/10' : 'border-slate-200/60 dark:border-slate-700/50 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600'} transition-all duration-200 group`}
        >
          <div className="flex items-start gap-3">
            <button 
              onClick={() => onTaskStatusChange(task.id, task.status === 'COMPLETADO' ? 'PENDIENTE' : 'COMPLETADO')} 
              className={`shrink-0 transition-colors no-modal-click mt-0.5 ${task.status === 'COMPLETADO' ? 'text-primary' : 'text-slate-400 hover:text-primary dark:text-slate-500'}`}
            >
              {task.status === 'COMPLETADO' ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
            </button>
            <div className="flex-1 min-w-0">
              <p className={`text-[15px] font-medium leading-snug truncate ${task.status === 'COMPLETADO' ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-slate-200'}`}>
                {task.title}
              </p>
              
              {task.dueDate && (
                <p className="text-[11px] flex items-center gap-1.5 text-slate-500 dark:text-slate-400 mt-2 font-medium">
                  <CalendarIcon className="w-3.5 h-3.5" />
                  {new Date(task.dueDate).toLocaleDateString('es-MX', { month: 'short', day: 'numeric' })}
                </p>
              )}

              {task.property && (
                <div className="mt-3 flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 p-1.5 rounded-xl w-fit max-w-full border border-slate-100 dark:border-slate-700/50">
                  {getPropertyImage(task) ? (
                    <Image src={getPropertyImage(task) as string} width={24} height={24} className="object-cover rounded-lg shadow-sm" alt="" />
                  ) : (
                    <div className="w-6 h-6 bg-primary/10 flex items-center justify-center rounded-lg text-primary shrink-0">
                      <Building className="w-3.5 h-3.5" />
                    </div>
                  )}
                  <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 truncate pr-2">{task.property.title}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}, (prevProps, nextProps) => {
  return prevProps.task.id === nextProps.task.id && 
         prevProps.task.status === nextProps.task.status && 
         prevProps.index === nextProps.index;
});
