"use client";

import { useState } from "react";
import { Building, Edit, Globe, Image as ImageIcon, Loader2, Plus, Trash2, Upload, MapPin, ChevronDown, FileText, Map, Camera, Maximize, Frame } from "lucide-react";
import { GoogleDrivePicker } from "@/components/GoogleDrivePicker";
import { DriveImagePreview } from "@/components/DriveImagePreview";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function ProjectMultimediaTab({
  project,
  attachments,
  setAttachments,
  saveAttachments,
  handleFileUpload,
  isUploading,
  driveThumbnails,
  setDriveThumbnails,
  userRole
}: any) {
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const canEdit = userRole !== 'INVERSOR';

  // Helper para renderizar los editores de arrays (imágenes, planos, etc)
  const renderArrayEditor = (listName: string, title: string, accept: string = "image/*,application/pdf") => (
    <div className="space-y-4">
      {attachments[listName]?.map((url: string, i: number) => (
        <div key={i} className="flex gap-2 items-center">
          {url && (
            <div className="w-12 h-12 shrink-0 rounded-lg overflow-hidden border border-border bg-muted flex items-center justify-center relative">
              <DriveImagePreview url={url} thumbnails={driveThumbnails} alt={`Preview ${i}`} className="w-full h-full object-cover pointer-events-none" />
            </div>
          )}
          <input 
            value={url} 
            onChange={(e) => {
              const newList = [...(attachments[listName] || [])]; 
              newList[i] = e.target.value; 
              setAttachments({...attachments, [listName]: newList});
            }} 
            placeholder="https://..." 
            className="flex-1 p-3 rounded-xl border border-border outline-none" 
          />
          <button 
            onClick={() => {
              const newList = attachments[listName].filter((_: any, idx: number) => idx !== i);
              setAttachments({...attachments, [listName]: newList});
            }} 
            className="p-3 bg-destructive/10 text-destructive rounded-xl hover:bg-destructive/20 transition-colors"
          >
            <Trash2 className="w-5 h-5"/>
          </button>
        </div>
      ))}
      <div className="flex flex-wrap gap-4 items-center">
        <button onClick={() => setAttachments({...attachments, [listName]: [...(attachments[listName]||[]), '']})} className="text-sm font-semibold text-primary flex items-center gap-1 hover:underline"><Plus className="w-4 h-4"/> Añadir URL</button>
        <GoogleDrivePicker onFileSelect={(url, thumb) => {
          setAttachments((prev: any) => ({...prev, [listName]: [...(prev[listName]||[]), url]}));
          if (thumb) setDriveThumbnails((prev: any) => ({...prev, [url]: thumb}));
        }} />
        <label className={`text-sm font-semibold flex items-center gap-1 cursor-pointer ${isUploading ? 'text-gray-400' : 'text-primary hover:underline'}`}>
          {isUploading ? <Loader2 className="w-4 h-4 animate-spin"/> : <Upload className="w-4 h-4"/>} 
          {isUploading ? 'Subiendo...' : 'Subir Archivo'}
          <input type="file" accept={accept} multiple className="hidden" onChange={(e) => { handleFileUpload(e.target.files, listName); e.target.value = ''; }} disabled={isUploading} />
        </label>
      </div>
      <div className="flex justify-end gap-2 pt-4 border-t border-border mt-4">
        <button onClick={() => setEditingSection(null)} className="px-4 py-2 text-sm font-semibold hover:bg-muted rounded-xl transition-colors">Cancelar</button>
        <button onClick={async () => { await saveAttachments(attachments); setEditingSection(null); }} className="px-4 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-xl shadow-md hover:bg-primary/90 transition-colors">Guardar Cambios</button>
      </div>
    </div>
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 print:hidden space-y-8">
      
      {/* 1. GALERÍA PRINCIPAL (MASONRY) */}
      <div className="bg-card border border-border rounded-[2rem] p-8 shadow-sm">
        <div className="flex justify-between items-center mb-6 group">
          <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <ImageIcon className="text-primary w-6 h-6" /> Galería del Proyecto
          </h3>
          {canEdit && editingSection !== 'images' && (
            <button onClick={() => setEditingSection('images')} className="opacity-0 group-hover:opacity-100 p-2 hover:bg-muted rounded-full transition-opacity"><Edit className="w-4 h-4 text-muted-foreground"/></button>
          )}
        </div>
        
        {editingSection === 'images' ? (
          renderArrayEditor('images', 'Imágenes del Proyecto', 'image/*')
        ) : (
          attachments.images?.length > 0 ? (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
              {attachments.images.map((url: string, i: number) => (
                <div key={i} onClick={() => setLightboxImage(url)} className="break-inside-avoid relative group rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-shadow border border-border">
                  <DriveImagePreview url={url} thumbnails={driveThumbnails} alt={`Imagen ${i+1}`} className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <span className="text-white font-medium flex items-center gap-1 text-sm bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full"><Maximize className="w-4 h-4"/> Ampliar</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 bg-muted/50 rounded-3xl border border-dashed border-border flex flex-col items-center justify-center text-muted-foreground text-center">
              <ImageIcon className="w-12 h-12 mb-3 opacity-20" />
              <p className="font-medium text-foreground">No hay imágenes principales.</p>
              <p className="text-sm">Sube renders, vistas exteriores e interiores del proyecto.</p>
            </div>
          )
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* 2. PLANOS ARQUITECTÓNICOS Y TIPOLOGÍAS */}
        <div className="bg-card border border-border rounded-[2rem] p-8 shadow-sm">
          <div className="flex justify-between items-center mb-6 group">
            <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Frame className="text-primary w-6 h-6" /> Planos y Tipologías
            </h3>
            {canEdit && editingSection !== 'plans' && (
              <button onClick={() => setEditingSection('plans')} className="opacity-0 group-hover:opacity-100 p-2 hover:bg-muted rounded-full transition-opacity"><Edit className="w-4 h-4 text-muted-foreground"/></button>
            )}
          </div>

          <div className="space-y-6">
            {/* Planos Generales (Master Plan) */}
            <div>
              <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Planos Generales (Master Plan)</h4>
              {editingSection === 'plans' ? (
                renderArrayEditor('plans', 'Planos Generales')
              ) : (
                attachments.plans?.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4">
                    {attachments.plans.map((url: string, i: number) => (
                      <div key={i} onClick={() => setLightboxImage(url)} className="relative group rounded-2xl overflow-hidden cursor-pointer shadow-sm border border-border aspect-[4/3] bg-muted">
                        <DriveImagePreview url={url} thumbnails={driveThumbnails} alt={`Plano ${i+1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-white font-medium text-sm bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full">Ver Plano</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">No hay planos generales subidos.</p>
                )
              )}
            </div>

            {/* Planos de Unidades / Tipologías */}
            {project.properties && project.properties.length > 0 && (
              <div className="pt-4 border-t border-border">
                <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">Planos por Tipología (Extraídos)</h4>
                <div className="grid grid-cols-2 gap-4">
                  {project.properties.filter((p: any) => p.floorPlans || p.images).map((prop: any) => {
                    let firstImage = null;
                    if (prop.floorPlans) {
                      try {
                        const parsed = JSON.parse(prop.floorPlans);
                        firstImage = Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : parsed;
                      } catch(e) { firstImage = prop.floorPlans; }
                    }
                    if (!firstImage && prop.images) {
                       try {
                        const parsed = JSON.parse(prop.images);
                        firstImage = Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : parsed;
                      } catch(e) { firstImage = prop.images; }
                    }

                    if (!firstImage || typeof firstImage !== 'string' || firstImage.trim() === '') return null;

                    return (
                      <div key={prop.id} onClick={() => setLightboxImage(firstImage)} className="group rounded-2xl border border-border bg-background overflow-hidden cursor-pointer hover:shadow-md transition-shadow">
                        <div className="aspect-[4/3] w-full bg-muted relative overflow-hidden">
                           <DriveImagePreview url={firstImage} thumbnails={driveThumbnails} alt={prop.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="p-3 bg-card border-t border-border">
                          <p className="font-semibold text-sm truncate">{prop.title}</p>
                          <p className="text-xs text-muted-foreground">{prop.area ? `${prop.area} m²` : 'Tipología'}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 3. MAPA Y ENTORNO */}
        <div className="bg-card border border-border rounded-[2rem] p-8 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6 group">
            <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <MapPin className="text-primary w-6 h-6" /> Ubicación y Entorno
            </h3>
            {canEdit && editingSection !== 'maps' && (
              <button onClick={() => setEditingSection('maps')} className="opacity-0 group-hover:opacity-100 p-2 hover:bg-muted rounded-full transition-opacity"><Edit className="w-4 h-4 text-muted-foreground"/></button>
            )}
          </div>
          
          {editingSection === 'maps' ? (
             <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">Iframe de Google Maps (URL completa o src)</label>
                  <textarea 
                    value={attachments.mapIframe || ""} 
                    onChange={(e) => setAttachments({...attachments, mapIframe: e.target.value})}
                    placeholder="<iframe src='...' /> o simplemente la URL de src"
                    className="w-full p-3 rounded-xl border border-border bg-background min-h-[100px]"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-2">Mapas Ilustrativos (Imágenes)</h4>
                  {renderArrayEditor('maps', 'Mapas Ilustrativos')}
                </div>
             </div>
          ) : (
            <div className="space-y-6 flex-1 flex flex-col">
              {attachments.mapIframe ? (
                <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden border border-border shadow-inner bg-muted">
                  {attachments.mapIframe.includes('<iframe') ? (
                     <div className="w-full h-full [&>iframe]:w-full [&>iframe]:h-full" dangerouslySetInnerHTML={{__html: attachments.mapIframe}} />
                  ) : (
                    <iframe src={attachments.mapIframe} className="w-full h-full border-0" allowFullScreen loading="lazy"></iframe>
                  )}
                </div>
              ) : (
                <div className="w-full aspect-[4/3] rounded-2xl border border-dashed border-border bg-muted/50 flex flex-col items-center justify-center text-muted-foreground p-6 text-center">
                  <Map className="w-10 h-10 mb-2 opacity-30" />
                  <p className="text-sm">No se ha configurado un mapa interactivo para este proyecto.</p>
                </div>
              )}

              {attachments.maps?.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Mapas Ilustrativos</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {attachments.maps.map((url: string, i: number) => (
                      <div key={i} onClick={() => setLightboxImage(url)} className="relative group rounded-2xl overflow-hidden cursor-pointer shadow-sm border border-border aspect-square bg-muted">
                        <DriveImagePreview url={url} thumbnails={driveThumbnails} alt={`Mapa ${i+1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                         <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-white font-medium text-sm bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full">Ampliar</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 4. AVANCE DE OBRA */}
      <div className="bg-card border border-border rounded-[2rem] p-8 shadow-sm">
        <div className="flex justify-between items-center mb-6 group">
          <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Camera className="text-primary w-6 h-6" /> Avance de Obra
          </h3>
          {canEdit && editingSection !== 'constructionProgress' && (
            <button onClick={() => setEditingSection('constructionProgress')} className="opacity-0 group-hover:opacity-100 p-2 hover:bg-muted rounded-full transition-opacity"><Edit className="w-4 h-4 text-muted-foreground"/></button>
          )}
        </div>

        {editingSection === 'constructionProgress' ? (
          renderArrayEditor('constructionProgress', 'Fotos de Avance de Obra')
        ) : (
          attachments.constructionProgress?.length > 0 ? (
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
              {attachments.constructionProgress.map((url: string, i: number) => (
                <div key={i} onClick={() => setLightboxImage(url)} className="snap-start shrink-0 w-[280px] aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-shadow border border-border relative group">
                   <DriveImagePreview url={url} thumbnails={driveThumbnails} alt={`Avance ${i+1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-90 group-hover:opacity-100 transition-opacity flex items-end p-4">
                     <span className="text-white font-medium text-sm">Registro Visual #{i+1}</span>
                   </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 bg-muted rounded-2xl border border-dashed border-border flex items-center justify-center text-muted-foreground text-center">
              <p>No se han subido fotos de avance de obra todavía.</p>
            </div>
          )
        )}
      </div>

      {/* 5. RECORRIDOS, AFICHES Y DOCUMENTOS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
        
        {/* Recorridos */}
        <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
           <div className="flex justify-between items-center mb-4 group">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Globe className="text-primary w-5 h-5" /> Videos 360 / Virtuales
              </h3>
              {canEdit && editingSection !== 'videos' && (
                <button onClick={() => setEditingSection('videos')} className="opacity-0 group-hover:opacity-100 p-2 hover:bg-muted rounded-full transition-opacity"><Edit className="w-4 h-4 text-muted-foreground"/></button>
              )}
            </div>
            {editingSection === 'videos' ? renderArrayEditor('videos', 'Videos', 'video/*,image/*') : (
              attachments.videos?.length > 0 ? (
                <div className="space-y-4">
                  {attachments.videos.map((url: string, i: number) => {
                     let embedUrl = url;
                     if (url.includes('youtube.com/watch?v=')) embedUrl = url.replace('watch?v=', 'embed/');
                     else if (url.includes('youtu.be/')) embedUrl = url.replace('youtu.be/', 'www.youtube.com/embed/');
                     else if (url.includes('drive.google.com/file/d/')) embedUrl = url.replace(/\/view.*$/, '/preview');
                     const isVideoFile = url.startsWith('data:video/') || url.match(/\.(mp4|webm|ogg)$/i);
                     
                     return (
                       <details key={i} className="group/video border border-border rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                          <summary className="flex items-center justify-between p-3 cursor-pointer outline-none list-none [&::-webkit-details-marker]:hidden">
                            <span className="font-semibold text-sm">Ver Video {i+1}</span>
                            <ChevronDown className="w-4 h-4 text-muted-foreground group-open/video:rotate-180 transition-transform" />
                          </summary>
                          <div className="p-3 pt-0">
                             <div className="w-full aspect-video rounded-lg overflow-hidden bg-black">
                                {isVideoFile ? <video src={url} controls className="w-full h-full" /> : <iframe src={embedUrl} className="w-full h-full" allowFullScreen></iframe>}
                             </div>
                          </div>
                       </details>
                     )
                  })}
                </div>
              ) : <p className="text-sm text-muted-foreground italic">No hay videos disponibles.</p>
            )}
        </div>

        {/* Afiches */}
        <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4 group">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <ImageIcon className="text-primary w-5 h-5" /> Afiches Promo
              </h3>
              {canEdit && editingSection !== 'posters' && (
                <button onClick={() => setEditingSection('posters')} className="opacity-0 group-hover:opacity-100 p-2 hover:bg-muted rounded-full transition-opacity"><Edit className="w-4 h-4 text-muted-foreground"/></button>
              )}
            </div>
            {editingSection === 'posters' ? renderArrayEditor('posters', 'Afiches', 'image/*') : (
               attachments.posters?.length > 0 ? (
                 <div className="grid grid-cols-2 gap-3">
                   {attachments.posters.map((url: string, i: number) => (
                     <div key={i} onClick={() => setLightboxImage(url)} className="w-full aspect-[3/4] rounded-xl overflow-hidden border border-border cursor-pointer shadow-sm relative group">
                        <DriveImagePreview url={url} thumbnails={driveThumbnails} alt={`Afiche ${i+1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                     </div>
                   ))}
                 </div>
               ) : <p className="text-sm text-muted-foreground italic">No hay afiches disponibles.</p>
            )}
        </div>

        {/* Documentos */}
        <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4 group">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <FileText className="text-primary w-5 h-5" /> PDFs & Docs
              </h3>
              {canEdit && editingSection !== 'presentations' && (
                <button onClick={() => setEditingSection('presentations')} className="opacity-0 group-hover:opacity-100 p-2 hover:bg-muted rounded-full transition-opacity"><Edit className="w-4 h-4 text-muted-foreground"/></button>
              )}
            </div>
            {editingSection === 'presentations' ? renderArrayEditor('presentations', 'Documentos', 'application/pdf,image/*') : (
               attachments.presentations?.length > 0 ? (
                 <div className="space-y-3">
                   {attachments.presentations.map((url: string, i: number) => (
                     <a key={i} href={url} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-colors group">
                       <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                         <FileText className="w-4 h-4 text-primary" />
                       </div>
                       <span className="text-sm font-medium truncate group-hover:text-primary transition-colors">Ver Documento {i+1}</span>
                     </a>
                   ))}
                 </div>
               ) : <p className="text-sm text-muted-foreground italic">No hay documentos disponibles.</p>
            )}
        </div>

      </div>

      {/* LIGHTBOX MODAL */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 sm:p-8 backdrop-blur-md"
            onClick={() => setLightboxImage(null)}
          >
            <button className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors">
              <X className="w-6 h-6" />
            </button>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center"
            >
               <DriveImagePreview url={lightboxImage} thumbnails={driveThumbnails} alt="Vista Ampliada" className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
    </div>
  );
}
