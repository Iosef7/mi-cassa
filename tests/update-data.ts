async function updatePropertyData() {
  const BASE_URL = 'http://localhost:3000/api/properties';
  
  try {
    const res = await fetch(BASE_URL);
    const properties = await res.json();
    
    if (properties.length === 0) return;

    const firstProp = properties[0];
    
    const longDescription = `Descubre este exclusivo e inigualable penthouse, diseñado para quienes buscan lujo, comodidad y una espectacular vista panorámica de 360 grados sobre la ciudad.

UBICACIÓN PRIVILEGIADA
Situado en la zona de mayor plusvalía de Santa Fe, este inmueble ofrece acceso inmediato a los centros corporativos más importantes, centros comerciales premium como Centro Santa Fe, y una variedad de restaurantes de alta cocina.

DISEÑO Y ACABADOS
El diseño arquitectónico de este penthouse destaca por sus espacios abiertos y techos de doble altura que permiten una iluminación natural excepcional. Cuenta con:
• Pisos de mármol italiano en áreas sociales.
• Duela de madera de ingeniería de importación en recámaras.
• Sistema inteligente de iluminación y sonido integrado (Smart Home).
• Cancelería termoacústica de piso a techo.

AMENIDADES DEL DESARROLLO
Vivir aquí significa disfrutar de amenidades de clase mundial sin salir de casa:
• Alberca semiolímpica techada y climatizada.
• Gimnasio de última generación y salón de yoga.
• Spa con sauna, vapor y cabinas de masaje.
• Salón de eventos, ludoteca y Business Center.
• Seguridad privada 24/7 con circuito cerrado y control de acceso biométrico.

Una oportunidad única en el mercado para elevar tu estilo de vida.`;

    const updatePayload = {
      description: longDescription,
      bedrooms: '4',
      bathrooms: '4.5',
      area: '350',
      price: '18500000',
      location: 'Av. Santa Fe 482, Lomas de Santa Fe, CDMX'
    };

    const updateRes = await fetch(`${BASE_URL}/${firstProp.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatePayload)
    });

    if (updateRes.ok) {
      console.log('✅ Información de propiedad actualizada.');
    }
  } catch (e) {
    console.error('Error:', e);
  }
}

updatePropertyData();
