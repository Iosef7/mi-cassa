import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function PublicHomepage() {
  return (
    <div className="min-h-screen bg-white text-legacy-gray font-lato">
      {/* 1. Navbar Structure & Links */}
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-[90px]">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <div className="relative w-48 h-16 cursor-pointer hover:opacity-90 transition flex items-center">
                  <Image src="/micassa-brand.png?v=1" alt="MiCassa Logo" fill className="object-contain" priority unoptimized />
                </div>
              </Link>
            </div>

            {/* Links */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="#" className="font-copperplate text-legacy-blue text-[15px] hover:opacity-80 transition">INICIO</Link>
              <Link href="#servicios" className="font-copperplate text-legacy-gray text-[15px] hover:opacity-80 transition">SERVICIOS</Link>
              <div className="relative group py-6">
                <Link href="#proyectos" className="font-copperplate text-legacy-gray text-[15px] hover:opacity-80 transition flex items-center">
                  PROYECTOS <span className="ml-1 text-[10px]">▼</span>
                </Link>
                
                {/* Dropdown Menu */}
                <div className="absolute top-full left-0 w-64 bg-white border-t-2 border-legacy-blue shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 flex flex-col py-4">
                  <Link href="#" className="font-copperplate text-legacy-gray hover:text-legacy-blue text-sm py-3 px-6 transition">LEGACY</Link>
                  <Link href="#" className="font-copperplate text-legacy-gray hover:text-legacy-blue text-sm py-3 px-6 transition">SAVYON VIEW<br/>JERUSALEM</Link>
                  <Link href="#" className="font-copperplate text-legacy-gray hover:text-legacy-blue text-sm py-3 px-6 transition">BRIGA TOWERS</Link>
                  <Link href="#" className="font-copperplate text-legacy-gray hover:text-legacy-blue text-sm py-3 px-6 transition">SAVYON CITY<br/>NETANYA</Link>
                  <Link href="#" className="font-copperplate text-legacy-gray hover:text-legacy-blue text-sm py-3 px-6 transition">SPIRIT NETANYA</Link>
                  <Link href="#" className="font-copperplate text-legacy-gray hover:text-legacy-blue text-sm py-3 px-6 transition">JERUSALEM<br/>SPIRIT</Link>
                </div>
              </div>
              <Link href="#alquileres" className="font-copperplate text-legacy-gray text-[15px] hover:opacity-80 transition">ALQUILERES TEMPORARIOS</Link>
              <Link href="#contacto" className="font-copperplate text-legacy-gray text-[15px] hover:opacity-80 transition">CONTACTO</Link>
              
              {/* Language Flags */}
              <div className="flex items-center space-x-2 border-l border-gray-300 pl-4">
                <button className="hover:opacity-80 transition" title="Español">
                  <Image src="https://flagcdn.com/w20/es.png" alt="ES" width={20} height={15} />
                </button>
                <button className="hover:opacity-80 transition opacity-50" title="English">
                  <Image src="https://flagcdn.com/w20/us.png" alt="EN" width={20} height={15} />
                </button>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative w-full h-[600px] flex items-center">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/hero.jpg" 
            alt="Jerusalem Plaza" 
            fill 
            className="object-cover" 
            priority
          />
          {/* Subtle overlay to ensure text readability if needed, though original had an asymmetric layout */}
          <div className="absolute inset-0 bg-white/40 md:w-1/2"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="md:w-1/2 bg-white/90 p-8 shadow-lg border-t-4 border-legacy-blue">
            <h3 className="font-copperplate text-legacy-blue text-sm tracking-widest font-bold mb-2">TU SUEÑO ES POSIBLE</h3>
            <h2 className="font-copperplate text-legacy-blue text-2xl md:text-3xl font-bold mb-6 leading-snug">
              ¿Querés invertir en los mejores proyectos inmobiliarios de Israel?
            </h2>
            <p className="text-legacy-gray text-base leading-relaxed text-justify">
              En MiCassa vamos a asesorarte desde el primer momento a encontrar tu inversión ideal en Israel. Trabajamos con empresas constructoras de renombre internacional, solidez y extensa trayectoria. No te pierdas la oportunidad única y el mérito de tener tu propiedad en la Tierra prometida a Nuestros Padres con una santidad única y lugares llenos de mística e historia.
            </p>
          </div>
        </div>
      </section>

      {/* 3. About/Intro Sections */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <h2 className="font-copperplate text-legacy-blue text-3xl font-bold mb-4">
                Cumplí tu sueño y un precepto único para toda la vida
              </h2>
              <div className="w-16 h-1 bg-legacy-blue mb-8"></div>
              <p className="text-legacy-gray text-lg mb-6 leading-relaxed">
                Hoy, es posible cumplir uno de los preceptos más importantes de vivir y comprar una propiedad en las mejores zonas de Israel junto a oportunidades de negocio y rentabilidad únicas. En nuestro equipo profesional vas a encontrar:
              </p>
              <ul className="space-y-4 text-legacy-gray font-bold">
                <li className="flex items-center">
                  <span className="text-legacy-blue mr-3 text-xl">✓</span> Atención personalizada
                </li>
                <li className="flex items-center">
                  <span className="text-legacy-blue mr-3 text-xl">✓</span> Asesoramiento crediticio y jurídico
                </li>
                <li className="flex items-center">
                  <span className="text-legacy-blue mr-3 text-xl">✓</span> Servicio post-entrega
                </li>
              </ul>
            </div>
            <div className="order-1 md:order-2 relative h-[450px] w-full shadow-xl">
              <Image 
                src="https://images.unsplash.com/photo-1541888086225-ee5b99ec16c8?auto=format&fit=crop&q=80&w=800" 
                alt="Construction Cranes" 
                fill 
                className="object-cover" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* "ESTAMOS AQUÍ PARA AYUDARTE..." Section */}
      <section className="py-20 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="font-copperplate text-legacy-gray text-lg tracking-widest mb-2">MICASSA</h3>
          <h2 className="font-copperplate text-legacy-blue text-4xl font-bold mb-12">ESTAMOS AQUÍ PARA AYUDARTE...</h2>
          
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            <div className="bg-white px-6 py-4 shadow text-legacy-blue font-bold font-copperplate border-b-2 border-transparent hover:border-legacy-blue transition cursor-default">INVESTIGACIÓN DE MERCADO</div>
            <div className="bg-white px-6 py-4 shadow text-legacy-blue font-bold font-copperplate border-b-2 border-transparent hover:border-legacy-blue transition cursor-default">ANÁLISIS Y ASESORAMIENTO DE CADA PROYECTO</div>
          </div>
          
          <button className="bg-white border-2 border-legacy-blue text-legacy-blue font-copperplate font-bold py-4 px-10 hover:bg-legacy-blue hover:text-white transition duration-300">
            COMENCEMOS
          </button>
        </div>
      </section>

      {/* Servicios Section */}
      <section id="servicios" className="py-24 bg-legacy-blue text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-copperplate text-3xl font-bold mb-6">Invertí en el mejor lugar del mundo</h2>
            <div className="w-16 h-1 bg-white mx-auto mb-6"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl mb-6">🤝</div>
              <h4 className="font-copperplate font-bold mb-4 text-lg">ATENCIÓN PERSONALIZADA</h4>
              <p className="text-sm font-lato text-gray-300">Somos un equipo interdisciplinario en contacto con las principales empresas constructoras locales e internacionales.</p>
            </div>
            <div>
              <div className="text-4xl mb-6">⚖️</div>
              <h4 className="font-copperplate font-bold mb-4 text-lg">ASESORAMIENTO LEGAL Y FINANCIERO</h4>
              <p className="text-sm font-lato text-gray-300">Gestionamos ante las entidades bancarias el otorgamiento de créditos hipotecarios (Mashkanta).</p>
            </div>
            <div>
              <div className="text-4xl mb-6">📈</div>
              <h4 className="font-copperplate font-bold mb-4 text-lg">RENTABILIDAD</h4>
              <p className="text-sm font-lato text-gray-300">Contamos con una gran cartera de proyectos que te aseguran una renta anual.</p>
            </div>
            <div>
              <div className="text-4xl mb-6">🔑</div>
              <h4 className="font-copperplate font-bold mb-4 text-lg">ALQUILER</h4>
              <p className="text-sm font-lato text-gray-300">Contamos con asesoramiento legal y jurídico para que puedas alquilar tu propiedad.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-gray-200">
            <div className="py-4">
              <div className="font-copperplate text-5xl font-bold text-legacy-blue mb-2">+50</div>
              <div className="text-legacy-gray font-bold uppercase tracking-wider text-sm">Proyectos finalizados</div>
            </div>
            <div className="py-4">
              <div className="font-copperplate text-5xl font-bold text-legacy-blue mb-2">+2000</div>
              <div className="text-legacy-gray font-bold uppercase tracking-wider text-sm">Clientes satisfechos</div>
            </div>
            <div className="py-4">
              <div className="font-copperplate text-5xl font-bold text-legacy-blue mb-2">12</div>
              <div className="text-legacy-gray font-bold uppercase tracking-wider text-sm">Años de experiencia</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-[#f9f9f9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-copperplate text-legacy-blue text-3xl font-bold mb-16 text-center">Testimonios</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Meir Y.", text: "Excelente atención de parte de Ovadia, siempre dispuesto a resolver cada inquietud y acompañarnos en todo el proceso de compra." },
              { name: "Brian S.", text: "Gracias a MiCassa pudimos concretar nuestra inversión en Israel desde el exterior con total confianza y seguridad." },
              { name: "Alberto D.", text: "El servicio post-venta y la gestión del alquiler de nuestra propiedad ha sido impecable. Totalmente recomendados." }
            ].map((testimonial, i) => (
              <div key={i} className="bg-white p-8 pt-12 relative shadow-md border-t border-gray-100">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-legacy-blue text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-lg font-serif">"</div>
                <p className="text-legacy-gray italic mb-6 text-center leading-relaxed font-lato text-[15px]">{testimonial.text}</p>
                <div className="w-12 h-0.5 bg-legacy-blue mx-auto mb-4"></div>
                <h4 className="text-center font-copperplate text-legacy-blue font-bold">{testimonial.name}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Properties/Projects Sections */}
      <section id="proyectos" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-copperplate text-legacy-blue text-3xl font-bold mb-16 text-center">Proyectos únicos</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[
              { title: "Legacy – Jerusalem", img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800" },
              { title: "Savyon View – Jerusalem", img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800" },
              { title: "Jerusalem Spirit – Jerusalem", img: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=800" }
            ].map((proj, i) => (
              <div key={i} className="group cursor-pointer flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="relative h-64 w-full bg-gray-200">
                  <Image src={proj.img} alt={proj.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="bg-legacy-blue text-white p-6 text-center flex-grow flex flex-col justify-center">
                  <h3 className="font-copperplate font-bold text-xl mb-3">{proj.title}</h3>
                  <div className="w-12 h-0.5 bg-white mx-auto mb-3 opacity-50"></div>
                  <p className="text-sm text-gray-200 font-lato">Haz clic para ver los detalles completos de este proyecto.</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <Link href="/propiedades" className="inline-block bg-legacy-blue text-white font-copperplate font-bold py-3 px-8 hover:bg-blue-900 transition shadow-md">
              VER TODOS LOS PROYECTOS
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Footer Structure */}
      <footer id="contacto" className="bg-legacy-footer text-legacy-gray py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="font-copperplate text-white text-2xl tracking-widest mb-2">OVADIA TACHE</h2>
          <p className="font-lato text-lg">
            <a href="tel:+972587464528" className="hover:text-white transition">+972 587464528</a>
          </p>
          <p className="font-lato text-lg">
            <a href="mailto:INFO@MICASSAIL.COM" className="hover:text-white transition">INFO@MICASSAIL.COM</a>
          </p>
          
          <div className="flex justify-center space-x-6 pt-4">
            <a href="#" className="w-10 h-10 border border-legacy-gray rounded-full flex items-center justify-center hover:text-white hover:border-white transition">
              <span className="sr-only">Facebook</span>
              <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path></svg>
            </a>
            <a href="#" className="w-10 h-10 border border-legacy-gray rounded-full flex items-center justify-center hover:text-white hover:border-white transition">
              <span className="sr-only">Instagram</span>
              <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path></svg>
            </a>
          </div>
          
          <div className="pt-8 border-t border-gray-700 text-sm mt-8">
            © {new Date().getFullYear()} MiCassail | Diseño y desarrollo BÚA Marketing Digital (Replicado en Next.js)
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a 
        href="https://wa.me/972587464528" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:bg-[#1ebe5d] hover:scale-110 transition-transform flex items-center justify-center"
        aria-label="Contactar por WhatsApp"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
          <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
        </svg>
      </a>
    </div>
  );
}
