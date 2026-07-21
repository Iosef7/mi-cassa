"use client";

import { useState } from "react";
import { FileSignature, X, Loader2, ChevronDown, Check } from "lucide-react";
import Image from "next/image";
import { createContract } from "@/actions/contracts";
import { toast } from "sonner";

export default function GenerateContractButton({ 
  leadId, 
  propertyId: initialPropertyId, 
  agentId,
  availableProperties = []
}: { 
  leadId: string, 
  propertyId: string | null, 
  agentId: string | null,
  availableProperties?: { id: string, title: string, location: string, images?: string | null }[]
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [commission, setCommission] = useState("2");
  const [generatedLink, setGeneratedLink] = useState("");
  const [selectedPropertyId, setSelectedPropertyId] = useState(initialPropertyId || "");
  const [isPropertyDropdownOpen, setIsPropertyDropdownOpen] = useState(false);

  const getFirstImage = (imagesStr?: string | null) => {
    if (!imagesStr) return null;
    let url = null;
    try {
      const parsed = JSON.parse(imagesStr);
      if (Array.isArray(parsed) && parsed.length > 0) url = parsed[0];
    } catch {
      url = imagesStr; // If it's just a raw URL
    }
    if (!url) return null;
    
    // Use the existing /api/drive/image API route which handles authentication
    if (url.includes('drive.google.com')) {
      let fileId = null;
      if (url.includes('/file/d/')) {
        fileId = url.match(/\/file\/d\/([^\/]+)/)?.[1];
      } else if (url.includes('id=')) {
        try {
          const u = new URL(url);
          fileId = u.searchParams.get('id');
        } catch {}
      }
      if (fileId) {
        return `/api/drive/image/${fileId}`;
      }
    }
    return url;
  };

  const selectedProperty = availableProperties.find(p => p.id === selectedPropertyId);

  const handleGenerate = async () => {
    const finalPropertyId = selectedPropertyId;
    if (!finalPropertyId) {
      toast.error("El prospecto no tiene una propiedad asignada.");
      return;
    }
    if (!agentId) {
      toast.error("El prospecto no tiene un agente asignado.");
      return;
    }
    
    setLoading(true);
    const res = await createContract(leadId, finalPropertyId, agentId, parseFloat(commission));
    setLoading(false);

    if (res.success && res.contract) {
      const link = `${window.location.origin}/firma/${res.contract.token}`;
      setGeneratedLink(link);
      toast.success("Contrato generado con éxito");
    } else {
      toast.error(res.error || "Error al generar contrato");
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    toast.success("¡Enlace copiado al portapapeles!");
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
      >
        <FileSignature size={18} />
        Generar Contrato
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-visible flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-2xl">
              <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                <FileSignature className="text-blue-500" />
                Acuerdo de Corretaje
              </h3>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-700 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4 rounded-b-2xl bg-white">
              {!generatedLink ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Comisión Acordada (%)
                    </label>
                    <input 
                      type="number"
                      step="0.1"
                      value={commission}
                      onChange={(e) => setCommission(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Selecciona la Propiedad
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setIsPropertyDropdownOpen(!isPropertyDropdownOpen)}
                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white flex items-center justify-between transition-all"
                      >
                        {selectedProperty ? (
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 relative shrink-0">
                              {getFirstImage(selectedProperty.images) ? (
                                <Image src={getFirstImage(selectedProperty.images)!} alt="" fill unoptimized={true} className="rounded object-cover" />
                              ) : (
                                <div className="w-8 h-8 bg-slate-100 rounded flex items-center justify-center text-slate-400 text-xs">Sin img</div>
                              )}
                            </div>
                            <div className="text-left">
                              <p className="text-sm font-medium text-slate-800 line-clamp-1">{selectedProperty.title}</p>
                              <p className="text-xs text-slate-500 line-clamp-1">{selectedProperty.location}</p>
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-500">-- Selecciona una propiedad --</span>
                        )}
                        <ChevronDown size={18} className="text-slate-400" />
                      </button>
                      
                      {isPropertyDropdownOpen && (
                        <div className="absolute top-full left-0 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto">
                          {availableProperties.map(p => {
                            const isSelected = p.id === selectedPropertyId;
                            const imgUrl = getFirstImage(p.images);
                            return (
                              <button
                                key={p.id}
                                type="button"
                                onClick={() => {
                                  setSelectedPropertyId(p.id);
                                  setIsPropertyDropdownOpen(false);
                                }}
                                className={`w-full flex items-center justify-between p-3 border-b border-slate-50 hover:bg-slate-50 transition-colors ${isSelected ? 'bg-blue-50/50' : ''}`}
                              >
                                <div className="flex items-center gap-3 text-left">
                                  <div className="w-10 h-10 relative shrink-0">
                                    {imgUrl ? (
                                      <Image src={imgUrl} alt="" fill unoptimized={true} className="rounded object-cover border border-slate-100" />
                                    ) : (
                                      <div className="w-10 h-10 bg-slate-100 rounded flex items-center justify-center text-slate-400 text-xs border border-slate-100">Sin img</div>
                                    )}
                                  </div>
                                  <div>
                                    <p className={`text-sm font-medium line-clamp-1 ${isSelected ? 'text-blue-700' : 'text-slate-800'}`}>{p.title}</p>
                                    <p className="text-xs text-slate-500 line-clamp-1">{p.location}</p>
                                  </div>
                                </div>
                                {isSelected && <Check size={18} className="text-blue-600 flex-shrink-0" />}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  <button 
                    onClick={handleGenerate}
                    disabled={loading || !selectedPropertyId}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-all mt-4"
                  >
                    {loading ? <Loader2 className="animate-spin" size={18} /> : <FileSignature size={18} />}
                    Crear y Obtener Enlace
                  </button>
                </>
              ) : (
                <div className="text-center space-y-4">
                  <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
                    <FileSignature size={24} />
                  </div>
                  <h4 className="font-bold text-slate-800">¡Contrato Listo!</h4>
                  <p className="text-sm text-slate-500">Envía este enlace al cliente por WhatsApp para que lo firme desde su móvil.</p>
                  
                  <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
                    <input 
                      type="text" 
                      readOnly 
                      value={generatedLink}
                      className="bg-transparent flex-1 outline-none text-sm text-slate-600 px-2"
                    />
                    <button 
                      onClick={copyLink}
                      className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
                    >
                      Copiar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
