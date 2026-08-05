"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import PublicHeader from "@/components/ui/PublicHeader";

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

export default function PublicPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  // Mock simulando la data original de WP para mostrar la UI correctamente mientras se migra wp_dump.sql
  const mockProperties = [
    {
      id: "3869",
      title: "Ein Kerem",
      location: "Jerusalem",
      image: "/wp-uploads/1-1.jpg", 
      description: "En la entrada del complejo desde la calle Brasil descubrirás Pastoral Hillside, 7 pisos boutique con ascensores y entrada propia, ubicados entre las cuatro torres y que permiten una experiencia de vida de villa flotando frente a la vista.",
      category: "proyectos"
    },
    {
      id: "3800",
      title: "Apartamento Jaffa Shalem Tower",
      location: "Jerusalem",
      image: "/wp-uploads/18.jpg", 
      description: "Espectacular apartamento en el corazón de la ciudad. Con excelentes vistas y comodidades inigualables para toda la familia.",
      category: "proyectos"
    },
    {
      id: "3741",
      title: "En la zona de Mamilla",
      location: "Jerusalem",
      image: "/wp-uploads/2-1.jpg", 
      description: "Lujosa residencia a pocos pasos de la ciudad vieja, diseño moderno que respeta la piedra tradicional jerosolimitana.",
      category: "proyectos"
    }
  ];

  const displayProperties = properties.length > 0 ? properties : mockProperties;

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-[#333333] font-sans overflow-x-hidden">
      <PublicHeader />
      
      {/* Import de fuente cursiva parecida al sitio viejo */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Caveat+Brush&display=swap');
        .font-caveat-brush { font-family: 'Caveat Brush', cursive; }
      `}} />

      <main className="max-w-[1140px] mx-auto px-4 py-12">
        
        {/* Banner Estilo WordPress (Hero) */}
        <div className="relative w-full h-[250px] md:h-[300px] bg-[#335F70] rounded-2xl flex flex-col justify-center px-10 md:px-20 mb-16 overflow-hidden shadow-sm">
          <h1 className="text-white text-[60px] md:text-[80px] font-caveat-brush z-10 tracking-wider">
            Proyectos
          </h1>
          
          {/* Elemento de diseño a la derecha (edificio recortado original de tu sitio) */}
          <div className="absolute right-0 bottom-0 h-full w-[55%] md:w-[45%] opacity-90 pointer-events-none flex justify-end">
            <Image 
              src="/wp-uploads/61cc242d5cc29603d8c9094655ea6ce7.png" 
              alt="Edificio" 
              width={500}
              height={500}
              className="h-[120%] w-auto object-cover object-bottom translate-y-[10%]"
            />
          </div>
        </div>

        {/* Grid de Propiedades al estilo Elementor */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {displayProperties.map((prop: any) => {
            const imageUrl = prop.images ? JSON.parse(prop.images)[0] : prop.image;
            return (
              <article key={prop.id} className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                {/* Imagen 700x400 ratio */}
                <Link href={`/propiedades/${prop.id}`} className="block relative w-full aspect-[7/4] overflow-hidden">
                  <Image 
                    src={imageUrl || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80'} 
                    alt={prop.title}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                  />
                </Link>
                
                {/* Contenido de la Tarjeta */}
                <div className="p-8 flex flex-col flex-grow">
                  <div className="mb-3">
                    <span className="text-[#335F70] uppercase text-xs font-semibold tracking-wider">
                      {prop.category || 'proyectos'}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-800 mb-4 hover:text-[#335F70] transition-colors">
                    <Link href={`/propiedades/${prop.id}`}>
                      {prop.title}
                    </Link>
                  </h3>
                  
                  <p className="text-gray-600 mb-6 text-sm leading-relaxed line-clamp-3">
                    {prop.description}
                  </p>
                  
                  <div className="mt-auto">
                    <Link 
                      href={`/propiedades/${prop.id}`}
                      className="inline-block px-8 py-3 bg-[#335F70] text-white text-sm font-medium rounded hover:bg-[#254A58] transition-colors"
                    >
                      Leer mas
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

      </main>

      {/* Botón Flotante de WhatsApp */}
      <a 
        href="https://wa.me/972000000000" 
        target="_blank" 
        rel="noreferrer"
        className="fixed bottom-8 right-8 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 z-50 flex items-center justify-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      </a>
    </div>
  );
}
