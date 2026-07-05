import React from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import { Playfair_Display, Lato } from 'next/font/google';
import PrintButton from './PrintButton';
import { DriveImagePreview } from '@/components/DriveImagePreview';
import { PresentationRenderer } from '@/components/presentations/PresentationRenderer';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '600', '700'] });
const lato = Lato({ subsets: ['latin'], weight: ['300', '400', '700'] });

const formatPrice = (price: string | number) => {
  const num = typeof price === 'string' ? parseFloat(price) : price;
  if (isNaN(num)) return price;
  return new Intl.NumberFormat('en-IL').format(num);
};

export default async function PresentationPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  
  const property = await prisma.property.findUnique({
    where: { id },
  });

  if (!property) {
    notFound(); 
  }

  // Parse images
  let imagesList: string[] = [];
  try {
    if (property.images) {
      const parsed = JSON.parse(property.images);
      if (Array.isArray(parsed)) {
        imagesList = parsed;
      }
    }
  } catch (e) {
    console.error("Error parsing images", e);
  }

  let dynamicFeaturesArray: any[] = [];
  let isAiPresentation = false;
  let aiPresentationData = null;
  try {
    if (property.dynamicFeatures) {
      const parsed = JSON.parse(property.dynamicFeatures);
      if (Array.isArray(parsed)) {
        dynamicFeaturesArray = parsed;
      } else if (typeof parsed === 'object' && parsed !== null) {
        if (parsed.aiPresentation) {
          isAiPresentation = true;
          aiPresentationData = parsed.aiPresentation;
        }
        // Recover array items if it was spread into an object
        const possibleArray = Object.keys(parsed)
          .filter(k => !isNaN(Number(k)))
          .sort((a, b) => Number(a) - Number(b))
          .map(k => parsed[k]);
        if (possibleArray.length > 0) {
          dynamicFeaturesArray = possibleArray;
        }
      }
    }
  } catch (e) {
    console.error("Error parsing features", e);
  }

  if (isAiPresentation) {
    return (
      <>
        <PrintButton />
        <PresentationRenderer data={aiPresentationData} />
      </>
    );
  }

  const priceStr = property.price ? property.price.toString() : '0';
  const priceNum = parseFloat(priceStr);
  const enganche25 = priceNum * 0.25;
  const enganche50 = priceNum * 0.5;
  
  // Rough estimate for mortgage at 30 years 5% interest
  const interestRate = 5.06;
  const calculateMonthly = (principal: number) => {
    const r = (interestRate / 100) / 12;
    const n = 30 * 12;
    return principal > 0 ? (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : 0;
  };
  
  const cuota25 = calculateMonthly(priceNum - enganche25);
  const cuota50 = calculateMonthly(priceNum - enganche50);

  const heroImage = imagesList[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2000&auto=format&fit=crop';
  const img2 = imagesList[1] || heroImage;
  const img3 = imagesList[2] || heroImage;
  const img4 = imagesList[3] || heroImage;
  const img5 = imagesList[4] || heroImage;
  const img6 = imagesList[5] || heroImage;

  return (
    <div className={`min-h-screen bg-[#faf9f6] text-[#2c2c2c] ${lato.className}`}>
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          .page-break { page-break-after: always; }
          .no-print { display: none !important; }
          body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; margin: 0; }
          @page { size: 16in 9in; margin: 0; } /* Perfect 16:9 aspect ratio */
        }
        
        .slide {
          width: 100%;
          aspect-ratio: 16/9;
          position: relative;
          overflow: hidden;
          display: flex;
        }
      `}} />

      {/* Floating print button */}
      <PrintButton />

      {/* Page 1: Intro / Portada */}
      <div className="slide page-break bg-black">
        {/* Exterior photo covering the whole page */}
        <DriveImagePreview url={imagesList[5] || imagesList[0] || heroImage} alt="Exterior" priority={true} className="absolute inset-0 w-full h-full object-cover" />
        
        {/* Logo outside the z-10 container so mix-blend works against the image */}
        <Image src="/logo.png" alt="Mi Cassa" width={192} height={48} className="absolute top-12 left-24 object-contain mix-blend-screen invert grayscale opacity-90 z-20" />

        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent w-[75%] z-0"></div>
        
        <div className="absolute inset-0 flex flex-col justify-center px-24 z-10 text-white w-[65%]">
          <div className="flex items-center gap-6 mb-6 mt-12">
            <div className="w-16 h-px bg-[#bda871]"></div>
            <p className="text-[#bda871] font-medium text-sm uppercase tracking-[0.25em]">Dos Residencias a Medida</p>
          </div>
          
          <h1 className={`${playfair.className} text-[4.5rem] font-bold leading-[1.1] mb-8`}>
            Su próximo hogar en el corazón de la Ciudad Santa
          </h1>
          <p className="text-xl text-gray-300 font-light leading-relaxed max-w-xl">
            Diseñados para la vida familiar, la tradición y el confort en Jerusalén. Encuentre la propiedad ideal adaptada a sus necesidades.
          </p>
        </div>
      </div>

      {/* Page 2: Hero de la propiedad (Interior) */}
      <div className="slide page-break bg-[#111] flex flex-row">
        <div className="w-[45%] h-full flex flex-col justify-center px-16 z-10 relative text-white">
          <div className="mb-12">
             <Image src="/logo.png" alt="Mi Cassa" width={160} height={40} className="object-contain mix-blend-screen invert grayscale opacity-90" />
          </div>
          
          <div className="flex items-center gap-6 mb-6">
            <div className="w-16 h-px bg-[#bda871]"></div>
            <p className="text-[#bda871] font-medium text-sm uppercase tracking-[0.25em]">{property.location || 'Jerusalén'}</p>
          </div>
          
          <h1 className={`${playfair.className} text-[4.5rem] font-bold leading-[1.1] mb-8`}>
            {property.title}
          </h1>
          <p className="text-lg text-gray-300 font-light leading-relaxed max-w-xl">
            {property.description || `Magnífico apartamento, luminoso y renovado con los más altos estándares. Cuenta con una espaciosa área construida de ${property.area || 0} m² y las mejores comodidades.`}
          </p>
        </div>
        <div className="w-[55%] h-full relative">
          <DriveImagePreview url={imagesList[0] || heroImage} alt={property.title} priority={true} className="absolute inset-0 w-full h-full object-cover" />
        </div>
      </div>

      {/* Page 2: La Residencia */}
      <div className="slide page-break bg-[#f7f5f0] flex-col px-24 py-20 justify-center">
        <div className="flex items-center gap-6 mb-6">
          <div className="w-16 h-px bg-[#bda871]"></div>
          <p className="text-[#bda871] font-medium text-sm uppercase tracking-[0.25em]">Las Características</p>
        </div>
        <h2 className={`${playfair.className} text-5xl font-bold text-[#1a2629] mb-12`}>Detalles de la propiedad</h2>
        
        <div className="bg-white w-full rounded-sm shadow-sm border border-gray-100/50 flex">
          <div className="w-1/2 p-12 border-r border-gray-100">
            <h3 className={`${playfair.className} text-3xl text-[#1a2629] mb-8`}>Información General</h3>
            <div className="space-y-6">
              <div className="flex justify-between border-b border-gray-100 pb-4">
                <span className="text-gray-500 font-medium">Superficie interior</span>
                <span className="font-bold text-[#1a2629]">{property.area || 0} m²</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-4">
                <span className="text-gray-500 font-medium">Recámaras</span>
                <span className="font-bold text-[#1a2629]">{property.bedrooms || 0}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-4">
                <span className="text-gray-500 font-medium">Baños</span>
                <span className="font-bold text-[#1a2629]">{property.bathrooms || 0}</span>
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
                <p className={`${playfair.className} text-3xl font-bold text-[#1a2629]`}>{formatPrice(enganche25)} <span className="text-lg text-[#bda871]">ILS</span></p>
                <p className="text-sm text-gray-400 mt-2">Cuota mensual est. {formatPrice(cuota25)} ILS</p>
              </div>
              <div className="w-16 h-px bg-gray-200"></div>
              <div>
                <p className="text-gray-500 font-medium mb-2">Enganche 50%</p>
                <p className={`${playfair.className} text-3xl font-bold text-[#1a2629]`}>{formatPrice(enganche50)} <span className="text-lg text-[#bda871]">ILS</span></p>
                <p className="text-sm text-gray-400 mt-2">Cuota mensual est. {formatPrice(cuota50)} ILS</p>
              </div>
             </div>
          </div>
        </div>
      </div>

      {/* Page 3: Distribución */}
      <div className="slide page-break bg-[#f7f5f0]">
        <div className="w-[50%] h-full p-16 flex items-center justify-center">
           <div className="w-full h-full relative bg-white shadow-md border border-gray-200 rounded-sm overflow-hidden">
             <DriveImagePreview url={img2} alt="Plano" className="w-full h-full object-cover" />
           </div>
        </div>
        <div className="w-[50%] h-full flex flex-col justify-center pr-24 pl-12">
          <div className="flex items-center gap-6 mb-6">
            <div className="w-16 h-px bg-[#bda871]"></div>
            <p className="text-[#bda871] font-medium text-sm uppercase tracking-[0.25em]">Propiedad</p>
          </div>
          <h2 className={`${playfair.className} text-5xl font-bold text-[#1a2629] mb-4`}>Distribución</h2>
          <p className="text-gray-500 mb-16 text-lg">Superficie total aproximada: {property.area} m²</p>
          
          <h3 className="text-[#bda871] font-semibold tracking-widest uppercase mb-8">Ambientes</h3>
          <div className="space-y-6">
            {dynamicFeaturesArray.length > 0 ? dynamicFeaturesArray.map((feat: any, idx: number) => (
              <div key={idx} className="flex gap-6 items-start">
                 <span className="text-[#bda871] font-light text-xl mt-1">{(idx+1).toString().padStart(2, '0')}</span>
                 <p className="text-[#1a2629] text-xl leading-relaxed">
                   <strong>{feat.name}</strong> {feat.value}
                 </p>
              </div>
            )) : (
              <div className="flex gap-6 items-start">
                 <span className="text-[#bda871] font-light text-xl mt-1">01</span>
                 <p className="text-[#1a2629] text-xl leading-relaxed">
                   <strong>Diseño Abierto:</strong> Integración perfecta entre espacios.
                 </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Page 4: Galería (Dark) */}
      <div className="slide page-break bg-[#1a2629] text-white">
        <div className="w-[35%] h-full flex flex-col justify-center pl-24 pr-12">
          <div className="flex items-center gap-6 mb-6">
            <div className="w-16 h-px bg-[#bda871]"></div>
            <p className="text-[#bda871] font-medium text-sm uppercase tracking-[0.25em]">Espacios</p>
          </div>
          <h2 className={`${playfair.className} text-4xl font-bold mb-6`}>Medidas por ambiente</h2>
          <p className="text-gray-400 text-lg leading-relaxed">
             Cada detalle ha sido cuidadosamente medido para asegurar la comodidad en su hogar.
          </p>
        </div>
        <div className="w-[65%] h-full grid grid-cols-2 grid-rows-2 gap-4 p-12 content-center justify-items-center">
            <div className="w-full h-full relative bg-white/5 rounded-sm overflow-hidden shadow-lg border border-white/10">
               <DriveImagePreview url={img3} alt="Interior" className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="w-full h-full relative bg-white/5 rounded-sm overflow-hidden shadow-lg border border-white/10">
               <DriveImagePreview url={img4} alt="Interior" className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="w-full h-full relative bg-white/5 rounded-sm overflow-hidden shadow-lg border border-white/10">
               <DriveImagePreview url={img5} alt="Interior" className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="w-full h-full relative bg-white/5 rounded-sm overflow-hidden shadow-lg border border-white/10">
               <DriveImagePreview url={img6} alt="Interior" className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>
        </div>
      </div>

      {/* Page 5: Vida al exterior */}
      <div className="slide page-break bg-[#1a2629]">
        <div className="w-[50%] h-full relative">
           <DriveImagePreview url={imagesList[6] || img4} alt="Terraza" className="absolute inset-0 w-full h-full object-cover" />
        </div>
        <div className="w-[50%] h-full flex flex-col justify-center pl-20 pr-24 text-white">
          <div className="flex items-center gap-6 mb-6">
            <div className="w-16 h-px bg-[#bda871]"></div>
            <p className="text-[#bda871] font-medium text-sm uppercase tracking-[0.25em]">Vida al Exterior</p>
          </div>
          <h2 className={`${playfair.className} text-4xl font-bold leading-tight mb-8`}>
            Terrazas para reunir a la familia
          </h2>
          <p className="text-lg text-gray-300 font-light leading-relaxed mb-12 max-w-lg">
            Espacios exteriores integrados a la vida diaria: ideales para acoger celebraciones, montar la sucá y disfrutar del clima.
          </p>
          <div className="flex flex-wrap gap-12 border-t border-gray-700 pt-8 mt-4">
             <div>
               <p className={`${playfair.className} text-3xl font-bold text-white mb-2`}>10.5 <span className="text-lg font-sans text-[#bda871]">m²</span></p>
               <p className="text-sm text-gray-400 uppercase tracking-widest font-semibold">Terraza Principal</p>
             </div>
             <div>
               <p className={`${playfair.className} text-3xl font-bold text-white mb-2`}>9.0 <span className="text-lg font-sans text-[#bda871]">m²</span></p>
               <p className="text-sm text-gray-400 uppercase tracking-widest font-semibold">Terraza Cubierta</p>
             </div>
          </div>
        </div>
      </div>

      {/* Page 6: Estilo de Vida */}
      <div className="slide page-break bg-[#f7f5f0]">
        <div className="w-[45%] h-full flex flex-col justify-center pl-24 pr-16">
          <div className="flex items-center gap-6 mb-6">
            <div className="w-16 h-px bg-[#bda871]"></div>
            <p className="text-[#bda871] font-medium text-sm uppercase tracking-[0.25em]">Estilo de Vida Mi Cassa</p>
          </div>
          <h2 className={`${playfair.className} text-4xl font-bold text-[#1a2629] mb-12`}>Comunidad y tradición</h2>
          
          <div className="space-y-10">
            <div>
              <h3 className="text-xl font-bold text-[#1a2629] mb-3">Legado familiar</h3>
              <p className="text-lg text-gray-600 font-light leading-relaxed">
                Un espacio que celebra la pertenencia y la continuidad generacional, hecho para crecer en familia.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#1a2629] mb-3">Valores compartidos</h3>
              <p className="text-lg text-gray-600 font-light leading-relaxed">
                Diseñado bajo los valores y los ritmos de nuestra comunidad, en el corazón de la ciudad.
              </p>
            </div>
          </div>
        </div>
        <div className="w-[55%] h-full flex flex-col">
          <div className="h-1/2 w-full relative border-b border-white">
            <DriveImagePreview url={imagesList[7] || img5} alt="Familia" className="absolute inset-0 w-full h-full object-cover" />
          </div>
          <div className="h-1/2 w-full relative border-t border-white">
             <DriveImagePreview url={imagesList[8] || img6} alt="Comunidad" className="absolute inset-0 w-full h-full object-cover" />
          </div>
        </div>
      </div>

      {/* Page 8: Cierre */}
      <div className="slide page-break bg-[#111] flex flex-row">
        <div className="w-[45%] h-full flex flex-col justify-center px-16 z-10 relative text-white">
          <div className="mb-12">
             <Image src="/logo.png" alt="Mi Cassa" width={192} height={48} className="object-contain mix-blend-screen invert grayscale opacity-90" />
          </div>
          
          <div className="flex items-center gap-6 mb-6">
            <div className="w-16 h-px bg-[#bda871]"></div>
            <p className="text-[#bda871] font-medium text-sm uppercase tracking-[0.25em]">El Siguiente Paso</p>
          </div>
          <h2 className={`${playfair.className} text-[4rem] font-bold leading-[1.1] mb-6`}>
            Conozca su lugar en<br/>la Ciudad Santa
          </h2>
          <p className="text-lg text-gray-300 font-light max-w-xl leading-relaxed mb-auto">
            Le invitamos a una conversación privada y a una visita personalizada para conocer la propiedad y encontrar la suya.
          </p>
          
          <div className="flex justify-between items-end pb-12 pt-8 border-t border-gray-700/50 mt-12">
             <div className="flex flex-col gap-6">
                <div>
                   <p className="text-gray-400 text-sm uppercase tracking-widest font-semibold mb-2">Teléfono</p>
                   <p className="text-xl font-medium">+972 58-713-7208</p>
                </div>
                <div>
                   <p className="text-gray-400 text-sm uppercase tracking-widest font-semibold mb-2">Correo</p>
                   <p className="text-xl font-medium">micassaisrael@gmail.com</p>
                </div>
             </div>
          </div>
          <p className="text-[#bda871] font-light tracking-widest text-sm mt-4">Inmobiliaria · Hipotecas · Inversiones</p>
        </div>
        <div className="w-[55%] h-full relative">
          <DriveImagePreview url={heroImage} alt="Cierre" className="absolute inset-0 w-full h-full object-cover" />
        </div>
      </div>
    </div>
  );
}
