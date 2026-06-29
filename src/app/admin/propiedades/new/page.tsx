"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Edit, Save, Trash2, MapPin, Building, Image as ImageIcon, FileText, Plus, X, BedDouble, Bath, Maximize, Car, Calendar, Users, Phone, Mail, FolderLock, Globe, Shield, Dumbbell, Waves, Trees, Link as LinkIcon, BadgePercent, BadgeCheck, Upload, GripVertical, Loader2, Activity, CheckCircle2, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { GoogleDrivePicker } from '@/components/GoogleDrivePicker';
import { DriveFolderManager } from '@/components/DriveFolderManager';
import { createProject, generatePropertyDescription } from '../actions';

const getDisplayUrl = (url: string) => {
  if (url && typeof url === 'string' && url.includes('drive.google.com') && url.includes('/preview')) {
    const fileId = url.match(/\/file\/d\/(.+?)\/preview/)?.[1];
    if (fileId) {
      // Use the 'uc' endpoint which is more reliable for direct embedding
      return `https://drive.google.com/uc?export=view&id=${fileId}`;
    }
  }
  return url;
};

const AVAILABLE_AMENITIES = [
  { name: 'Piscina', icon: Waves, color: 'text-blue-500' },
  { name: 'Seguridad 24/7', icon: Shield, color: 'text-emerald-500' },
  { name: 'Gimnasio Equipado', icon: Dumbbell, color: 'text-amber-500' },
  { name: 'Áreas Verdes', icon: Trees, color: 'text-green-500' },
  { name: 'Estacionamiento', icon: Car, color: 'text-slate-500' },
  { name: 'Salón de Eventos', icon: Users, color: 'text-purple-500' },
  { name: 'Juegos Infantiles', icon: Activity, color: 'text-pink-500' },
];
interface Property {
  title: string;
  description: string;
  price: string;
  type: string;
  location: string;
  bedrooms: number | null;
  bathrooms: number | null;
  area: number | null;
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;
  ownerNotes: string;
  independentUnit: string;
}

