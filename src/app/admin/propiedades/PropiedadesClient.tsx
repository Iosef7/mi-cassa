"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Building, Plus, Search, MapPin, Edit, Trash2, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { showConfirm, showToast } from '@/lib/alerts';

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
  minPrice?: number | null;
  maxPrice?: number | null;
  availableUnits?: number | null;
  deliveryDate?: string | null;
}

const getDisplayUrl = (url: string) => {
  if (url && typeof url === 'string' && url.includes('drive.google.com') && url.includes('/preview')) {
    const fileId = url.match(/\/file\/d\/(.+?)\/preview/)?.[1];
    if (fileId) {
      return `/api/drive/image/${fileId}`;
    }
  }
  return url;
};

const DriveImagePreview = ({ url, alt, className, priority }: { url: string, alt: string, className?: string, priority?: boolean }) => {
  const displayUrl = getDisplayUrl(url);
  const [imgError, setImgError] = useState(false);

  if (imgError) {
    return (
      <div className={`flex flex-col items-center justify-center bg-muted/20 text-muted-foreground border-border border-dashed border ${className}`}>
         <div className="text-xs mb-1 font-medium">Permiso requerido</div>
         <a href={url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-500 hover:underline z-10 pointer-events-auto">
            Abrir en Drive
         </a>
      </div>
    );
  }

  const isAllowedDomain = displayUrl?.includes('lh3.googleusercontent.com') || displayUrl?.includes('images.unsplash.com');

  if (isAllowedDomain) {
    return <Image src={displayUrl} alt={alt} fill className={className} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" onError={() => setImgError(true)} priority={priority} />;
  }

  return <img src={displayUrl} alt={alt} className={className} loading={priority ? "eager" : "lazy"} onError={() => setImgError(true)} />;
};

export default function PropiedadesClient({ initialProperties }: { initialProperties: Property[] }) {
  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('TODOS');
  const [filterLocation, setFilterLocation] = useState<string>('TODAS');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    title: '', description: '', price: '', type: 'CASA', location: '', bedrooms: '', bathrooms: '', area: '', images: ''
  });

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchProperties = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/properties');
      let data;
      try {
        data = await res.json();
      } catch (e) {
        console.error("Failed to parse response");
        setProperties([]);
        return;
      }
      if (res.ok && Array.isArray(data)) {
        setProperties(data);
      } else {
        console.error("Failed to load properties:", data?.error || data?.details || data);
        setProperties([]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const extractCity = (location: string) => {
    if (!location) return '';
    const parts = location.split(',');
    return parts[parts.length - 1].trim();
  };

  const uniqueLocations = useMemo(() => {
    return Array.from(new Set(properties.map(p => extractCity(p.location)).filter(Boolean))).sort();
  }, [properties]);

  const filteredProperties = useMemo(() => {
    return properties.filter(p => {
      const matchesType = filterType === 'TODOS' || p.type === filterType;
      const matchesLocation = filterLocation === 'TODAS' || extractCity(p.location) === filterLocation;
      const searchLower = debouncedSearch.toLowerCase();
      const matchesSearch = p.title.toLowerCase().includes(searchLower) || 
                            (p.location && p.location.toLowerCase().includes(searchLower));
      return matchesType && matchesLocation && matchesSearch;
    });
  }, [properties, filterType, filterLocation, debouncedSearch]);

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
    if(!(await showConfirm('¿Eliminar propiedad?', 'Esta acción no se puede deshacer.', 'Sí, eliminar'))) return;
    try {
      await fetch(`/api/properties/${id}`, { method: 'DELETE' });
      fetchProperties();
      showToast('Propiedad eliminada');
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
    return new Intl.NumberFormat('en-IL', { style: 'currency', currency: 'ILS' }).format(Number(price));
  };

  return (
    <div className="p-8 overflow-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 animate-in">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gradient flex items-center gap-2">
            Catálogo de Inmuebles
          </h1>
          <p className="text-muted-foreground mt-1">Gestiona el inventario de propiedades exclusivas de Mi Cassa.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto mt-4 md:mt-0">
          <div className="relative group w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Buscar..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-sm w-full sm:w-[220px]"
            />
          </div>

          <div className="relative w-full sm:w-auto">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/70 pointer-events-none" />
            <select
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              className="pl-9 pr-8 py-2.5 rounded-xl bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-sm cursor-pointer appearance-none w-full sm:w-[180px] font-medium text-foreground"
            >
              <option value="TODAS">Todas las ciudades</option>
              {uniqueLocations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none bg-card pl-1 rounded-r-xl">
              <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>

          <Link 
            href="/admin/propiedades/new"
            className="w-full sm:w-auto bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-lg shadow-primary/20 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" /> Subir Proyecto
          </Link>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-4 mb-8 border-b border-border overflow-x-auto pb-px">
        {['TODOS', 'CASA', 'DEPARTAMENTO', 'TERRENO', 'PROYECTO'].map(cat => (
          <button 
            key={cat}
            onClick={() => setFilterType(cat)}
            className={`pb-3 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${filterType === cat ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'}`}
          >
            {cat === 'TODOS' ? 'Todos los Inmuebles' : cat === 'CASA' ? 'Casas' : cat === 'DEPARTAMENTO' ? 'Departamentos' : cat === 'TERRENO' ? 'Terrenos' : 'Nuevos Proyectos'}
          </button>
        ))}
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : filteredProperties.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center border-2 border-dashed border-border rounded-2xl bg-card p-8 animate-in fade-in zoom-in-95 duration-300">
          <div className="bg-primary/10 p-4 rounded-full mb-4">
            <Building className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-bold mb-2">No hay propiedades en esta sección</h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            Actualmente no hay inmuebles o proyectos registrados aquí. Haz clic en el botón de abajo para empezar a agregar.
          </p>
          <Link 
            href="/admin/propiedades/new"
            className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-primary/20 hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4" /> Agregar Proyecto
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((p, index) => {
            let image = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=600';
            try { 
              const parsed = JSON.parse(p.images); 
              if(parsed[0]) {
                image = parsed[0];
              } 
            } catch(e) {}
            
            return (
              <Link href={`/admin/propiedades/${p.id}`} key={p.id} className="block rounded-2xl border border-border bg-card overflow-hidden group relative shadow-sm animate-in hover:-translate-y-1.5 hover:shadow-xl transition-all duration-300 cursor-pointer" style={{animationDelay: `${index * 50}ms`}}>
                <div className="h-60 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                  <DriveImagePreview url={image} alt={p.title} priority={index < 6} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out" />
                  <div className="absolute top-3 left-3 z-20 bg-background/80 backdrop-blur-md px-3 py-1 rounded-full text-sm font-bold text-primary shadow-sm border border-border/50">
                    {p.minPrice ? `Desde ${formatPrice(p.minPrice.toString())}` : formatPrice(p.price)}
                  </div>
                  <div className="absolute top-3 right-3 z-20 bg-background/80 backdrop-blur-md px-2 py-1 rounded-full text-xs font-semibold shadow-sm border border-border/50 uppercase tracking-wider">
                    {p.status}
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="font-bold text-xl mb-2 line-clamp-1 group-hover:text-primary transition-colors">{p.title}</h4>
                  <p className="text-muted-foreground text-sm flex items-center gap-1.5 mb-4 font-medium">
                    <MapPin className="w-4 h-4 text-primary/70" /> {p.location}
                  </p>
                  <div className="flex gap-4 text-sm text-muted-foreground mb-4 border-t border-border pt-4">
                    {p.type === 'PROYECTO' ? (
                      <>
                        <span className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md">🏢 {p.availableUnits || 0} unid.</span>
                        <span className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md">🗓️ {p.deliveryDate || 'N/A'}</span>
                      </>
                    ) : (
                      <>
                        <span className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md">🛏️ {p.bedrooms || 0}</span>
                        <span className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md">🛁 {p.bathrooms || 0}</span>
                        <span className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md">📐 {p.area || 0} m²</span>
                      </>
                    )}
                  </div>
                  
                  {/* Actions */}
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 absolute bottom-6 right-6 bg-background/90 backdrop-blur-md p-1.5 rounded-xl border border-border shadow-lg z-20">
                    <div className="p-2 text-primary hover:bg-primary/20 rounded-lg transition-colors" title="Ver Detalles">
                      <Edit className="w-4 h-4" />
                    </div>
                    <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDelete(p.id); }} className="p-2 text-destructive hover:bg-destructive/20 rounded-lg transition-colors" title="Eliminar Propiedad">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

    </div>
  );
}
