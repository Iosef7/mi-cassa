const fs = require('fs');

const file = 'src/app/admin/proyectos/[id]/ProjectDashboard.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add missing imports
if (!content.includes('DriveImagePreview')) {
  content = content.replace(
    'import { GoogleDrivePicker } from "@/components/GoogleDrivePicker";',
    'import { GoogleDrivePicker } from "@/components/GoogleDrivePicker";\nimport { DriveImagePreview } from "@/components/DriveImagePreview";'
  );
}
content = content.replace(
  'import { ArrowLeft, Building2, MapPin, Loader2, Calendar, FileText, CheckCircle2, LayoutDashboard, Calculator, Folder, FileSpreadsheet, Lock, Printer, Upload, X } from "lucide-react";',
  'import { ArrowLeft, Building2, MapPin, Loader2, Calendar, FileText, CheckCircle2, LayoutDashboard, Calculator, Folder, FileSpreadsheet, Lock, Printer, Upload, X, Globe, Edit, Image as ImageIcon, ChevronDown, Trash2, Plus, Maximize, Building } from "lucide-react";'
);

// 2. Add DriveThumbnails state & handleFileUpload parameter
if (!content.includes('const [driveThumbnails, setDriveThumbnails] = useState<Record<string, string>>({});')) {
  content = content.replace(
    'const [isUploading, setIsUploading] = useState(false);',
    'const [isUploading, setIsUploading] = useState(false);\n  const [driveThumbnails, setDriveThumbnails] = useState<Record<string, string>>({});\n  const [editingSection, setEditingSection] = useState<string | null>(null);'
  );
}

// Modify handleFileUpload to take a list name
content = content.replace(
  'const handleFileUpload = async (files: FileList | null) => {',
  'const handleFileUpload = async (files: FileList | null, listName: string = "presentations") => {'
);
content = content.replace(
  'const newAtt = { ...attachments, presentations: [...attachments.presentations, ...uploadedUrls] };',
  'const newAtt = { ...attachments, [listName]: [...(attachments[listName] || []), ...uploadedUrls] };'
);

// Update activeTab button text
content = content.replace(
  '<Folder className="w-4 h-4" />\n          Documentos',
  '<Folder className="w-4 h-4" />\n          Multimedia y Planos'
);

