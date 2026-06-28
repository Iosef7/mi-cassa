const { PrismaClient } = require('./prisma/generated/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding different types of properties...');

  // 1. TERRENO
  const terreno = await prisma.property.create({
    data: {
      title: 'Terreno Comercial Premium en Avenida Principal',
      description: 'Excelente oportunidad de inversión. Terreno plano, listo para construcción, con uso de suelo comercial mixto. Ubicado en una zona de alta plusvalía y flujo vehicular constante.',
      price: 12500000,
      type: 'TERRENO',
      status: 'DISPONIBLE',
      location: 'Av. Las Torres 540, Zona Sur, Monterrey',
      area: 850,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1498673394965-85cb14905c89?auto=format&fit=crop&w=1200&q=80'
      ]),
      presentations: JSON.stringify([
        'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
      ]),
      nearbyPlaces: JSON.stringify([
        { name: 'Plaza Galerías', category: 'Centro Comercial', distance: '5 min' },
        { name: 'Gasolinera PEMEX', category: 'Servicios', distance: '1 min' }
      ]),
      dynamicFeatures: JSON.stringify({
        frontMeters: 25,
        depthMeters: 34,
        zoning: 'Comercial Mixto (C-3)'
      }),
      ownerName: 'Roberto Garza',
      ownerPhone: '8112345678',
      ownerNotes: 'Propietario motivado a vender, acepta ofertas a partir de 11.8M.',
      leads: {
        create: [
          {
            name: 'Constructora Alfa',
            phone: '8180001111',
            email: 'contacto@alfa.com',
            status: 'NEGOCIACION',
            budget: 12000000,
            notes: 'Interesados en construir una pequeña plaza comercial.',
            requiresMortgage: false,
            source: 'Llamada Directa'
          }
        ]
      }
    }
  });

  // 2. CASA
  const casa = await prisma.property.create({
    data: {
      title: 'Hermosa Residencia con Alberca en Privada',
      description: 'Espectacular casa contemporánea de 3 niveles. Cuenta con acabados de lujo, alberca privada, asador, cuarto de juegos y sistema de casa inteligente (domótica) en toda la propiedad.',
      price: 8900000,
      type: 'CASA',
      status: 'DISPONIBLE',
      location: 'Privada Los Encinos #12, Cumbres, Monterrey',
      bedrooms: 4,
      bathrooms: 4.5,
      area: 320,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80'
      ]),
      presentations: JSON.stringify([]),
      nearbyPlaces: JSON.stringify([
        { name: 'Colegio San Patricio', category: 'Educación', distance: '3 min en auto' },
        { name: 'Parque de los Encinos', category: 'Parques', distance: 'Caminando' }
      ]),
      dynamicFeatures: JSON.stringify({
        hasPool: true,
        parkingSpaces: 3,
        security: '24/7'
      }),
      ownerName: 'Familia Martínez',
      ownerPhone: '8123334444',
      leads: {
        create: [
          {
            name: 'Alejandro Ruiz',
            phone: '8134445555',
            status: 'VISITA_AGENDADA',
            budget: 9000000,
            notes: 'Familia con 3 hijos, buscan casa con alberca.',
            requiresMortgage: true,
            source: 'Facebook Ads'
          }
        ]
      }
    }
  });

  // 3. DEPARTAMENTO
  const departamento = await prisma.property.create({
    data: {
      title: 'Penthouse Panorámico en Valle Oriente',
      description: 'Increíble penthouse con vistas 360 a la sierra madre. Amenidades AAA: Gimnasio, alberca infinita, salón de eventos, coworking y seguridad biométrica. Incluye 3 cajones de estacionamiento techado.',
      price: 15500000,
      type: 'DEPARTAMENTO',
      status: 'DISPONIBLE',
      location: 'Torre KOI Piso 50, Valle Oriente, San Pedro Garza García',
      bedrooms: 3,
      bathrooms: 3.5,
      area: 250,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1502672260266-1c1de2d93688?auto=format&fit=crop&w=1200&q=80'
      ]),
      nearbyPlaces: JSON.stringify([
        { name: 'Plaza Fiesta San Agustín', category: 'Centro Comercial', distance: '2 min en auto' },
        { name: 'Hospital Zambrano Hellion', category: 'Salud', distance: '5 min en auto' }
      ]),
      dynamicFeatures: JSON.stringify({
        floorNumber: 50,
        elevators: 4,
        maintenanceFee: 8500
      }),
      ownerName: 'Inversiones SP',
      ownerEmail: 'ventas@inversionessp.com'
    }
  });

  // 4. PROYECTO (EDIFICIO / PREVENTA)
  const proyecto = await prisma.property.create({
    data: {
      title: 'Torre Lúmina - Departamentos en Preventa',
      description: 'Exclusivo desarrollo de usos mixtos. 120 departamentos, zona comercial en planta baja. Excelente esquema de pagos: 10% enganche, 20% diferido en 24 meses y 70% a la entrega.',
      price: 3200000, // Precio "Desde"
      minPrice: 3200000,
      maxPrice: 6500000,
      availableUnits: 120,
      deliveryDate: 'Primavera 2026',
      type: 'PROYECTO',
      status: 'DISPONIBLE',
      location: 'Centro de Monterrey',
      bedrooms: 2, // Default / Promedio
      bathrooms: 2,
      area: 85, // Promedio
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'
      ]),
      presentations: JSON.stringify([
        'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
      ]),
      nearbyPlaces: JSON.stringify([
        { name: 'Macroplaza', category: 'Turismo', distance: '10 min caminando' },
        { name: 'Estación de Metro', category: 'Transporte', distance: '1 min caminando' }
      ]),
      dynamicFeatures: JSON.stringify({
        totalLevels: 24,
        amenities: 'Sky Bar, Gym, Co-work'
      }),
      ownerName: 'Desarrolladora Urbano',
      leads: {
        create: [
          {
            name: 'María Fernández',
            phone: '8182223333',
            email: 'mariaf@gmail.com',
            status: 'CONTACTADO',
            budget: 3500000,
            notes: 'Busca 2 recámaras, piso alto.',
            source: 'Instagram Ads'
          },
          {
            name: 'Juan Pérez',
            phone: '8119998888',
            status: 'NUEVO',
            budget: 4000000,
            source: 'Landing Page'
          }
        ]
      }
    }
  });

  console.log('Seeded properties:');
  console.log('- Terreno ID:', terreno.id);
  console.log('- Casa ID:', casa.id);
  console.log('- Departamento ID:', departamento.id);
  console.log('- Proyecto ID:', proyecto.id);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
