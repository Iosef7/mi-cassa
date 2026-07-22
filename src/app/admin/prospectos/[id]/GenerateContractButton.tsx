"use client";

import { useState, useEffect, useRef } from "react";
import { FileSignature, X, Loader2, ChevronDown, Check, Mail, Upload, Save, Globe } from "lucide-react";
import Image from "next/image";
import { createContract, sendContractEmail, getContractTemplates, createContractTemplate } from "@/actions/contracts";
import { toast } from "sonner";
import { GoogleDrivePicker } from "@/components/GoogleDrivePicker";

export default function GenerateContractButton({ 
  leadId, 
  propertyId: initialPropertyId, 
  agentId,
  leadEmail,
  availableProperties = []
}: { 
  leadId: string, 
  propertyId: string | null, 
  agentId: string | null,
  leadEmail?: string | null,
  availableProperties?: { id: string, title: string, location: string, images?: string | null }[]
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [commission, setCommission] = useState("2");
  const [generatedLink, setGeneratedLink] = useState("");
  const [contractToken, setContractToken] = useState("");
  const [email, setEmail] = useState(leadEmail || "");
  const [sendingEmail, setSendingEmail] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState(initialPropertyId || "");
  const [isPropertyDropdownOpen, setIsPropertyDropdownOpen] = useState(false);

  // New states for multi-language and templates
  const [language, setLanguage] = useState("es");
  const [templateMode, setTemplateMode] = useState<"none" | "saved" | "custom_local" | "custom_drive">("none");
  const [templates, setTemplates] = useState<any[]>([]);
  const [selectedTemplateUrl, setSelectedTemplateUrl] = useState("");
  
  const [customPdfBase64, setCustomPdfBase64] = useState("");
  const [customPdfName, setCustomPdfName] = useState("");
  const [saveAsTemplate, setSaveAsTemplate] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState("");
  const [driveToken, setDriveToken] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      getContractTemplates().then((res) => {
        if (res.success && res.templates) {
          setTemplates(res.templates);
        }
      });
    }
  }, [isOpen]);

  const getFirstImage = (imagesStr?: string | null) => {
    if (!imagesStr) return null;
    let url = null;
    try {
      const parsed = JSON.parse(imagesStr);
      if (Array.isArray(parsed) && parsed.length > 0) url = parsed[0];
    } catch {
      url = imagesStr;
    }
    if (!url) return null;
    
    if (url.includes('drive.google.com')) {
      let fileId = null;
      if (url.includes('/file/d/')) fileId = url.match(/\/file\/d\/([^\/]+)/)?.[1];
      else if (url.includes('id=')) {
        try { fileId = new URL(url).searchParams.get('id'); } catch {}
      }
      if (fileId) return `/api/drive/image/${fileId}`;
    }
    return url;
  };

  const selectedProperty = availableProperties.find(p => p.id === selectedPropertyId);

  const handleLocalFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast.error("Por favor selecciona un archivo PDF");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("El archivo no debe pesar más de 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setCustomPdfBase64(reader.result as string);
      setCustomPdfName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleDriveFileSelect = async (url: string, thumbnail?: string, fileId?: string, name?: string) => {
    if (!fileId || !driveToken) {
      toast.error("No se pudo obtener el archivo de Google Drive");
      return;
    }
    
    try {
      toast.info("Descargando PDF de Google Drive...");
      const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
        headers: { Authorization: `Bearer ${driveToken}` }
      });
      
      if (!response.ok) throw new Error("Error al descargar");
      const blob = await response.blob();
      if (blob.type !== "application/pdf") {
        toast.error("Por favor selecciona un archivo PDF válido");
        return;
      }
      
      const reader = new FileReader();
      reader.onload = () => {
        setCustomPdfBase64(reader.result as string);
        setCustomPdfName(name || "drive_document.pdf");
        toast.success("PDF cargado con éxito");
      };
      reader.readAsDataURL(blob);
    } catch (error) {
      console.error(error);
      toast.error("Error al descargar el archivo de Drive. Asegúrate de tener permisos.");
    }
  };

  const handleGenerate = async () => {
    const finalPropertyId = selectedPropertyId;
    if (!finalPropertyId) return toast.error("El prospecto no tiene una propiedad asignada.");
    if (!agentId) return toast.error("El prospecto no tiene un agente asignado.");
    
    let templatePdfUrl = undefined;
    let base64ToUse = undefined;

    if (templateMode === "saved") {
      if (!selectedTemplateUrl) return toast.error("Selecciona una plantilla guardada.");
      templatePdfUrl = selectedTemplateUrl;
    } else if (templateMode === "custom_local" || templateMode === "custom_drive") {
      if (!customPdfBase64) return toast.error("Sube o selecciona un archivo PDF.");
      base64ToUse = customPdfBase64;

      if (saveAsTemplate && newTemplateName) {
        setLoading(true);
        const resTemplate = await createContractTemplate(newTemplateName, language, base64ToUse);
        if (!resTemplate.success) {
          setLoading(false);
          return toast.error("Error al guardar la plantilla: " + resTemplate.error);
        }
        templatePdfUrl = resTemplate.template?.pdfUrl;
        base64ToUse = undefined; // Ya se guardó y tenemos URL
      }
    }
    
    setLoading(true);
    const res = await createContract(
      leadId, 
      finalPropertyId, 
      agentId, 
      parseFloat(commission), 
      language, 
      templatePdfUrl, 
      base64ToUse
    );
    setLoading(false);

    if (res.success && res.contract) {
      const link = `${window.location.origin}/firma/${res.contract.token}`;
      setGeneratedLink(link);
      setContractToken(res.contract.token);
      toast.success("Contrato generado con éxito");
    } else {
      toast.error(res.error || "Error al generar contrato");
    }
  };

  const handleSendEmail = async () => {
    if (!email) return toast.error("Ingresa el correo electrónico");
    setSendingEmail(true);
    const res = await sendContractEmail(contractToken, email);
    setSendingEmail(false);
    if (res.success) toast.success("Correo enviado con éxito");
    else toast.error(res.error || "Error al enviar el correo");
  };

  const resetForm = () => {
    setIsOpen(false);
    setGeneratedLink("");
    setContractToken("");
    setTemplateMode("none");
    setCustomPdfBase64("");
    setCustomPdfName("");
    setSaveAsTemplate(false);
    setNewTemplateName("");
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
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-visible flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-2xl shrink-0">
              <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                <FileSignature className="text-blue-500" />
                Acuerdo de Corretaje
              </h3>
              <button onClick={resetForm} className="text-slate-400 hover:text-slate-700 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4 rounded-b-2xl bg-white overflow-y-auto">
              {!generatedLink ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Comisión (%)
                      </label>
                      <input 
                        type="number" step="0.1"
                        value={commission}
                        onChange={(e) => setCommission(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
                        <Globe size={14} className="text-slate-400" />
                        Idioma
                      </label>
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                      >
                        <option value="es">Español</option>
                        <option value="en">English</option>
                        <option value="he">עברית (Hebrew)</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Propiedad
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
                            return (
                              <button
                                key={p.id} type="button"
                                onClick={() => { setSelectedPropertyId(p.id); setIsPropertyDropdownOpen(false); }}
                                className={`w-full flex items-center justify-between p-3 border-b border-slate-50 hover:bg-slate-50 transition-colors ${isSelected ? 'bg-blue-50/50' : ''}`}
                              >
                                <div className="flex items-center gap-3 text-left">
                                  <div className="w-10 h-10 relative shrink-0">
                                    {getFirstImage(p.images) ? (
                                      <Image src={getFirstImage(p.images)!} alt="" fill unoptimized={true} className="rounded object-cover border border-slate-100" />
                                    ) : (
                                      <div className="w-10 h-10 bg-slate-100 rounded flex items-center justify-center text-slate-400 text-xs border border-slate-100">Sin img</div>
                                    )}
                                  </div>
                                  <div>
                                    <p className={`text-sm font-medium line-clamp-1 ${isSelected ? 'text-blue-700' : 'text-slate-800'}`}>{p.title}</p>
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

                  {/* Template Selection */}
                  <div className="pt-2 border-t border-slate-100">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Documento Base (Opcional)
                    </label>
                    <div className="space-y-2">
                      <select
                        value={templateMode}
                        onChange={(e) => setTemplateMode(e.target.value as any)}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 text-sm"
                      >
                        <option value="none">Sin Plantilla (Contrato Automático)</option>
                        <option value="saved">Plantilla Guardada</option>
                        <option value="custom_local">Subir PDF Personalizado (Local)</option>
                        <option value="custom_drive">Elegir PDF desde Google Drive</option>
                      </select>

                      {templateMode === "saved" && (
                        <div className="mt-2 animate-in fade-in slide-in-from-top-1">
                          <select
                            value={selectedTemplateUrl}
                            onChange={(e) => setSelectedTemplateUrl(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm bg-white"
                          >
                            <option value="">-- Elige una plantilla --</option>
                            {templates.filter(t => t.language === language).map(t => (
                              <option key={t.id} value={t.pdfUrl}>{t.name}</option>
                            ))}
                            {templates.filter(t => t.language !== language).length > 0 && (
                              <optgroup label={`Otros Idiomas`}>
                                {templates.filter(t => t.language !== language).map(t => (
                                  <option key={t.id} value={t.pdfUrl}>{t.name} ({t.language})</option>
                                ))}
                              </optgroup>
                            )}
                          </select>
                        </div>
                      )}

                      {templateMode === "custom_local" && (
                        <div className="mt-2 animate-in fade-in slide-in-from-top-1 p-4 border-2 border-dashed border-slate-200 rounded-xl text-center bg-slate-50">
                          <input 
                            type="file" accept="application/pdf" className="hidden" 
                            ref={fileInputRef} onChange={handleLocalFileChange} 
                          />
                          {!customPdfName ? (
                            <button onClick={() => fileInputRef.current?.click()} className="text-sm font-medium text-blue-600 hover:text-blue-700 flex flex-col items-center gap-2 mx-auto">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center"><Upload size={20} /></div>
                              Seleccionar Archivo PDF
                            </button>
                          ) : (
                            <div className="text-sm flex flex-col items-center gap-2">
                              <span className="font-medium text-slate-800 line-clamp-1">{customPdfName}</span>
                              <button onClick={() => { setCustomPdfBase64(""); setCustomPdfName(""); }} className="text-red-500 text-xs hover:underline">Quitar archivo</button>
                            </div>
                          )}
                        </div>
                      )}

                      {templateMode === "custom_drive" && (
                        <div className="mt-2 animate-in fade-in slide-in-from-top-1 p-4 border-2 border-dashed border-slate-200 rounded-xl text-center bg-slate-50">
                          {!customPdfName ? (
                            <GoogleDrivePicker 
                              onFileSelect={handleDriveFileSelect}
                              onToken={(token) => setDriveToken(token)}
                              mimeTypes="application/pdf"
                              className="text-sm font-medium text-blue-600 flex-col items-center gap-2 mx-auto hover:no-underline"
                            >
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center"><Upload size={20} /></div>
                              Elegir archivo PDF desde Drive
                            </GoogleDrivePicker>
                          ) : (
                            <div className="text-sm flex flex-col items-center gap-2">
                              <span className="font-medium text-slate-800 line-clamp-1">{customPdfName}</span>
                              <button onClick={() => { setCustomPdfBase64(""); setCustomPdfName(""); }} className="text-red-500 text-xs hover:underline">Quitar archivo</button>
                            </div>
                          )}
                        </div>
                      )}

                      {(templateMode === "custom_local" || templateMode === "custom_drive") && customPdfBase64 && (
                        <div className="mt-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
                          <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                            <input type="checkbox" checked={saveAsTemplate} onChange={(e) => setSaveAsTemplate(e.target.checked)} className="rounded text-blue-600" />
                            Guardar como plantilla para el futuro
                          </label>
                          {saveAsTemplate && (
                            <div className="mt-2">
                              <input 
                                type="text" placeholder="Nombre de la plantilla" 
                                value={newTemplateName} onChange={(e) => setNewTemplateName(e.target.value)}
                                className="w-full px-3 py-1.5 border border-slate-300 rounded text-sm"
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <button 
                    onClick={handleGenerate}
                    disabled={loading || !selectedPropertyId || ((templateMode === "custom_local" || templateMode === "custom_drive") && !customPdfBase64)}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-all mt-6 shadow-md shadow-blue-600/20"
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
                      type="text" readOnly value={generatedLink}
                      className="bg-transparent flex-1 outline-none text-sm text-slate-600 px-2"
                    />
                    <button 
                      onClick={copyLink}
                      className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
                    >
                      Copiar
                    </button>
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    <label className="block text-sm font-medium text-slate-700 mb-2 text-left">
                      Enviar por Correo
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="correo@ejemplo.com"
                        className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                      <button
                        onClick={handleSendEmail} disabled={sendingEmail || !email}
                        className="bg-slate-900 hover:bg-black disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                      >
                        {sendingEmail ? <Loader2 className="animate-spin" size={16} /> : <Mail size={16} />}
                        Enviar
                      </button>
                    </div>
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
