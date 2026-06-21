"use client";

import React, { useState, useEffect } from 'react';
import { Building, Plus, Search, MapPin, Edit, Trash2, X } from 'lucide-react';

interface Property {
  id: string;
  title: string;
  description: string;
  price: string;
  type: string;
  status: string;
  location: string;
  bedrooms: number | null;
  bathrooms: number | null;
  area: number | null;
  images: string;
}

export default function PropiedadesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '', description: '', price: '', type: 'CASA', location: '', bedrooms: '', bathrooms: '', area: '', images: ''
  });

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/properties');
      const data = await res.json();
      setProperties(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingId ? `/api/properties/${editingId}` : '/api/properties';
    const method = editingId ? 'PUT' : 'POST';
    
    // Parse single string image to array format expected by backend (simplified for now)
    const payload = { ...formData, images: [formData.images] };

    try {
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      setIsModalOpen(false);
      setEditingId(null);
      resetForm();
      fetchProperties();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if(!confirm('¿Estás seguro de eliminar esta propiedad?')) return;
    try {
      await fetch(`/api/properties/${id}`, { method: 'DELETE' });
      fetchProperties();
    } catch (e) {
      console.error(e);
    }
  };

  const openEdit = (p: Property) => {
    let imageStr = '';
    try {
      const parsed = JSON.parse(p.images);
      if(parsed && parsed.length > 0) imageStr = parsed[0];
    } catch(e) {}

    setFormData({
      title: p.title,
      description: p.description || '',
      price: p.price,
      type: p.type,
      location: p.location,
      bedrooms: p.bedrooms?.toString() || '',
      bathrooms: p.bathrooms?.toString() || '',
      area: p.area?.toString() || '',
      images: imageStr
    });
    setEditingId(p.id);
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', price: '', type: 'CASA', location: '', bedrooms: '', bathrooms: '', area: '', images: '' });
  };

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(Number(price));
  };

  return (
    <div className="p-8 overflow-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Building className="w-8 h-8 text-primary" /> 
            Catálogo de Inmuebles
          </h1>
          <p className="text-foreground/60 mt-1">Gestiona el inventario de propiedades de Mi Cassa.</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50" />
            <input 
              type="text" 
              placeholder="Buscar..." 
              className="pl-10 pr-4 py-2 rounded-lg bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <button 
            onClick={() => { resetForm(); setEditingId(null); setIsModalOpen(true); }}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 flex items-center gap-2 hover-lift"
          >
            <Plus className="w-4 h-4" /> Nueva Propiedad
          </button>
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map(p => {
            let image = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=600';
            try { const parsed = JSON.parse(p.images); if(parsed[0]) image = parsed[0]; } catch(e) {}
            
            return (
              <div key={p.id} className="rounded-2xl border border-border bg-card overflow-hidden hover-lift group relative">
                <div className="h-56 overflow-hidden relative">
                  <img src={image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3 bg-card/90 backdrop-blur px-3 py-1 rounded text-sm font-bold text-primary">
                    {formatPrice(p.price)}
                  </div>
                  <div className="absolute top-3 right-3 bg-card/90 backdrop-blur px-2 py-1 rounded text-xs font-semibold">
                    {p.status}
                  </div>
                </div>
                <div className="p-5">
                  <h4 className="font-bold text-xl mb-1 truncate">{p.title}</h4>
                  <p className="text-foreground/60 text-sm flex items-center gap-1 mb-4">
                    <MapPin className="w-3 h-3" /> {p.location}
                  </p>
                  <div className="flex gap-4 text-sm text-foreground/70 mb-4 border-t border-border pt-4">
                    <span>🛏️ {p.bedrooms || 0}</span>
                    <span>🛁 {p.bathrooms || 0}</span>
                    <span>📐 {p.area || 0} m²</span>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-5 right-5 bg-card/90 backdrop-blur p-1 rounded-lg border border-border">
                    <button onClick={() => openEdit(p)} className="p-2 text-primary hover:bg-primary/10 rounded-md">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(p.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-md">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-border bg-card">
              <h3 className="text-xl font-bold">{editingId ? 'Editar Propiedad' : 'Agregar Nueva Propiedad'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-foreground/50 hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Título</label>
                  <input required value={formData.title} onChange={e=>setFormData({...formData, title: e.target.value})} className="w-full p-2 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary outline-none" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Precio</label>
                  <input required type="number" value={formData.price} onChange={e=>setFormData({...formData, price: e.target.value})} className="w-full p-2 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Ubicación</label>
                  <input required value={formData.location} onChange={e=>setFormData({...formData, location: e.target.value})} className="w-full p-2 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary outline-none" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Tipo</label>
                  <select value={formData.type} onChange={e=>setFormData({...formData, type: e.target.value})} className="w-full p-2 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary outline-none">
                    <option value="CASA">Casa</option>
                    <option value="DEPARTAMENTO">Departamento</option>
                    <option value="TERRENO">Terreno</option>
                    <option value="LOCAL">Local Comercial</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">URL de Imagen</label>
                  <input placeholder="https://..." value={formData.images} onChange={e=>setFormData({...formData, images: e.target.value})} className="w-full p-2 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary outline-none" />
                </div>

                <div className="grid grid-cols-3 gap-2 col-span-2">
                  <div>
                    <label className="block text-sm font-medium mb-1">Habitaciones</label>
                    <input type="number" value={formData.bedrooms} onChange={e=>setFormData({...formData, bedrooms: e.target.value})} className="w-full p-2 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Baños</label>
                    <input type="number" value={formData.bathrooms} onChange={e=>setFormData({...formData, bathrooms: e.target.value})} className="w-full p-2 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Área (m²)</label>
                    <input type="number" value={formData.area} onChange={e=>setFormData({...formData, area: e.target.value})} className="w-full p-2 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary outline-none" />
                  </div>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Descripción</label>
                  <textarea rows={3} value={formData.description} onChange={e=>setFormData({...formData, description: e.target.value})} className="w-full p-2 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary outline-none"></textarea>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg text-sm font-medium border border-border hover:bg-background">Cancelar</button>
                <button type="submit" className="px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:opacity-90">
                  {editingId ? 'Actualizar' : 'Guardar Propiedad'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
