async function injectTestData() {
  const BASE_URL = 'http://localhost:3000/api/properties';
  
  try {
    const res = await fetch(BASE_URL);
    const properties = await res.json();
    
    if (properties.length === 0) {
      console.log('No hay propiedades para actualizar.');
      return;
    }

    const firstProp = properties[0];
    const propertyId = firstProp.id;
    console.log(`Actualizando la propiedad: ${firstProp.title} (${propertyId})`);

    const updatePayload = {
      presentations: [
        'https://www.orimi.com/pdf-test.pdf' // Brochure de prueba
      ],
      plans: [
        'https://images.unsplash.com/photo-1536895058696-a69b1c7ba34e?q=80&w=1000&auto=format&fit=crop', // Plano 1
        'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=1000&auto=format&fit=crop' // Plano 2
      ],
      videos: [
        'https://www.youtube.com/watch?v=y9j-BL5ocW8', // Recorrido 1
        'https://my.matterport.com/show/?m=JRW1uF1nB5y' // Recorrido 3D
      ]
    };

    const updateRes = await fetch(`${BASE_URL}/${propertyId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatePayload)
    });

    if (updateRes.ok) {
      console.log('✅ Archivos de prueba inyectados correctamente en la primera propiedad.');
    } else {
      console.error('❌ Error al actualizar la propiedad:', await updateRes.text());
    }
  } catch (e) {
    console.error('Error:', e);
  }
}

injectTestData();
