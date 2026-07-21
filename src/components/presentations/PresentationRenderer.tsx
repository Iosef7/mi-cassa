/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from 'react';
import { Playfair_Display, Lato } from 'next/font/google';
import { DriveImagePreview } from '@/components/DriveImagePreview';
import Image from 'next/image';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '600', '700'] });
const lato = Lato({ subsets: ['latin'], weight: ['300', '400', '700'] });

const formatPrice = (price: string | number) => {
  const num = typeof price === 'string' ? parseFloat(price) : price;
  if (isNaN(num)) return price;
  return new Intl.NumberFormat('en-IL').format(num);
};

export interface SlideData {
  type: 'cover' | 'property_hero' | 'features' | 'distribution' | 'gallery' | 'split_image_text' | 'lifestyle' | 'contact';
  [key: string]: any;
}

export interface PresentationData {
  slides: SlideData[];
}

export function PresentationRenderer({ data }: { data: PresentationData }) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [scale, setScale] = React.useState(1);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const observer = new ResizeObserver((entries) => {
      if (entries[0] && entries[0].contentRect.width > 0) {
        setScale(entries[0].contentRect.width / 1920);
      }
    });
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  if (!data || !data.slides) return null;

  return (
    <div ref={containerRef} className={`min-h-screen bg-[#faf9f6] text-[#2c2c2c] ${lato.className}`}>
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          .page-break { page-break-after: always; }
          .no-print { display: none !important; }
          body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; margin: 0; }
          @page { size: 16in 9in; margin: 0; }
          .slide-wrapper { margin-bottom: 0; }
        }
        
        .slide-wrapper {
          width: 100%;
          aspect-ratio: 16/9;
          position: relative;
          overflow: hidden;
          margin-bottom: 2rem;
          border-radius: 0.5rem;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
        }
        
        .slide {
          width: 1920px;
          height: 1080px;
          transform-origin: top left;
          position: absolute;
          top: 0;
          left: 0;
          display: flex;
        }
      `}} />

      {data.slides.map((slide, index) => {
        const renderSlide = () => {
        switch (slide.type) {
          case 'cover':
            return (
              <div className="slide bg-black" style={{ transform: `scale(${scale})` }}>
                <DriveImagePreview url={slide.imageUrl} alt="Exterior" priority={true} className="absolute inset-0 w-full h-full object-cover" />
                <Image src="/logo_final.png" alt="Mi Cassa" width={192} height={48} className="absolute top-12 left-24 object-contain mix-blend-screen invert grayscale opacity-90 z-20" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent w-[75%] z-0"></div>
                
                <div className="absolute inset-0 flex flex-col justify-center px-24 z-10 text-white w-[65%]">
                  <div className="flex items-center gap-6 mb-6 mt-12">
                    <div className="w-16 h-px bg-[#bda871]"></div>
                    <p className="text-[#bda871] font-medium text-sm uppercase tracking-[0.25em]">{slide.subtitle}</p>
                  </div>
                  
                  <h1 className={`${playfair.className} text-[4.5rem] font-bold leading-[1.1] mb-8`}>
                    {slide.title}
                  </h1>
                  <p className="text-xl text-gray-300 font-light leading-relaxed max-w-xl">
                    {slide.description}
                  </p>
                </div>
              </div>
            );
          
          case 'property_hero':
            return (
              <div className="slide bg-[#111] flex flex-row" style={{ transform: `scale(${scale})` }}>
                <div className="w-[45%] h-full flex flex-col justify-center px-16 z-10 relative text-white">
                  <div className="mb-12">
                    <Image src="/logo_final.png" alt="Mi Cassa" width={160} height={40} className="object-contain mix-blend-screen invert grayscale opacity-90" />
                  </div>
                  <div className="flex items-center gap-6 mb-6">
                    <div className="w-16 h-px bg-[#bda871]"></div>
                    <p className="text-[#bda871] font-medium text-sm uppercase tracking-[0.25em]">{slide.location}</p>
                  </div>
                  <h1 className={`${playfair.className} text-[4.5rem] font-bold leading-[1.1] mb-8`}>
                    {slide.title}
                  </h1>
                  <p className="text-lg text-gray-300 font-light leading-relaxed max-w-xl">
                    {slide.description}
                  </p>
                </div>
                <div className="w-[55%] h-full relative">
                  <DriveImagePreview url={slide.imageUrl} alt={slide.title} priority={true} className="absolute inset-0 w-full h-full object-cover" />
                </div>
              </div>
            );

          case 'features':
            const priceNum = parseFloat(slide.price || '0');
            return (
              <div className="slide bg-[#f7f5f0] flex-col px-24 py-20 justify-center" style={{ transform: `scale(${scale})` }}>
                <div className="flex items-center gap-6 mb-6">
                  <div className="w-16 h-px bg-[#bda871]"></div>
                  <p className="text-[#bda871] font-medium text-sm uppercase tracking-[0.25em]">Las Características</p>
                </div>
                <h2 className={`${playfair.className} text-5xl font-bold text-[#1a2629] mb-12`}>{slide.title || "Detalles de la propiedad"}</h2>
                
                <div className="bg-white w-full rounded-sm shadow-sm border border-gray-100/50 flex">
                  <div className="w-1/2 p-12 border-r border-gray-100">
                    <h3 className={`${playfair.className} text-3xl text-[#1a2629] mb-8`}>Información General</h3>
                    <div className="space-y-6">
                      <div className="flex justify-between border-b border-gray-100 pb-4">
                        <span className="text-gray-500 font-medium">Superficie interior</span>
                        <span className="font-bold text-[#1a2629]">{slide.area} m²</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-100 pb-4">
                        <span className="text-gray-500 font-medium">Recámaras</span>
                        <span className="font-bold text-[#1a2629]">{slide.bedrooms}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-100 pb-4">
                        <span className="text-gray-500 font-medium">Baños</span>
                        <span className="font-bold text-[#1a2629]">{slide.bathrooms}</span>
                      </div>
                    </div>
                    
                    <div className="mt-12">
                      <p className="text-sm text-gray-500 uppercase tracking-widest font-medium mb-3">PRECIO TOTAL</p>
                      <p className={`${playfair.className} text-4xl font-bold text-[#1a2629]`}>
                        {formatPrice(priceNum)} <span className="text-[#bda871] text-xl font-sans ml-2">ILS</span>
                      </p>
                    </div>
                  </div>
                  <div className="w-1/2 p-12 bg-[#faf9f6]">
                    <h3 className={`${playfair.className} text-3xl text-[#1a2629] mb-8`}>Financiamiento</h3>
                    <div className="space-y-8">
                      <div>
                        <p className="text-gray-500 font-medium mb-2">Enganche 25%</p>
                        <p className={`${playfair.className} text-3xl font-bold text-[#1a2629]`}>{formatPrice(slide.enganche25 || priceNum * 0.25)} <span className="text-lg text-[#bda871]">ILS</span></p>
                      </div>
                      <div className="w-16 h-px bg-gray-200"></div>
                      <div>
                        <p className="text-gray-500 font-medium mb-2">Enganche 50%</p>
                        <p className={`${playfair.className} text-3xl font-bold text-[#1a2629]`}>{formatPrice(slide.enganche50 || priceNum * 0.50)} <span className="text-lg text-[#bda871]">ILS</span></p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );

          case 'distribution':
            return (
              <div className="slide bg-[#f7f5f0]" style={{ transform: `scale(${scale})` }}>
                <div className="w-[50%] h-full p-16 flex items-center justify-center">
                  <div className="w-full h-full relative bg-white shadow-md border border-gray-200 rounded-sm overflow-hidden">
                    <DriveImagePreview url={slide.planImageUrl} alt="Plano" className="w-full h-full object-contain" />
                  </div>
                </div>
                <div className="w-[50%] h-full flex flex-col justify-center pr-24 pl-12">
                  <div className="flex items-center gap-6 mb-6">
                    <div className="w-16 h-px bg-[#bda871]"></div>
                    <p className="text-[#bda871] font-medium text-sm uppercase tracking-[0.25em]">Propiedad</p>
                  </div>
                  <h2 className={`${playfair.className} text-5xl font-bold text-[#1a2629] mb-4`}>Distribución</h2>
                  <p className="text-gray-500 mb-16 text-lg">{slide.areaText}</p>
                  
                  <h3 className="text-[#bda871] font-semibold tracking-widest uppercase mb-8">Ambientes</h3>
                  <div className="space-y-6">
                    {(slide.features || []).map((feat: any, idx: number) => (
                      <div key={idx} className="flex gap-6 items-start">
                        <span className="text-[#bda871] font-light text-xl mt-1">{(idx+1).toString().padStart(2, '0')}</span>
                        <p className="text-[#1a2629] text-xl leading-relaxed">
                          <strong>{feat.name}</strong> {feat.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );

          case 'gallery':
            return (
              <div className="slide bg-[#1a2629] text-white" style={{ transform: `scale(${scale})` }}>
                <div className="w-[35%] h-full flex flex-col justify-center pl-24 pr-12">
                  <div className="flex items-center gap-6 mb-6">
                    <div className="w-16 h-px bg-[#bda871]"></div>
                    <p className="text-[#bda871] font-medium text-sm uppercase tracking-[0.25em]">Espacios</p>
                  </div>
                  <h2 className={`${playfair.className} text-4xl font-bold mb-6`}>{slide.title}</h2>
                  <p className="text-gray-400 text-lg leading-relaxed">
                    {slide.description}
                  </p>
                </div>
                <div className="w-[65%] h-full grid grid-cols-2 grid-rows-2 gap-4 p-12 content-center justify-items-center">
                  {(slide.images || []).slice(0,4).map((imgUrl: string, idx: number) => (
                    <div key={idx} className="w-full h-full relative bg-white/5 rounded-sm overflow-hidden shadow-lg border border-white/10">
                      <DriveImagePreview url={imgUrl} alt="Interior" className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                    </div>
                  ))}
                </div>
              </div>
            );

          case 'split_image_text':
            return (
              <div className="slide bg-[#1a2629]" style={{ transform: `scale(${scale})` }}>
                <div className="w-[50%] h-full relative">
                  <DriveImagePreview url={slide.imageUrl} alt="Visual" className="absolute inset-0 w-full h-full object-cover" />
                </div>
                <div className="w-[50%] h-full flex flex-col justify-center pl-20 pr-24 text-white">
                  <div className="flex items-center gap-6 mb-6">
                    <div className="w-16 h-px bg-[#bda871]"></div>
                    <p className="text-[#bda871] font-medium text-sm uppercase tracking-[0.25em]">{slide.subtitle || 'Detalles'}</p>
                  </div>
                  <h2 className={`${playfair.className} text-4xl font-bold leading-tight mb-8`}>
                    {slide.title}
                  </h2>
                  <p className="text-lg text-gray-300 font-light leading-relaxed mb-12 max-w-lg">
                    {slide.description}
                  </p>
                  {slide.highlights && slide.highlights.length > 0 && (
                    <div className="flex flex-wrap gap-12 border-t border-gray-700 pt-8 mt-4">
                      {slide.highlights.map((hi: any, idx: number) => (
                        <div key={idx}>
                          <p className={`${playfair.className} text-3xl font-bold text-white mb-2`}>{hi.value} <span className="text-lg font-sans text-[#bda871]">{hi.unit}</span></p>
                          <p className="text-sm text-gray-400 uppercase tracking-widest font-semibold">{hi.label}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );

          case 'lifestyle':
            return (
              <div className="slide bg-[#f7f5f0]" style={{ transform: `scale(${scale})` }}>
                <div className="w-[45%] h-full flex flex-col justify-center pl-24 pr-16">
                  <div className="flex items-center gap-6 mb-6">
                    <div className="w-16 h-px bg-[#bda871]"></div>
                    <p className="text-[#bda871] font-medium text-sm uppercase tracking-[0.25em]">Estilo de Vida</p>
                  </div>
                  <h2 className={`${playfair.className} text-4xl font-bold text-[#1a2629] mb-12`}>{slide.title}</h2>
                  
                  <div className="space-y-10">
                    {(slide.items || []).map((item: any, idx: number) => (
                      <div key={idx}>
                        <h3 className="text-xl font-bold text-[#1a2629] mb-3">{item.title}</h3>
                        <p className="text-lg text-gray-600 font-light leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="w-[55%] h-full flex flex-col">
                  <div className="h-1/2 w-full relative border-b border-white">
                    <DriveImagePreview url={slide.image1} alt="Visual" className="absolute inset-0 w-full h-full object-cover" />
                  </div>
                  <div className="h-1/2 w-full relative border-t border-white">
                    <DriveImagePreview url={slide.image2} alt="Visual" className="absolute inset-0 w-full h-full object-cover" />
                  </div>
                </div>
              </div>
            );

          case 'contact':
            return (
              <div className="slide bg-[#111] flex flex-row" style={{ transform: `scale(${scale})` }}>
                <div className="w-[45%] h-full flex flex-col justify-center px-16 z-10 relative text-white">
                  <div className="mb-12">
                    <Image src="/logo_final.png" alt="Mi Cassa" width={192} height={48} className="object-contain mix-blend-screen invert grayscale opacity-90" />
                  </div>
                  
                  <div className="flex items-center gap-6 mb-6">
                    <div className="w-16 h-px bg-[#bda871]"></div>
                    <p className="text-[#bda871] font-medium text-sm uppercase tracking-[0.25em]">El Siguiente Paso</p>
                  </div>
                  <h2 className={`${playfair.className} text-[4rem] font-bold leading-[1.1] mb-6`}>
                    {slide.title}
                  </h2>
                  <p className="text-lg text-gray-300 font-light max-w-xl leading-relaxed mb-auto">
                    {slide.description}
                  </p>
                  
                  <div className="flex justify-between items-end pb-12 pt-8 border-t border-gray-700/50 mt-12">
                    <div className="flex flex-col gap-6">
                      <div>
                        <p className="text-gray-400 text-sm uppercase tracking-widest font-semibold mb-2">Teléfono</p>
                        <p className="text-xl font-medium">{slide.phone}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm uppercase tracking-widest font-semibold mb-2">Correo</p>
                        <p className="text-xl font-medium">{slide.email}</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-[#bda871] font-light tracking-widest text-sm mt-4">Inmobiliaria · Hipotecas · Inversiones</p>
                </div>
                <div className="w-[55%] h-full relative">
                  <DriveImagePreview url={slide.imageUrl} alt="Cierre" className="absolute inset-0 w-full h-full object-cover" />
                </div>
              </div>
            );

          default:
            return null;
        }
        };
        return (
          <div key={index} className="slide-wrapper page-break">
            {renderSlide()}
          </div>
        );
      })}
    </div>
  );
}
