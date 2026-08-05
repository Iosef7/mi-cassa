'use client';

import { useState } from 'react';
import { Share2, QrCode, ChevronDown, ChevronUp, Settings2 } from 'lucide-react';
import { toast } from 'sonner';
import PropertyAiButton from './PropertyAiButton';

interface PropertyActionButtonsProps {
  property: {
    id: string;
    title?: string;
    aiProcessed?: boolean;
    images?: string;
  };
  setShowShareModal: (show: boolean) => void;
}

export default function PropertyActionButtons({ property, setShowShareModal }: PropertyActionButtonsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  let imageCount = 10;
  if (property.images) {
    try {
      const parsed = JSON.parse(property.images);
      imageCount = Array.isArray(parsed) ? parsed.length : 1;
    } catch(e) {
      imageCount = 1;
    }
  }

  return (
    <div className="flex flex-col items-end gap-2 shrink-0 relative">
      {/* Header / Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border border-border/50"
      >
        <Settings2 className="w-4 h-4" /> 
        Acciones rápidas
        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="absolute top-full mt-2 right-0 bg-background border border-border shadow-lg rounded-xl p-3 flex flex-col gap-3 min-w-[220px] z-50 animate-in fade-in slide-in-from-top-2">
          
          <div className="pb-2 border-b border-border/50">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">Inteligencia Artificial</p>
            <PropertyAiButton 
              propertyId={property.id}
              propertyTitle={property.title}
              isProcessed={property.aiProcessed} 
              imageCount={imageCount} 
            />
          </div>

          <div className="pt-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">Compartir</p>
            <button 
                onClick={() => {
                   navigator.clipboard.writeText(`${window.location.origin}/p/${property.id}`);
                   toast.success("Enlace público copiado al portapapeles");
                   setIsExpanded(false);
                }}
                className="flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded-lg font-bold transition-colors w-full justify-center mb-2 text-sm"
             >
                <Share2 className="w-4 h-4" /> Copiar Link
             </button>
             
             <button 
                onClick={() => {
                  setShowShareModal(true);
                  setIsExpanded(false);
                }}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-full justify-center py-1"
             >
                <QrCode className="w-4 h-4" /> Mostrar Código QR
             </button>
          </div>
        </div>
      )}
    </div>
  );
}