const MortgageCalculator = ({ price }: { price: number }) => {
  const [downPayment, setDownPayment] = useState(price * 0.2);
  const [years, setYears] = useState(20);
  const interestRate = 5.06;

  useEffect(() => {
    setDownPayment(price * 0.2);
  }, [price]);

  const principal = price - downPayment;
  const r = (interestRate / 100) / 12;
  const n = years * 12;
  
  const monthlyPayment = principal > 0 && n > 0 
    ? (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
    : 0;

  const formatPrice = (p: number) => new Intl.NumberFormat('en-IL', { style: 'currency', currency: 'ILS' }).format(p);

  return (
    <div className="bg-card border border-border rounded-3xl p-8 shadow-sm mt-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-4 h-4 bg-red-600 rotate-45 rounded-sm"></div>
        <h3 className="text-2xl font-bold text-foreground">Primer paso hacia tu nuevo hogar</h3>
      </div>
      
      <div className="space-y-8">
        <div>
          <div className="flex justify-between mb-4">
            <span className="font-bold text-lg">{formatPrice(downPayment)}</span>
            <span className="text-muted-foreground font-medium">¿Cuál es tu capital inicial?</span>
          </div>
          <input 
            type="range" 
            min={0} max={price} step={10000} 
            value={downPayment} 
            onChange={(e) => setDownPayment(Number(e.target.value))}
            className="w-full accent-red-600 h-2 bg-muted rounded-lg appearance-none cursor-pointer" 
          />
        </div>

        <div>
          <div className="flex justify-between mb-4">
            <span className="font-bold text-lg">{years} Años</span>
            <span className="text-muted-foreground font-medium">¿A cuántos años quieres pagarlo?</span>
          </div>
          <input 
            type="range" 
            min={5} max={30} step={1} 
            value={years} 
            onChange={(e) => setYears(Number(e.target.value))}
            className="w-full accent-red-600 h-2 bg-muted rounded-lg appearance-none cursor-pointer" 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-muted/30 p-6 rounded-2xl border border-border mt-8">
          <div className="text-center border-b md:border-b-0 md:border-r border-border pb-4 md:pb-0">
            <p className="text-muted-foreground text-sm font-medium mb-1">Pago mensual estimado</p>
            <p className="text-3xl font-black text-red-600">{formatPrice(monthlyPayment)}</p>
          </div>
          <div className="text-center border-b md:border-b-0 md:border-r border-border pb-4 md:pb-0">
            <p className="text-muted-foreground text-sm font-medium mb-1">Tasa de interés promedio</p>
            <p className="text-3xl font-black text-foreground">{interestRate}%</p>
          </div>
          <div className="text-center">
            <p className="text-muted-foreground text-sm font-medium mb-1">Préstamo total</p>
            <p className="text-3xl font-black text-foreground">{formatPrice(principal)}</p>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <button className="bg-red-600 hover:bg-red-700 text-white px-10 py-4 rounded-full text-lg font-bold transition-colors shadow-lg shadow-red-600/20">
            Obtener Propuesta
          </button>
        </div>
      </div>
    </div>
  );
};

export default function NewProjectPage() {
  const router = useRouter();
  
  const [property, setProperty] = useState<Property>({
    title: 'Nombre del Proyecto',
    description: '',
    price: '0',
    type: 'PROYECTO',
    location: '',
    bedrooms: null,
    bathrooms: null,
    area: null,
    independentUnit: '',
    ownerName: '',
    ownerPhone: '',
    ownerEmail: '',
    ownerNotes: '',
  });

  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [expandedDocs, setExpandedDocs] = useState<number[]>([]);
  const [expandedVideos, setExpandedVideos] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState<'resumen' | 'multimedia' | 'comercial'>('resumen');

  // Form states (Draft state while editing)
  const [formData, setFormData] = useState<Property>(property);
  const [imagesList, setImagesList] = useState<string[]>([]);
  const [nearbyPlacesList, setNearbyPlacesList] = useState<{name: string, category: string, distance: string}[]>([]);
  const [dynamicFeatures, setDynamicFeatures] = useState<any>({ amenities: [] });
  const [presentationsList, setPresentationsList] = useState<string[]>([]);
  const [videosList, setVideosList] = useState<string[]>([]);
  const [postersList, setPostersList] = useState<string[]>([]);
  const [legalDocsList, setLegalDocsList] = useState<string[]>([]);
  const [draggedImageIndex, setDraggedImageIndex] = useState<number | null>(null);
  
  const [selectedFolder, setSelectedFolder] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // AI Assistant States
  const [aiText, setAiText] = useState('');
  const [aiFiles, setAiFiles] = useState<File[]>([]);
  const [aiDriveUrls, setAiDriveUrls] = useState<string[]>([]);
  const [aiDriveToken, setAiDriveToken] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiProgress, setAiProgress] = useState(0);
  const [aiStatusText, setAiStatusText] = useState('');
  const [aiLightboxUrl, setAiLightboxUrl] = useState<string | null>(null);

  // Sync draft data when opening an edit section
  useEffect(() => {
    if (editingSection) {
      setFormData(property);
    }
  }, [editingSection, property]);

  const handleFileUpload = async (files: FileList | null, listSetter: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (!files || files.length === 0) return;
    
    // In creation mode we can't upload directly to Drive because the folder doesn't exist yet.
    // For now we'll convert images to base64 for preview, but note that large files might fail.
    // Ideally, users will provide URLs or sync from Drive later, but we support local upload via Data URI for preview.
    setIsUploading(true);
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
      alert("Error procesando archivos locales.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleAiExtract = async () => {
    if (!aiText && aiFiles.length === 0 && aiDriveUrls.length === 0) return;
    setIsAiLoading(true);
    setAiProgress(0);
    setAiStatusText("Preparando archivos...");
    
    // Simular progreso para mejorar la experiencia de usuario
    const progressInterval = setInterval(() => {
      setAiProgress(p => {
        if (p < 20) { setAiStatusText("Enviando archivos a la nube..."); return p + 5; }
        if (p < 50) { setAiStatusText("Procesando multimedia (esto puede tardar si hay videos)..."); return p + 2; }
        if (p < 85) { setAiStatusText("Extrayendo información clave con IA..."); return p + 1; }
        setAiStatusText("Finalizando detalles...");
        return Math.min(p + 0.5, 95);
      });
    }, 800);

    try {
      const form = new FormData();
      
      let textToSend = aiText;
      if (aiDriveUrls.length > 0) {
        textToSend += '\n\nArchivos de Google Drive adjuntos (URLs):\n' + aiDriveUrls.join('\n');
      }
      
      if (aiDriveToken) form.append('driveToken', aiDriveToken);
      aiDriveUrls.forEach(url => form.append('driveUrls', url));
      
      if (textToSend) form.append('text', textToSend);
      aiFiles.forEach(file => form.append('files', file));
      
      const res = await fetch('/api/properties/ai-extract', {
        method: 'POST',
        body: form
      });
      
      clearInterval(progressInterval);
      setAiProgress(100);
      setAiStatusText("¡Extracción completada!");
      
      const result = await res.json();
      
      if (result.success && result.data) {
        const d = result.data;
        setProperty(prev => ({
          ...prev,
          title: d.title || prev.title,
          description: d.description || prev.description,
          price: d.price?.toString() || prev.price,
          type: d.type || prev.type,
          location: d.location || prev.location,
          bedrooms: d.bedrooms || prev.bedrooms,
          bathrooms: d.bathrooms || prev.bathrooms,
          area: d.area || prev.area
        }));
        setFormData(prev => ({ 
          ...prev,
          title: d.title || prev.title,
          description: d.description || prev.description,
          price: d.price?.toString() || prev.price,
          type: d.type || prev.type,
          location: d.location || prev.location,
          bedrooms: d.bedrooms || prev.bedrooms,
          bathrooms: d.bathrooms || prev.bathrooms,
          area: d.area || prev.area
        }));
        
        if (d.dynamicFeatures && Object.keys(d.dynamicFeatures).length > 0) {
          setDynamicFeatures(d.dynamicFeatures);
        }
        
        if (d.fileCategorization && result.filesData) {
            const filesData = result.filesData; 
            
            if (d.fileCategorization.images) {
                const imgUrls = d.fileCategorization.images.map((name: string) => filesData[name] || (name.startsWith('http') ? name : null)).filter(Boolean);
                if (imgUrls.length > 0) setImagesList(prev => [...prev, ...imgUrls]);
            }
            if (d.fileCategorization.presentations) {
                const presUrls = d.fileCategorization.presentations.map((name: string) => filesData[name] || (name.startsWith('http') ? name : null)).filter(Boolean);
                if (presUrls.length > 0) setPresentationsList(prev => [...prev, ...presUrls]);
            }
            if (d.fileCategorization.videos) {
                const vidUrls = d.fileCategorization.videos.map((name: string) => filesData[name] || (name.startsWith('http') ? name : null)).filter(Boolean);
                if (vidUrls.length > 0) setVideosList(prev => [...prev, ...vidUrls]);
            }
            if (d.fileCategorization.posters) {
                const postUrls = d.fileCategorization.posters.map((name: string) => filesData[name] || (name.startsWith('http') ? name : null)).filter(Boolean);
                if (postUrls.length > 0) setPostersList(prev => [...prev, ...postUrls]);
            }
            if (d.fileCategorization.legalDocs) {
                const docUrls = d.fileCategorization.legalDocs.map((name: string) => filesData[name] || (name.startsWith('http') ? name : null)).filter(Boolean);
                if (docUrls.length > 0) setLegalDocsList(prev => [...prev, ...docUrls]);
            }
        }
        
        // Check if anything was actually extracted
        const hasExtractedInfo = d.title || d.description || d.price || d.type || d.location || d.bedrooms || d.bathrooms || d.area || (d.dynamicFeatures && Object.keys(d.dynamicFeatures).length > 0) || (d.fileCategorization && Object.values(d.fileCategorization).some((arr: any) => arr.length > 0));
        
        if (hasExtractedInfo) {
          alert("¡Información extraída y autocompletada con éxito!");
        } else {
          alert("La IA analizó tu solicitud pero no encontró nueva información clara para extraer. Si usaste archivos de Google Drive sin añadir texto, recuerda que la IA no puede leer el contenido interno de esos enlaces privados por seguridad.");
        }

        // Clear AI inputs after success
        setAiText('');
        setAiFiles([]);
        setAiDriveUrls([]);
        setAiDriveToken(null);
      } else {
        alert(result.error || "Error al procesar la IA.");
      }
    } catch (e) {
      clearInterval(progressInterval);
      console.error(e);
      alert("Error crítico conectando con el asistente IA.");
    } finally {
      setTimeout(() => {
        setIsAiLoading(false);
        setAiProgress(0);
      }, 1000);
    }
  };

  const handleSaveSection = (sectionFields: string[]) => {
    // Instead of API call, just commit the draft formData to the main property state
    setProperty(prev => ({
      ...prev,
      ...formData
    }));
    setEditingSection(null);
  };

  const handleCreateSubmit = async () => {
    if (!selectedFolder) {
      alert("Por favor selecciona una carpeta de Google Drive en Configuración Inicial.");
      return;
    }
    
    setIsCreating(true);
    setError(null);
    try {
      const form = new FormData();
      form.set('title', property.title);
      form.set('location', property.location);
      form.set('type', property.type);
      form.set('price', property.price);
      form.set('description', property.description);
      form.set('bedrooms', property.bedrooms?.toString() || '');
      form.set('bathrooms', property.bathrooms?.toString() || '');
      form.set('area', property.area?.toString() || '');
      form.set('ownerName', property.ownerName);
      form.set('ownerPhone', property.ownerPhone);
      form.set('ownerEmail', property.ownerEmail);
      form.set('ownerNotes', property.ownerNotes);
      
      form.set('dynamicFeatures', JSON.stringify(dynamicFeatures));
      form.set('nearbyPlaces', JSON.stringify(nearbyPlacesList));
      form.set('parentDriveFolderId', selectedFolder);
      
      const result = await createProject(form);
      
      if (result.success && result.project?.id) {
        // Update the project with the remaining arrays
        const payload = {
          images: imagesList.filter(url => url.trim() !== ''),
          presentations: presentationsList.filter(url => url.trim() !== ''),
          videos: videosList.filter(url => url.trim() !== ''),
          legalDocs: legalDocsList.filter(url => url.trim() !== ''),
          posters: postersList.filter(url => url.trim() !== ''),
          independentUnit: property.independentUnit
        };
        
        await fetch(`/api/properties/${result.project.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        
        router.push("/admin/propiedades");
        router.refresh();
      } else {
        setError(result.error || "Ocurrió un error");
        setIsCreating(false);
      }
    } catch (e) {
      console.error(e);
      setError("Error crítico al crear el proyecto");
      setIsCreating(false);
    }
  };

  const handleImageDragStart = (e: React.DragEvent, index: number) => {
    setDraggedImageIndex(index);
  };

  const handleImageDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
  };

  const handleImageDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedImageIndex === null || draggedImageIndex === targetIndex) return;

    const newImagesList = [...imagesList];
    const [draggedItem] = newImagesList.splice(draggedImageIndex, 1);
    newImagesList.splice(targetIndex, 0, draggedItem);
    
    setImagesList(newImagesList);
    setDraggedImageIndex(null);
  };

  const handleDragScroll = (e: React.DragEvent) => {
    const container = document.getElementById('main-scroll-container');
    if (container && e.clientY > 0) {
      const { clientY } = e;
      const { top, bottom } = container.getBoundingClientRect();
      const scrollThreshold = 100; // pixels from edge to trigger scroll
      
      if (clientY < top + scrollThreshold) {
        container.scrollTop -= 20; // Scroll up
      } else if (clientY > bottom - scrollThreshold) {
        container.scrollTop += 20; // Scroll down
      }
    }
  };

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('en-IL', { style: 'currency', currency: 'ILS' }).format(Number(price));
  };

  return (
    <div id="main-scroll-container" className="flex-1 flex flex-col h-full bg-background overflow-auto">
      
      {/* Header */}
      <div className="bg-card/80 backdrop-blur-md border-b border-border px-8 py-6 sticky top-0 z-20 shadow-sm animate-in">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/admin/propiedades" className="p-2 rounded-full hover:bg-muted text-muted-foreground transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-2">
                {editingSection === 'header' ? (
                  <div className="flex gap-2 items-center">
                    <input 
                      autoFocus
                      value={formData.title} 
                      onChange={e=>setFormData({...formData, title: e.target.value})} 
                      className="bg-background border border-border rounded-lg px-3 py-1 text-2xl font-black w-96" 
                    />
                    <button onClick={() => setEditingSection(null)} className="p-1 hover:bg-muted rounded-full" title="Cancelar"><X className="w-5 h-5 text-muted-foreground"/></button>
                    <button onClick={() => handleSaveSection(['title', 'price'])} className="p-1 hover:bg-primary/20 bg-primary/10 rounded-full" title="Guardar Cambios"><Save className="w-5 h-5 text-primary"/></button>
                  </div>
                ) : (
                  <div className="flex gap-2 items-center group">
                    {property.title}
                    <button onClick={() => setEditingSection('header')} className="opacity-0 group-hover:opacity-100 p-1 hover:bg-muted rounded-full transition-opacity"><Edit className="w-4 h-4 text-muted-foreground"/></button>
                  </div>
                )}
              </h1>
              {editingSection === 'header' ? (
                <div className="mt-2 flex gap-2">
                  <input 
                    type="number"
                    value={formData.price} 
                    onChange={e=>setFormData({...formData, price: e.target.value})} 
                    className="bg-background border border-border rounded-lg px-3 py-1 w-48 text-sm"
                    placeholder="Precio..."
                  />
                  <button onClick={() => setEditingSection(null)} className="text-xs px-3 py-1 hover:bg-muted text-muted-foreground rounded-lg font-semibold transition-colors">Cancelar</button>
                  <button onClick={() => handleSaveSection(['title', 'price'])} className="text-xs px-4 py-1 bg-primary text-primary-foreground rounded-lg font-bold shadow-sm hover:opacity-90 transition-opacity">Guardar Cambios</button>
                </div>
              ) : (
                <div className="mt-1">
                  <p className="text-primary font-bold text-lg">{formatPrice(property.price)}</p>
                  {property.area && property.area > 0 && !isNaN(Number(property.price)) && (
                    <p className="text-muted-foreground text-sm font-medium">
                      {formatPrice((Number(property.price) / property.area).toString())} / m²
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex gap-4 items-center">
            <div className="flex gap-2 bg-muted p-1 rounded-2xl shrink-0 overflow-x-auto">
              <button onClick={() => setActiveTab('resumen')} className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'resumen' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>Resumen</button>
              <button onClick={() => setActiveTab('multimedia')} className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'multimedia' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>Multimedia y Planos</button>
              <button onClick={() => setActiveTab('comercial')} className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'comercial' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>Comercial (CRM)</button>
            </div>
            <button 
              onClick={handleCreateSubmit} 
              disabled={isCreating}
              className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2"
            >
              {isCreating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              {isCreating ? 'Guardando...' : 'Crear Proyecto'}
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
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
                <h3 className="text-2xl font-black text-indigo-950 dark:text-indigo-200">Asistente de Auto-Completado IA</h3>
                <p className="text-indigo-800/70 dark:text-indigo-300/70 font-medium">Sube archivos y pega texto. La IA extraerá los datos y llenará el formulario mágicamente.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-indigo-900 dark:text-indigo-300 mb-2">Información en texto (WhatsApp, correos, descripciones)</label>
                <textarea 
                  value={aiText}
                  onChange={(e) => setAiText(e.target.value)}
                  placeholder="Pega aquí toda la información desordenada que tengas sobre la propiedad..."
                  className="w-full h-32 p-4 bg-white dark:bg-background border-2 border-indigo-100 dark:border-indigo-900 rounded-2xl resize-none focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-400/20 transition-all text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-indigo-900 dark:text-indigo-300 mb-2">Archivos (Imágenes, PDFs, Videos, Planos)</label>
                <div 
                  className="w-full h-32 border-2 border-dashed border-indigo-300 dark:border-indigo-700 rounded-2xl flex flex-col items-center justify-center bg-white/50 dark:bg-background/50 hover:bg-white dark:hover:bg-background transition-colors cursor-pointer relative"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (e.dataTransfer.files) {
                      setAiFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)]);
                    }
                  }}
                >
                  <input 
                    type="file" 
                    multiple 
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                    onChange={(e) => {
                      if (e.target.files) {
                        setAiFiles(prev => [...prev, ...Array.from(e.target.files!)]);
                      }
                    }}
                  />
                  <Upload className="w-8 h-8 text-indigo-400 mb-2" />
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">Haz clic o arrastra archivos aquí</p>
                  <p className="text-xs text-indigo-400/80 mt-1">Soporta múltiples formatos</p>
                </div>
                
                <div className="mt-4 flex justify-center">
                  <GoogleDrivePicker onFileSelect={(url) => setAiDriveUrls(prev => [...prev, url])} onToken={(token) => setAiDriveToken(token)} />
                </div>

                {(aiFiles.length > 0 || aiDriveUrls.length > 0) && (
                  <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {aiFiles.map((f, i) => {
                      const isImage = f.type.startsWith('image/');
                      return (
                        <div key={`file-${i}`} className="bg-white dark:bg-background border-2 border-indigo-100 dark:border-indigo-900 rounded-xl overflow-hidden relative group shadow-sm flex flex-col h-24">
                          <button onClick={() => setAiFiles(aiFiles.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 z-10 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"><X className="w-3 h-3" /></button>
                          <div 
                            className="flex-1 flex items-center justify-center bg-indigo-50/50 dark:bg-indigo-950/20 relative w-full h-full cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => {
                              if (isImage) {
                                setAiLightboxUrl(URL.createObjectURL(f));
                              }
                            }}
                          >
                            {isImage ? (
                              <img src={URL.createObjectURL(f)} alt={f.name} className="absolute inset-0 w-full h-full object-cover" />
                            ) : (
                              <FileText className="w-8 h-8 text-indigo-300" />
                            )}
                          </div>
                          <div className="bg-indigo-100 dark:bg-indigo-900/80 px-2 py-1 text-[10px] text-indigo-900 dark:text-indigo-200 font-medium truncate">
                            {f.name}
                          </div>
                        </div>
                      );
                    })}
                    {aiDriveUrls.map((url, i) => {
                      // Attempt to render as image if it looks like a thumbnail or general drive link
                      const isLikelyImage = url.includes('=s') || url.includes('uc?id');
                      const isPreview = url.includes('/preview');
                      return (
                        <div key={`drive-${i}`} className="bg-white dark:bg-background border-2 border-blue-100 dark:border-blue-900 rounded-xl overflow-hidden relative group shadow-sm flex flex-col h-24">
                          <button onClick={() => setAiDriveUrls(aiDriveUrls.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 z-10 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"><X className="w-3 h-3" /></button>
                          <div 
                            className="flex-1 flex items-center justify-center bg-blue-50/50 dark:bg-blue-950/20 relative w-full h-full overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => setAiLightboxUrl(url)}
                          >
                            {isLikelyImage ? (
                              <img src={getDisplayUrl(url)} alt="Google Drive Preview" className="absolute inset-0 w-full h-full object-cover" />
                            ) : isPreview ? (
                              <div className="absolute inset-0 w-full h-full overflow-hidden flex items-center justify-center bg-black/5">
                                <iframe src={url} className="w-[150%] h-[150%] border-0 pointer-events-none scale-75 origin-center" title="Google Drive Preview" />
                              </div>
                            ) : (
                              <FileText className="w-8 h-8 text-blue-300" />
                            )}
                          </div>
                          <div className="bg-blue-100 dark:bg-blue-900/80 px-2 py-1 text-[10px] text-blue-900 dark:text-blue-200 font-medium truncate flex items-center gap-1 relative z-20">
                            <svg className="w-3 h-3 shrink-0" viewBox="0 0 87.3 126.9"><path fill="#FFC107" d="M62.5 126.9l24.8-43.1L62.5 40.7 12.9 40.7 37.7 83.8z"/><path fill="#1976D2" d="M87.3 83.8H37.7L12.9 40.7 0 63.5l24.8 43.1 37.7 20.3z"/><path fill="#4CAF50" d="M24.8 126.9L0 83.8 24.8 40.7h49.6L49.6 126.9z"/></svg>
                            Drive File
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button 
                onClick={handleAiExtract}
                disabled={isAiLoading || (!aiText && aiFiles.length === 0 && aiDriveUrls.length === 0)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-indigo-600/20 hover:-translate-y-0.5 transition-all flex items-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
              >
                {isAiLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                {isAiLoading ? 'Analizando mágicamente...' : 'Analizar y Auto-completar'}
              </button>
            </div>
          </div>
        </div>
        
        {/* Drive Config - Only visible in Create Mode */}
        <div className="bg-card border-2 border-primary/30 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <FolderLock className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-foreground">Configuración Inicial: Google Drive <span className="text-red-500">*</span></h3>
              <p className="text-sm text-muted-foreground">Selecciona la carpeta raíz donde se creará el directorio para este nuevo proyecto.</p>
            </div>
          </div>
          <DriveFolderManager 
            selectedFolderId={selectedFolder} 
            onSelectFolder={setSelectedFolder} 
          />
        </div>

        {activeTab === 'resumen' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 space-y-8">
                {/* Galería */}
                <div className="flex justify-between items-center mb-4 group">
                    <h3 className="text-xl font-bold">Imágenes Principales</h3>
                    {editingSection !== 'images' && (
                      <button onClick={() => setEditingSection('images')} className="opacity-0 group-hover:opacity-100 p-2 hover:bg-muted rounded-full transition-opacity"><Edit className="w-4 h-4 text-muted-foreground"/></button>
                    )}
                  </div>
                  {editingSection === 'images' ? (
                    <div className="space-y-4 bg-card border border-border rounded-3xl p-6 shadow-sm">
                      {imagesList.map((img, i) => (
                        <div 
                          key={i} 
                          className={`flex gap-2 items-center ${draggedImageIndex === i ? 'opacity-50' : 'opacity-100'}`}
                          draggable
                          onDragStart={(e) => handleImageDragStart(e, i)}
                          onDragOver={(e) => handleImageDragOver(e, i)}
                          onDrag={handleDragScroll}
                          onDrop={(e) => handleImageDrop(e, i)}
                          onDragEnd={() => setDraggedImageIndex(null)}
                        >
                          <div className="cursor-grab hover:text-primary transition-colors text-muted-foreground p-1" title="Arrastrar para reordenar">
                            <GripVertical className="w-5 h-5 pointer-events-none" />
                          </div>
                          {img && (
                            <div className="w-12 h-12 shrink-0 rounded-lg overflow-hidden border border-border bg-muted flex items-center justify-center">
                              <img src={getDisplayUrl(img)} alt={`Preview ${i}`} className="w-full h-full object-cover pointer-events-none" />
                            </div>
                          )}
                          {img.startsWith('data:') ? (
                            <div className="flex-1 p-3 rounded-xl border border-border bg-muted/50 text-muted-foreground text-sm truncate flex items-center">
                              Archivo de imagen subido localmente
                            </div>
                          ) : (
                            <input value={img} onChange={(e) => {
                              const newList = [...imagesList]; newList[i] = e.target.value; setImagesList(newList);
                            }} placeholder="https://..." className="flex-1 p-3 rounded-xl border border-border outline-none" />
                          )}
                          <button onClick={() => setImagesList(imagesList.filter((_, idx) => idx !== i))} className="p-3 bg-destructive/10 text-destructive rounded-xl"><Trash2 className="w-5 h-5"/></button>
                        </div>
                      ))}
                      <div className="flex gap-4">
                        <button onClick={() => setImagesList([...imagesList, ''])} className="text-sm font-semibold text-primary flex items-center gap-1 hover:underline"><Plus className="w-4 h-4"/> Añadir URL de Imagen</button>
                        <GoogleDrivePicker onFileSelect={(url) => setImagesList(prev => [...prev, url])} mimeTypes="image/png,image/jpeg,image/jpg" />
                        <label className="text-sm font-semibold text-primary flex items-center gap-1 hover:underline cursor-pointer">
                          <Upload className="w-4 h-4"/> Subir Archivo
                          <input 
                            type="file" 
                            accept="image/*" 
                            multiple
                            className="hidden" 
                            onChange={(e) => handleFileUpload(e.target.files, setImagesList)} 
                          />
                        </label>
                      </div>
                      <div className="flex justify-end gap-2 pt-4">
                        <button onClick={() => setEditingSection(null)} className="px-4 py-2 text-sm font-semibold hover:bg-muted rounded-xl transition-colors">Cancelar</button>
                        <button onClick={() => handleSaveSection(['imagesList'])} className="px-4 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-xl">Guardar</button>
                      </div>
                    </div>
                  ) : (
                    <>
                    {imagesList.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div 
                          className="col-span-1 md:col-span-2 h-96 rounded-3xl overflow-hidden border border-border shadow-sm cursor-pointer group relative"
                          onClick={() => { setCurrentImageIndex(0); setIsLightboxOpen(true); }}
                        >
                          <img src={getDisplayUrl(imagesList[0])} alt="Principal" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                        </div>
                        <div className="grid grid-rows-2 gap-4 h-96">
                          {imagesList.slice(1, 3).map((img, idx) => {
                            const isLastVisible = idx === 1;
                            const hasMore = imagesList.length > 3;
                            
                            return (
                              <div 
                                key={idx} 
                                className="h-full w-full rounded-3xl overflow-hidden border border-border shadow-sm cursor-pointer group relative"
                                onClick={() => { setCurrentImageIndex(idx + 1); setIsLightboxOpen(true); }}
                              >
                                <img src={getDisplayUrl(img)} alt={`Img ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                                
                                {isLastVisible && hasMore && (
                                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[2px]">
                                    <span className="text-white font-bold text-xl tracking-wide flex items-center gap-2">
                                      <ImageIcon className="w-5 h-5" /> +{imagesList.length - 3} Fotos
                                    </span>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                          {imagesList.length < 2 && <div className="bg-muted rounded-3xl border border-dashed border-border flex items-center justify-center text-muted-foreground text-sm cursor-pointer hover:bg-muted/80 transition-colors" onClick={() => setEditingSection('images')}><Plus className="w-4 h-4 mr-1"/> Añadir Imagen</div>}
                          {imagesList.length < 3 && imagesList.length >= 2 && <div className="bg-muted rounded-3xl border border-dashed border-border flex items-center justify-center text-muted-foreground text-sm cursor-pointer hover:bg-muted/80 transition-colors" onClick={() => setEditingSection('images')}><Plus className="w-4 h-4 mr-1"/> Añadir Imagen</div>}
                        </div>
                      </div>
                    ) : (
                      <div onClick={() => setEditingSection('images')} className="h-64 cursor-pointer bg-muted rounded-3xl border border-dashed border-border hover:bg-muted/80 transition-colors flex items-center justify-center text-muted-foreground flex-col gap-2">
                        <ImageIcon className="w-8 h-8 opacity-50" />
                        <span className="font-semibold text-primary">Añadir Imágenes Principales</span>
                        <p className="text-xs">Pega URLs o sube imágenes referenciales temporalmente</p>
                      </div>
                    )}
                    </>
                  )}
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="col-span-2 space-y-8">
                    {/* Acerca de la propiedad */}
                    <div className="bg-card border border-border rounded-3xl p-8 shadow-sm">
                      <div className="flex justify-between items-center mb-4 group">
                        <h3 className="text-2xl font-bold text-foreground">Acerca de la propiedad</h3>
                        {editingSection !== 'description' && (
                          <button onClick={() => setEditingSection('description')} className="opacity-0 group-hover:opacity-100 p-2 hover:bg-muted rounded-full transition-opacity"><Edit className="w-4 h-4 text-muted-foreground"/></button>
                        )}
                      </div>
                      
                      {editingSection === 'description' ? (
                        <div className="space-y-4">
                          <textarea 
                            rows={6}
                            value={formData.description}
                            onChange={e => setFormData({...formData, description: e.target.value})}
                            className="w-full p-3 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary outline-none resize-none"
                            autoFocus
                            placeholder="Detalla las amenidades, acabados y demás características..."
                          />
                          <div className="flex justify-between items-center">
                            <button 
                              onClick={async () => {
                                setIsGenerating(true);
                                const res = await generatePropertyDescription({ ...property, ...formData, dynamicFeatures });
                                if (res.success && res.description) {
                                  setFormData({ ...formData, description: res.description });
                                } else {
                                  alert('Error al generar la descripción');
                                }
                                setIsGenerating(false);
                              }}
                              disabled={isGenerating}
                              className={`text-sm font-semibold flex items-center gap-2 px-3 py-1.5 rounded-lg border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                              {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : "✨ Generar con IA"}
                            </button>
                            <div className="flex justify-end gap-2">
                              <button onClick={() => setEditingSection(null)} className="px-4 py-2 text-sm font-semibold hover:bg-muted rounded-xl transition-colors">Cancelar</button>
                              <button onClick={() => handleSaveSection(['description'])} className="px-4 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-xl flex items-center gap-2">
                                <Save className="w-4 h-4" /> Guardar
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="relative group cursor-text" onClick={() => setEditingSection('description')}>
                          <p className={`text-muted-foreground whitespace-pre-wrap leading-relaxed transition-all duration-300 ${!isDescriptionExpanded ? 'line-clamp-4' : ''}`}>
                            {property.description || "Añade una descripción aquí..."}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Ficha Técnica */}
                    <div className="bg-card border border-border rounded-3xl p-8 shadow-sm">
                      <div className="flex justify-between items-center mb-6 group">
                        <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
                          <FileText className="text-primary w-6 h-6" /> Ficha Técnica
                        </h3>
                        {editingSection !== 'specs' && (
                          <button onClick={() => setEditingSection('specs')} className="opacity-0 group-hover:opacity-100 p-2 hover:bg-muted rounded-full transition-opacity"><Edit className="w-4 h-4 text-muted-foreground"/></button>
                        )}
                      </div>
                      
                      {editingSection === 'specs' ? (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-xs font-semibold text-muted-foreground mb-1 block">Tipo de Inmueble</label>
                              <select value={formData.type} onChange={e=>setFormData({...formData, type: e.target.value})} className="w-full p-2 rounded-lg border border-border bg-background outline-none">
                                <option value="CASA">Casa</option>
                                <option value="DEPARTAMENTO">Departamento</option>
                                <option value="TERRENO">Terreno</option>
                                <option value="PROYECTO">Proyecto</option>
                              </select>
                            </div>
                            {formData.type !== 'TERRENO' && (
                              <>
                                <div>
                                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">Habitaciones</label>
                                  <input type="number" value={formData.bedrooms || ''} onChange={e=>setFormData({...formData, bedrooms: Number(e.target.value)})} className="w-full p-2 rounded-lg border border-border bg-background outline-none" />
                                </div>
                                <div>
                                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">Baños</label>
                                  <input type="number" value={formData.bathrooms || ''} onChange={e=>setFormData({...formData, bathrooms: Number(e.target.value)})} className="w-full p-2 rounded-lg border border-border bg-background outline-none" />
                                </div>
                              </>
                            )}
                            <div>
                              <label className="text-xs font-semibold text-muted-foreground mb-1 block">{formData.type === 'TERRENO' ? 'Área Total (m²)' : 'Construcción (m²)'}</label>
                              <input type="number" value={formData.area || ''} onChange={e=>setFormData({...formData, area: Number(e.target.value)})} className="w-full p-2 rounded-lg border border-border bg-background outline-none" />
                            </div>
                            <div>
                              <label className="text-xs font-semibold text-muted-foreground mb-1 block">Estacionamiento</label>
                              <input type="text" placeholder="Ej: 3 lugares" value={dynamicFeatures.parking || ''} onChange={e=>setDynamicFeatures({...dynamicFeatures, parking: e.target.value})} className="w-full p-2 rounded-lg border border-border bg-background outline-none" />
                            </div>
                            <div>
                              <label className="text-xs font-semibold text-muted-foreground mb-1 block">Antigüedad</label>
                              <input type="text" placeholder="Ej: A estrenar" value={dynamicFeatures.antiquity || ''} onChange={e=>setDynamicFeatures({...dynamicFeatures, antiquity: e.target.value})} className="w-full p-2 rounded-lg border border-border bg-background outline-none" />
                            </div>
                            <div className="md:col-span-2">
                              <label className="text-xs font-semibold text-muted-foreground mb-1 block">Unidad Independiente (Anexo)</label>
                              <input type="text" placeholder="Ej: Incluye una unidad de 2 ambientes..." value={formData.independentUnit || ''} onChange={e=>setFormData({...formData, independentUnit: e.target.value})} className="w-full p-2 rounded-lg border border-border bg-background outline-none" />
                            </div>
                            {formData.type === 'TERRENO' && (
                              <>
                                <div>
                                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">Metros de Frente</label>
                                  <input type="number" value={dynamicFeatures.frontMeters || ''} onChange={e=>setDynamicFeatures({...dynamicFeatures, frontMeters: e.target.value})} className="w-full p-2 rounded-lg border border-border bg-background outline-none" />
                                </div>
                                <div>
                                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">Metros de Fondo</label>
                                  <input type="number" value={dynamicFeatures.depthMeters || ''} onChange={e=>setDynamicFeatures({...dynamicFeatures, depthMeters: e.target.value})} className="w-full p-2 rounded-lg border border-border bg-background outline-none" />
                                </div>
                                <div>
                                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">Uso de Suelo</label>
                                  <input type="text" value={dynamicFeatures.zoning || ''} onChange={e=>setDynamicFeatures({...dynamicFeatures, zoning: e.target.value})} className="w-full p-2 rounded-lg border border-border bg-background outline-none" />
                                </div>
                              </>
                            )}
                            {formData.type === 'DEPARTAMENTO' && (
                              <>
                                <div>
                                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">Piso (Nivel)</label>
                                  <input type="number" value={dynamicFeatures.floorNumber || ''} onChange={e=>setDynamicFeatures({...dynamicFeatures, floorNumber: e.target.value})} className="w-full p-2 rounded-lg border border-border bg-background outline-none" />
                                </div>
                                <div>
                                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">Elevadores</label>
                                  <input type="number" value={dynamicFeatures.elevators || ''} onChange={e=>setDynamicFeatures({...dynamicFeatures, elevators: e.target.value})} className="w-full p-2 rounded-lg border border-border bg-background outline-none" />
                                </div>
                              </>
                            )}
                          </div>
                          <div className="flex justify-end gap-2 pt-2">
                            <button onClick={() => setEditingSection(null)} className="px-4 py-2 text-sm font-semibold hover:bg-muted rounded-xl transition-colors">Cancelar</button>
                            <button onClick={() => handleSaveSection(['type', 'bedrooms', 'bathrooms', 'area', 'dynamicFeatures', 'independentUnit'])} className="px-4 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-xl">Guardar</button>
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 group cursor-pointer" onClick={() => setEditingSection('specs')}>
                          <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-2xl border border-blue-200/60 bg-blue-50/50">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                              <Building className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs md:text-sm text-blue-900/60 font-medium truncate">Tipo de Inmueble</p>
                              <p className="font-bold text-blue-950 text-base md:text-lg capitalize truncate">{property.type.toLowerCase()}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-2xl border border-emerald-200/60 bg-emerald-50/50">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
                              <BedDouble className="w-5 h-5 md:w-6 md:h-6 text-emerald-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs md:text-sm text-emerald-900/60 font-medium truncate">Habitaciones</p>
                              <p className="font-bold text-emerald-950 text-base md:text-lg truncate">{property.bedrooms || '-'}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-2xl border border-cyan-200/60 bg-cyan-50/50">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-cyan-100 rounded-xl flex items-center justify-center shrink-0">
                              <Bath className="w-5 h-5 md:w-6 md:h-6 text-cyan-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs md:text-sm text-cyan-900/60 font-medium truncate">Baños</p>
                              <p className="font-bold text-cyan-950 text-base md:text-lg truncate">{property.bathrooms || '-'}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-2xl border border-amber-200/60 bg-amber-50/50">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                              <Maximize className="w-5 h-5 md:w-6 md:h-6 text-amber-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs md:text-sm text-amber-900/60 font-medium truncate">Construcción</p>
                              <p className="font-bold text-amber-950 text-base md:text-lg truncate">{property.area ? `${property.area} m²` : '-'}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-2xl border border-indigo-200/60 bg-indigo-50/50">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-100 rounded-xl flex items-center justify-center shrink-0">
                              <Car className="w-5 h-5 md:w-6 md:h-6 text-indigo-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs md:text-sm text-indigo-900/60 font-medium truncate">Estacionamiento</p>
                              <p className="font-bold text-indigo-950 text-base md:text-lg truncate">{dynamicFeatures.parking || '-'}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-2xl border border-rose-200/60 bg-rose-50/50">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-rose-100 rounded-xl flex items-center justify-center shrink-0">
                              <Calendar className="w-5 h-5 md:w-6 md:h-6 text-rose-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs md:text-sm text-rose-900/60 font-medium truncate">Antigüedad</p>
                              <p className="font-bold text-rose-950 text-base md:text-lg truncate">{dynamicFeatures.antiquity || '-'}</p>
                            </div>
                          </div>
                          
                          {property.independentUnit && (
                            <div className="mt-6 flex items-start gap-4 p-4 rounded-2xl border border-violet-200/60 bg-violet-50/50 col-span-2 md:col-span-3">
                              <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center shrink-0 mt-1">
                                <LinkIcon className="w-6 h-6 text-violet-600" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-sm text-violet-900/60 font-medium">Unidad Independiente</p>
                                <p className="font-bold text-violet-950 text-base">{property.independentUnit}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Amenidades */}
                    <div className="bg-card border border-border rounded-3xl p-8 shadow-sm">
                      <div className="flex justify-between items-center mb-6 group">
                        <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
                          <Waves className="text-primary w-6 h-6" /> Amenidades y Características
                        </h3>
                        {editingSection !== 'amenities' && (
                          <button onClick={() => setEditingSection('amenities')} className="opacity-0 group-hover:opacity-100 p-2 hover:bg-muted rounded-full transition-opacity"><Edit className="w-4 h-4 text-muted-foreground"/></button>
                        )}
                      </div>
                      
                      {editingSection === 'amenities' ? (
                        <div className="space-y-4">
                          <div className="flex flex-wrap gap-3">
                            {AVAILABLE_AMENITIES.map((amenity, idx) => {
                              const isSelected = (dynamicFeatures.amenities || []).includes(amenity.name);
                              const Icon = amenity.icon;
                              return (
                                <div 
                                  key={idx}
                                  onClick={() => {
                                    const current = dynamicFeatures.amenities || [];
                                    const newAmenities = isSelected 
                                      ? current.filter((a: string) => a !== amenity.name)
                                      : [...current, amenity.name];
                                    setDynamicFeatures({ ...dynamicFeatures, amenities: newAmenities });
                                  }}
                                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border cursor-pointer transition-all ${
                                    isSelected 
                                      ? 'bg-primary/10 border-primary text-primary' 
                                      : 'bg-muted border-border hover:bg-muted/80 text-muted-foreground'
                                  }`}
                                >
                                  <Icon className={`w-4 h-4 ${isSelected ? 'text-primary' : amenity.color}`} />
                                  <span className="text-sm font-medium">{amenity.name}</span>
                                </div>
                              );
                            })}
                          </div>
                          <div className="flex justify-end gap-2 mt-4">
                            <button onClick={() => setEditingSection(null)} className="px-4 py-2 text-sm font-semibold hover:bg-muted rounded-xl transition-colors">Cancelar</button>
                            <button onClick={() => handleSaveSection(['amenities'])} className="px-4 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-xl flex items-center gap-2">
                              <Save className="w-4 h-4" /> Guardar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-3">
                          {(dynamicFeatures.amenities || []).length > 0 ? (
                            (dynamicFeatures.amenities || []).map((amenityName: string, idx: number) => {
                              const amenity = AVAILABLE_AMENITIES.find(a => a.name === amenityName);
                              const Icon = amenity ? amenity.icon : CheckCircle2;
                              return (
                                <div key={idx} className="flex items-center gap-2 px-4 py-2 bg-muted rounded-xl border border-border">
                                  <Icon className={`w-4 h-4 ${amenity ? amenity.color : 'text-primary'}`} /> 
                                  <span className="text-sm font-medium">{amenityName}</span>
                                </div>
                              );
                            })
                          ) : (
                            <p className="text-muted-foreground text-sm italic">Sin amenidades seleccionadas. Haz clic en el ícono de editar para añadir.</p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Lugares Cercanos */}
                    <div className="bg-card border border-border rounded-3xl p-8 shadow-sm">
                      <div className="flex justify-between items-center mb-6 group">
                        <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
                          <MapPin className="text-primary w-6 h-6" /> Lugares Cercanos
                        </h3>
                        {editingSection !== 'nearbyPlaces' && (
                          <button onClick={() => setEditingSection('nearbyPlaces')} className="opacity-0 group-hover:opacity-100 p-2 hover:bg-muted rounded-full transition-opacity"><Edit className="w-4 h-4 text-muted-foreground"/></button>
                        )}
                      </div>
                      
                      {editingSection === 'nearbyPlaces' ? (
                        <div className="space-y-4">
                          {nearbyPlacesList.map((place, i) => (
                            <div key={i} className="flex flex-wrap gap-2 p-3 bg-muted/50 rounded-xl border border-border">
                              <input 
                                value={place.name} 
                                onChange={(e) => {
                                  const newList = [...nearbyPlacesList]; newList[i].name = e.target.value; setNearbyPlacesList(newList);
                                }} 
                                placeholder="Nombre (ej. Superama)" 
                                className="flex-1 min-w-[150px] p-2 rounded-lg border border-border bg-background outline-none text-sm" 
                              />
                              <input 
                                value={place.category} 
                                onChange={(e) => {
                                  const newList = [...nearbyPlacesList]; newList[i].category = e.target.value; setNearbyPlacesList(newList);
                                }} 
                                placeholder="Categoría (ej. Supermercados)" 
                                className="flex-1 min-w-[150px] p-2 rounded-lg border border-border bg-background outline-none text-sm" 
                              />
                              <input 
                                value={place.distance} 
                                onChange={(e) => {
                                  const newList = [...nearbyPlacesList]; newList[i].distance = e.target.value; setNearbyPlacesList(newList);
                                }} 
                                placeholder="Distancia (ej. 5 min caminando)" 
                                className="flex-1 min-w-[150px] p-2 rounded-lg border border-border bg-background outline-none text-sm" 
                              />
                              <button onClick={() => setNearbyPlacesList(nearbyPlacesList.filter((_, idx) => idx !== i))} className="p-2 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20"><Trash2 className="w-4 h-4"/></button>
                            </div>
                          ))}
                          <div className="flex gap-2 items-center">
                            <button onClick={() => setNearbyPlacesList([...nearbyPlacesList, {name: '', category: '', distance: ''}])} className="text-sm font-semibold text-primary flex items-center gap-1 hover:underline"><Plus className="w-4 h-4"/> Añadir Lugar</button>
                            <button onClick={async (e) => {
                              e.preventDefault(); 
                              try {
                                const res = await fetch(`/api/places?location=${encodeURIComponent(property.location)}`);
                                const data = await res.json();
                                if (data.results && data.results.length > 0) {
                                  setNearbyPlacesList([...nearbyPlacesList, ...data.results]);
                                } else {
                                  alert('No se encontraron lugares o falta configurar la API Key de Google.');
                                }
                              } catch (err) {
                                alert('Error al buscar lugares.');
                              }
                            }} className="text-sm font-semibold text-blue-600 flex items-center gap-1 hover:underline ml-4"><Globe className="w-4 h-4"/> Autocompletar con Google</button>
                          </div>
                          <div className="flex justify-end gap-2 pt-2">
                            <button onClick={() => setEditingSection(null)} className="px-4 py-2 text-sm font-semibold hover:bg-muted rounded-xl transition-colors">Cancelar</button>
                            <button onClick={() => handleSaveSection(['nearbyPlacesList'])} className="px-4 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-xl">Guardar</button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4 group cursor-pointer" onClick={() => setEditingSection('nearbyPlaces')}>
                          {nearbyPlacesList.length === 0 ? (
                            <div className="bg-muted border border-dashed border-border rounded-xl p-6 text-center text-muted-foreground hover:bg-muted/80 transition-colors">
                              <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
                              <span className="font-semibold text-primary">Añadir Lugares Cercanos</span>
                              <p className="text-xs">Agrega escuelas, centros comerciales u hospitales</p>
                            </div>
                          ) : (
                            <div className="grid gap-3">
                              {nearbyPlacesList.map((place, idx) => (
                                <div key={idx} className="flex justify-between items-center p-3 rounded-xl border border-border bg-background">
                                  <div>
                                    <p className="font-bold text-sm">{place.name}</p>
                                    <p className="text-xs text-muted-foreground">{place.category}</p>
                                  </div>
                                  <div className="text-xs font-semibold bg-muted px-2 py-1 rounded-md">
                                    {place.distance}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-8">
                    {/* Location Card */}
                    <div className="bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col gap-4">
                      <div>
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                          <MapPin className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex justify-between items-center w-full group">
                          <h4 className="font-bold text-lg mb-1">Ubicación</h4>
                          {editingSection !== 'location' && (
                            <button onClick={() => setEditingSection('location')} className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-muted rounded-full transition-opacity -mt-2"><Edit className="w-4 h-4 text-muted-foreground"/></button>
                          )}
                        </div>
                        {editingSection === 'location' ? (
                          <div className="space-y-3 w-full">
                            <input 
                              value={formData.location}
                              onChange={e => setFormData({...formData, location: e.target.value})}
                              className="w-full p-2 rounded-lg bg-background border border-border outline-none"
                              autoFocus
                            />
                            <div className="flex gap-2">
                              <button onClick={() => setEditingSection(null)} className="px-3 py-1.5 text-xs font-semibold hover:bg-muted rounded-lg">Cancelar</button>
                              <button onClick={() => handleSaveSection(['location'])} className="px-3 py-1.5 text-xs font-semibold bg-primary text-primary-foreground rounded-lg">Guardar</button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-muted-foreground cursor-pointer hover:text-primary transition-colors" onClick={() => setEditingSection('location')}>{property.location || 'Añadir ubicación...'}</p>
                        )}
                      </div>
                      
                      {property.location && (
                        <a 
                          href={`https://maps.google.com/?q=${encodeURIComponent(property.location)}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="w-full h-48 mt-2 rounded-2xl overflow-hidden border border-border block group relative shadow-sm"
                          title="Abrir en Google Maps"
                        >
                          <iframe 
                            width="100%" 
                            height="100%" 
                            frameBorder="0" 
                            scrolling="no" 
                            marginHeight={0} 
                            marginWidth={0} 
                            src={`https://maps.google.com/maps?width=100%25&height=100%25&hl=es&q=${encodeURIComponent(property.location)}&t=&z=15&ie=UTF8&iwloc=B&output=embed`}
                            className="pointer-events-none group-hover:scale-105 transition-transform duration-500 w-full h-full"
                          ></iframe>
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                            <div className="bg-primary text-primary-foreground px-4 py-2 rounded-xl font-bold opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 flex items-center gap-2 shadow-lg">
                              <MapPin className="w-4 h-4" /> Abrir en Google Maps
                            </div>
                          </div>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
        )}

        {activeTab === 'multimedia' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="grid grid--grid-cols-1 md:grid-cols-2 gap-8">
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
                  {videosList.map((url, i) => {
                    const isVideoData = url.startsWith('data:video');
                    const isImageData = url.startsWith('data:image');
                    const isData = url.startsWith('data:');
                    return (
                    <div key={i} className="flex gap-2 items-center">
                      {url && (
                        <div className="w-12 h-12 shrink-0 rounded-lg overflow-hidden border border-border bg-muted flex items-center justify-center">
                          {isVideoData ? (
                            <video src={url} className="w-full h-full object-cover" />
                          ) : isImageData || url.match(/\.(jpeg|jpg|gif|png)$/i) ? (
                            <img src={getDisplayUrl(url)} alt={`Preview ${i}`} className="w-full h-full object-cover" />
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
                          const newList = [...videosList]; newList[i] = e.target.value; setVideosList(newList);
                        }} placeholder="https://..." className="flex-1 p-3 rounded-xl border border-border outline-none" />
                      )}
                      <button onClick={() => setVideosList(videosList.filter((_, idx) => idx !== i))} className="p-3 bg-destructive/10 text-destructive rounded-xl"><Trash2 className="w-5 h-5"/></button>
                    </div>
                  )})}
                  <div className="flex gap-4">
                    <button onClick={() => setVideosList([...videosList, ''])} className="text-sm font-semibold text-primary flex items-center gap-1 hover:underline"><Plus className="w-4 h-4"/> Añadir URL</button>
                    <GoogleDrivePicker onFileSelect={(url) => setVideosList(prev => [...prev, url])} />
                    <label className="text-sm font-semibold text-primary flex items-center gap-1 hover:underline cursor-pointer">
                      <Upload className="w-4 h-4"/> Subir Archivo
                      <input 
                        type="file" 
                        accept="video/*,image/*,application/pdf"
                        multiple 
                        className="hidden" 
                        onChange={(e) => handleFileUpload(e.target.files, setVideosList)} 
                      />
                    </label>
                  </div>
                  <div className="flex justify-end gap-2 pt-4">
                    <button onClick={() => setEditingSection(null)} className="px-4 py-2 text-sm font-semibold hover:bg-muted rounded-xl transition-colors">Cancelar</button>
                    <button onClick={() => handleSaveSection(['videosList'])} className="px-4 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-xl">Guardar</button>
                  </div>
                </div>
              ) : (
                <>
                {videosList.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {videosList.map((url, i) => {
                      let embedUrl = url;
                      if (url.includes('youtube.com/watch?v=')) embedUrl = url.replace('watch?v=', 'embed/');
                      else if (url.includes('youtu.be/')) embedUrl = url.replace('youtu.be/', 'www.youtube.com/embed/');
                      
                      const isIframe = embedUrl.includes('youtube') || embedUrl.includes('matterport');
                      const isVideoFile = url.startsWith('data:video/') || url.match(/\.(mp4|webm|ogg)$/i);
                      const canExpand = isIframe || isVideoFile;
                      const isExpanded = expandedVideos.includes(i);

                      return (
                        <div key={i} className="flex flex-col gap-2">
                          {!isExpanded ? (
                            <button 
                              onClick={() => canExpand ? setExpandedVideos([...expandedVideos, i]) : window.open(url, '_blank')}
                              className="flex items-center justify-between p-3 bg-muted rounded-2xl hover:bg-primary/5 transition-colors group w-full text-left border border-transparent hover:border-primary/20"
                            >
                              <div className="flex items-center gap-3 overflow-hidden">
                                <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center shrink-0 shadow-sm">
                                  <div className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[8px] border-l-white border-b-[5px] border-b-transparent ml-1"></div>
                                </div>
                                <span className="text-sm font-medium truncate group-hover:text-primary transition-colors">Ver Video / Recorrido {i + 1}</span>
                              </div>
                              {canExpand ? (
                                <Maximize className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                              ) : (
                                <div className="text-xs font-bold text-red-600 bg-red-500/10 px-3 py-1 rounded-full">Abrir link</div>
                              )}
                            </button>
                          ) : (
                            <div className="animate-in fade-in slide-in-from-top-2 duration-300 space-y-2">
                              <div className="flex items-center justify-between gap-2 px-2">
                                <div className="flex items-center gap-2">
                                  <div className="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center shrink-0">
                                    <div className="w-0 h-0 border-t-[3px] border-t-transparent border-l-[4px] border-l-white border-b-[3px] border-b-transparent ml-0.5"></div>
                                  </div>
                                  <span className="font-bold text-sm text-foreground">Video / Recorrido {i + 1}</span>
                                </div>
                                <button 
                                  onClick={() => setExpandedVideos(expandedVideos.filter(id => id !== i))}
                                  className="text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1 bg-muted px-2 py-1 rounded-lg transition-colors"
                                >
                                  <X className="w-3 h-3" /> Contraer
                                </button>
                              </div>
                              <div className="w-full aspect-video rounded-2xl overflow-hidden border border-border shadow-sm bg-muted relative">
                                {isVideoFile ? (
                                  <video src={url} controls className="w-full h-full bg-black" />
                                ) : (
                                  <iframe src={embedUrl} className="w-full h-full" allowFullScreen></iframe>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div onClick={() => setEditingSection('videos')} className="cursor-pointer hover:bg-muted/80 transition-colors p-6 bg-muted rounded-2xl border border-dashed border-border flex flex-col items-center justify-center text-muted-foreground text-sm text-center">
                    <Building className="w-8 h-8 opacity-50 mb-2" />
                    <span className="font-semibold text-primary">Añadir Recorridos</span>
                    <p className="text-xs mt-1">Sube videos o enlaces a YouTube / Matterport</p>
                  </div>
                )}
                </>
              )}
              </div>

              {/* Presentations Card */}
              <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div className="flex justify-between items-center mb-4 group">
                  <h4 className="font-bold text-lg">Presentaciones y Brochures</h4>
                  {editingSection !== 'presentations' && (
                    <button onClick={() => setEditingSection('presentations')} className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-muted rounded-full transition-opacity"><Edit className="w-4 h-4 text-muted-foreground"/></button>
                  )}
                </div>
                
                {editingSection === 'presentations' ? (
                <div className="space-y-4">
                  {presentationsList.map((url, i) => (
                    <div key={i} className="flex gap-2">
                      <input value={url} onChange={(e) => {
                        const newList = [...presentationsList]; newList[i] = e.target.value; setPresentationsList(newList);
                      }} placeholder="https://..." className="flex-1 p-3 rounded-xl border border-border outline-none" />
                      <button onClick={() => setPresentationsList(presentationsList.filter((_, idx) => idx !== i))} className="p-3 bg-destructive/10 text-destructive rounded-xl"><Trash2 className="w-5 h-5"/></button>
                    </div>
                  ))}
                  <div className="flex gap-4">
                    <button onClick={() => setPresentationsList([...presentationsList, ''])} className="text-sm font-semibold text-primary flex items-center gap-1 hover:underline"><Plus className="w-4 h-4"/> Añadir URL</button>
                    <GoogleDrivePicker onFileSelect={(url) => setPresentationsList(prev => [...prev, url])} />
                    <label className="text-sm font-semibold text-primary flex items-center gap-1 hover:underline cursor-pointer">
                      <Upload className="w-4 h-4"/> Subir Archivo
                      <input 
                        type="file" 
                        accept="image/*,application/pdf" 
                        multiple
                        className="hidden" 
                        onChange={(e) => handleFileUpload(e.target.files, setPresentationsList)} 
                      />
                    </label>
                  </div>
                  <div className="flex justify-end gap-2 pt-4">
                    <button onClick={() => setEditingSection(null)} className="px-4 py-2 text-sm font-semibold hover:bg-muted rounded-xl transition-colors">Cancelar</button>
                    <button onClick={() => handleSaveSection(['presentationsList'])} className="px-4 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-xl">Guardar</button>
                  </div>
                </div>
              ) : (
                <>
                {presentationsList.length > 0 ? (
                  <div className="space-y-6">
                    {presentationsList.map((url, i) => {
                      let embedUrl = url;
                      if (url.includes('drive.google.com/file/d/')) {
                        embedUrl = url.replace('/view', '/preview');
                      } else if (url.includes('dropbox.com')) {
                        embedUrl = url.replace('dl=0', 'raw=1');
                      }

                      const isExpanded = expandedDocs.includes(i);

                      return (
                        <div key={i} className="flex flex-col gap-3">
                          {!isExpanded ? (
                            <button 
                              onClick={() => setExpandedDocs([...expandedDocs, i])}
                              className="flex items-center justify-between p-4 bg-muted rounded-2xl hover:bg-primary/5 transition-colors group w-full text-left border border-transparent hover:border-primary/20"
                            >
                              <div className="flex items-center gap-3 overflow-hidden">
                                <FileText className="w-5 h-5 text-primary shrink-0" />
                                <span className="text-base font-medium truncate group-hover:text-primary transition-colors">Visualizar Documento {i + 1}</span>
                              </div>
                              <Maximize className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                            </button>
                          ) : (
                            <div className="animate-in fade-in slide-in-from-top-2 duration-300 space-y-3">
                              <div className="flex items-center justify-between gap-2 px-2">
                                <div className="flex items-center gap-2">
                                  <FileText className="w-4 h-4 text-primary shrink-0" />
                                  <span className="font-bold text-foreground">Documento {i + 1}</span>
                                </div>
                                <button 
                                  onClick={() => setExpandedDocs(expandedDocs.filter(id => id !== i))}
                                  className="text-sm font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1 bg-muted px-3 py-1 rounded-lg transition-colors"
                                >
                                  <X className="w-4 h-4" /> Contraer
                                </button>
                              </div>
                              <div className="w-full h-80 rounded-2xl overflow-hidden border border-border bg-muted shadow-sm relative group">
                                <iframe 
                                  src={embedUrl} 
                                  className="w-full h-full border-none"
                                  title={`Documento ${i+1}`}
                                ></iframe>
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <a href={url} target="_blank" rel="noopener noreferrer" className="bg-white/90 backdrop-blur text-black text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-1 hover:bg-white">
                                    <Maximize className="w-3 h-3" /> Abrir en nueva pestaña
                                  </a>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div onClick={() => setEditingSection('presentations')} className="cursor-pointer hover:bg-muted/80 transition-colors p-6 bg-muted rounded-2xl border border-dashed border-border flex flex-col items-center justify-center text-muted-foreground text-sm text-center">
                    <FileText className="w-8 h-8 opacity-50 mb-2" />
                    <span className="font-semibold text-primary">Añadir Presentaciones</span>
                    <p className="text-xs mt-1">Sube PDFs, brochures o enlaces a Google Drive</p>
                  </div>
                )}
                </>
              )}
              </div>

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
                  {postersList.map((url, i) => (
                    <div key={i} className="flex gap-2">
                      <input value={url} onChange={(e) => {
                        const newList = [...postersList]; newList[i] = e.target.value; setPostersList(newList);
                      }} placeholder="https://..." className="flex-1 p-3 rounded-xl border border-border outline-none" />
                      <button onClick={() => setPostersList(postersList.filter((_, idx) => idx !== i))} className="p-3 bg-destructive/10 text-destructive rounded-xl"><Trash2 className="w-5 h-5"/></button>
                    </div>
                  ))}
                  <div className="flex gap-4">
                    <button onClick={() => setPostersList([...postersList, ''])} className="text-sm font-semibold text-primary flex items-center gap-1 hover:underline"><Plus className="w-4 h-4"/> Añadir URL</button>
                    <GoogleDrivePicker onFileSelect={(url) => setPostersList(prev => [...prev, url])} />
                    <label className="text-sm font-semibold text-primary flex items-center gap-1 hover:underline cursor-pointer">
                      <Upload className="w-4 h-4"/> Subir Archivo
                      <input 
                        type="file" 
                        accept="image/*,application/pdf" 
                        multiple
                        className="hidden" 
                        onChange={(e) => handleFileUpload(e.target.files, setPostersList)} 
                      />
                    </label>
                  </div>
                  <div className="flex justify-end gap-2 pt-4">
                    <button onClick={() => setEditingSection(null)} className="px-4 py-2 text-sm font-semibold hover:bg-muted rounded-xl transition-colors">Cancelar</button>
                    <button onClick={() => handleSaveSection(['postersList'])} className="px-4 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-xl">Guardar</button>
                  </div>
                </div>
              ) : (
                <>
                {postersList.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4">
                    {postersList.map((url, i) => (
                      <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="relative group rounded-xl overflow-hidden border border-border aspect-[3/4] block shadow-sm">
                        <img src={getDisplayUrl(url)} alt={`Afiche ${i}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                          <Maximize className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </a>
                    ))}
                  </div>
                ) : (
                  <div onClick={() => setEditingSection('posters')} className="cursor-pointer hover:bg-muted/80 transition-colors p-6 bg-muted rounded-2xl border border-dashed border-border flex flex-col items-center justify-center text-muted-foreground text-sm text-center">
                    <ImageIcon className="w-8 h-8 opacity-50 mb-2" />
                    <span className="font-semibold text-primary">Añadir Afiches</span>
                    <p className="text-xs mt-1">Sube renders, flyers o publicidad</p>
                  </div>
                )}
                </>
              )}
              </div>
              </div>
              
              <MortgageCalculator price={Number(property.price)} />
            </div>
          </div>
        )}

        {activeTab === 'comercial' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Column 1 */}
              <div className="space-y-8 h-fit">
                {/* Owner Data Card */}
                <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex justify-between items-center mb-4 group">
                    <h4 className="font-bold text-lg">Datos del Propietario</h4>
                    {editingSection !== 'owner' && (
                      <button onClick={() => setEditingSection('owner')} className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-muted rounded-full transition-opacity"><Edit className="w-4 h-4 text-muted-foreground"/></button>
                    )}
                  </div>
                  
                  {editingSection === 'owner' ? (
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground mb-1 block">Nombre del Propietario</label>
                        <input id="ownerNameInput" type="text" value={formData.ownerName} onChange={e=>setFormData({...formData, ownerName: e.target.value})} className="w-full p-2 rounded-lg border border-border bg-background outline-none" autoFocus />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground mb-1 block">Teléfono</label>
                        <input type="tel" value={formData.ownerPhone} onChange={e=>setFormData({...formData, ownerPhone: e.target.value})} className="w-full p-2 rounded-lg border border-border bg-background outline-none" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground mb-1 block">Correo Electrónico</label>
                        <input type="email" value={formData.ownerEmail} onChange={e=>setFormData({...formData, ownerEmail: e.target.value})} className="w-full p-2 rounded-lg border border-border bg-background outline-none" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground mb-1 block">Notas Internas</label>
                        <textarea rows={3} value={formData.ownerNotes} onChange={e=>setFormData({...formData, ownerNotes: e.target.value})} className="w-full p-2 rounded-lg border border-border bg-background outline-none resize-none" />
                      </div>
                      <div className="flex justify-end gap-2 pt-2">
                        <button onClick={() => setEditingSection(null)} className="px-4 py-2 text-sm font-semibold hover:bg-muted rounded-xl transition-colors">Cancelar</button>
                        <button onClick={() => handleSaveSection(['ownerName', 'ownerPhone', 'ownerEmail', 'ownerNotes'])} className="px-4 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-xl">Guardar</button>
                      </div>
                    </div>
                  ) : property.ownerName || property.ownerPhone || property.ownerEmail || property.ownerNotes ? (
                    <div className="space-y-4">
                      {property.ownerName && (
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Nombre</p>
                          <p className="font-medium">{property.ownerName}</p>
                        </div>
                      )}
                      {(property.ownerPhone || property.ownerEmail) && (
                        <div className="flex gap-4">
                          {property.ownerPhone && (
                            <a href={`tel:${property.ownerPhone}`} className="flex items-center gap-2 text-sm font-semibold text-primary bg-primary/10 px-3 py-1.5 rounded-lg hover:bg-primary/20 transition-colors">
                              <Phone className="w-4 h-4" /> {property.ownerPhone}
                            </a>
                          )}
                          {property.ownerEmail && (
                            <a href={`mailto:${property.ownerEmail}`} className="flex items-center gap-2 text-sm font-semibold text-primary bg-primary/10 px-3 py-1.5 rounded-lg hover:bg-primary/20 transition-colors">
                              <Mail className="w-4 h-4" /> Correo
                            </a>
                          )}
                        </div>
                      )}
                      {property.ownerNotes && (
                        <div className="bg-muted p-4 rounded-xl border border-border/50">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Notas Internas</p>
                          <p className="text-sm leading-relaxed">{property.ownerNotes}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-sm text-muted-foreground mb-4">No se han registrado los datos del propietario.</p>
                      <button
                        onClick={() => {
                          setEditingSection('owner');
                          setTimeout(() => {
                            const el = document.getElementById("ownerNameInput");
                            el?.scrollIntoView({ behavior: 'smooth' });
                            el?.focus();
                          }, 100);
                        }}
                        className="text-xs font-semibold text-primary bg-primary/10 px-4 py-2 rounded-xl hover:bg-primary/20 transition-colors"
                      >
                        Registrar Propietario
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Column 2 */}
              <div className="space-y-8">
                {/* Legal Docs */}
                <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                    <FolderLock className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex justify-between items-center mb-4 group">
                  <h4 className="font-bold text-lg">Documentos Legales</h4>
                  {editingSection !== 'legalDocs' && (
                    <button onClick={() => setEditingSection('legalDocs')} className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-muted rounded-full transition-opacity"><Edit className="w-4 h-4 text-muted-foreground"/></button>
                  )}
                </div>
                  
                  {editingSection === 'legalDocs' ? (
                <div className="space-y-4">
                  {legalDocsList.map((url, i) => (
                    <div key={i} className="flex gap-2">
                      <input value={url} onChange={(e) => {
                        const newList = [...legalDocsList]; newList[i] = e.target.value; setLegalDocsList(newList);
                      }} placeholder="https://..." className="flex-1 p-3 rounded-xl border border-border outline-none" />
                      <button onClick={() => setLegalDocsList(legalDocsList.filter((_, idx) => idx !== i))} className="p-3 bg-destructive/10 text-destructive rounded-xl"><Trash2 className="w-5 h-5"/></button>
                    </div>
                  ))}
                  <div className="flex gap-4">
                    <button onClick={() => setLegalDocsList([...legalDocsList, ''])} className="text-sm font-semibold text-primary flex items-center gap-1 hover:underline"><Plus className="w-4 h-4"/> Añadir URL</button>
                    <GoogleDrivePicker onFileSelect={(url) => setLegalDocsList(prev => [...prev, url])} />
                    <label className="text-sm font-semibold text-primary flex items-center gap-1 hover:underline cursor-pointer">
                      <Upload className="w-4 h-4"/> Subir Archivo
                      <input 
                        type="file" 
                        accept="image/*,application/pdf" 
                        multiple
                        className="hidden" 
                        onChange={(e) => handleFileUpload(e.target.files, setLegalDocsList)} 
                      />
                    </label>
                  </div>
                  <div className="flex justify-end gap-2 pt-4">
                    <button onClick={() => setEditingSection(null)} className="px-4 py-2 text-sm font-semibold hover:bg-muted rounded-xl transition-colors">Cancelar</button>
                    <button onClick={() => handleSaveSection(['legalDocsList'])} className="px-4 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-xl">Guardar</button>
                  </div>
                </div>
              ) : (
                <>
                {legalDocsList && legalDocsList.length > 0 ? (
                    <div className="space-y-3">
                      {legalDocsList.map((url, i) => (
                        <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 bg-muted rounded-2xl hover:bg-primary/5 transition-colors group">
                          <div className="flex items-center gap-3 overflow-hidden">
                            <FolderLock className="w-5 h-5 text-primary shrink-0" />
                            <span className="text-sm font-medium truncate group-hover:text-primary transition-colors">Documento Legal {i + 1}</span>
                          </div>
                        </a>
                      ))}
                    </div>
                  ) : (
                    <div onClick={() => setEditingSection('legalDocs')} className="cursor-pointer hover:bg-muted/80 transition-colors p-6 bg-muted rounded-2xl border border-dashed border-border flex flex-col items-center justify-center text-muted-foreground text-sm text-center">
                      <FolderLock className="w-8 h-8 opacity-50 mb-2" />
                      <span className="font-semibold text-primary">Añadir Documentos</span>
                      <p className="text-xs mt-1">Sube escrituras o planos del proyecto</p>
                    </div>
                  )}
                  </>
                )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {isLightboxOpen && imagesList.length > 0 && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-200">
          <button 
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 p-2 text-white/70 hover:text-white bg-black/20 hover:bg-black/40 rounded-full transition-colors z-[110]"
          >
            <X className="w-8 h-8" />
          </button>
          
          <button 
            onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(prev => (prev === 0 ? imagesList.length - 1 : prev - 1)); }}
            className="absolute left-4 md:left-8 p-3 text-white/70 hover:text-white bg-black/20 hover:bg-black/40 rounded-full transition-colors z-[110]"
          >
            <ArrowLeft className="w-6 h-6 md:w-8 md:h-8" />
          </button>

          <div className="w-full max-w-6xl max-h-[90vh] p-4 flex items-center justify-center relative" onClick={() => setIsLightboxOpen(false)}>
            <img 
              src={imagesList[currentImageIndex]} 
              alt={`Imagen ${currentImageIndex + 1}`} 
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl" 
              onClick={(e) => e.stopPropagation()}
            />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-md">
              {currentImageIndex + 1} / {imagesList.length}
            </div>
          </div>

          <button 
            onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(prev => (prev === imagesList.length - 1 ? 0 : prev + 1)); }}
            className="absolute right-4 md:right-8 p-3 text-white/70 hover:text-white bg-black/20 hover:bg-black/40 rounded-full transition-colors z-[110]"
          >
            <div className="rotate-180">
              <ArrowLeft className="w-6 h-6 md:w-8 md:h-8" />
            </div>
          </button>
        </div>
      )}
      
      {/* AI Lightbox (Simple) */}
      {aiLightboxUrl && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setAiLightboxUrl(null)}>
          <button 
            onClick={() => setAiLightboxUrl(null)}
            className="absolute top-6 right-6 p-2 text-white/70 hover:text-white bg-black/20 hover:bg-black/40 rounded-full transition-colors z-[110]"
          >
            <X className="w-8 h-8" />
          </button>
          
          <div className="w-full h-full max-w-6xl max-h-[90vh] p-4 md:p-12 flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            {aiLightboxUrl.includes('/preview') ? (
              <iframe src={aiLightboxUrl} className="w-full h-full border-0 rounded-xl shadow-2xl bg-white" title="Google Drive Preview" />
            ) : (
              <img 
                src={aiLightboxUrl} 
                alt="Previsualización" 
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" 
              />
            )}
          </div>
        </div>
      )}

      {/* Indicador de Progreso Flotante de IA */}
      {isAiLoading && (
        <div className="fixed bottom-6 right-6 bg-white dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 p-4 rounded-2xl shadow-2xl z-50 w-80 animate-in slide-in-from-bottom-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 rounded-full flex items-center justify-center animate-pulse">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-indigo-900 dark:text-indigo-100">IA Analizando...</h4>
              <p className="text-xs text-muted-foreground">{aiStatusText}</p>
            </div>
          </div>
          <div className="w-full bg-indigo-100 dark:bg-indigo-900/50 rounded-full h-2 mb-1 overflow-hidden relative">
            <div className="bg-indigo-600 h-2 rounded-full transition-all duration-500 ease-out relative" style={{ width: `${aiProgress}%` }}>
               <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite]"></div>
            </div>
          </div>
          <p className="text-[10px] text-right text-indigo-400 font-medium">{Math.floor(aiProgress)}%</p>
        </div>
      )}

    </div>
  );
}
