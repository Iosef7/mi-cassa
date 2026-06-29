"use client";

import React, { useState, useEffect } from 'react';
import { Folder, ChevronRight, Plus, Loader2, ArrowLeft, Check } from 'lucide-react';

interface DriveFolderManagerProps {
  selectedFolderId: string;
  onSelectFolder: (id: string) => void;
}

export function DriveFolderManager({ selectedFolderId, onSelectFolder }: DriveFolderManagerProps) {
  const [path, setPath] = useState<{id: string, name: string}[]>([]); // Empty means root
  const [folders, setFolders] = useState<{id: string, name: string}[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isCreating, setIsCreating] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [creatingLoading, setCreatingLoading] = useState(false);

  const currentFolderId = path.length > 0 ? path[path.length - 1].id : undefined;

  const fetchFolders = async (parentId?: string) => {
    setLoading(true);
    try {
      const url = parentId ? `/api/drive/folders?parentId=${parentId}` : '/api/drive/folders';
      const res = await fetch(url);
      const data = await res.json();
      if (Array.isArray(data)) {
        setFolders(data);
        // Automatically select the first folder if we are at root and nothing is selected
        if (!parentId && !selectedFolderId && data.length > 0) {
          onSelectFolder(data[0].id);
        }
      }
    } catch (err) {
      console.error("Error fetching folders:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFolders(currentFolderId);
  }, [currentFolderId]);

  const handleNavigateIn = (folder: {id: string, name: string}) => {
    setPath([...path, folder]);
  };

  const handleNavigateUp = () => {
    const newPath = [...path];
    newPath.pop();
    setPath(newPath);
  };

  const handleNavigateToBreadcrumb = (index: number) => {
    setPath(path.slice(0, index + 1));
  };

  const handleNavigateToRoot = () => {
    setPath([]);
  };

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim() || !currentFolderId) return;

    setCreatingLoading(true);
    try {
      const res = await fetch('/api/drive/folders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newFolderName, parentId: currentFolderId })
      });
      if (res.ok) {
        const newFolder = await res.json();
        setFolders(prev => [...prev, newFolder].sort((a, b) => a.name.localeCompare(b.name)));
        setNewFolderName('');
        setIsCreating(false);
      } else {
        const errData = await res.json();
        alert(errData.error || 'Error al crear la carpeta');
      }
    } catch (err) {
      console.error("Error creating folder:", err);
      alert('Error al crear la carpeta');
    }
    setCreatingLoading(false);
  };

  return (
    <div className="border rounded-md bg-background overflow-hidden flex flex-col h-[300px]">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 border-b bg-muted/30">
        <div className="flex items-center space-x-1 text-sm overflow-hidden whitespace-nowrap">
          {path.length > 0 && (
            <button 
              type="button"
              onClick={handleNavigateUp}
              className="p-1 hover:bg-muted rounded mr-1 text-muted-foreground"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          
          <button 
            type="button"
            onClick={handleNavigateToRoot}
            className={`hover:bg-muted px-2 py-1 rounded transition-colors ${path.length === 0 ? 'font-bold text-foreground' : 'text-muted-foreground'}`}
          >
            Inicio
          </button>
          
          {path.map((folder, idx) => (
            <React.Fragment key={folder.id}>
              <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <button
                type="button"
                onClick={() => handleNavigateToBreadcrumb(idx)}
                className={`hover:bg-muted px-2 py-1 rounded truncate max-w-[100px] transition-colors ${idx === path.length - 1 ? 'font-bold text-foreground' : 'text-muted-foreground'}`}
                title={folder.name}
              >
                {folder.name}
              </button>
            </React.Fragment>
          ))}
        </div>
        
        {path.length > 0 && (
          <button
            type="button"
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-1 text-sm bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1.5 rounded-md transition-colors font-medium"
          >
            <Plus className="w-4 h-4" />
            Nueva
          </button>
        )}
      </div>

      {/* Creation form inline */}
      {isCreating && (
        <div className="p-3 border-b bg-muted/10">
          <form onSubmit={handleCreateFolder} className="flex gap-2">
            <input 
              autoFocus
              type="text" 
              placeholder="Nombre de la carpeta"
              value={newFolderName}
              onChange={e => setNewFolderName(e.target.value)}
              className="flex-1 px-3 py-1.5 text-sm border rounded-md"
            />
            <button 
              type="submit" 
              disabled={creatingLoading || !newFolderName.trim()}
              className="bg-primary text-primary-foreground px-3 py-1.5 rounded-md text-sm font-medium disabled:opacity-50 flex items-center"
            >
              {creatingLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Crear"}
            </button>
            <button 
              type="button" 
              onClick={() => setIsCreating(false)}
              className="px-3 py-1.5 text-sm border rounded-md hover:bg-muted font-medium"
            >
              Cancelar
            </button>
          </form>
        </div>
      )}

      {/* Folder list */}
      <div className="flex-1 overflow-y-auto p-2">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground space-y-2">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <span className="text-sm">Cargando carpetas...</span>
          </div>
        ) : folders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-sm">
            <Folder className="w-8 h-8 mb-2 opacity-20" />
            No hay carpetas aquí.
          </div>
        ) : (
          <div className="space-y-1">
            {folders.map(f => (
              <div 
                key={f.id}
                className={`flex items-center justify-between p-2 rounded-md group hover:bg-muted/50 cursor-pointer transition-colors ${selectedFolderId === f.id ? 'bg-primary/5 border border-primary/20' : 'border border-transparent'}`}
                onClick={() => onSelectFolder(f.id)}
                onDoubleClick={() => handleNavigateIn(f)}
              >
                <div className="flex items-center space-x-3 flex-1 overflow-hidden">
                  <Folder className={`w-5 h-5 flex-shrink-0 ${selectedFolderId === f.id ? 'text-primary' : 'text-blue-400'}`} fill="currentColor" fillOpacity={0.2} />
                  <span className={`text-sm truncate select-none ${selectedFolderId === f.id ? 'font-medium' : ''}`}>
                    {f.name}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  {selectedFolderId === f.id && (
                    <span className="text-xs text-primary font-medium flex items-center bg-primary/10 px-2 py-0.5 rounded-full mr-2">
                      <Check className="w-3 h-3 mr-1" /> Seleccionada
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleNavigateIn(f); }}
                    className="text-xs px-3 py-1.5 rounded bg-muted text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary/10 hover:text-primary font-medium"
                  >
                    Abrir
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
