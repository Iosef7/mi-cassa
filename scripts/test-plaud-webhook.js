async function testWebhook() {
  const payload = {
    title: "Llamada entrante con Constructora Alfa",
    audioUrl: "https://plaud-audio-dummy-url.com/rec-123.mp3",
    summary: "El cliente está muy interesado en el terreno de la Av. Las Torres. Quiere saber si hay permiso para 5 pisos.",
    transcription: "Agente: Hola, buenas tardes, le hablo de Mi Cassa. Cliente: Hola, soy de Constructora Alfa. Vi el terreno en Avenida Principal. ¿Se pueden construir 5 pisos ahí? Agente: Sí, tiene uso de suelo mixto. ¿Le interesa? Cliente: Sí, mándame los planos topográficos por favor y también el contrato de promesa de compraventa. Mi presupuesto está bien, unos 12 millones. Agente: Excelente, se los mando hoy mismo. Gracias."
  };

  try {
    console.log("Enviando webhook de prueba...");
    const res = await fetch('http://localhost:3001/api/plaud/webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    console.log("Respuesta del servidor:", data);
  } catch (error) {
    console.error("Error enviando webhook:", error);
  }
}

testWebhook();
