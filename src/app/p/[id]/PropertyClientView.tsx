'use client';

import React, { useState, useEffect } from 'react';
import { Playfair_Display, Inter } from 'next/font/google';
import { Bed, Bath, Maximize, MapPin, Calculator, Video, Info, Map as MapIcon } from 'lucide-react';
import Image from 'next/image';
import dynamic from 'next/dynamic';

const ImageGallery = dynamic(() => import('@/components/public-property/ImageGallery'), {
  ssr: false,
  loading: () => <div className="w-full aspect-[4/3] md:aspect-[21/9] bg-gray-100 dark:bg-gray-800 animate-pulse flex items-center justify-center"><p className="text-gray-400">Cargando galería...</p></div>
});

const playfair = Playfair_Display({ subsets: ['latin'] });
const inter = Inter({ subsets: ['latin'] });

export default function PropertyClientView({ property }: { property: any }) {
  const [showFloatingBar, setShowFloatingBar] = useState(false);
  const [downPaymentPct, setDownPaymentPct] = useState(20);
  const [lang, setLang] = useState<'es' | 'en' | 'he'>('es');
  
  // Format price
  const priceNum = typeof property.price === 'string' ? parseFloat(property.price) : property.price;
  const formattedPrice = !isNaN(priceNum) ? new Intl.NumberFormat('en-IL').format(priceNum) : property.price;
  
  // Mortgage calculation (estimate)
  const interestRate = 5.0; // 5% estimate
  const principal = priceNum * (1 - (downPaymentPct / 100));
  const r = (interestRate / 100) / 12;
  const n = 30 * 12;
  const monthlyPayment = principal > 0 ? (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : 0;
  const formattedMonthly = new Intl.NumberFormat('en-IL', { maximumFractionDigits: 0 }).format(monthlyPayment);

  // Parse Images
  let images: string[] = [];
  try {
    if (property.images) {
      const parsed = JSON.parse(property.images);
      images = Array.isArray(parsed) ? parsed : [];
    }
  } catch (e) {}

  // Parse Features & Dynamic Settings
  let features: any[] = [];
  let dynamicSettings: any = {};
  try {
    if (property.dynamicFeatures) {
      const parsed = JSON.parse(property.dynamicFeatures);
      if (Array.isArray(parsed)) {
        features = parsed;
      } else if (parsed && typeof parsed === 'object') {
        dynamicSettings = parsed;
        features = Array.isArray(parsed.amenities) ? parsed.amenities : [];
      }
    }
  } catch (e) {}
  // Parse Translations
  let translations: any = {};
  try {
    if (property.translations) {
      translations = typeof property.translations === 'string' ? JSON.parse(property.translations) : property.translations;
    }
  } catch (e) {}

  const currentTitle = lang === 'es' ? property.title : (translations?.[lang]?.title || property.title);
  const currentDescription = lang === 'es' ? property.description : (translations?.[lang]?.description || property.description);
  
  const isRTL = lang === 'he';

  // Scroll listener for floating bar (Optimized with throttling)
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setShowFloatingBar(window.scrollY > 400);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`relative pb-24 ${inter.className} dark:bg-[#111] dark:text-gray-100 transition-colors duration-300`}>
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            background-color: white !important;
            color: black !important;
          }
          .dark\\:bg-\\[\\#111\\], .dark\\:text-gray-100, .bg-\\[\\#faf9f6\\] {
             background-color: white !important;
             color: black !important;
             border: 1px solid #eee !important;
          }
          /* Hide floating bar and buttons */
          .fixed, .md\\:hidden {
            display: none !important;
          }
          /* Ensure images print well */
          img {
            max-width: 100% !important;
            page-break-inside: avoid;
          }
          /* Page breaks */
          section {
            page-break-inside: avoid;
          }
        }
      `}} />
      
      {/* Floating Summary Bar (Mobile) */}
      <div 
        className={`fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-black/90 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 p-4 transform transition-transform duration-300 md:hidden flex justify-between items-center ${
          showFloatingBar ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{property.operationType}</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">₪{formattedPrice}</p>
        </div>
        <div className="flex gap-2">
          <select 
            value={lang} 
            onChange={(e) => setLang(e.target.value as any)}
            className="px-2 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm font-semibold border-none cursor-pointer"
          >
            <option value="es">🇪🇸 ES</option>
            <option value="en">🇺🇸 EN</option>
            <option value="he">🇮🇱 HE</option>
          </select>
          <a href="#contact" className="bg-[#bda871] hover:bg-[#a5915f] text-white px-6 py-2 rounded-xl font-bold transition-colors">
            {lang === 'en' ? 'Contact' : lang === 'he' ? 'צור קשר' : 'Contactar'}
          </a>
        </div>
      </div>

      <ImageGallery images={images} title={currentTitle} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10" dir={isRTL ? 'rtl' : 'ltr'}>
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6 border-b border-gray-200 dark:border-gray-800 pb-8 mb-8">
          <div className="flex-1">
            <span className="inline-block px-3 py-1 bg-[#bda871]/10 text-[#bda871] text-xs font-semibold uppercase tracking-wider rounded-full mb-4">
              {property.status === 'DISPONIBLE' ? 'Disponible' : property.status} • {property.operationType}
            </span>
            <h1 className={`${playfair.className} text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4`}>
              {property.title}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2 text-lg">
              <MapPin size={20} className="text-[#bda871]" />
              {property.location || 'Ubicación a consultar'}
            </p>
          </div>
          
          <div className="bg-white dark:bg-[#1a1a1a] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 md:w-72 flex-shrink-0">
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide mb-1">Precio</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">₪{formattedPrice}</p>
            {property.type && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Tipo: {property.type}</p>
            )}
          </div>
        </div>

        {/* Key Features Bar */}
        <div className="flex flex-wrap gap-8 py-6 px-8 bg-[#faf9f6] dark:bg-[#1a1a1a] rounded-2xl mb-12 justify-around shadow-sm border border-gray-100 dark:border-gray-800">
          {property.bedrooms && (
            <div className="flex flex-col items-center gap-2">
              <Bed className="text-[#bda871]" size={28} />
              <span className="font-semibold text-xl dark:text-white">{property.bedrooms}</span>
              <span className="text-xs text-gray-500 uppercase tracking-wide">Recámaras</span>
            </div>
          )}
          {property.bathrooms && (
            <div className="flex flex-col items-center gap-2">
              <Bath className="text-[#bda871]" size={28} />
              <span className="font-semibold text-xl dark:text-white">{property.bathrooms}</span>
              <span className="text-xs text-gray-500 uppercase tracking-wide">Baños</span>
            </div>
          )}
          {property.area && (
            <div className="flex flex-col items-center gap-2">
              <Maximize className="text-[#bda871]" size={28} />
              <span className="font-semibold text-xl dark:text-white">{property.area}</span>
              <span className="text-xs text-gray-500 uppercase tracking-wide">m² Área</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-12">
            
            {/* Description */}
            <section>
              <h2 className={`${playfair.className} text-2xl font-bold mb-6 flex items-center gap-2 dark:text-white`}>
                <Info className="text-[#bda871]" /> 
                {lang === 'en' ? 'About this Property' : lang === 'he' ? 'אודות הנכס' : 'Acerca de la Propiedad'}
              </h2>
              <div className="prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                {currentDescription || 'No hay descripción disponible para esta propiedad.'}
              </div>
            </section>

            {/* Amenities */}
            {features.length > 0 && (
              <section>
                <h2 className={`${playfair.className} text-2xl font-bold mb-6 dark:text-white`}>
                  Amenidades y Características
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-4 bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
                      <div className="w-2 h-2 rounded-full bg-[#bda871] mt-2 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{feat.name || feat}</p>
                        {feat.value && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{feat.value}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Location */}
            <section>
              <h2 className={`${playfair.className} text-2xl font-bold mb-6 flex items-center gap-2 dark:text-white`}>
                <MapIcon className="text-[#bda871]" /> Ubicación
              </h2>
              <div className="flex flex-col gap-6">
                {dynamicSettings.mapImage && (
                  <a 
                    href={`https://maps.google.com/?q=${encodeURIComponent(property.location)}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block relative rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 group h-64 shadow-sm"
                  >
                    <Image 
                      src={dynamicSettings.mapImage} 
                      alt="Mapa de la propiedad" 
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 z-10">
                      <span className="bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-bold shadow-sm flex items-center gap-2">
                        Maps <MapIcon className="w-4 h-4" />
                      </span>
                    </div>
                  </a>
                )}
                
                <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl h-64 flex items-center justify-center p-6 text-center border border-gray-200 dark:border-gray-700">
                  <div>
                    <MapPin size={48} className="text-[#bda871] mx-auto mb-4 opacity-50" />
                    <p className="text-gray-600 dark:text-gray-300 font-medium">Ubicación protegida por privacidad.</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">La propiedad se encuentra en la zona de: <br/><strong className="text-gray-900 dark:text-white">{property.location}</strong></p>
                  </div>
                </div>
              </div>
              
              {property.nearbyPlaces && (
                <div className="mt-4 p-4 bg-[#faf9f6] dark:bg-[#1a1a1a] rounded-xl border border-gray-100 dark:border-gray-800">
                  <p className="font-medium mb-2 dark:text-white">Lugares de Interés:</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{property.nearbyPlaces}</p>
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            
            {/* Presentations / Video Link */}
            {property.presentations && (
              <div className="bg-white dark:bg-[#1a1a1a] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2 dark:text-white">
                  <Video className="text-[#bda871]" /> Material Multimedia
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Esta propiedad cuenta con videos o presentaciones adicionales.
                </p>
                <a 
                  href={property.presentations} 
                  target="_blank" 
                  rel="noreferrer"
                  className="block w-full text-center bg-gray-900 hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 text-white py-3 rounded-lg font-medium transition-colors"
                >
                  Ver Videos / Recorrido
                </a>
              </div>
            )}

            {/* Mortgage Calculator */}
            <div className="bg-[#faf9f6] dark:bg-[#1a1a1a] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
              <h3 className="font-bold text-lg mb-6 flex items-center gap-2 dark:text-white">
                <Calculator className="text-[#bda871]" /> Estimador de Hipoteca
              </h3>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 dark:text-gray-400">Enganche ({downPaymentPct}%)</span>
                    <span className="font-medium dark:text-white">₪{new Intl.NumberFormat('en-IL', { maximumFractionDigits: 0 }).format(priceNum * (downPaymentPct / 100))}</span>
                  </div>
                  <input 
                    type="range" 
                    min="10" 
                    max="80" 
                    step="5"
                    value={downPaymentPct}
                    onChange={(e) => setDownPaymentPct(Number(e.target.value))}
                    className="w-full accent-[#bda871]"
                  />
                </div>
                
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Estimación de Pago Mensual</p>
                  <p className={`${playfair.className} text-3xl font-bold text-[#bda871]`}>
                    ₪{formattedMonthly}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    *Basado en tasa anual de {interestRate}% a 30 años. Solo fines informativos.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
