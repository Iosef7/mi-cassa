import { GoogleGenAI, GenerateContentConfig } from '@google/genai';
import { prisma } from '@/lib/prisma';

// Precios por 1 Millón de tokens (USD)
const MODEL_PRICES: Record<string, { prompt: number; completion: number }> = {
  'gemini-3.6-flash': { prompt: 0.075, completion: 0.30 },
  'gemini-3.6-pro': { prompt: 1.25, completion: 5.00 },
  'gemini-3.5-flash': { prompt: 0.075, completion: 0.30 },
  'gemini-3.5-pro': { prompt: 1.25, completion: 5.00 },
  'gemini-2.5-flash': { prompt: 0.075, completion: 0.30 },
  'gemini-2.5-pro': { prompt: 1.25, completion: 5.00 },
  'gemini-1.5-flash': { prompt: 0.075, completion: 0.30 },
  'gemini-1.5-pro': { prompt: 1.25, completion: 5.00 },
};

// Instancia única (usa GEMINI_API_KEY del env)
export const ai = new GoogleGenAI({});

export async function generateAiContent({
  operationType,
  contents,
  config
}: {
  operationType: string;
  contents: any;
  config?: GenerateContentConfig;
}) {
  // 1. Obtener el modelo configurado desde la base de datos
  const settingKey = `ai_model_${operationType}`;
  let selectedModel = 'gemini-2.5-flash'; // Default

  try {
    const setting = await prisma.siteSettings.findUnique({
      where: { key: settingKey }
    });
    if (setting && setting.value) {
      selectedModel = setting.value;
    }
  } catch (err) {
    console.error('Error fetching AI model preference:', err);
  }

  // 2. Ejecutar IA
  try {
    const response = await ai.models.generateContent({
      model: selectedModel,
      contents,
      config
    });

    // 3. Calcular tokens y costo
    // Estimar tokens si los metadatos no están disponibles
    let promptString = '';
    if (typeof contents === 'string') {
      promptString = contents;
    } else {
      promptString = JSON.stringify(contents);
    }
    
    if (config?.systemInstruction) {
      if (typeof config.systemInstruction === 'string') {
        promptString += config.systemInstruction;
      } else {
        promptString += JSON.stringify(config.systemInstruction);
      }
    }

    const aiResponseText = response.text || '{}';

    const promptTokens = response.usageMetadata?.promptTokenCount || Math.floor(promptString.length / 4);
    const completionTokens = response.usageMetadata?.candidatesTokenCount || Math.floor(aiResponseText.length / 4);

    const prices = MODEL_PRICES[selectedModel] || MODEL_PRICES['gemini-2.5-flash'];
    const costUSD = (promptTokens / 1000000) * prices.prompt + (completionTokens / 1000000) * prices.completion;

    // 4. Guardar registro de éxito
    await prisma.aiUsage.create({
      data: {
        provider: 'Google',
        model: selectedModel,
        operationType,
        promptTokens,
        completionTokens,
        costUSD,
        status: 'SUCCESS'
      }
    });

    return response;

  } catch (error: any) {
    // Registrar error
    try {
      await prisma.aiUsage.create({
        data: {
          provider: 'Google',
          model: selectedModel,
          operationType,
          status: 'ERROR',
          errorMessage: String(error)
        }
      });
    } catch (logError) {
      console.error('Error logging AI failure:', logError);
    }

    throw error;
  }
}
