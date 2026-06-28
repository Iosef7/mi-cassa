import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function PublicHomepage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50 p-6 flex justify-between items-center bg-black/30 backdrop-blur-sm text-white">
        <div className="text-2xl font-light tracking-[0.2em] uppercase" style={{ fontFamily: '"Copperplate Gothic Light Regular", serif' }}>
          MiCassa
        </div>
        <nav className="hidden md:flex space-x-6 text-sm uppercase tracking-widest">
          <Link href="#proyectos" className="hover:text-blue-400 transition">Proyectos</Link>
          <Link href="#alquileres" className="hover:text-blue-400 transition">Alquileres</Link>
          <Link href="/propiedades" className="hover:text-blue-400 transition font-bold">Catálogo</Link>
          <Link href="#nosotros" className="hover:text-blue-400 transition">Nosotros</Link>
          <Link href="#contacto" className="hover:text-blue-400 transition">Contacto</Link>
          <Link href="/admin" className="ml-4 opacity-50 hover:opacity-100 transition">Admin</Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative h-screen flex flex-col justify-center items-center text-center px-4 bg-gray-900">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1544984243-ec57b16fac25?auto=format&fit=crop&q=80&w=2000" 
            alt="Jerusalem" 
            fill 
            className="object-cover opacity-50" 
            priority
          />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg">Tu hogar en Israel</h1>
          <p className="text-lg md:text-2xl mb-10 font-light drop-shadow-md">
            Hacemos de tu inversión un éxito con el mejor asesoramiento para comprar y alquilar tu casa en Israel.
          </p>
          <Link href="/propiedades" className="inline-block px-8 py-4 bg-white text-black font-semibold uppercase tracking-widest text-sm hover:bg-gray-200 transition">
            Ver Catálogo
          </Link>
        </div>
      </section>

      {/* Por qué elegirnos */}
      <section id="nosotros" className="py-24 px-6 max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-16 uppercase tracking-wider">Por qué elegirnos</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <h4 className="font-bold uppercase tracking-wider mb-4">Atención Personalizada</h4>
            <p className="text-gray-600 leading-relaxed">Somos un equipo interdisciplinario en contacto con las principales empresas constructoras locales e internacionales para asesorarte en tu inversión</p>
          </div>
          <div>
            <h4 className="font-bold uppercase tracking-wider mb-4">Asesoramiento Legal y Financiero</h4>
            <p className="text-gray-600 leading-relaxed">Gestionamos ante las entidades bancarias el otorgamiento de créditos hipotecarios (Mashkanta). También disponemos de un equipo de letrados para asesorarte en la escritura y alquiler de tu propiedad</p>
          </div>
          <div>
            <h4 className="font-bold uppercase tracking-wider mb-4">Rentabilidad</h4>
            <p className="text-gray-600 leading-relaxed">Contamos con una gran cartera de proyectos que te aseguran una renta anual</p>
          </div>
          <div>
            <h4 className="font-bold uppercase tracking-wider mb-4">Alquiler</h4>
            <p className="text-gray-600 leading-relaxed">Contamos con asesoramiento legal y jurídico para que puedas alquilar tu propiedad por períodos temporarios o más extensos</p>
          </div>
        </div>
      </section>

      {/* Proyectos Únicos */}
      <section id="proyectos" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-16 text-center uppercase tracking-wider">Proyectos únicos</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded shadow hover:shadow-lg transition">
              <div className="h-64 relative bg-gray-200">
                 <Image src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800" alt="Legacy" fill className="object-cover" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Legacy – Jerusalem</h3>
                <p className="text-gray-600 text-sm">El prestigioso proyecto Legacy se encuentra en una ubicación única en Jerusalém: con vistas a las murallas de la Ciudad Vieja, Shaar Yafo, la Torre de David y en frente del Shopping Mamila.</p>
              </div>
            </div>

            <div className="bg-white rounded shadow hover:shadow-lg transition">
              <div className="h-64 relative bg-gray-200">
                 <Image src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800" alt="Savyon View" fill className="object-cover" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Savyon View – Jerusalem</h3>
                <p className="text-gray-600 text-sm">El proyecto Savyon View es otra perla inmobiliaria de nuestra colección ubicado en el corazón de Jerusalém. La torre de lujo se encuentra en el histórico complejo Mapai House en la esquina de las calles King George y Yafo.</p>
              </div>
            </div>

            <div className="bg-white rounded shadow hover:shadow-lg transition">
              <div className="h-64 relative bg-gray-200">
                 <Image src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=800" alt="Jerusalem Spirit" fill className="object-cover" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Jerusalem Spirit – Jerusalem</h3>
                <p className="text-gray-600 text-sm">Una experiencia de vida en el corazón de Jerusalem. Jerusalem Spirit, ubicado en el encantador barrio Rabi Akiva, se encuentra a poca distancia de los parques de la Ciudad y de los hermosos monumentos culturales de Jerusalem.</p>
              </div>
            </div>
          </div>
          
          <div className="mt-16 text-center">
             <Link href="/propiedades" className="inline-block px-8 py-3 border-2 border-gray-900 text-gray-900 font-bold uppercase tracking-widest hover:bg-gray-900 hover:text-white transition">
               Ver todos los proyectos
             </Link>
          </div>
        </div>
      </section>

      {/* Alquileres Temporarios */}
      <section id="alquileres" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-16">
             <div className="md:w-1/2 mb-8 md:mb-0">
               <h2 className="text-3xl font-bold uppercase tracking-wider mb-4">Alquileres temporarios</h2>
               <p className="text-gray-600 text-lg">Tenemos a disposición cientos de propiedades para hacer de tu estadía en Israel unas vacaciones de lujo. Disfrutá la experiencia única de visitar la santidad de Israel en los departamentos mejor ubicados y equipados.</p>
             </div>
             <div>
                <Link href="/propiedades" className="inline-block px-8 py-3 border-2 border-gray-900 text-gray-900 font-bold uppercase tracking-widest hover:bg-gray-900 hover:text-white transition">
                  Ver todos los alquileres
                </Link>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="group cursor-pointer">
              <div className="h-48 bg-gray-200 relative overflow-hidden">
                <Image src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800" alt="Ro'e Tson" fill className="object-cover group-hover:scale-105 transition duration-500" />
              </div>
              <h4 className="font-bold mt-4">Ro’e Tson 2 – Jerusalem</h4>
              <p className="text-sm text-gray-500">Dúplex de 4 dormitorios, 3 baños y jardín con vistas a las murallas de Jerusalém</p>
            </div>
            <div className="group cursor-pointer">
              <div className="h-48 bg-gray-200 relative overflow-hidden">
                <Image src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800" alt="Rav Kook" fill className="object-cover group-hover:scale-105 transition duration-500" />
              </div>
              <h4 className="font-bold mt-4">Rav Kook 7 – Jerusalem</h4>
              <p className="text-sm text-gray-500">Excelente propiedad de lujo de alquiler diario. 3 Dormitorios. Ubicado en pleno centro a 10 cuadras del Shopping Mamila</p>
            </div>
            <div className="group cursor-pointer">
              <div className="h-48 bg-gray-200 relative overflow-hidden">
                <Image src="https://images.unsplash.com/photo-1502672260266-1c1c24226133?auto=format&fit=crop&q=80&w=800" alt="HaNeviim" fill className="object-cover group-hover:scale-105 transition duration-500" />
              </div>
              <h4 className="font-bold mt-4">HaNeviim 45 – Jerusalem</h4>
              <p className="text-sm text-gray-500">Extraordinario Penthouse (Dúplex) de 5 dormitorios ubicado en el centro de la ciudad a 12 minutos caminando del Shopping Mamila</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer / Contacto */}
      <footer id="contacto" className="bg-gray-900 text-white py-16">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold uppercase tracking-wider mb-6">Contactanos</h2>
            <div className="space-y-4 text-gray-300">
               <p className="flex items-center gap-2"><span>📍</span> Ovadia Tache</p>
               <p className="flex items-center gap-2"><span>📱</span> +972 587464528</p>
               <p className="flex items-center gap-2"><span>✉️</span> info@micassail.com</p>
            </div>
          </div>
          <div>
            <form className="space-y-4">
              <input type="text" placeholder="Nombre" className="w-full bg-gray-800 border border-gray-700 rounded p-3 text-white placeholder-gray-500 focus:outline-none focus:border-white" />
              <input type="email" placeholder="Email" className="w-full bg-gray-800 border border-gray-700 rounded p-3 text-white placeholder-gray-500 focus:outline-none focus:border-white" />
              <input type="text" placeholder="Celular" className="w-full bg-gray-800 border border-gray-700 rounded p-3 text-white placeholder-gray-500 focus:outline-none focus:border-white" />
              <textarea placeholder="Mensaje" rows={4} className="w-full bg-gray-800 border border-gray-700 rounded p-3 text-white placeholder-gray-500 focus:outline-none focus:border-white"></textarea>
              <button className="px-8 py-3 bg-white text-black font-bold uppercase tracking-widest hover:bg-gray-200 transition">Enviar</button>
            </form>
          </div>
        </div>
      </footer>
    </div>
  );
}
