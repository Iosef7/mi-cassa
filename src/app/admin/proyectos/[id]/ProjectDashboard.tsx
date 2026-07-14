"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Building2, MapPin, Loader2, Calendar, FileText, CheckCircle2, LayoutDashboard, Calculator, Folder, FileSpreadsheet, Lock, Printer, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { GoogleDrivePicker } from "@/components/GoogleDrivePicker";
import ProjectSimulator from "./ProjectSimulator";
import ProjectTimeline from "./ProjectTimeline";

export default function ProjectDashboard({ projectId, userRole }: { projectId: string, userRole?: string }) {
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("resumen");
  const [attachments, setAttachments] = useState<any>({ images: [], videos: [], presentations: [], legalDocs: [], posters: [] });
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  const fetchProject = async () => {
    try {
      const res = await fetch(`/api/projects/${projectId}`);
      if (res.ok) {
        const data = await res.json();
        setProject(data);
        try {
          const parsed = JSON.parse(data.attachments || "{}");
          setAttachments({
            images: parsed.images || [],
            videos: parsed.videos || [],
            presentations: parsed.presentations || [],
            legalDocs: parsed.legalDocs || [],
            posters: parsed.posters || []
          });
        } catch(e) {}
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const saveAttachments = async (newAttachments: any) => {
    try {
      await fetch(`/api/projects/${projectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attachments: JSON.stringify(newAttachments) })
      });
      toast.success("Documentos actualizados");
    } catch (e) {
      console.error(e);
      toast.error("Error al guardar documentos");
    }
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    if (!project?.driveFolderId) {
      toast.error("Este proyecto no tiene carpeta de Drive vinculada.");
      return;
    }
    
    setIsUploading(true);
    try {
      const uploadedUrls: string[] = [];
      const token = localStorage.getItem('google_drive_token');
      if (!token) {
        toast.error("Inicia sesión con Google Drive primero (botón Desde Drive).");
        setIsUploading(false);
        return;
      }

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('parentId', project.driveFolderId);
        
        const res = await fetch('/api/drive/upload', {
          method: 'POST',
          headers: { 'Authorization': 'Bearer ' + token },
          body: formData
        });
        
        if (res.ok) {
          const data = await res.json();
          uploadedUrls.push(`https://drive.google.com/file/d/${data.id}/preview`);
        } else {
          toast.error("Error al subir archivo");
        }
      }
      
      const newAtt = { ...attachments, presentations: [...attachments.presentations, ...uploadedUrls] };
      setAttachments(newAtt);
      await saveAttachments(newAtt);
      
    } catch (err) {
      console.error(err);
      toast.error("Error al subir archivos.");
    } finally {
      setIsUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!project) {
    return <div className="p-8 text-center">Proyecto no encontrado.</div>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card p-6 rounded-3xl border border-border shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/admin/proyectos">
            <button type="button" className="p-2 rounded-full hover:bg-muted text-muted-foreground transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
              <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary border border-primary/20">
                {project.status}
              </span>
            </div>
            {project.location && (
              <div className="flex items-center text-muted-foreground text-sm">
                <MapPin className="w-4 h-4 mr-1.5" />
                {project.location}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex gap-2 print:hidden">
           <button type="button" onClick={() => window.print()} className="flex items-center px-4 py-2 border border-border bg-transparent text-foreground rounded-full hover:bg-muted transition-colors font-medium text-sm">
            <Printer className="w-4 h-4 mr-2" />
            Exportar a PDF
          </button>
          {userRole !== 'INVERSOR' && (
            <button type="button" className="px-4 py-2 bg-primary text-primary-foreground rounded-full shadow-lg hover:opacity-90 transition-all font-medium text-sm">Editar Proyecto</button>
          )}
        </div>
      </div>
      
      {userRole === 'INVERSOR' && (
        <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 px-4 py-3 rounded-2xl flex items-center gap-3 text-sm font-medium border border-amber-200 dark:border-amber-800/50 print:hidden">
          <Lock className="w-5 h-5" />
          Modo de visualización privado (Inversor). La edición de datos está bloqueada.
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border overflow-x-auto pb-2 scrollbar-hide print:hidden">
        <button
          onClick={() => setActiveTab("resumen")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all ${
            activeTab === "resumen" ? "bg-primary text-primary-foreground shadow-md" : "hover:bg-muted text-muted-foreground"
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          Resumen
        </button>
        <button
          onClick={() => setActiveTab("finanzas")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all ${
            activeTab === "finanzas" ? "bg-primary text-primary-foreground shadow-md" : "hover:bg-muted text-muted-foreground"
          }`}
        >
          <Calculator className="w-4 h-4" />
          Finanzas (ROI & Costos)
        </button>
        <button
          onClick={() => setActiveTab("documentos")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all ${
            activeTab === "documentos" ? "bg-primary text-primary-foreground shadow-md" : "hover:bg-muted text-muted-foreground"
          }`}
        >
          <Folder className="w-4 h-4" />
          Documentos
        </button>
        <button
          onClick={() => setActiveTab("unidades")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all ${
            activeTab === "unidades" ? "bg-primary text-primary-foreground shadow-md" : "hover:bg-muted text-muted-foreground"
          }`}
        >
          <Building2 className="w-4 h-4" />
          Unidades ({project.properties?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab("inversores")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all ${
            activeTab === "inversores" ? "bg-primary text-primary-foreground shadow-md" : "hover:bg-muted text-muted-foreground"
          }`}
        >
          <Lock className="w-4 h-4" />
          Portal Inversores
        </button>
      </div>

      {/* Tab Content */}
      <div className="bg-card border border-border rounded-3xl p-8 shadow-sm min-h-[400px]">
        
        {/* RESUMEN */}
        {activeTab === "resumen" && (
          <div className="space-y-8 animate-in fade-in">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-background rounded-2xl p-6 border border-border/50">
                <p className="text-sm font-medium text-muted-foreground mb-2">Unidades</p>
                <p className="text-3xl font-bold">{project.totalUnits || '--'}</p>
              </div>
              <div className="bg-background rounded-2xl p-6 border border-border/50">
                <p className="text-sm font-medium text-muted-foreground mb-2">Pisos</p>
                <p className="text-3xl font-bold">{project.floors || '--'}</p>
              </div>
              <div className="bg-background rounded-2xl p-6 border border-border/50">
                <p className="text-sm font-medium text-muted-foreground mb-2">Acuerdo</p>
                <p className="text-xl font-bold break-words">{project.dealType || '--'}</p>
              </div>
              <div className="bg-background rounded-2xl p-6 border border-border/50">
                <p className="text-sm font-medium text-muted-foreground mb-2">% Propiedad</p>
                <p className="text-3xl font-bold text-primary">{project.ownershipShare || 0}%</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2 border-b border-border pb-2">
                <FileText className="w-5 h-5 text-primary" />
                Descripción del Proyecto
              </h3>
              <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {project.description || "No hay descripción disponible."}
              </p>
            </div>

            <div className="space-y-4">
               <h3 className="text-lg font-semibold flex items-center gap-2 border-b border-border pb-2">
                <Calendar className="w-5 h-5 text-primary" />
                Línea de Tiempo
              </h3>
              <ProjectTimeline currentStatus={project.status} />
            </div>
          </div>
        )}

        {/* FINANZAS */}
        {(activeTab === "finanzas") && (
          <div className="space-y-6 animate-in fade-in">
             <h3 className="text-xl font-semibold mb-4 print:hidden">Simulador de Rentabilidad & Finanzas</h3>
             <ProjectSimulator initialData={project} />
          </div>
        )}

        {/* DOCUMENTOS */}
        {activeTab === "documentos" && (
          <div className="space-y-6 animate-in fade-in print:hidden">
            <h3 className="text-xl font-semibold mb-4">Documentación del Proyecto</h3>
            {project.driveFolderId ? (
              <div className="p-6 bg-background rounded-2xl border border-border flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Carpeta de Google Drive</h4>
                  <p className="text-sm text-muted-foreground">ID: {project.driveFolderId}</p>
                </div>
                <a href={`https://drive.google.com/drive/folders/${project.driveFolderId}`} target="_blank" rel="noreferrer">
                  <button type="button" className="px-4 py-2 border border-border bg-transparent rounded-full hover:bg-muted text-sm font-medium transition-colors">Abrir Drive</button>
                </a>
              </div>
            ) : (
              <div className="bg-background border border-dashed rounded-xl p-8 text-center text-muted-foreground">
                No hay carpeta de Drive vinculada a este proyecto.
              </div>
            )}
             
            <div className="mt-8">
              <h4 className="font-semibold mb-4">Subir Nuevos Documentos</h4>
              <div 
                className="w-full h-32 border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center bg-muted/20 hover:bg-muted/50 transition-colors cursor-pointer relative"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  handleFileUpload(e.dataTransfer.files);
                }}
              >
                <input type="file" multiple className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleFileUpload(e.target.files)} />
                {isUploading ? (
                  <Loader2 className="w-8 h-8 text-primary mb-2 animate-spin" />
                ) : (
                  <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                )}
                <p className="text-sm font-medium">Haz clic o arrastra PDFs/Excels aquí</p>
              </div>
              
              <div className="mt-4 flex justify-center">
                <GoogleDrivePicker onFileSelect={async (url) => {
                  const newAtt = { ...attachments, presentations: [...attachments.presentations, url] };
                  setAttachments(newAtt);
                  await saveAttachments(newAtt);
                }} />
              </div>
            </div>

            {attachments.presentations?.length > 0 && (
              <div className="mt-8">
                <h4 className="font-semibold mb-4">Archivos del Proyecto</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {attachments.presentations.map((url: string, i: number) => (
                    <div key={i} className="relative group rounded-xl overflow-hidden border border-border shadow-sm h-32 bg-muted/20 flex flex-col">
                      <button 
                        onClick={async () => {
                          const newAtt = { ...attachments, presentations: attachments.presentations.filter((_: any, idx: number) => idx !== i) };
                          setAttachments(newAtt);
                          await saveAttachments(newAtt);
                        }} 
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      <a href={url} target="_blank" rel="noreferrer" className="flex-1 flex flex-col items-center justify-center p-4">
                        <FileText className="w-8 h-8 text-primary mb-2" />
                        <span className="text-xs text-center break-all text-muted-foreground line-clamp-2">Documento {i+1}</span>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* UNIDADES */}
        {activeTab === "unidades" && (
          <div className="space-y-6 animate-in fade-in print:hidden">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Propiedades / Unidades del Proyecto</h3>
              {userRole !== 'INVERSOR' && (
                <button type="button" className="px-4 py-2 bg-primary text-primary-foreground rounded-full hover:opacity-90 transition-all text-sm font-medium">Vincular Propiedad</button>
              )}
            </div>
            
            {project.properties && project.properties.length > 0 ? (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.properties.map((prop: any) => (
                    <div key={prop.id} className="p-4 bg-background border border-border rounded-xl">
                      <p className="font-semibold">{prop.title}</p>
                      <p className="text-sm text-muted-foreground">{prop.price} NIS</p>
                    </div>
                  ))}
               </div>
            ) : (
              <div className="bg-background border border-dashed rounded-xl p-8 text-center text-muted-foreground">
                No hay propiedades vinculadas a este desarrollo todavía.
              </div>
            )}
          </div>
        )}

         {/* INVERSORES */}
         {activeTab === "inversores" && (
          <div className="space-y-6 animate-in fade-in print:hidden">
             <h3 className="text-xl font-semibold mb-4">Portal Privado para Inversores</h3>
             <div className="bg-background border border-dashed rounded-xl p-8 text-center text-muted-foreground">
                <Lock className="w-10 h-10 mx-auto mb-4 opacity-50" />
                <p className="font-medium text-foreground">El rol INVERSOR ya está activo en el sistema.</p>
                <p className="mt-2 text-sm">Los usuarios con este rol no verán botones de edición ni pestañas sensibles en esta vista.</p>
             </div>
          </div>
        )}

      </div>
    </div>
  );
}
