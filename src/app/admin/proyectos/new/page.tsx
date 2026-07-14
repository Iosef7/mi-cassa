"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Save, X, Edit, Upload, Sparkles, FolderLock, CheckCircle2, FileText, GripVertical, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { GoogleDrivePicker } from "@/components/GoogleDrivePicker";
import { DriveImagePreview } from "@/components/DriveImagePreview";
import { showAlert } from "@/lib/alerts";

export default function NewProjectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "Nuevo Proyecto",
    location: "",
    architect: "",
    totalUnits: "",
    floors: "",
    description: "",
    status: "EVALUACION",
    dealType: "",
    ownershipShare: "",
    estimatedCost: "",
    expectedRevenue: "",
    notes: "",
    driveFolderId: "",
  });

  const [activeTab, setActiveTab] = useState<'resumen' | 'multimedia'>('resumen');
  
  // Media Arrays
  const [imagesList, setImagesList] = useState<string[]>([]);
  const [videosList, setVideosList] = useState<string[]>([]);
  const [presentationsList, setPresentationsList] = useState<string[]>([]);
  const [legalDocsList, setLegalDocsList] = useState<string[]>([]);
  const [postersList, setPostersList] = useState<string[]>([]);
  
  const [driveThumbnails, setDriveThumbnails] = useState<Record<string, string>>({});
  
  // AI State
  const [aiText, setAiText] = useState("");
  const [aiFiles, setAiFiles] = useState<File[]>([]);
  const [aiDriveUrls, setAiDriveUrls] = useState<string[]>([]);
  const [aiDriveToken, setAiDriveToken] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiStatusText, setAiStatusText] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (files: FileList | null, listSetter: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (!files || files.length === 0) return;
    try {
      const uploadedUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        const promise = new Promise<string>((resolve) => {
          reader.onload = (e) => resolve(e.target?.result as string);
        });
        reader.readAsDataURL(file);
        const dataUrl = await promise;
        uploadedUrls.push(dataUrl);
      }
      listSetter(prev => [...prev, ...uploadedUrls]);
    } catch (err) {
      console.error(err);
      showAlert('Error', 'Error procesando archivos locales.', 'error');
    }
  };

  const handleAiExtract = async () => {
    if (!aiText && aiFiles.length === 0 && aiDriveUrls.length === 0) return;
    setIsAiLoading(true);
    setAiStatusText("Analizando archivos con IA...");

    try {
      const form = new FormData();
      let textToSend = aiText;
      let tokenToUse = aiDriveToken || localStorage.getItem('google_drive_token');
      if (tokenToUse) form.append('driveToken', tokenToUse);
      aiDriveUrls.forEach(url => form.append('driveUrls', url));
      if (textToSend) form.append('text', textToSend);
      aiFiles.forEach(file => form.append('files', file));
      
      const res = await fetch('/api/projects/ai-extract', {
        method: 'POST',
        body: form
      });
      
      setAiStatusText("¡Extracción completada!");
      const result = await res.json();
      
      if (result.success && result.data) {
        const d = result.data;
        setFormData(prev => ({
          ...prev,
          name: d.name || prev.name,
          location: d.location || prev.location,
          architect: d.architect || prev.architect,
          totalUnits: d.totalUnits?.toString() || prev.totalUnits,
          floors: d.floors?.toString() || prev.floors,
          description: d.description || prev.description,
          status: d.status || prev.status,
          dealType: d.dealType || prev.dealType,
          ownershipShare: d.ownershipShare?.toString() || prev.ownershipShare,
          estimatedCost: d.estimatedCost?.toString() || prev.estimatedCost,
          expectedRevenue: d.expectedRevenue?.toString() || prev.expectedRevenue,
          notes: d.notes || prev.notes
        }));
        
        if (d.fileCategorization && result.filesData && result.fileNames) {
            const filesData = result.filesData; 
            const fileNames = result.fileNames;
            
            const extractUrls = (indices: number[]) => {
              if (!Array.isArray(indices)) return [];
              return indices.map(index => {
                 const name = fileNames[index];
                 return name ? (filesData[name] || (name.startsWith('http') ? name : null)) : null;
              }).filter(Boolean);
            };

            const imgUrls = extractUrls(d.fileCategorization.images);
            if (imgUrls.length > 0) setImagesList(prev => [...prev, ...imgUrls]);
            
            const presUrls = extractUrls(d.fileCategorization.presentations);
            if (presUrls.length > 0) setPresentationsList(prev => [...prev, ...presUrls]);
            
            const vidUrls = extractUrls(d.fileCategorization.videos);
            if (vidUrls.length > 0) setVideosList(prev => [...prev, ...vidUrls]);
            
            const postUrls = extractUrls(d.fileCategorization.posters);
            if (postUrls.length > 0) setPostersList(prev => [...prev, ...postUrls]);
            
            const docUrls = extractUrls(d.fileCategorization.legalDocs);
            if (docUrls.length > 0) setLegalDocsList(prev => [...prev, ...docUrls]);
        }
        
        showAlert('Éxito', '¡Información extraída y autocompletada con éxito!', 'success');
        setAiText('');
        setAiFiles([]);
        setAiDriveUrls([]);
      } else {
        showAlert('Error', result.error || "Error al procesar la IA.", 'error');
      }
    } catch (error) {
      console.error("AI Error:", error);
      showAlert('Error Crítico', "Error conectando con el asistente IA.", 'error');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const attachmentsJSON = JSON.stringify({
        images: imagesList,
        videos: videosList,
        presentations: presentationsList,
        legalDocs: legalDocsList,
        posters: postersList
      });

      const res = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          attachments: attachmentsJSON
        }),
      });

      if (!res.ok) throw new Error("Error al crear el proyecto");

      const data = await res.json();
      toast.success("Proyecto creado con éxito");
      router.push(`/admin/proyectos/${data.id}`);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Hubo un problema al crear el proyecto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-auto" id="main-scroll-container">
      {/* Header */}
      <div className="bg-card/80 backdrop-blur-md border-b border-border px-8 py-6 sticky top-0 z-20 shadow-sm animate-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/admin/proyectos" className="p-2 rounded-full hover:bg-muted text-muted-foreground transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-2">
                <input 
                  name="name"
                  value={formData.name} 
                  onChange={handleChange} 
                  className="bg-transparent border-none p-0 focus:ring-0 text-3xl font-black outline-none w-96" 
                  placeholder="Nombre del Proyecto"
                />
                <Edit className="w-4 h-4 text-muted-foreground ml-2 opacity-50" />
              </h1>
              <p className="text-muted-foreground text-sm font-medium mt-1">Configura los datos del desarrollo de inversión</p>
            </div>
          </div>
          
          <div className="flex gap-4 items-center">
            <div className="flex gap-2 bg-muted p-1 rounded-2xl shrink-0 overflow-x-auto">
              <button onClick={() => setActiveTab('resumen')} className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'resumen' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>Datos del Proyecto</button>
              <button onClick={() => setActiveTab('multimedia')} className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'multimedia' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>Multimedia y Documentos</button>
            </div>
            <button 
              onClick={handleSubmit} 
              disabled={loading}
              className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              {loading ? 'Guardando...' : 'Crear Proyecto'}
            </button>
          </div>
        </div>
      </div>

      <div className="p-8 w-full max-w-7xl mx-auto space-y-8">
        
        {/* AI Assistant Section */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 border-2 border-indigo-200 dark:border-indigo-800 rounded-3xl p-6 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <Sparkles className="w-32 h-32 text-indigo-600" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-md">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-indigo-950 dark:text-indigo-200">Asistente IA para Proyectos</h3>
                <p className="text-indigo-800/70 dark:text-indigo-300/70 font-medium">Sube brochures, imágenes, datos financieros o textos promocionales y llenaré todo por ti.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-indigo-900 dark:text-indigo-300 mb-2">Información y Notas (Texto)</label>
                <textarea 
                  value={aiText}
                  onChange={(e) => setAiText(e.target.value)}
                  placeholder="Ej: Rentabilidad del 10% anual, 40% participación, 3 ambientes..."
                  className="w-full h-32 p-4 bg-white dark:bg-background border-2 border-indigo-100 dark:border-indigo-900 rounded-2xl resize-none focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-400/20 transition-all text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-indigo-900 dark:text-indigo-300 mb-2">Archivos (Imágenes, PDFs, Presentaciones)</label>
                <div 
                  className="w-full h-32 border-2 border-dashed border-indigo-300 dark:border-indigo-700 rounded-2xl flex flex-col items-center justify-center bg-white/50 dark:bg-background/50 hover:bg-white dark:hover:bg-background transition-colors cursor-pointer relative"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (e.dataTransfer.files) setAiFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)]);
                  }}
                >
                  <input type="file" multiple className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => {
                    if (e.target.files) setAiFiles(prev => [...prev, ...Array.from(e.target.files!)]);
                  }}/>
                  <Upload className="w-8 h-8 text-indigo-400 mb-2" />
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">Haz clic o arrastra archivos aquí</p>
                </div>
                
                <div className="mt-4 flex justify-center">
                  <GoogleDrivePicker onFileSelect={(url, thumb) => {
                    setAiDriveUrls(prev => [...prev, url]);
                    if (thumb) setDriveThumbnails(prev => ({...prev, [url]: thumb}));
                  }} onToken={(token) => setAiDriveToken(token)} />
                </div>

                {(aiFiles.length > 0 || aiDriveUrls.length > 0) && (
                  <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {aiFiles.map((f, i) => (
                      <div key={i} className="bg-white border-2 border-indigo-100 rounded-xl overflow-hidden relative group shadow-sm flex flex-col h-24">
                        <button onClick={() => setAiFiles(aiFiles.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 z-10 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100"><X className="w-3 h-3" /></button>
                        <div className="flex-1 flex items-center justify-center bg-indigo-50/50 relative w-full h-full overflow-hidden">
                          {f.type.startsWith('image/') ? (
                            <img src={URL.createObjectURL(f)} alt="Preview" className="w-full h-full object-cover" />
                          ) : (
                            <FileText className="w-8 h-8 text-indigo-300" />
                          )}
                        </div>
                        <div className="bg-indigo-100 px-2 py-1 text-[10px] text-indigo-900 truncate">{f.name}</div>
                      </div>
                    ))}
                    {aiDriveUrls.map((url, i) => (
                      <div key={i} className="bg-white border-2 border-blue-100 rounded-xl overflow-hidden relative group shadow-sm flex flex-col h-24">
                        <button onClick={() => setAiDriveUrls(aiDriveUrls.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 z-10 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100"><X className="w-3 h-3" /></button>
                        <div className="flex-1 flex items-center justify-center bg-blue-50/50 relative w-full h-full overflow-hidden">
                          {driveThumbnails[url] ? (
                            <img src={driveThumbnails[url]} alt="Drive preview" className="w-full h-full object-cover" />
                          ) : (
                            <FileText className="w-8 h-8 text-blue-300" />
                          )}
                        </div>
                        <div className="bg-blue-100 px-2 py-1 text-[10px] text-blue-900 truncate">Drive File</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button 
                onClick={handleAiExtract}
                disabled={isAiLoading || (!aiText && aiFiles.length === 0 && aiDriveUrls.length === 0)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg flex items-center gap-2 disabled:opacity-50"
              >
                {isAiLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                {isAiLoading ? aiStatusText : 'Extraer Datos y Autocompletar'}
              </button>
            </div>
          </div>
        </div>

        {activeTab === 'resumen' && (
          <div className="bg-card border border-border rounded-3xl p-8 shadow-sm animate-in fade-in slide-in-from-bottom-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Ubicación</label>
                <input name="location" value={formData.location} onChange={handleChange} className="w-full bg-background border border-border rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Arquitecto</label>
                <input name="architect" value={formData.architect} onChange={handleChange} className="w-full bg-background border border-border rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Estado</label>
                <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-background border border-border rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20">
                  <option value="EVALUACION">Evaluación / En espera de permiso</option>
                  <option value="PLANIFICACION">Planificación</option>
                  <option value="EN_CONSTRUCCION">En Construcción</option>
                  <option value="TERMINADO">Terminado</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Tipo de Acuerdo</label>
                <input name="dealType" value={formData.dealType} onChange={handleChange} className="w-full bg-background border border-border rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Total de Unidades</label>
                <input type="number" name="totalUnits" value={formData.totalUnits} onChange={handleChange} className="w-full bg-background border border-border rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Número de Pisos</label>
                <input type="number" name="floors" value={formData.floors} onChange={handleChange} className="w-full bg-background border border-border rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Porcentaje de Propiedad/Plusvalía (%)</label>
                <input type="number" step="0.01" name="ownershipShare" value={formData.ownershipShare} onChange={handleChange} className="w-full bg-background border border-border rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Costo Estimado / Precio Base (ILS/USD)</label>
                <input type="number" name="estimatedCost" value={formData.estimatedCost} onChange={handleChange} className="w-full bg-background border border-border rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Rendimiento Esperado (%)</label>
                <input type="number" step="0.01" name="expectedRevenue" value={formData.expectedRevenue} onChange={handleChange} className="w-full bg-background border border-border rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
            </div>

            <div className="space-y-2 mt-6">
              <label className="text-sm font-medium">Descripción y Beneficios (Texto de Inversión)</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows={6} className="w-full bg-background border border-border rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 resize-none" />
            </div>
            
            <div className="space-y-2 mt-6">
              <label className="text-sm font-medium">Notas Adicionales (Estructura Financiera)</label>
              <textarea name="notes" value={formData.notes} onChange={handleChange} rows={4} className="w-full bg-background border border-border rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 resize-none" />
            </div>
          </div>
        )}

        {activeTab === 'multimedia' && (
          <div className="bg-card border border-border rounded-3xl p-8 shadow-sm animate-in fade-in slide-in-from-bottom-2 space-y-8">
            {[
              { title: "Imágenes y Renders", list: imagesList, setter: setImagesList },
              { title: "Material Publicitario (Posters)", list: postersList, setter: setPostersList },
              { title: "Presentaciones / Folletos (PDF)", list: presentationsList, setter: setPresentationsList },
              { title: "Videos de Proyecto", list: videosList, setter: setVideosList },
              { title: "Documentación Legal", list: legalDocsList, setter: setLegalDocsList },
            ].map((section, idx) => (
              <div key={idx} className="space-y-4">
                <h3 className="text-lg font-bold">{section.title}</h3>
                <div className="bg-muted/30 border border-border rounded-2xl p-4">
                  {section.list.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      {section.list.map((itemUrl, itemIdx) => (
                        <div key={itemIdx} className="relative group rounded-xl overflow-hidden border border-border h-32 bg-muted flex items-center justify-center">
                          <button onClick={() => section.setter(section.list.filter((_, i) => i !== itemIdx))} className="absolute top-2 right-2 z-10 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4"/></button>
                          {itemUrl.startsWith('data:image/') || itemUrl.match(/\.(jpeg|jpg|gif|png)$/) != null ? (
                             <img src={itemUrl} alt="Preview" className="w-full h-full object-cover" />
                          ) : (
                             <div className="text-center p-2"><FileText className="w-8 h-8 mx-auto text-muted-foreground mb-1"/><p className="text-xs text-muted-foreground truncate w-full">{itemUrl}</p></div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground"><p>No hay archivos en esta categoría.</p></div>
                  )}
                  <div className="flex gap-4 items-center justify-center pt-2">
                    <label className="text-sm font-semibold text-primary flex items-center gap-1 hover:underline cursor-pointer bg-primary/10 px-4 py-2 rounded-xl transition-colors">
                      <Upload className="w-4 h-4"/> Subir Archivo
                      <input type="file" multiple className="hidden" onChange={(e) => handleFileUpload(e.target.files, section.setter)} />
                    </label>
                    <GoogleDrivePicker onFileSelect={(url, thumb) => section.setter(prev => [...prev, url])} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
