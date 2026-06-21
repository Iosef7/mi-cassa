import { Phone, Calendar, Clock, CheckCircle, AlertTriangle, FileText, PlayCircle } from 'lucide-react';

interface CallCardProps {
  call: any;
}

export default function CallCard({ call }: CallCardProps) {
  let keyPoints = [];
  let commitments = [];
  
  try {
    if (call.keyPoints) keyPoints = JSON.parse(call.keyPoints);
    if (call.commitments) commitments = JSON.parse(call.commitments);
  } catch (e) {}

  const getSentimentColor = (sentiment?: string) => {
    if (!sentiment) return 'bg-slate-100 text-slate-700 border-slate-200';
    const s = sentiment.toLowerCase();
    if (s.includes('positivo')) return 'bg-green-50 text-green-700 border-green-200';
    if (s.includes('negativo')) return 'bg-red-50 text-red-700 border-red-200';
    return 'bg-blue-50 text-blue-700 border-blue-200'; // Neutro
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden mb-6">
      {/* Card Header */}
      <div className="border-b border-slate-100 bg-slate-50 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-full text-blue-600">
            <Phone size={18} />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">{call.mainTopic || "Llamada Registrada"}</h3>
            <p className="text-sm text-slate-500 flex items-center gap-2">
              <Calendar size={14} />
              {new Date(call.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getSentimentColor(call.sentiment)}`}>
            Sentimiento: {call.sentiment || 'Desconocido'}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6">
        {/* Resumen Ejecutivo */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
            <FileText size={16} className="text-slate-400" />
            Resumen Ejecutivo
          </h4>
          <p className="text-slate-700 text-sm leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-100">
            {call.summary || "No hay resumen disponible."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Puntos Clave */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
              <CheckCircle size={16} className="text-slate-400" />
              Puntos Clave Discutidos
            </h4>
            {keyPoints.length > 0 ? (
              <ul className="space-y-2">
                {keyPoints.map((kp: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>{kp}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500 italic">No se extrajeron puntos clave.</p>
            )}
          </div>

          {/* Tareas y Compromisos */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
              <AlertTriangle size={16} className="text-slate-400" />
              Compromisos / Siguientes Pasos
            </h4>
            {commitments.length > 0 ? (
              <ul className="space-y-2">
                {commitments.map((com: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-700 bg-amber-50 p-2 rounded border border-amber-100">
                    <Clock size={16} className="text-amber-500 shrink-0 mt-0.5" />
                    <span>{com}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500 italic">No hay acciones pendientes registradas.</p>
            )}
          </div>
        </div>

        {/* Grabación de Audio */}
        {call.audioUrl && (
          <div className="mt-8 pt-6 border-t border-slate-100">
             <h4 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <PlayCircle size={16} className="text-slate-400" />
              Grabación Original
            </h4>
            <audio controls className="w-full max-w-md h-10 outline-none">
              <source src={call.audioUrl} type="audio/mpeg" />
              Tu navegador no soporta el elemento de audio.
            </audio>
          </div>
        )}

        {/* Transcripción (Oculta tras un botón o scroll) */}
        {call.transcription && (
          <div className="mt-6">
            <details className="group">
              <summary className="text-sm font-medium text-blue-600 cursor-pointer hover:underline outline-none select-none">
                Ver Transcripción Completa
              </summary>
              <div className="mt-3 p-4 bg-slate-50 rounded-lg border border-slate-200 max-h-60 overflow-y-auto text-sm text-slate-700 whitespace-pre-wrap">
                {call.transcription}
              </div>
            </details>
          </div>
        )}
      </div>
    </div>
  );
}
