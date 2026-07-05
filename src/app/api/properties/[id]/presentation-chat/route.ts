/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { message, history, model, propertyContext, attachments } = body;

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    // Choose model based on user selection or fallback to gemini-2.5-flash
    let geminiModel = 'gemini-2.5-flash';
    if (model === 'Gemini 3.1 Pro (High)' || model === 'Gemini 3.1 Pro' || model === 'Gemini 3.0 Ultra') {
        geminiModel = 'gemini-2.5-pro'; // Map "premium" selections to Pro
    }

    const systemPrompt = `Eres el Asistente de Diseño Premium de "Mi Cassa", una exclusiva agencia inmobiliaria de ultra lujo en Israel.
Tu objetivo principal es colaborar con el usuario para diseñar presentaciones espectaculares, dignas de la revista Architectural Digest, para presentar las propiedades.

Aquí tienes el contexto COMPLETO de la propiedad actual:
${JSON.stringify(propertyContext, null, 2)}

Instrucciones CRÍTICAS para tu comportamiento:
1. SÉ CONVERSACIONAL Y CONSULTIVO AL PRINCIPIO: No generes la presentación de inmediato a menos que el usuario te lo pida explícitamente o ya te haya dado suficientes detalles (ej. "crea la presentación basada en esto"). 
2. Si el usuario solo te manda referencias o te da un saludo/instrucción ambigua, PREGÚNTALE qué enfoque le gustaría darle, cuál es el público objetivo (familias, inversionistas, parejas, etc.), qué características específicas quiere resaltar, o si prefiere un tono más emocional o más financiero.
3. Solo cuando tengas claro el enfoque (o si el usuario te pide crearla de una vez), utiliza la herramienta "update_presentation" para generar el diseño.
4. Cuando uses la herramienta, crea una presentación extensa (mínimo 6 a 8 diapositivas) usando TODA la información disponible.
5. El copy (textos) debe ser sofisticado, evocativo, persuasivo y elegante. Usa un lenguaje de ultra lujo.
6. Distribuye las imágenes de la propiedad inteligentemente para que cada diapositiva tenga un impacto visual fuerte.

La presentación se renderiza usando componentes estructurados. Usa la herramienta "update_presentation" SOLO cuando vayas a generar o actualizar el diseño.
Tipos de diapositivas disponibles:
1. 'cover': Portada (title, subtitle, description, imageUrl)
2. 'property_hero': Hero interior (title, location, description, imageUrl)
3. 'features': Características (title, area, bedrooms, bathrooms, price, enganche25, enganche50)
4. 'distribution': Distribución (planImageUrl, areaText, features: [{name, value}])
5. 'gallery': Galería de fotos (title, description, images: [url, url...])
6. 'split_image_text': Texto e imagen (title, subtitle, description, imageUrl, highlights: [{value, unit, label}])
7. 'lifestyle': Estilo de vida (title, items: [{title, description}], image1, image2)
8. 'contact': Cierre/Contacto (title, description, phone, email, imageUrl)

Si haces preguntas al usuario, tu respuesta debe ser breve y amable. Si ya generaste la presentación, confirma los cambios de forma profesional y persuasiva.`;

    const formattedHistory = (history || []).map((h: any) => ({
      role: h.role === 'user' ? 'user' : 'model',
      parts: h.parts.map((p: any) => p.inlineData ? { inlineData: p.inlineData } : { text: p.text })
    }));

    const chat = ai.chats.create({
        model: geminiModel,
        history: formattedHistory,
        config: {
            systemInstruction: systemPrompt,
            tools: [{
                functionDeclarations: [{
                    name: 'update_presentation',
                    description: 'Actualiza o genera la estructura completa de la presentación.',
                    parameters: {
                        type: Type.OBJECT,
                        properties: {
                            slides: {
                                type: Type.ARRAY,
                                description: 'La lista de diapositivas de la presentación.',
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        type: { type: Type.STRING, description: 'Tipo de diapositiva (ej. cover, property_hero, features)' },
                                        title: { type: Type.STRING },
                                        subtitle: { type: Type.STRING },
                                        description: { type: Type.STRING },
                                        imageUrl: { type: Type.STRING },
                                        planImageUrl: { type: Type.STRING },
                                        image1: { type: Type.STRING },
                                        image2: { type: Type.STRING },
                                        location: { type: Type.STRING },
                                        area: { type: Type.NUMBER },
                                        bedrooms: { type: Type.NUMBER },
                                        bathrooms: { type: Type.NUMBER },
                                        price: { type: Type.STRING },
                                        enganche25: { type: Type.STRING },
                                        enganche50: { type: Type.STRING },
                                        areaText: { type: Type.STRING },
                                        phone: { type: Type.STRING },
                                        email: { type: Type.STRING },
                                        features: { 
                                            type: Type.ARRAY, 
                                            items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, value: { type: Type.STRING } } } 
                                        },
                                        highlights: { 
                                            type: Type.ARRAY, 
                                            items: { type: Type.OBJECT, properties: { value: { type: Type.STRING }, unit: { type: Type.STRING }, label: { type: Type.STRING } } } 
                                        },
                                        images: { type: Type.ARRAY, items: { type: Type.STRING } },
                                        items: { 
                                            type: Type.ARRAY, 
                                            items: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, description: { type: Type.STRING } } } 
                                        }
                                    },
                                    required: ['type']
                                }
                            }
                        },
                        required: ['slides']
                    }
                }]
            }]
        }
    });

    const msgParts: any[] = [{ text: message || "Analiza los archivos adjuntos." }];
    if (attachments && attachments.length > 0) {
        attachments.forEach((att: any) => {
            msgParts.push({ inlineData: { data: att.data, mimeType: att.mimeType } });
        });
    }

    const response = await chat.sendMessage({ message: msgParts });
    
    let newPresentationData = null;
    let aiMessage = response.text;

    // Verificar si usó la herramienta
    if (response.functionCalls && response.functionCalls.length > 0) {
        const call = response.functionCalls[0];
        if (call.name === 'update_presentation') {
            newPresentationData = call.args;
        }
    }

    return NextResponse.json({
      message: aiMessage,
      presentationData: newPresentationData
    });

  } catch (error: any) {
    console.error("Error in presentation chat API:", error);
    return NextResponse.json({ error: error.message || 'Failed to generate response' }, { status: 500 });
  }
}
