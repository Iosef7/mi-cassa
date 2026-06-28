async function updatePropertyWithPlans() {
  const BASE_URL = 'http://localhost:3000/api/properties';
  
  try {
    const res = await fetch(BASE_URL);
    const properties = await res.json();
    
    if (properties.length === 0) return;

    const firstProp = properties[0];

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

    parsedPlans = ["/plans/blueprint_1.png", "/plans/blueprint_2.png"];

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
      console.log('✅ Planos arquitectónicos agregados correctamente.');
    }
  } catch (e) {
    console.error('Error:', e);
  }
}

updatePropertyWithPlans();
