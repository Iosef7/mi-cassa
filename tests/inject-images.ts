async function injectImages() {
  const BASE_URL = 'http://localhost:3000/api/properties';
  
  try {
    const res = await fetch(BASE_URL);
    const properties = await res.json();
    
    if (properties.length === 0) return;

    const firstProp = properties[0];
    
    // Mantener los campos de presentaciones/planos/videos existentes
    let parsedPresentations;
    try {
      parsedPresentations = JSON.parse(firstProp.presentations);
    } catch {
      parsedPresentations = {};
    }

    const updatePayload = {
      images: [
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=2000', // Main
        'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=1000', // Interior 1
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1000', // Interior 2
        'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=1000'  // Extra
      ],
      // We must pass the raw values or the API will overwrite them if we don't.
      // Wait, the API only overwrites what is provided. If we only provide `images`, the others stay intact!
    };

    const updateRes = await fetch(`${BASE_URL}/${firstProp.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatePayload)
    });

    if (updateRes.ok) {
      console.log('✅ Imágenes adicionales inyectadas a la propiedad:', firstProp.title);
    }
  } catch (e) {
    console.error('Error:', e);
  }
}

injectImages();
