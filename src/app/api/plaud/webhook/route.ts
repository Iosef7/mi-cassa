import { NextResponse } from 'next/server';
import { processPlaudRecording } from '@/lib/plaud-processor';

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const { title, transcription, summary, audioUrl, audio_url, text } = payload;

    const finalTranscription = transcription || text || summary || '';
    const finalAudioUrl = audioUrl || audio_url || null;

    if (!finalTranscription && !finalAudioUrl) {
      return NextResponse.json({ error: 'Falta transcripción o URL de audio' }, { status: 400 });
    }

    let audioBuffer: Buffer | undefined = undefined;
    let mimeType: string | undefined = undefined;

    // If audioUrl is provided, attempt to fetch the audio file buffer
    if (finalAudioUrl) {
      try {
        const fetchRes = await fetch(finalAudioUrl);
        if (fetchRes.ok) {
          const ab = await fetchRes.arrayBuffer();
          audioBuffer = Buffer.from(ab);
          mimeType = fetchRes.headers.get('content-type') || 'audio/mp3';
        }
      } catch (err) {
        console.warn('No se pudo descargar el audio desde audioUrl:', err);
      }
    }

    const result = await processPlaudRecording({
      audioBuffer,
      mimeType,
      transcriptionText: finalTranscription,
      title: title || 'Llamada Plaud Pro Webhook',
      audioUrl: finalAudioUrl,
      source: 'WEBHOOK',
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error Webhook Plaud:', error);
    return NextResponse.json(
      { error: error?.message || 'Error procesando el Webhook de Plaud' },
      { status: 500 }
    );
  }
}
