async function runTests() {
  const BASE_URL = 'http://localhost:3000/api/properties';
  console.log('--- INICIANDO PRUEBAS DE API DE PROPIEDADES ---');

  try {
    // 1. Crear Propiedad
    console.log('\n1. Creando propiedad de prueba con planos y videos...');
    const createPayload = {
      title: 'Casa de Prueba Automatizada',
      description: 'Esta es una casa creada por el script de prueba',
      price: '5000000',
      type: 'CASA',
      location: 'Ciudad de Prueba',
      presentations: ['https://ejemplo.com/brochure.pdf'],
      plans: ['https://ejemplo.com/plano.pdf'],
      videos: ['https://youtube.com/watch?v=123']
    };

    const createRes = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(createPayload)
    });

    if (!createRes.ok) throw new Error(`POST falló: ${createRes.status}`);
    const createdProperty = await createRes.json();
    const propertyId = createdProperty.id;
    console.log('✅ Propiedad creada exitosamente. ID:', propertyId);

    // 2. Verificar la Base de Datos Directamente
    console.log('\n2. Verificando empaquetado de JSON...');
    // The raw `presentations` field from DB should have all 3 keys
    const rawPresentations = JSON.parse(createdProperty.presentations);
    if (!rawPresentations.plans || rawPresentations.plans[0] !== 'https://ejemplo.com/plano.pdf') {
       throw new Error('❌ Los planos no se guardaron correctamente en el JSON.');
    }
    if (!rawPresentations.videos || rawPresentations.videos[0] !== 'https://youtube.com/watch?v=123') {
       throw new Error('❌ Los videos no se guardaron correctamente en el JSON.');
    }
    console.log('✅ Los planos y videos se están guardando correctamente dentro de presentations.');

    // 3. Obtener la Propiedad (GET)
    console.log('\n3. Obteniendo la propiedad de la base de datos...');
    const getRes = await fetch(`${BASE_URL}/${propertyId}`);
    if (!getRes.ok) throw new Error(`GET falló: ${getRes.status}`);
    const fetchedProperty = await getRes.json();
    console.log('✅ Propiedad recuperada con éxito.');

    // 4. Modificar Propiedad (PUT)
    console.log('\n4. Modificando propiedad (añadiendo otro video)...');
    const updatePayload = {
      videos: ['https://youtube.com/watch?v=123', 'https://vimeo.com/456']
    };
    const updateRes = await fetch(`${BASE_URL}/${propertyId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatePayload)
    });
    if (!updateRes.ok) throw new Error(`PUT falló: ${updateRes.status}`);
    const updatedProperty = await updateRes.json();
    const updatedPresentations = JSON.parse(updatedProperty.presentations);
    if (updatedPresentations.videos.length !== 2) {
      throw new Error('❌ La modificación no actualizó los videos correctamente.');
    }
    console.log('✅ Propiedad actualizada correctamente.');

    // 5. Eliminar Propiedad
    console.log('\n5. Limpiando y eliminando propiedad de prueba...');
    const deleteRes = await fetch(`${BASE_URL}/${propertyId}`, {
      method: 'DELETE'
    });
    if (!deleteRes.ok) throw new Error(`DELETE falló: ${deleteRes.status}`);
    console.log('✅ Propiedad eliminada correctamente.');

    console.log('\n🎉 ¡TODAS LAS PRUEBAS FUERON EXITOSAS! El sistema está estable.');

  } catch (error) {
    console.error('\n❌ ERROR DURANTE LAS PRUEBAS:', error);
  }
}

runTests();
