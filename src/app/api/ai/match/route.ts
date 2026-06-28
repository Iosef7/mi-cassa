import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { prisma } from '@/lib/prisma';

// Initialize the Google Gen AI SDK
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    // 1. Fetch all available properties/projects from the database
    // In a production app with thousands of properties, we would use a vector database (pgvector).
    // For this prototype, we'll fetch all available properties and let Gemini filter them.
    const properties = await prisma.property.findMany({
      where: {
        status: 'DISPONIBLE'
      }
    });

    if (properties.length === 0) {
      return NextResponse.json({ 
        message: "No hay propiedades disponibles en el inventario para analizar.", 
        matches: [] 
      });
    }

    // 2. Prepare the prompt for Gemini
    const systemInstruction = `
      Eres el asistente experto en bienes raíces de "Mi Cassa". 
      Tu trabajo es analizar la petición de un cliente o agente y encontrar las 3 mejores propiedades o proyectos de nuestro catálogo que coincidan con sus necesidades.
      
      Catalogo de Propiedades (Formato JSON):
      ${JSON.stringify(properties, null, 2)}
      
      Instrucciones:
      1. Analiza el catálogo provisto arriba.
      2. Selecciona hasta 3 propiedades que mejor se ajusten a la consulta del usuario.
      3. Extrae la razón (reasoning) de por qué elegiste esa propiedad para el cliente.
      4. Devuelve el resultado en formato JSON estricto con la siguiente estructura:
      {
        "matches": [
          {
            "propertyId": "id-de-la-propiedad",
            "reasoning": "Breve justificación de por qué es ideal basado en la consulta."
          }
        ],
        "generalAdvice": "Algún consejo adicional o comentario amigable."
      }
    `;

    // 3. Call Gemini API
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        { role: 'user', parts: [{ text: query }] }
      ],
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
      }
    });

    const textOutput = response.text || "{}";
    const aiResult = JSON.parse(textOutput);

    // 4. Hydrate the property data
    if (aiResult.matches && aiResult.matches.length > 0) {
      const hydratedMatches = aiResult.matches.map((match: any) => {
        const fullProperty = properties.find(p => p.id === match.propertyId);
        return {
          ...match,
          property: fullProperty
        };
      }).filter((m: any) => m.property !== undefined);
      
      aiResult.matches = hydratedMatches;
    }

    return NextResponse.json(aiResult);

  } catch (error) {
    console.error('Error in AI Match API:', error);
    return NextResponse.json({ error: 'Failed to process AI match' }, { status: 500 });
  }
}
