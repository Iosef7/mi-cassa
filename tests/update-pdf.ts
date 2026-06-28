async function updatePropertyWithPDF() {
  const BASE_URL = 'http://localhost:3000/api/properties';
  
  try {
    const res = await fetch(BASE_URL);
    const properties = await res.json();
    
    if (properties.length === 0) return;

    const firstProp = properties[0];

    // Preserve existing data
    let parsedPresentations = [];
    let parsedPlans = [];
    let parsedVideos = [];
    try { 
      const p = JSON.parse(firstProp.presentations || "[]");
      if (Array.isArray(p)) {
        parsedPresentations = p;
      } else if (p && typeof p === 'object') {
        parsedPresentations = p.docs || [];
        parsedPlans = p.plans || [];
        parsedVideos = p.videos || [];
      }
    } catch (e) {}

    // Add a sample PDF presentation if none exists
    const samplePDF = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
    
    if (parsedPresentations.length === 0) {
      parsedPresentations.push(samplePDF);
    } else {
      parsedPresentations[0] = samplePDF;
    }

    const updatePayload = {
      presentations: parsedPresentations,
      plans: parsedPlans,
      videos: parsedVideos
    };

    const updateRes = await fetch(`${BASE_URL}/${firstProp.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatePayload)
    });

    if (updateRes.ok) {
      console.log('✅ PDF de muestra inyectado correctamente.');
    }
  } catch (e) {
    console.error('Error:', e);
  }
}

updatePropertyWithPDF();
