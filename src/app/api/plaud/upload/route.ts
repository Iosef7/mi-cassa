import { NextResponse } from 'next/server';
import { processPlaudRecording } from '@/lib/plaud-processor';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const transcriptionText = formData.get('transcription') as string | null;
    const title = formData.get('title') as string | null;

    if (!file && !transcriptionText) {
      return NextResponse.json(
        { error: 'Por favor proporciona un archivo de audio o texto de transcripción.' },
        { status: 400 }
      );
    }

    let audioBuffer: Buffer | undefined = undefined;
    let mimeType: string | undefined = undefined;

    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      audioBuffer = Buffer.from(arrayBuffer);
      mimeType = file.type || 'audio/mp3';
    }

    const result = await processPlaudRecording({
      audioBuffer,
      mimeType,
      transcriptionText: transcriptionText || undefined,
      title: title || file?.name || 'Grabación Plaud Pro',
      source: 'UPLOAD',
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error al procesar la subida de Plaud:', error);
    return NextResponse.json(
      { error: error?.message || 'Error al procesar la grabación con Gemini IA' },
      { status: 500 }
    );
  }
}
