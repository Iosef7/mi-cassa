"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import PublicHeader from "@/components/ui/PublicHeader";

const MortgageCalculator = dynamic(() => import('@/components/MortgageCalculator').then(mod => mod.MortgageCalculator), {
  ssr: false,
  loading: () => <div className="animate-pulse h-[400px] w-full bg-gray-100 rounded-2xl flex items-center justify-center"><p className="text-gray-400">Cargando calculadora...</p></div>
});

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans overflow-x-hidden">
      
      <PublicHeader />
      {/* 2. HERO VIDEO */}
      <section className="relative w-full h-[650px] bg-gray-900 z-10">
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-[850px] object-cover" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
            <source src="https://cdn.pixabay.com/video/2021/10/12/91744-636709154_large.mp4" type="video/mp4" />
          </video>
        </div>
        {/* White Triangle Pointing Down (Cutout) */}
        <div className="absolute bottom-0 left-0 w-full leading-none z-20" style={{ transform: 'translateY(1px) rotate(180deg)' }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 100" preserveAspectRatio="none" className="w-full h-[60px] md:h-[98.9px] block" style={{ fill: '#ffffff' }}>
            <path d="M500,98.9L0,6.1V0h1000v6.1L500,98.9z"></path>
          </svg>
        </div>
      </section>

      {/* 3. EDIFICIO MODERNO - QUIERES INVERTIR */}
      <section className="relative w-full bg-white pt-24 pb-32 z-20">
        <div className="max-w-[1140px] mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative">
          
          {/* Building Image (Left) */}
          <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative h-[500px] w-full flex justify-center z-30">
            <Image 
              src="/wp-uploads/edificio-moderno-gran-altura-sobre-fondo-transparente_1190923-3641.png" 
              alt="Edificio Moderno" 
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain" 
            />
          </motion.div>

          {/* Text (Right) */}
          <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="text-[#214953] z-20">
            <h2 className="text-[32px] md:text-[36px] font-bold mb-6 leading-tight">
              ¿Quieres invertir en los mejores<br/>proyectos inmobiliarios de Israel?
            </h2>
            <div className="w-[80px] h-[3px] bg-[#5280A4] mb-6"></div>
            <p className="text-gray-600 text-[18px] leading-relaxed">
              En MiCassa te asesoraremos desde el primer momento para encontrar tu inversión ideal en Israel. Trabajamos con empresas constructoras de renombre internacional, sólidas y con amplia experiencia. No pierda la oportunidad única y el mérito de tener su propiedad en la Tierra prometida a Nuestros Padres con santidad única y lugares llenos de misticismo e historia.
            </p>
          </motion.div>

        </div>

        {/* Asymmetrical Bottom Shape Divider (Bottom shape, negative = NO rotation) */}
        <div className="absolute bottom-0 left-0 w-full leading-none z-10" style={{ transform: 'translateY(1px)' }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 100" preserveAspectRatio="none" className="w-full h-[60px] md:h-[94.7px] block" style={{ fill: '#f9fafb' }}>
            <path d="M737.9,94.7L0,0v100h1000V0L737.9,94.7z"></path>
          </svg>
        </div>
      </section>

      {/* 4. HAZ REALIDAD TU SUEÑO */}
      <section className="relative w-full bg-gray-50 pt-24 pb-32 z-10">
        <div className="max-w-[1140px] mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-[#214953] text-[36px] font-normal mb-6 leading-tight">Haz realidad tu sueño y un<br/>precepto único para la vida.</h2>
            <div className="w-[80px] h-[3px] bg-[#5280A4] mb-6"></div>
            <p className="text-gray-600 text-[18px] leading-relaxed mb-6">
              Hoy es posible cumplir uno de los preceptos de vida más importantes y adquirir propiedades en las mejores regiones de Israel, con oportunidades de negocio y rentabilidad únicas. En nuestro equipo profesional encontrarás:
            </p>
            <ul className="text-gray-600 text-[18px] leading-relaxed list-disc pl-6 space-y-2">
              <li>Atención personalizada</li>
              <li>Asesoramiento crediticio y legal</li>
              <li>Servicio post entrega</li>
            </ul>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative h-[400px] w-full rounded-lg shadow-lg overflow-hidden">
            <Image 
              src="/wp-uploads/illustration-construction-site-1024x585.jpg" 
              alt="Construction Site" 
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover" 
            />
          </motion.div>
        </div>
      </section>

      {/* 5. ESTAMOS AQUI PARA AYUDARLE */}
      <section className="relative w-full bg-[#214953] text-white pt-32 pb-24 z-10">
        <div className="absolute top-0 left-0 w-full leading-none z-10" style={{ transform: 'translateY(-1px) rotate(180deg)' }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 100" preserveAspectRatio="none" className="w-full h-[60px] md:h-[94.7px] block" style={{ fill: '#f9fafb' }}>
            <path d="M737.9,94.7L0,0v100h1000V0L737.9,94.7z"></path>
          </svg>
        </div>
        <div className="max-w-[1140px] mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-start mt-8">
          <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="text-[36px] font-bold mb-6 leading-tight">Estamos aquí para ayudarle en cada paso del camino en este maravilloso proyecto.</h2>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="w-[80px] h-[3px] bg-[#5280A4] mb-8"></div>
            <ul className="text-[18px] leading-relaxed space-y-4">
              <li><strong>• Investigación de mercado</strong></li>
              <li><strong>• Análisis y asesoramiento para cada proyecto.</strong></li>
              <li><strong>• Gestión global de préstamos hipotecarios (mashkanta)</strong></li>
              <li><strong>• Asesoramiento legal y financiero</strong></li>
              <li><strong>• Alquileres temporales y por periodos prolongados</strong></li>
              <li><strong>• Diseño de decoración de interiores.</strong></li>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* 6. INVIERTE EN EL MEJOR LUGAR */}
      <section className="relative w-full bg-[#5280A4] text-white pt-24 pb-32 z-10">
        <div className="max-w-[1140px] mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="text-[36px] font-bold mb-6 leading-tight">Invierte en el mejor lugar del mundo</h2>
            <div className="w-[80px] h-[3px] bg-white/50 mb-6"></div>
            <p className="text-[18px] leading-relaxed text-white/90">
              Es la tierra de nuestros Padres y en la que todos los judíos del mundo aspiran a vivir. Un lugar que irradia santidad y ofrece diversos proyectos para que puedas realizar tu sueño y obtener considerables ingresos. Estamos aquí para asesorarte y recorrer juntos este hermoso camino.
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <h3 className="text-[20px] font-bold mb-2">Atención personalizada</h3>
              <p className="text-white/80 text-[15px]">Somos un equipo interdisciplinario en contacto con las principales constructoras locales e internacionales para asesorarte en tu inversión.</p>
            </div>
            <div>
              <h3 className="text-[20px] font-bold mb-2">Asesoramiento legal y financiero</h3>
              <p className="text-white/80 text-[15px]">Gestionamos la concesión de préstamos hipotecarios a entidades bancarias. Contamos con abogados para escrituración y alquiler.</p>
            </div>
            <div>
              <h3 className="text-[20px] font-bold mb-2">Rentabilidad</h3>
              <p className="text-white/80 text-[15px]">Disponemos de una gran cartera de proyectos que te garantizan unos ingresos anuales.</p>
            </div>
            <div>
              <h3 className="text-[20px] font-bold mb-2">Para alquilar</h3>
              <p className="text-white/80 text-[15px]">Contamos con asesoría legal para que puedas alquilar tu propiedad por períodos temporales o prolongados.</p>
            </div>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 w-full leading-none z-10" style={{ transform: 'translateY(1px)' }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 100" preserveAspectRatio="none" className="w-full h-[60px] md:h-[94.7px] block" style={{ fill: '#111827' }}>
            <path d="M737.9,94.7L0,0v100h1000V0L737.9,94.7z"></path>
          </svg>
        </div>
      </section>

      {/* 7. ALQUILERES TEMPORALES (VIDEO BACKGROUND) */}
      <section className="relative w-full h-[500px] bg-gray-900 flex items-center justify-center">
        <div className="absolute inset-0 w-full h-full overflow-hidden opacity-60">
          <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
            <source src="http://localhost/micassaisrael/wp-content/uploads/2024/11/7578552-uhd_3840_2160_30fps.mp4" type="video/mp4" />
          </video>
        </div>
        <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} className="relative z-20 text-center">
          <h2 className="text-white text-[48px] font-bold mb-6 drop-shadow-lg">Alquileres temporales</h2>
          <div className="w-[100px] h-[3px] bg-[#5280A4] mx-auto mb-6"></div>
        </motion.div>
        <div className="absolute top-0 left-0 w-full leading-none z-10" style={{ transform: 'translateY(-1px)' }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 100" preserveAspectRatio="none" className="w-full h-[60px] md:h-[94.7px] block" style={{ fill: '#5280A4' }}>
            <path d="M738,99l262-93V0H0v5.6L738,99z"></path>
          </svg>
        </div>
      </section>

      {/* 8. COUNTERS */}
      <section className="w-full bg-white py-16">
        <div className="max-w-[1140px] mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-[50px] font-bold text-[#214953]">+50</div>
            <div className="text-[18px] text-gray-500 uppercase tracking-wide">Proyectos completados</div>
          </div>
          <div>
            <div className="text-[50px] font-bold text-[#214953]">+2,000</div>
            <div className="text-[18px] text-gray-500 uppercase tracking-wide">Clientes satisfechos</div>
          </div>
          <div>
            <div className="text-[50px] font-bold text-[#214953]">12</div>
            <div className="text-[18px] text-gray-500 uppercase tracking-wide">Años de experiencia</div>
          </div>
        </div>
      </section>

      {/* 9. TESTIMONIOS */}
      <section className="w-full bg-gray-50 py-24">
        <div className="max-w-[1140px] mx-auto px-4 text-center">
          <h2 className="text-[#214953] text-[36px] font-bold mb-12">Lo que dicen nuestros clientes</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Review 1 */}
            <div className="bg-white p-8 rounded-lg shadow-sm text-left">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold text-xl mr-4">A</div>
                <div>
                  <h4 className="font-bold text-[#214953]">Alberto D.</h4>
                  <span className="text-sm text-gray-500">Buenos Aires, Argentina</span>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">"No tengo más que palabras de agradecimiento para MiCassa. La calidez humana de sus empleados para asesorarme en todo, desde la elección de la inversión hasta el alquiler de mi inmueble. Pude combinar una excelente inversión con el valor de un precepto tan importante como es la adquisición de una propiedad en la Tierra de Israel."</p>
            </div>
            {/* Review 2 */}
            <div className="bg-white p-8 rounded-lg shadow-sm text-left">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold text-xl mr-4">M</div>
                <div>
                  <h4 className="font-bold text-[#214953]">Meir Y.</h4>
                  <span className="text-sm text-gray-500">Buenos Aires, Argentina</span>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">"Me gustaría destacar el nivel humano de todo el personal de MiCassa, que me asesoró desde el primer momento en la elección de mi inversión. Hoy puedo decir que he cumplido mi sueño de tener mi hogar en Israel."</p>
            </div>
            {/* Review 3 */}
            <div className="bg-white p-8 rounded-lg shadow-sm text-left">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold text-xl mr-4">B</div>
                <div>
                  <h4 className="font-bold text-[#214953]">Brian S.</h4>
                  <span className="text-sm text-gray-500">Ciudad de México, México</span>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">"Han pasado varios años desde mi inversión en un proyecto que fue un éxito y la empresa sigue en contacto conmigo y disponible para cualquier necesidad que pueda surgir. Altamente recomendado."</p>
            </div>
          </div>
        </div>
      </section>

      {/* 10. PROYECTOS UNICOS */}
      <section className="w-full bg-white py-24">
        <div className="max-w-[1140px] mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-[#214953] text-[36px] font-bold mb-6">Proyectos unicos</h2>
            <div className="w-[100px] h-[3px] bg-[#5280A4] mx-auto mb-6"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Proyecto 1 */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="h-[250px] w-full relative overflow-hidden bg-gray-100">
                <Image src="/wp-uploads/Captura-de-pantalla-2025-07-14.png" alt="Ein Kerem" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
              </div>
              <div className="p-6">
                <span className="text-xs font-semibold text-[#5280A4] uppercase tracking-wider mb-2 block">PROYECTOS</span>
                <h3 className="text-xl font-bold text-[#214953] mb-3">Ein Kerem</h3>
                <p className="text-gray-600 text-sm mb-6 line-clamp-3">En la entrada del complejo desde la calle Brasil descubrirás Pastoral Hillside, 7 pisos boutique con ascensores y entrada propia, ubicados entre las cuatro torres y que permiten una experiencia de vida de villa flotando frente a la vista,</p>
                <Link href="#" className="inline-block px-6 py-2 bg-[#5280A4] text-white text-sm font-medium rounded hover:bg-[#3E77A4] transition-colors">Leer mas</Link>
              </div>
            </div>
            {/* Proyecto 2 */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="h-[250px] w-full relative overflow-hidden bg-gray-100">
                <Image src="/wp-uploads/18-3.jpg" alt="Apartamento Jaffa Shalem Tower" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
              </div>
              <div className="p-6">
                <span className="text-xs font-semibold text-[#5280A4] uppercase tracking-wider mb-2 block">PROYECTOS</span>
                <h3 className="text-xl font-bold text-[#214953] mb-3">Apartamento Jaffa Shalem Tower</h3>
                <p className="text-gray-600 text-sm mb-6 line-clamp-3">• Edificio nuevo • 5.780.000 NIS ** Oportunidad para inversores por una oferta perfecta, ¡el apartamento ya está alquilado!</p>
                <Link href="#" className="inline-block px-6 py-2 bg-[#5280A4] text-white text-sm font-medium rounded hover:bg-[#3E77A4] transition-colors">Leer mas</Link>
              </div>
            </div>
            {/* Proyecto 3 */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="h-[250px] w-full relative overflow-hidden bg-gray-100">
                <Image src="/wp-uploads/9-6.jpg" alt="En la zona de Mamilla" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
              </div>
              <div className="p-6">
                <span className="text-xs font-semibold text-[#5280A4] uppercase tracking-wider mb-2 block">PROYECTOS</span>
                <h3 className="text-xl font-bold text-[#214953] mb-3">En la zona de Mamilla</h3>
                <p className="text-gray-600 text-sm mb-6 line-clamp-3">3 habitaciones<br/>800 m²<br/>Balcón de 12 m²</p>
                <Link href="#" className="inline-block px-6 py-2 bg-[#5280A4] text-white text-sm font-medium rounded hover:bg-[#3E77A4] transition-colors">Leer mas</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COTIZADOR HIPOTECARIO (De SICOBEN) */}
      <section className="w-full bg-gray-50 py-24 border-t border-gray-200">
        <div className="max-w-[1140px] mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-[#214953] text-[36px] font-bold mb-6">Calcula tu Inversión</h2>
            <div className="w-[100px] h-[3px] bg-[#5280A4] mx-auto mb-6"></div>
            <p className="text-gray-600">Simula tu crédito hipotecario, enganche y gastos notariales en tiempo real.</p>
          </div>
          <MortgageCalculator />
        </div>
      </section>

      {/* 11. FOOTER CONTACTANOS */}
      <footer className="w-full bg-[#111827] text-white py-24 relative overflow-hidden">
        <div className="max-w-[1140px] mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
          
          {/* Columna Izquierda: Información de contacto e imagen */}
          <div>
            <div className="w-full h-[300px] mb-8 overflow-hidden rounded-lg opacity-80 mix-blend-luminosity relative">
              <Image src="/wp-uploads/PHOTO-2024-10-31-18-25-55-1024x738.jpg" alt="Oficina" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
            </div>
            <h2 className="text-[36px] font-bold mb-4">Contactanos</h2>
            <div className="w-[80px] h-[3px] bg-[#5280A4] mb-8"></div>
            
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full border border-[#5280A4] flex items-center justify-center text-[#5280A4]">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 512 512"><path d="M497.39 361.8l-112-48a24 24 0 0 0-28 6.9l-49.6 60.6A370.66 370.66 0 0 1 130.6 204.11l60.6-49.6a23.94 23.94 0 0 0 6.9-28l-48-112A24.16 24.16 0 0 0 122.6.61l-104 24A24 24 0 0 0 0 48c0 256.5 207.9 464 464 464a24 24 0 0 0 23.4-18.6l24-104a24.29 24.29 0 0 0-14.01-27.6z"/></svg>
                </div>
                <p className="text-xl">972 58-713-7208</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full border border-[#5280A4] flex items-center justify-center text-[#5280A4]">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 512 512"><path d="M502.3 190.8c3.9-3.1 9.7-.2 9.7 4.7V400c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V195.6c0-5 5.7-7.8 9.7-4.7 22.4 17.4 52.1 39.5 154.1 113.6 21.1 15.4 56.7 47.8 92.2 47.6 35.7.3 72-32.8 92.3-47.6 102-74.1 131.6-96.3 154-113.7zM256 320c23.2.4 56.6-29.2 73.4-41.4 132.7-96.3 142.8-104.7 173.4-128.7 5.8-4.5 9.2-11.5 9.2-18.9v-19c0-26.5-21.5-48-48-48H48C21.5 64 0 85.5 0 112v19c0 7.4 3.4 14.3 9.2 18.9 30.6 23.9 40.7 32.4 173.4 128.7 16.8 12.2 50.2 41.8 73.4 41.4z"/></svg>
                </div>
                <p className="text-xl">micassaisrael@gmail.com</p>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Formulario */}
          <div className="bg-white text-gray-800 p-8 rounded-lg shadow-xl">
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input type="text" placeholder="John Doe" className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-[#5280A4] focus:border-[#5280A4] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" placeholder="john@doe.com" className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-[#5280A4] focus:border-[#5280A4] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Celular</label>
                <input type="tel" placeholder="+1 300 400 5000" className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-[#5280A4] focus:border-[#5280A4] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pais *</label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-[#5280A4] focus:border-[#5280A4] outline-none bg-white">
                  <option value="">Seleccionar país</option>
                  <option value="IL">Israel</option>
                  <option value="MX">México</option>
                  <option value="AR">Argentina</option>
                  <option value="US">Estados Unidos</option>
                  <option value="ES">España</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje</label>
                <textarea rows={4} className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-[#5280A4] focus:border-[#5280A4] outline-none resize-none"></textarea>
              </div>
              <button type="button" className="w-full py-4 bg-[#5280A4] text-white font-bold rounded-md hover:bg-[#3E77A4] transition-colors shadow-md">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Widget (Exact Replica) */}
      <div className="fixed bottom-[30px] right-[30px] z-[9999] flex flex-col items-end">
        {/* Chat Box (Hover Reveal) */}
        <div className="hidden hover:flex bg-white rounded-lg shadow-xl mb-4 w-[300px] flex-col overflow-hidden transform transition-all">
          <div className="bg-[#2DB742] p-4 text-white">
            <h4 className="font-bold text-lg">Micassa</h4>
            <p className="text-xs text-[#d9ebc6]">comunicate con nosotros</p>
          </div>
          <div className="p-4 bg-gray-50 flex items-center space-x-3 cursor-pointer hover:bg-gray-100 transition-colors">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0">
               <svg viewBox="0 0 512 512" fill="currentColor" className="w-full h-full text-white bg-[#55CD6C] rounded-full p-2"><path d="M137.71 430.786l7.945 4.414c32.662 20.303 70.621 32.662 110.345 32.662 c115.641 0 211.862-96.221 211.862-213.628S371.641 44.138 255.117 44.138S44.138 137.71 44.138 254.234 c0 40.607 11.476 80.331 32.662 113.876l5.297 7.945l-20.303 74.152L137.71 430.786z" fill="#55CD6C"/></svg>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800">Micassa</p>
              <p className="text-xs text-gray-500">En línea</p>
            </div>
          </div>
        </div>

        {/* Floating Button */}
        <a href="https://api.whatsapp.com/send?phone=972587137208" target="_blank" rel="noopener noreferrer" className="w-[60px] h-[60px] bg-[#2DB742] text-white rounded-full shadow-[0_4px_10px_rgba(0,0,0,0.15)] hover:scale-110 transition-transform flex items-center justify-center relative">
          <svg viewBox="0 0 32 32" className="w-8 h-8 fill-current" xmlns="http://www.w3.org/2000/svg"><path d="M16 0c-8.837 0-16 7.163-16 16 0 2.822.733 5.467 2.031 7.781l-2.031 8.219 8.375-2.219c2.256 1.156 4.825 1.813 7.563 1.813 8.837 0 16-7.163 16-16s-7.163-16-16-16zm8.125 22.844c-.344.969-2 1.844-2.75 1.938-.75.125-1.75.25-5.188-1.188-4.156-1.719-6.844-6.031-7.063-6.313-.219-.313-1.688-2.25-1.688-4.281 0-2.063 1.063-3.094 1.469-3.531.375-.406.844-.5 1.125-.5.281 0 .563 0 .781.031.25.031.563-.094.875.688.344.813 1.156 2.844 1.281 3.094.125.25.188.531.031.844-.125.281-.188.469-.406.719-.188.25-.406.531-.563.719-.188.219-.406.469-.156.906.219.406 1.031 1.719 2.188 2.75 1.5 1.344 2.781 1.781 3.25 1.969.469.219.75.188 1.031-.125.281-.313 1.25-1.469 1.594-1.969.313-.5.656-.406 1.094-.25.438.156 2.75 1.313 3.219 1.531.469.219.781.344.906.531.125.188.125 1.063-.219 2.031z"/></svg>
        </a>
      </div>
    </div>
  );
}