// Replace the entire activeTab === "documentos" block
const newDocUI = `
        {/* MULTIMEDIA Y PLANOS */}
        {activeTab === "documentos" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 print:hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-8">
                {/* Videos / Recorridos Virtuales */}
                <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
                  <div className="flex justify-between items-center mb-4 group">
                    <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                      <Building className="text-primary w-5 h-5" /> Recorridos Virtuales y Videos
                    </h3>
                    {editingSection !== 'videos' && (
                      <button onClick={() => setEditingSection('videos')} className="opacity-0 group-hover:opacity-100 p-2 hover:bg-muted rounded-full transition-opacity"><Edit className="w-4 h-4 text-muted-foreground"/></button>
                    )}
                  </div>
                  {editingSection === 'videos' ? (
                    <div className="space-y-4">
                      {attachments.videos?.map((url: string, i: number) => {
                        const isVideoData = url.startsWith('data:video');
                        const isImageData = url.startsWith('data:image');
                        const isData = url.startsWith('data:');
                        return (
                        <div key={i} className="flex gap-2 items-center">
                          {url && (
                            <div className="w-12 h-12 shrink-0 rounded-lg overflow-hidden border border-border bg-muted flex items-center justify-center relative">
                              {isVideoData ? (
                                <video src={url} className="w-full h-full object-cover" />
                              ) : isImageData || url.match(/\\.(jpeg|jpg|gif|png)$/i) || url.includes('drive.google.com') ? (
                                <DriveImagePreview url={url} thumbnails={driveThumbnails} alt={\`Preview \${i}\`} className="w-full h-full object-cover pointer-events-none" />
                              ) : (
                                <Building className="w-5 h-5 text-muted-foreground" />
                              )}
                            </div>
                          )}
                          {isData ? (
                            <div className="flex-1 p-3 rounded-xl border border-border bg-muted/50 text-muted-foreground text-sm truncate flex items-center">
                              Archivo multimedia subido localmente
                            </div>
                          ) : (
                            <input value={url} onChange={(e) => {
                              const newList = [...(attachments.videos || [])]; newList[i] = e.target.value; setAttachments({...attachments, videos: newList});
                            }} placeholder="https://..." className="flex-1 p-3 rounded-xl border border-border outline-none" />
                          )}
                          <button onClick={() => {
                            const newList = attachments.videos.filter((_: any, idx: number) => idx !== i);
                            setAttachments({...attachments, videos: newList});
                          }} className="p-3 bg-destructive/10 text-destructive rounded-xl"><Trash2 className="w-5 h-5"/></button>
                        </div>
                      )})}
                      <div className="flex gap-4">
                        <button onClick={() => setAttachments({...attachments, videos: [...(attachments.videos||[]), '']})} className="text-sm font-semibold text-primary flex items-center gap-1 hover:underline"><Plus className="w-4 h-4"/> Añadir URL</button>
                        <GoogleDrivePicker onFileSelect={(url, thumb) => {
                          setAttachments(prev => ({...prev, videos: [...(prev.videos||[]), url]}));
                          if (thumb) setDriveThumbnails(prev => ({...prev, [url]: thumb}));
                        }} />
                        <label className={\`text-sm font-semibold flex items-center gap-1 cursor-pointer \${isUploading ? 'text-gray-400' : 'text-primary hover:underline'}\`}>
                          {isUploading ? <Loader2 className="w-4 h-4 animate-spin"/> : <Upload className="w-4 h-4"/>} 
                          {isUploading ? 'Subiendo...' : 'Subir Archivo'}
                          <input type="file" accept="video/*,image/*,application/pdf" multiple className="hidden" onChange={(e) => { handleFileUpload(e.target.files, 'videos'); e.target.value = ''; }} />
                        </label>
                      </div>
                      <div className="flex justify-end gap-2 pt-4">
                        <button onClick={() => setEditingSection(null)} className="px-4 py-2 text-sm font-semibold hover:bg-muted rounded-xl transition-colors">Cancelar</button>
                        <button onClick={async () => { await saveAttachments(attachments); setEditingSection(null); }} className="px-4 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-xl">Guardar</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {attachments.videos?.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4">
                          {attachments.videos.map((url: string, i: number) => {
                            let embedUrl = url;
                            if (url.includes('youtube.com/watch?v=')) embedUrl = url.replace('watch?v=', 'embed/');
                            else if (url.includes('youtu.be/')) embedUrl = url.replace('youtu.be/', 'www.youtube.com/embed/');
                            else if (url.includes('drive.google.com/file/d/')) embedUrl = url.replace(/\\/view.*$/, '/preview');
                            
                            const isVideoFile = url.startsWith('data:video/') || url.match(/\\.(mp4|webm|ogg)$/i);

                            return (
                              <div key={i} className="flex flex-col gap-2">
                                <details className="group/video border border-border rounded-2xl bg-card hover:bg-muted/30 transition-colors">
                                  <summary className="flex items-center justify-between p-4 cursor-pointer outline-none list-none [&::-webkit-details-marker]:hidden">
                                    <div className="flex items-center gap-2">
                                      <div className="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center shrink-0">
                                        <div className="w-0 h-0 border-t-[3px] border-t-transparent border-l-[4px] border-l-white border-b-[3px] border-b-transparent ml-0.5"></div>
                                      </div>
                                      <span className="font-bold text-sm text-foreground">Video / Recorrido {i + 1}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <button onClick={(e) => { e.preventDefault(); window.open(url, '_blank'); }} className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 bg-primary/10 px-3 py-1.5 rounded-xl transition-colors">
                                        <Globe className="w-3 h-3" /> Abrir link
                                      </button>
                                      <ChevronDown className="w-4 h-4 text-muted-foreground group-open/video:rotate-180 transition-transform" />
                                    </div>
                                  </summary>
                                  <div className="p-4 pt-0">
                                    <div className="w-full aspect-video rounded-xl overflow-hidden border border-border shadow-sm bg-muted relative">
                                      {isVideoFile ? (
                                        <video src={url} controls className="w-full h-full bg-black" />
                                      ) : (
                                        <iframe src={embedUrl} className="w-full h-full" allowFullScreen></iframe>
                                      )}
                                    </div>
                                  </div>
                                </details>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="p-6 bg-muted rounded-2xl border border-dashed border-border flex items-center justify-center text-muted-foreground text-sm text-center">
                          <p>No se han subido recorridos virtuales para este proyecto.</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              <div className='space-y-8'>
                {/* Afiches Promocionales */}
                <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
                  <div className="flex justify-between items-center mb-4 group">
                    <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                      <ImageIcon className="text-primary w-5 h-5" /> Afiches Promocionales
                    </h3>
                    {editingSection !== 'posters' && (
                      <button onClick={() => setEditingSection('posters')} className="opacity-0 group-hover:opacity-100 p-2 hover:bg-muted rounded-full transition-opacity"><Edit className="w-4 h-4 text-muted-foreground"/></button>
                    )}
                  </div>
                  {editingSection === 'posters' ? (
                    <div className="space-y-4">
                      {attachments.posters?.map((url: string, i: number) => (
                        <div key={i} className="flex gap-2 items-center">
                          {url && (
                            <div className="w-12 h-12 shrink-0 rounded-lg overflow-hidden border border-border bg-muted flex items-center justify-center relative">
                              <DriveImagePreview url={url} thumbnails={driveThumbnails} alt={\`Preview \${i}\`} className="w-full h-full object-cover pointer-events-none" />
                            </div>
                          )}
                          <input value={url} onChange={(e) => {
                            const newList = [...(attachments.posters||[])]; newList[i] = e.target.value; setAttachments({...attachments, posters: newList});
                          }} placeholder="https://..." className="flex-1 p-3 rounded-xl border border-border outline-none" />
                          <button onClick={() => {
                            const newList = attachments.posters.filter((_: any, idx: number) => idx !== i);
                            setAttachments({...attachments, posters: newList});
                          }} className="p-3 bg-destructive/10 text-destructive rounded-xl"><Trash2 className="w-5 h-5"/></button>
                        </div>
                      ))}
                      <div className="flex gap-4">
                        <button onClick={() => setAttachments({...attachments, posters: [...(attachments.posters||[]), '']})} className="text-sm font-semibold text-primary flex items-center gap-1 hover:underline"><Plus className="w-4 h-4"/> Añadir URL</button>
                        <GoogleDrivePicker onFileSelect={(url, thumb) => {
                          setAttachments(prev => ({...prev, posters: [...(prev.posters||[]), url]}));
                          if (thumb) setDriveThumbnails(prev => ({...prev, [url]: thumb}));
                        }} />
                        <label className={\`text-sm font-semibold flex items-center gap-1 cursor-pointer \${isUploading ? 'text-gray-400' : 'text-primary hover:underline'}\`}>
                          {isUploading ? <Loader2 className="w-4 h-4 animate-spin"/> : <Upload className="w-4 h-4"/>} 
                          {isUploading ? 'Subiendo...' : 'Subir Archivo'}
                          <input type="file" accept="image/*,application/pdf" multiple className="hidden" onChange={(e) => { handleFileUpload(e.target.files, 'posters'); e.target.value = ''; }} />
                        </label>
                      </div>
                      <div className="flex justify-end gap-2 pt-4">
                        <button onClick={() => setEditingSection(null)} className="px-4 py-2 text-sm font-semibold hover:bg-muted rounded-xl transition-colors">Cancelar</button>
                        <button onClick={async () => { await saveAttachments(attachments); setEditingSection(null); }} className="px-4 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-xl">Guardar</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {attachments.posters?.length > 0 ? (
                        <div className="grid grid-cols-2 gap-4">
                          {attachments.posters.map((url: string, i: number) => (
                            <div key={i} onClick={() => window.open(url, '_blank')} className="w-full aspect-[3/4] rounded-2xl overflow-hidden border border-border shadow-sm block group relative cursor-pointer">
                              <DriveImagePreview url={url} thumbnails={driveThumbnails} alt={\`Afiche \${i+1}\`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="text-white font-bold text-xs px-3 py-1.5 bg-black/50 rounded-xl backdrop-blur-sm">Ampliar</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-6 bg-muted rounded-2xl border border-dashed border-border flex items-center justify-center text-muted-foreground text-sm text-center">
                          <p>No se han subido afiches.</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Planos Arquitectónicos */}
            <div className={\`mt-8 bg-card border border-border rounded-3xl shadow-sm h-fit max-h-min overflow-hidden \${attachments.plans?.length > 0 || editingSection === 'plans' ? 'p-8' : 'px-8 pt-8 pb-6'}\`}>
              <div className="flex justify-between items-center mb-6 group">
                <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
                  <MapPin className="text-primary w-6 h-6" /> Planos Arquitectónicos
                </h3>
                {editingSection !== 'plans' && (
                  <button onClick={() => setEditingSection('plans')} className="opacity-0 group-hover:opacity-100 p-2 hover:bg-muted rounded-full transition-opacity"><Edit className="w-4 h-4 text-muted-foreground"/></button>
                )}
              </div>
              {editingSection === 'plans' ? (
                <div className="space-y-4">
                  {attachments.plans?.map((url: string, i: number) => (
                    <div key={i} className="flex gap-2 items-center">
                      {url && (
                        <div className="w-12 h-12 shrink-0 rounded-lg overflow-hidden border border-border bg-muted flex items-center justify-center relative">
                          <DriveImagePreview url={url} thumbnails={driveThumbnails} alt={\`Preview \${i}\`} className="w-full h-full object-cover pointer-events-none" />
                        </div>
                      )}
                      <input value={url} onChange={(e) => {
                        const newList = [...(attachments.plans||[])]; newList[i] = e.target.value; setAttachments({...attachments, plans: newList});
                      }} placeholder="https://..." className="flex-1 p-3 rounded-xl border border-border outline-none" />
                      <button onClick={() => {
                        const newList = attachments.plans.filter((_: any, idx: number) => idx !== i);
                        setAttachments({...attachments, plans: newList});
                      }} className="p-3 bg-destructive/10 text-destructive rounded-xl"><Trash2 className="w-5 h-5"/></button>
                    </div>
                  ))}
                  <div className="flex gap-4">
                    <button onClick={() => setAttachments({...attachments, plans: [...(attachments.plans||[]), '']})} className="text-sm font-semibold text-primary flex items-center gap-1 hover:underline"><Plus className="w-4 h-4"/> Añadir URL</button>
                    <GoogleDrivePicker onFileSelect={(url, thumb) => {
                      setAttachments(prev => ({...prev, plans: [...(prev.plans||[]), url]}));
                      if (thumb) setDriveThumbnails(prev => ({...prev, [url]: thumb}));
                    }} />
                    <label className={\`text-sm font-semibold flex items-center gap-1 cursor-pointer \${isUploading ? 'text-gray-400' : 'text-primary hover:underline'}\`}>
                      {isUploading ? <Loader2 className="w-4 h-4 animate-spin"/> : <Upload className="w-4 h-4"/>} 
                      {isUploading ? 'Subiendo...' : 'Subir Archivo'}
                      <input type="file" accept="image/*,application/pdf" multiple className="hidden" onChange={(e) => { handleFileUpload(e.target.files, 'plans'); e.target.value = ''; }} />
                    </label>
                  </div>
                  <div className="flex justify-end gap-2 pt-4">
                    <button onClick={() => setEditingSection(null)} className="px-4 py-2 text-sm font-semibold hover:bg-muted rounded-xl transition-colors">Cancelar</button>
                    <button onClick={async () => { await saveAttachments(attachments); setEditingSection(null); }} className="px-4 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-xl">Guardar</button>
                  </div>
                </div>
              ) : (
                <>
                  {attachments.plans?.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6">
                      {attachments.plans.map((url: string, i: number) => {
                        const isImage = url.match(/\\.(jpeg|jpg|gif|png)$/i) || url.includes('unsplash');
                        return (
                          <div key={i} className="flex flex-col gap-3">
                            {isImage ? (
                              <a href={url} target="_blank" rel="noopener noreferrer" className="w-full aspect-[4/3] rounded-2xl overflow-hidden border border-border shadow-sm block group relative">
                                <DriveImagePreview url={url} thumbnails={driveThumbnails} alt={\`Plano \${i+1}\`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <span className="text-white font-bold px-4 py-2 bg-black/50 rounded-xl backdrop-blur-sm">Ampliar Plano</span>
                                </div>
                              </a>
                            ) : (
                              <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 bg-muted rounded-2xl hover:bg-primary/5 transition-colors group h-full">
                                <div className="flex items-center gap-3 overflow-hidden">
                                  <MapPin className="w-5 h-5 text-primary shrink-0" />
                                  <span className="text-base font-medium truncate group-hover:text-primary transition-colors">Descargar Plano {i + 1}</span>
                                </div>
                              </a>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-8 bg-muted rounded-2xl border border-dashed border-border flex items-center justify-center text-muted-foreground text-center">
                      <p>No se han subido planos arquitectónicos.</p>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Documentación del Proyecto */}
            <div className="mt-8 bg-card border border-border rounded-3xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div className="flex justify-between items-center mb-4 group">
                <h4 className="font-bold text-lg">Presentaciones y Documentos</h4>
                {editingSection !== 'presentations' && (
                  <button onClick={() => setEditingSection('presentations')} className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-muted rounded-full transition-opacity"><Edit className="w-4 h-4 text-muted-foreground"/></button>
                )}
              </div>
              
              {editingSection === 'presentations' ? (
                <div className="space-y-4">
                  {attachments.presentations?.map((url: string, i: number) => (
                    <div key={i} className="flex gap-2 items-center">
                      {url && (
                        <div className="w-12 h-12 shrink-0 rounded-lg overflow-hidden border border-border bg-muted flex items-center justify-center relative">
                          <DriveImagePreview url={url} thumbnails={driveThumbnails} alt={\`Preview \${i}\`} className="w-full h-full object-cover pointer-events-none" />
                        </div>
                      )}
                      <input value={url} onChange={(e) => {
                        const newList = [...(attachments.presentations||[])]; newList[i] = e.target.value; setAttachments({...attachments, presentations: newList});
                      }} placeholder="https://..." className="flex-1 p-3 rounded-xl border border-border outline-none" />
                      <button onClick={() => {
                        const newList = attachments.presentations.filter((_: any, idx: number) => idx !== i);
                        setAttachments({...attachments, presentations: newList});
                      }} className="p-3 bg-destructive/10 text-destructive rounded-xl"><Trash2 className="w-5 h-5"/></button>
                    </div>
                  ))}
                  <div className="flex gap-4">
                    <button onClick={() => setAttachments({...attachments, presentations: [...(attachments.presentations||[]), '']})} className="text-sm font-semibold text-primary flex items-center gap-1 hover:underline"><Plus className="w-4 h-4"/> Añadir URL</button>
                    <GoogleDrivePicker onFileSelect={(url, thumb) => {
                      setAttachments(prev => ({...prev, presentations: [...(prev.presentations||[]), url]}));
                      if (thumb) setDriveThumbnails(prev => ({...prev, [url]: thumb}));
                    }} />
                    <label className={\`text-sm font-semibold flex items-center gap-1 cursor-pointer \${isUploading ? 'text-gray-400' : 'text-primary hover:underline'}\`}>
                      {isUploading ? <Loader2 className="w-4 h-4 animate-spin"/> : <Upload className="w-4 h-4"/>} 
                      {isUploading ? 'Subiendo...' : 'Subir Archivo'}
                      <input type="file" accept="image/*,application/pdf" multiple className="hidden" onChange={(e) => { handleFileUpload(e.target.files, 'presentations'); e.target.value = ''; }} />
                    </label>
                  </div>
                  <div className="flex justify-end gap-2 pt-4">
                    <button onClick={() => setEditingSection(null)} className="px-4 py-2 text-sm font-semibold hover:bg-muted rounded-xl transition-colors">Cancelar</button>
                    <button onClick={async () => { await saveAttachments(attachments); setEditingSection(null); }} className="px-4 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-xl">Guardar</button>
                  </div>
                </div>
              ) : (
                <>
                  {attachments.presentations?.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {attachments.presentations.map((url: string, i: number) => (
                        <div key={i} className="relative group rounded-xl overflow-hidden border border-border shadow-sm h-32 bg-muted/20 flex flex-col">
                          <a href={url} target="_blank" rel="noreferrer" className="flex-1 flex flex-col items-center justify-center p-4">
                            <FileText className="w-8 h-8 text-primary mb-2" />
                            <span className="text-xs text-center break-all text-muted-foreground line-clamp-2">Documento {i+1}</span>
                          </a>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 bg-muted rounded-2xl border border-dashed border-border flex items-center justify-center text-muted-foreground text-sm text-center">
                      <p>No hay documentos ni presentaciones vinculadas.</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}`;

// Replace old activeTab block
const startIdx = content.indexOf('{/* DOCUMENTOS */}');
const endIdx = content.indexOf('{/* UNIDADES */}');
if (startIdx !== -1 && endIdx !== -1) {
  content = content.substring(0, startIdx) + newDocUI + '\n\n        ' + content.substring(endIdx);
}

fs.writeFileSync(file, content);
console.log("Done");
