"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, MapPin, SlidersHorizontal, Home, Building2, Map } from 'lucide-react';

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

export default function PublicPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filters
  const [filterType, setFilterType] = useState<string>('TODOS');
  const [filterLocation, setFilterLocation] = useState<string>('TODAS');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/properties');
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        setProperties(data);
      } else {
        setProperties([]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('en-IL', { style: 'currency', currency: 'ILS' }).format(Number(price));
  };

  const extractCity = (location: string) => {
    if (!location) return '';
    const parts = location.split(',');
    return parts[parts.length - 1].trim();
  };

  const uniqueLocations = Array.from(new Set(properties.map(p => extractCity(p.location)).filter(Boolean))).sort();

  const filteredProperties = properties.filter(p => {
    // Solo mostrar las que no están vendidas (opcional, pero buena práctica para clientes)
    if (p.status === 'VENDIDA') return false;

    const matchesType = filterType === 'TODOS' || p.type === filterType;
    const matchesLocation = filterLocation === 'TODAS' || extractCity(p.location) === filterLocation;
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = p.title.toLowerCase().includes(searchLower) || 
                          (p.location && p.location.toLowerCase().includes(searchLower));
    
    return matchesType && matchesLocation && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Navbar (Simplified for the page) */}
      <header className="bg-gray-900 text-white p-6 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-light tracking-[0.2em] uppercase" style={{ fontFamily: '"Copperplate Gothic Light Regular", serif' }}>
            MiCassa
          </Link>
          <nav className="hidden md:flex space-x-6 text-sm uppercase tracking-widest">
            <Link href="/#proyectos" className="hover:text-blue-400 transition">Proyectos</Link>
            <Link href="/#alquileres" className="hover:text-blue-400 transition">Alquileres</Link>
            <Link href="/propiedades" className="text-blue-400 border-b-2 border-blue-400 pb-1">Catálogo</Link>
            <Link href="/#contacto" className="hover:text-blue-400 transition">Contacto</Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gray-900 text-white py-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
           <Image src="https://images.unsplash.com/photo-1544984243-ec57b16fac25?auto=format&fit=crop&q=80&w=2000" alt="Jerusalem Background" fill className="object-cover" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 uppercase tracking-widest">Nuestro Catálogo</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto font-light">
            Encuentra la propiedad ideal en Israel. Filtra por ciudad, barrio o tipo de inmueble.
          </p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-20">
        <div className="bg-white rounded-xl shadow-xl p-6 md:p-8 flex flex-col md:flex-row gap-4 items-center justify-between border border-gray-100">
          
          {/* Search */}
          <div className="relative w-full md:w-1/3 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
            <input 
              type="text" 
              placeholder="Buscar proyecto o ciudad..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-gray-700"
            />
          </div>

          {/* Location Filter */}
          <div className="relative w-full md:w-1/3">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              className="w-full pl-12 pr-10 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-gray-700 appearance-none cursor-pointer font-medium"
            >
              <option value="TODAS">Todas las ciudades/barrios</option>
              {uniqueLocations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
            <SlidersHorizontal className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Type Filter */}
          <div className="w-full md:w-auto flex overflow-x-auto pb-2 md:pb-0 hide-scrollbar gap-2">
            {[
              { id: 'TODOS', label: 'Todos', icon: null },
              { id: 'CASA', label: 'Casas', icon: <Home className="w-4 h-4" /> },
              { id: 'DEPARTAMENTO', label: 'Deptos', icon: <Building2 className="w-4 h-4" /> },
              { id: 'PROYECTO', label: 'Nuevos', icon: <Building2 className="w-4 h-4" /> }
            ].map(cat => (
              <button 
                key={cat.id}
                onClick={() => setFilterType(cat.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-bold whitespace-nowrap transition-all duration-300 ${
                  filterType === cat.id 
                    ? 'bg-gray-900 text-white shadow-md' 
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-200 hover:text-gray-900 border border-gray-200'
                }`}
              >
                {cat.icon}
                {cat.label}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full"></div>
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <Map className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No encontramos propiedades</h3>
            <p className="text-gray-500">Intenta ajustando los filtros de búsqueda o ubicación.</p>
            <button 
              onClick={() => { setFilterType('TODOS'); setFilterLocation('TODAS'); setSearchTerm(''); }}
              className="mt-6 px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-lg transition-colors"
            >
              Limpiar filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((p, index) => {
              let image = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800';
              try { const parsed = JSON.parse(p.images); if(parsed[0]) image = parsed[0]; } catch(e) {}
              
              return (
                <Link href={`/propiedades/${p.id}`} key={p.id} className="block group">
                  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 h-full flex flex-col">
                    
                    {/* Image Container */}
                    <div className="h-64 overflow-hidden relative">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-10"></div>
                      <Image 
                        src={image} 
                        alt={p.title} 
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out" 
                      />
                      
                      {/* Price Tag */}
                      <div className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg font-bold text-gray-900 shadow-lg border border-white/20 flex flex-col">
                        <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">{p.type}</span>
                        <span className="text-lg text-blue-600">
                          {p.minPrice ? `Desde ${formatPrice(p.minPrice.toString())}` : formatPrice(p.price)}
                        </span>
                      </div>

                      {/* Status Tag */}
                      <div className="absolute top-4 right-4 z-20 bg-gray-900/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-white uppercase tracking-widest shadow-sm">
                        {p.status}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-grow flex flex-col">
                      <h4 className="font-bold text-xl mb-2 text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                        {p.title}
                      </h4>
                      
                      <p className="text-gray-500 text-sm flex items-center gap-2 mb-6 font-medium">
                        <MapPin className="w-4 h-4 text-blue-500" /> {p.location}
                      </p>
                      
                      <div className="mt-auto pt-4 border-t border-gray-100 flex gap-4 text-sm text-gray-600">
                        {p.type === 'PROYECTO' ? (
                          <>
                            <span className="flex items-center gap-1.5 font-medium"><Building2 className="w-4 h-4 text-gray-400"/> {p.availableUnits || 0} unid.</span>
                            <span className="flex items-center gap-1.5 font-medium text-blue-600">Entrega: {p.deliveryDate || 'N/A'}</span>
                          </>
                        ) : (
                          <>
                            <span className="flex items-center gap-1.5 font-medium">🛏️ {p.bedrooms || 0}</span>
                            <span className="flex items-center gap-1.5 font-medium">🛁 {p.bathrooms || 0}</span>
                            <span className="flex items-center gap-1.5 font-medium">📐 {p.area || 0} m²</span>
                          </>
                        )}
                      </div>
                    </div>

                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-400">
          <p className="mb-4 text-2xl font-light tracking-[0.2em] uppercase text-white" style={{ fontFamily: '"Copperplate Gothic Light Regular", serif' }}>
            MiCassa
          </p>
          <p>© 2026 Mi Cassa. Tu hogar en Israel.</p>
        </div>
      </footer>
    </div>
  );
}
