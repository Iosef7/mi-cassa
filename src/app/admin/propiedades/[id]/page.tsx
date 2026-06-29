"use client";

import React, { useState, useEffect } from 'react';
import { getProperty, updateProperty, createProject, generatePropertyDescription } from '../actions';

const AVAILABLE_AMENITIES = [
  { name: 'Piscina', icon: Waves, color: 'text-blue-500' },
  { name: 'Seguridad 24/7', icon: Shield, color: 'text-emerald-500' },
  { name: 'Gimnasio Equipado', icon: Dumbbell, color: 'text-amber-500' },
  { name: 'Áreas Verdes', icon: Trees, color: 'text-green-500' },
  { name: 'Estacionamiento', icon: Car, color: 'text-slate-500' },
  { name: 'Salón de Eventos', icon: Users, color: 'text-purple-500' },
  { name: 'Juegos Infantiles', icon: Activity, color: 'text-pink-500' },
];
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Edit, Save, Trash2, MapPin, Building, Image as ImageIcon, FileText, Plus, X, BedDouble, Bath, Maximize, Car, Calendar, Users, Phone, Mail, Briefcase, FolderLock, MessageCircle, ChevronDown, ChevronUp, ListTodo, Activity, CheckCircle2, Clock, Banknote, MessageSquare, BarChart3, Globe, Shield, Dumbbell, Waves, Trees, Link as LinkIcon, Copy, TrendingUp, BadgePercent, BadgeCheck , Info, Upload, GripVertical, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { GoogleDrivePicker } from '@/components/GoogleDrivePicker';


interface Property {
  id: string;
  title: string;
  description: string;
  price: string;
  type: string;
  status: string;
  location: string;
  bedrooms: number | null;
  bathrooms: number | null;
  area: number | null;
  images: string; // JSON string
  presentations: string | null; // JSON string
  nearbyPlaces?: string | null;
  dynamicFeatures?: string | null;
  independentUnit?: string | null;
  minPrice?: number | null;
  maxPrice?: number | null;
  availableUnits?: number | null;
  deliveryDate?: string | null;
  ownerName?: string | null;
  ownerPhone?: string | null;
  ownerEmail?: string | null;
  ownerNotes?: string | null;
  driveFolderId?: string | null;
  leads?: {
    id: string;
    name: string;
    email: string | null;
    phone: string;
    status: string;
    budget: number | null;
    notes?: string | null;
    preferences?: string | null;
    source?: string | null;
    requiresMortgage?: boolean;
    appointments?: {
      date: string;
    }[];
    calls?: {
      duration: number;
      summary?: string | null;
      sentiment?: string | null;
      createdAt: string;
    }[];
    messages?: {
      content: string;
      fromBot: boolean;
      createdAt: string;
    }[];
    tasks?: {
      id: string;
      title: string;
      status: string;
      dueDate?: string | null;
    }[];
    createdAt: string;
  }[];
}

const MortgageCalculator = ({ price }: { price: number }) => {
  const [downPayment, setDownPayment] = useState(price * 0.2);
  const [years, setYears] = useState(20);
  const interestRate = 5.06;

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
        
        <p className="text-xs text-muted-foreground text-center mt-6">
          Los cálculos son estimaciones y se basan en la tasa de interés promedio actual del mercado. Esta herramienta no constituye una oferta vinculante ni aprobación de crédito hipotecario.
        </p>
      </div>
    </div>
  );
};

// --- Lead Scoring Helper ---
const calculateLeadScore = (lead: any, propertyPrice: number) => {
  let score = 0;
  const breakdown = [];

  // 1. Status (Max 40)
  let statusScore = 0;
  if (lead.status === 'CERRADO_GANADO') statusScore = 40;
  else if (lead.status === 'FIRMA') statusScore = 35;
  else if (lead.status === 'NEGOCIACION') statusScore = 30;
  else if (lead.status === 'VISITA_AGENDADA') statusScore = 20;
  else if (lead.status === 'CONTACTADO') statusScore = 10;
  else statusScore = 5; // NUEVO
  score += statusScore;
  breakdown.push({ name: 'Progreso (Status)', score: statusScore, max: 40, desc: 'Avanza conforme el cliente pasa de Nuevo hasta Cierre.' });

  // 2. Budget (Max 30)
  let budgetScore = 0;
  if (!lead.budget) {
    budgetScore = 5;
  } else if (propertyPrice && Number(lead.budget) >= propertyPrice) {
    budgetScore = 30;
  } else if (propertyPrice && Number(lead.budget) >= propertyPrice * 0.9) {
    budgetScore = 20;
  } else {
    budgetScore = 10;
  }
  score += budgetScore;
  breakdown.push({ name: 'Presupuesto', score: budgetScore, max: 30, desc: 'Compara el presupuesto del cliente con el precio de la propiedad. Mayor presupuesto = mejor puntuación.' });

  // 3. Finance (Max 15)
  let financeScore = lead.requiresMortgage ? 5 : 15;
  score += financeScore;
  breakdown.push({ name: 'Financiamiento', score: financeScore, max: 15, desc: 'Compras de contado (sin crédito) obtienen mayor puntuación por rapidez de cierre.' });

  // 4. Source (Max 15)
  let sourceScore = 5;
  const src = (lead.source || '').toLowerCase();
  if (src.includes('referido') || src.includes('directo')) sourceScore = 15;
  else if (src.includes('whatsapp') || src.includes('web')) sourceScore = 10;
  score += sourceScore;
  breakdown.push({ name: 'Origen (Source)', score: sourceScore, max: 15, desc: 'Leads referidos u orgánicos suelen tener mayor intención de compra que los de anuncios.' });

  let summary = '';
  if (score >= 80) summary = '🔥 Prospecto Muy Caliente. Altamente calificado, excelente presupuesto y etapa avanzada. ¡Prioridad máxima!';
  else if (score >= 50) summary = '⭐ Prospecto Interesante. Buen perfil, pero requiere más seguimiento o empujar a la siguiente etapa del embudo.';
  else summary = '❄️ Prospecto Frío. Recién llegado o con presupuesto limitado. Mantener en nutrición a largo plazo.';

  return { total: score, breakdown, summary };
};

export default function PropertyDetailsPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [expandedDocs, setExpandedDocs] = useState<number[]>([]);
  const [expandedVideos, setExpandedVideos] = useState<number[]>([]);
  const [expandedLegalDocs, setExpandedLegalDocs] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState<'resumen' | 'multimedia' | 'comercial'>('resumen');
  const [expandedLeadId, setExpandedLeadId] = useState<string | null>(null);
  const [showScoreForLead, setShowScoreForLead] = useState<string | null>(null);
  const [editingLeadId, setEditingLeadId] = useState<string | null>(null);
  const [editLeadData, setEditLeadData] = useState<any>({});
  const [legalDocsList, setLegalDocsList] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Form states
  const [formData, setFormData] = useState<any>({});
  const [imagesList, setImagesList] = useState<string[]>([]);
  const [nearbyPlacesList, setNearbyPlacesList] = useState<{name: string, category: string, distance: string}[]>([]);
  const [dynamicFeatures, setDynamicFeatures] = useState<any>({});
  const [presentationsList, setPresentationsList] = useState<string[]>([]);
  const [plansList, setPlansList] = useState<string[]>([]);
  const [videosList, setVideosList] = useState<string[]>([]);
  const [postersList, setPostersList] = useState<string[]>([]);
  const [draggedImageIndex, setDraggedImageIndex] = useState<number | null>(null);

  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/properties/${id}`);
      let data;
      try {
        data = await res.json();
      } catch (e) {
        throw new Error("Failed to parse response");
      }
      if (!res.ok) throw new Error(data?.error || data?.details || "Property not found");
      
      setProperty(data);
      
      // Initialize form
      let parsedImages = [];
      let parsedPresentations = [];
      let parsedPlans = [];
      let parsedVideos = [];
      let parsedLegalDocs = [];
      let parsedPosters = [];
      let parsedNearby = [];
      let parsedDynamic = {};
      try { parsedImages = JSON.parse(data.images || "[]"); } catch (e) {}
      try { parsedNearby = JSON.parse(data.nearbyPlaces || "[]"); } catch (e) {}
      try { parsedDynamic = JSON.parse(data.dynamicFeatures || "{}"); } catch (e) {}
      try { 
        const p = JSON.parse(data.presentations || "[]");
        if (Array.isArray(p)) {
          parsedPresentations = p;
        } else if (p && typeof p === 'object') {
          parsedPresentations = p.docs || [];
          parsedPlans = p.plans || [];
          parsedVideos = p.videos || [];
          parsedLegalDocs = p.legalDocs || [];
          parsedPosters = p.posters || [];
        }
      } catch (e) {}

      setImagesList(Array.isArray(parsedImages) ? parsedImages : [data.images].filter(Boolean));
      setPresentationsList(Array.isArray(parsedPresentations) ? parsedPresentations : []);
      setPlansList(Array.isArray(parsedPlans) ? parsedPlans : []);
      setVideosList(Array.isArray(parsedVideos) ? parsedVideos : []);
      setLegalDocsList(Array.isArray(parsedLegalDocs) ? parsedLegalDocs : []);
      setPostersList(Array.isArray(parsedPosters) ? parsedPosters : []);
      setNearbyPlacesList(Array.isArray(parsedNearby) ? parsedNearby : []);
      setDynamicFeatures(parsedDynamic && typeof parsedDynamic === 'object' ? parsedDynamic : {});

      setFormData({
        title: data.title || '',
        description: data.description || '',
        price: data.price || '',
        type: data.type || 'CASA',
        location: data.location || '',
        bedrooms: data.bedrooms?.toString() || '',
        bathrooms: data.bathrooms?.toString() || '',
        area: data.area?.toString() || '',
        ownerName: data.ownerName || '',
        ownerPhone: data.ownerPhone || '',
        ownerEmail: data.ownerEmail || '',
        ownerNotes: data.ownerNotes || '',
        independentUnit: data.independentUnit || ''
      });

    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (files: FileList | null, listSetter: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (!files || files.length === 0) return;
    
    if (!property?.driveFolderId) {
      alert("Esta propiedad no tiene una carpeta de Drive vinculada. No se pueden subir archivos directamente. Crea una nueva propiedad para que se vincule automáticamente, o usa 'Vincular Carpeta' si se implementa.");
      return;
    }

    setIsUploading(true);
    try {
      const uploadedUrls: string[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('parentId', property.driveFolderId);
        
        const res = await fetch('/api/drive/upload', {
          method: 'POST',
          body: formData
        });
        
        if (res.ok) {
          const data = await res.json();
          uploadedUrls.push(data.webViewLink);
        } else {
          console.error("Error al subir archivo");
        }
      }
      
      listSetter(prev => [...prev, ...uploadedUrls]);
    } catch (err) {
      console.error(err);
      alert("Error al subir archivos a Drive.");
    } finally {
      setIsUploading(false);
    }
  };

  const syncFromDrive = async () => {
    if (!property?.driveFolderId) {
      alert("Esta propiedad no tiene una carpeta de Drive vinculada.");
      return;
    }
    
    setIsUploading(true);
    try {
      const res = await fetch(`/api/drive/files?folderId=${property.driveFolderId}`);
      if (res.ok) {
        const files = await res.json();
        
        const newImages: string[] = [];
        const newVideos: string[] = [];
        const newDocs: string[] = [];
        
        files.forEach((f: any) => {
          if (f.mimeType.startsWith('image/')) newImages.push(f.webViewLink);
          else if (f.mimeType.startsWith('video/')) newVideos.push(f.webViewLink);
          else newDocs.push(f.webViewLink);
        });
        
        // Solo sobreescribimos o agregamos, por ahora agregaremos
        if (newImages.length > 0) setImagesList(Array.from(new Set([...imagesList, ...newImages])));
        if (newVideos.length > 0) setVideosList(Array.from(new Set([...videosList, ...newVideos])));
        if (newDocs.length > 0) setPresentationsList(Array.from(new Set([...presentationsList, ...newDocs])));
        
        alert(`Sincronización completa. Se encontraron ${files.length} archivos en Drive.`);
      }
    } catch (err) {
      console.error(err);
      alert("Error al sincronizar con Drive.");
    } finally {
      setIsUploading(false);
    }
  };


  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        images: imagesList.filter(url => url.trim() !== ''),
        presentations: presentationsList.filter(url => url.trim() !== ''),
        plans: plansList.filter(url => url.trim() !== ''),
        videos: videosList.filter(url => url.trim() !== ''),
        legalDocs: legalDocsList.filter(url => url.trim() !== ''),
        posters: postersList.filter(url => url.trim() !== '')
      };

      await fetch(`/api/properties/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });
      fetchProperty();
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveLead = async (leadId: string) => {
    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editLeadData)
      });
      if (res.ok) {
        setEditingLeadId(null);
        fetchProperty(); // Refresh to get the updated lead data
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveSection = async (sectionFields: string[]) => {
    setIsSaving(true);
    try {
      const payload: any = {};
      sectionFields.forEach(f => {
        payload[f] = formData[f];
      });
      if (sectionFields.includes('imagesList')) payload.images = imagesList.filter(url => url.trim() !== '');
      if (sectionFields.includes('presentationsList')) payload.presentations = presentationsList.filter(url => url.trim() !== '');
      if (sectionFields.includes('plansList')) payload.plans = plansList.filter(url => url.trim() !== '');
      if (sectionFields.includes('videosList')) payload.videos = videosList.filter(url => url.trim() !== '');
      if (sectionFields.includes('legalDocsList')) payload.legalDocs = legalDocsList.filter(url => url.trim() !== '');
      if (sectionFields.includes('postersList')) payload.posters = postersList.filter(url => url.trim() !== '');
      if (sectionFields.includes('nearbyPlacesList')) payload.nearbyPlaces = nearbyPlacesList;
      if (sectionFields.includes('dynamicFeatures')) payload.dynamicFeatures = dynamicFeatures;

      await fetch(`/api/properties/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      setEditingSection(null);
      fetchProperty();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLeadStatusChange = async (leadId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setProperty(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            leads: prev.leads?.map(l => l.id === leadId ? { ...l, status: newStatus } : l)
          };
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleImageDragStart = (e: React.DragEvent, index: number) => {
    setDraggedImageIndex(index);
  };

  const handleImageDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault(); // Necessary to allow dropping
    
    // Auto-scroll logic
    const scrollContainer = document.getElementById('main-scroll-container');
    if (scrollContainer) {
      const scrollThreshold = 100;
      const scrollSpeed = 15;
      
      const rect = scrollContainer.getBoundingClientRect();
      
      if (e.clientY - rect.top < scrollThreshold) {
        scrollContainer.scrollTop -= scrollSpeed;
      } else if (rect.bottom - e.clientY < scrollThreshold) {
        scrollContainer.scrollTop += scrollSpeed;
      }
    }
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

  if (isLoading || !property) {
    return (
      <div className="flex-1 flex justify-center items-center bg-background">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div id="main-scroll-container" className="flex-1 flex flex-col h-full bg-background overflow-auto">
      
      {/* Header */}
      <div className="bg-card/80 backdrop-blur-md border-b border-border px-8 py-6 sticky top-0 z-20 shadow-sm animate-in">
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
                    <button onClick={() => handleSaveSection(['title', 'price'])} disabled={isSaving} className="p-1 hover:bg-primary/20 bg-primary/10 rounded-full" title="Guardar Cambios"><Save className="w-5 h-5 text-primary"/></button>
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
                  <button onClick={() => handleSaveSection(['title', 'price'])} disabled={isSaving} className="text-xs px-4 py-1 bg-primary text-primary-foreground rounded-lg font-bold shadow-sm hover:opacity-90 transition-opacity">Guardar Cambios</button>
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
          <div className="flex gap-2 bg-muted p-1 rounded-2xl shrink-0 overflow-x-auto">
            <button onClick={() => setActiveTab('resumen')} className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'resumen' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>Resumen</button>
            <button onClick={() => setActiveTab('multimedia')} className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'multimedia' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>Multimedia y Planos</button>
            <button onClick={() => setActiveTab('comercial')} className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'comercial' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>Comercial (CRM)</button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-8 w-full max-w-7xl mx-auto">
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
                              <img src={img} alt={`Preview ${i}`} className="w-full h-full object-cover pointer-events-none" />
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
                        <button onClick={() => setImagesList([...imagesList, ''])} className="text-sm font-semibold text-primary flex items-center gap-1 hover:underline"><Plus className="w-4 h-4"/> Añadir Imagen</button>
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
                        <button onClick={() => handleSaveSection(['imagesList'])} disabled={isSaving} className="px-4 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-xl">Guardar</button>
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
                      <img src={imagesList[0]} alt="Principal" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
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
                            <img src={img} alt={`Img ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
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
                      {imagesList.length < 2 && <div className="bg-muted rounded-3xl border border-dashed border-border flex items-center justify-center text-muted-foreground">Sin Imagen Adicional</div>}
                      {imagesList.length < 3 && imagesList.length >= 2 && <div className="bg-muted rounded-3xl border border-dashed border-border flex items-center justify-center text-muted-foreground">Sin Imagen Adicional</div>}
                    </div>
                  </div>
                ) : (
                  <div className="h-64 bg-muted rounded-3xl border border-dashed border-border flex items-center justify-center text-muted-foreground flex-col gap-2">
                    <ImageIcon className="w-8 h-8 opacity-50" />
                    No hay imágenes cargadas
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
                              <button onClick={() => handleSaveSection(['description'])} disabled={isSaving} className="px-4 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-xl flex items-center gap-2">
                                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Guardar
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="relative">
                          <p className={`text-muted-foreground whitespace-pre-wrap leading-relaxed transition-all duration-300 ${!isDescriptionExpanded ? 'line-clamp-4' : ''}`}>
                            {property.description || "Sin descripción proporcionada."}
                          </p>
                          {property.description && property.description.length > 200 && (
                            <button 
                              onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                              className="text-primary font-bold mt-3 text-sm hover:underline focus:outline-none flex items-center gap-1"
                            >
                              {isDescriptionExpanded ? 'Mostrar menos' : 'Leer descripción completa'}
                            </button>
                          )}
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
                                  <input type="number" value={formData.bedrooms} onChange={e=>setFormData({...formData, bedrooms: e.target.value})} className="w-full p-2 rounded-lg border border-border bg-background outline-none" />
                                </div>
                                <div>
                                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">Baños</label>
                                  <input type="number" value={formData.bathrooms} onChange={e=>setFormData({...formData, bathrooms: e.target.value})} className="w-full p-2 rounded-lg border border-border bg-background outline-none" />
                                </div>
                              </>
                            )}
                            <div>
                              <label className="text-xs font-semibold text-muted-foreground mb-1 block">{formData.type === 'TERRENO' ? 'Área Total (m²)' : 'Construcción (m²)'}</label>
                              <input type="number" value={formData.area} onChange={e=>setFormData({...formData, area: e.target.value})} className="w-full p-2 rounded-lg border border-border bg-background outline-none" />
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
                            <button onClick={() => handleSaveSection(['type', 'bedrooms', 'bathrooms', 'area', 'dynamicFeatures', 'independentUnit'])} disabled={isSaving} className="px-4 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-xl">Guardar</button>
                          </div>
                        </div>
                      ) : (() => {
                        let parsedDf: any = {};
                        try { parsedDf = property.dynamicFeatures ? JSON.parse(property.dynamicFeatures) : {}; } catch(e) {}
                        return (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
                        <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-2xl border border-blue-200/60 bg-blue-50/50">
                          <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                            <Building className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs md:text-sm text-blue-900/60 font-medium truncate" title="Tipo de Inmueble">Tipo de Inmueble</p>
                            <p className="font-bold text-blue-950 text-base md:text-lg capitalize truncate" title={property.type.toLowerCase()}>{property.type.toLowerCase()}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-2xl border border-emerald-200/60 bg-emerald-50/50">
                          <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
                            <BedDouble className="w-5 h-5 md:w-6 md:h-6 text-emerald-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs md:text-sm text-emerald-900/60 font-medium truncate" title="Habitaciones">Habitaciones</p>
                            <p className="font-bold text-emerald-950 text-base md:text-lg truncate" title={property.bedrooms?.toString() || '-'}>{property.bedrooms || '-'}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-2xl border border-cyan-200/60 bg-cyan-50/50">
                          <div className="w-10 h-10 md:w-12 md:h-12 bg-cyan-100 rounded-xl flex items-center justify-center shrink-0">
                            <Bath className="w-5 h-5 md:w-6 md:h-6 text-cyan-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs md:text-sm text-cyan-900/60 font-medium truncate" title="Baños">Baños</p>
                            <p className="font-bold text-cyan-950 text-base md:text-lg truncate" title={property.bathrooms?.toString() || '-'}>{property.bathrooms || '-'}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-2xl border border-amber-200/60 bg-amber-50/50">
                          <div className="w-10 h-10 md:w-12 md:h-12 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                            <Maximize className="w-5 h-5 md:w-6 md:h-6 text-amber-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs md:text-sm text-amber-900/60 font-medium truncate" title="Construcción">Construcción</p>
                            <p className="font-bold text-amber-950 text-base md:text-lg truncate" title={property.area ? `${property.area} m²` : '-'}>{property.area ? `${property.area} m²` : '-'}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-2xl border border-indigo-200/60 bg-indigo-50/50">
                          <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-100 rounded-xl flex items-center justify-center shrink-0">
                            <Car className="w-5 h-5 md:w-6 md:h-6 text-indigo-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs md:text-sm text-indigo-900/60 font-medium truncate" title="Estacionamiento">Estacionamiento</p>
                            <p className="font-bold text-indigo-950 text-base md:text-lg truncate" title={parsedDf.parking || '-'}>{parsedDf.parking || '-'}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-2xl border border-rose-200/60 bg-rose-50/50">
                          <div className="w-10 h-10 md:w-12 md:h-12 bg-rose-100 rounded-xl flex items-center justify-center shrink-0">
                            <Calendar className="w-5 h-5 md:w-6 md:h-6 text-rose-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs md:text-sm text-rose-900/60 font-medium truncate" title="Antigüedad">Antigüedad</p>
                            <p className="font-bold text-rose-950 text-base md:text-lg truncate" title={parsedDf.antiquity || '-'}>{parsedDf.antiquity || '-'}</p>
                          </div>
                        </div>
                        
                        {property.independentUnit && (
                          <div className="mt-6 flex items-start gap-4 p-4 rounded-2xl border border-violet-200/60 bg-violet-50/50">
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
                    )
                  })()}
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
                        <button onClick={() => handleSaveSection(['amenities'])} disabled={isSaving} className="px-4 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-xl flex items-center gap-2">
                          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Guardar
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
                            {/* In the future we can add the Google Auto-complete button here */}
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
                            <button onClick={() => handleSaveSection(['nearbyPlacesList'])} disabled={isSaving} className="px-4 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-xl">Guardar</button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {nearbyPlacesList.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No hay lugares cercanos registrados.</p>
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
                    {/* Detalles Financieros Card */}
                    <div className="bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-2">
                        <BadgePercent className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg mb-4">Detalles Financieros</h4>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center border-b border-border pb-3">
                            <span className="text-muted-foreground font-medium text-sm">Expensas / Mantenimiento</span>
                            <span className="font-bold">{formatPrice('2500')}</span>
                          </div>
                          <div className="flex justify-between items-center border-b border-border pb-3">
                            <span className="text-muted-foreground font-medium text-sm">Impuestos Anuales</span>
                            <span className="font-bold">{formatPrice('12000')}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Asesor Asignado Card */}
                    <div className="bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-muted border-2 border-primary/20 flex items-center justify-center overflow-hidden shrink-0">
                          <Users className="w-8 h-8 text-muted-foreground opacity-50" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1 flex items-center gap-1"><BadgeCheck className="w-3.5 h-3.5" /> Asesor Asignado</p>
                          <h4 className="font-bold text-lg leading-tight">Juan Pérez</h4>
                          <p className="text-sm text-muted-foreground">Especialista en Ventas</p>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <button className="flex-1 flex justify-center items-center gap-2 py-2 bg-green-500/10 text-green-600 rounded-xl text-xs font-bold hover:bg-green-500/20 transition-colors">
                          <MessageCircle className="w-4 h-4" /> WhatsApp
                        </button>
                        <button className="flex-1 flex justify-center items-center gap-2 py-2 bg-muted text-foreground rounded-xl text-xs font-bold hover:bg-muted/80 transition-colors">
                          <Phone className="w-4 h-4" /> Llamar
                        </button>
                      </div>
                    </div>

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
                              <button onClick={() => handleSaveSection(['location'])} disabled={isSaving} className="px-3 py-1.5 text-xs font-semibold bg-primary text-primary-foreground rounded-lg">Guardar</button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-muted-foreground">{property.location}</p>
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
                {property?.driveFolderId && (
                  <div className="mb-6 flex justify-end">
                    <button 
                      onClick={syncFromDrive}
                      disabled={isUploading}
                      className="bg-primary/10 text-primary hover:bg-primary/20 px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-colors"
                    >
                      {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Globe className="w-5 h-5" />}
                      {isUploading ? "Sincronizando..." : "Sincronizar todo desde Drive"}
                    </button>
                  </div>
                )}
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
                                <img src={url} alt={`Preview ${i}`} className="w-full h-full object-cover" />
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
                        <button onClick={() => handleSaveSection(['videosList'])} disabled={isSaving} className="px-4 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-xl">Guardar</button>
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
                      <div className="p-6 bg-muted rounded-2xl border border-dashed border-border flex items-center justify-center text-muted-foreground text-sm text-center">
                        <p>No se han subido recorridos virtuales para esta propiedad.</p>
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
                        <button onClick={() => handleSaveSection(['presentationsList'])} disabled={isSaving} className="px-4 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-xl">Guardar</button>
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
                      <p className="text-sm text-muted-foreground">No hay presentaciones cargadas.</p>
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
                        <button onClick={() => handleSaveSection(['postersList'])} disabled={isSaving} className="px-4 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-xl">Guardar</button>
                      </div>
                    </div>
                  ) : (
                    <>
{postersList.length > 0 ? (
                      <div className="grid grid-cols-2 gap-4">
                        {postersList.map((url, i) => (
                          <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="w-full aspect-[3/4] rounded-2xl overflow-hidden border border-border shadow-sm block group relative">
                            <img src={url} alt={`Afiche ${i+1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <span className="text-white font-bold text-xs px-3 py-1.5 bg-black/50 rounded-xl backdrop-blur-sm">Ampliar</span>
                            </div>
                          </a>
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

                {/* Planos Arquitectónicos */}
                <div className="bg-card border border-border rounded-3xl p-8 shadow-sm">
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
                      {plansList.map((url, i) => (
                        <div key={i} className="flex gap-2">
                          <input value={url} onChange={(e) => {
                            const newList = [...plansList]; newList[i] = e.target.value; setPlansList(newList);
                          }} placeholder="https://..." className="flex-1 p-3 rounded-xl border border-border outline-none" />
                          <button onClick={() => setPlansList(plansList.filter((_, idx) => idx !== i))} className="p-3 bg-destructive/10 text-destructive rounded-xl"><Trash2 className="w-5 h-5"/></button>
                        </div>
                      ))}
                      <div className="flex gap-4">
                        <button onClick={() => setPlansList([...plansList, ''])} className="text-sm font-semibold text-primary flex items-center gap-1 hover:underline"><Plus className="w-4 h-4"/> Añadir URL</button>
                        <GoogleDrivePicker onFileSelect={(url) => setPlansList(prev => [...prev, url])} />
                        <label className="text-sm font-semibold text-primary flex items-center gap-1 hover:underline cursor-pointer">
                          <Upload className="w-4 h-4"/> Subir Archivo
                          <input 
                            type="file" 
                            accept="image/*,application/pdf" 
                            multiple
                            className="hidden" 
                            onChange={(e) => handleFileUpload(e.target.files, setPlansList)} 
                          />
                        </label>
                      </div>
                      <div className="flex justify-end gap-2 pt-4">
                        <button onClick={() => setEditingSection(null)} className="px-4 py-2 text-sm font-semibold hover:bg-muted rounded-xl transition-colors">Cancelar</button>
                        <button onClick={() => handleSaveSection(['plansList'])} disabled={isSaving} className="px-4 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-xl">Guardar</button>
                      </div>
                    </div>
                  ) : (
                    <>
{plansList.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6">
                      {plansList.map((url, i) => {
                        const isImage = url.match(/\.(jpeg|jpg|gif|png)$/i) || url.includes('unsplash');
                        return (
                          <div key={i} className="flex flex-col gap-3">
                            {isImage ? (
                              <a href={url} target="_blank" rel="noopener noreferrer" className="w-full aspect-[4/3] rounded-2xl overflow-hidden border border-border shadow-sm block group relative">
                                <img src={url} alt={`Plano ${i+1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
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
                
                {/* Enlaces Públicos Card */}
                <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                    <LinkIcon className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-bold text-lg mb-4">Enlaces Públicos y Marketing</h4>
                  <div className="space-y-3">
                    <div className="flex flex-col gap-2 p-4 bg-muted rounded-2xl border border-border">
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Enlace Web Público</span>
                      <div className="flex gap-2">
                        <input type="text" readOnly value={`https://micassa.mx/propiedades/${id}`} className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none" />
                        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 transition-colors text-sm">
                          <Copy className="w-4 h-4" /> Copiar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
             </div>
            )}

            {activeTab === 'comercial' && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 space-y-8">
                {/* Metrics Card */}
                {(() => {
                  const leads = property.leads || [];
                  const statusCounts = leads.reduce((acc, l) => {
                    acc[l.status] = (acc[l.status] || 0) + 1;
                    return acc;
                  }, {} as Record<string, number>);
                  const sourceCounts = leads.reduce((acc, l) => {
                    const src = l.source || 'Desconocido';
                    acc[src] = (acc[src] || 0) + 1;
                    return acc;
                  }, {} as Record<string, number>);
                  
                  const total = leads.length;
                  const activeLeads = (statusCounts['VISITA_AGENDADA'] || 0) + (statusCounts['NEGOCIACION'] || 0) + (statusCounts['FIRMA'] || 0);
                  const closed = statusCounts['CERRADO_GANADO'] || 0;
                  const conversionRate = total > 0 ? ((activeLeads + closed) / total * 100).toFixed(1) : 0;

                  return (
                    <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                          <BarChart3 className="w-5 h-5 text-primary" />
                        </div>
                        <h4 className="font-bold text-lg">Métricas de Conversión</h4>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                        <div className="bg-muted p-4 rounded-2xl border border-border/50 text-center">
                          <p className="text-xs font-semibold text-muted-foreground mb-1">Prospectos</p>
                          <p className="text-3xl font-black text-foreground">{total}</p>
                        </div>
                        <div className="bg-muted p-4 rounded-2xl border border-border/50 text-center">
                          <p className="text-xs font-semibold text-muted-foreground mb-1">Activos</p>
                          <p className="text-3xl font-black text-blue-600">{activeLeads}</p>
                        </div>
                        <div className="bg-muted p-4 rounded-2xl border border-border/50 text-center">
                          <p className="text-xs font-semibold text-muted-foreground mb-1">Cerrados</p>
                          <p className="text-3xl font-black text-green-600">{closed}</p>
                        </div>
                        <div className="bg-muted p-4 rounded-2xl border border-border/50 text-center flex flex-col justify-center">
                          <p className="text-xs font-semibold text-muted-foreground mb-1">Conversión</p>
                          <p className="text-3xl font-black text-primary">{conversionRate}%</p>
                        </div>
                      </div>
                      {Object.keys(sourceCounts).length > 0 && (
                        <div className="mt-6 pt-6 border-t border-border">
                          <p className="text-sm font-semibold text-muted-foreground mb-3">Orígenes Principales</p>
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(sourceCounts).map(([src, count]) => (
                              <div key={src} className="flex items-center gap-2 bg-background border border-border px-3 py-1.5 rounded-lg text-xs font-medium">
                                <Globe className="w-3.5 h-3.5 text-muted-foreground" />
                                <span>{src}</span>
                                <span className="bg-muted px-1.5 py-0.5 rounded text-[10px] font-bold">{count}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Column 1: Flujo de Ventas */}
                  <div className="space-y-8 h-fit">
                    {/* Clientes Interesados Card */}
                    <div className="bg-card border border-border rounded-3xl p-5 shadow-sm h-fit">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                        <Users className="w-5 h-5 text-primary" />
                      </div>
                      <h4 className="font-bold text-base flex-1 flex justify-between items-center">
                        Clientes Interesados 
                        <span className="bg-primary/10 text-primary px-2.5 py-0.5 rounded-full text-xs">
                          {property.leads?.length || 0}
                        </span>
                      </h4>
                    </div>
                    
                    {property.leads && property.leads.length > 0 ? (
                      <div className="space-y-3">
                        {property.leads.map(lead => {
                          const isExpanded = expandedLeadId === lead.id;
                          let preferences: any = {};
                          try {
                            if (lead.preferences) preferences = JSON.parse(lead.preferences);
                          } catch (e) {}

                          const formatBudget = (val: number | null | undefined) => {
                            if (!val) return 'No especificado';
                            return new Intl.NumberFormat('en-IL', { style: 'currency', currency: 'ILS' }).format(val);
                          };

                          const nextAppointment = lead.appointments && lead.appointments.length > 0 
                            ? new Date(lead.appointments[0].date) 
                            : null;

                          const scoreData = calculateLeadScore(lead, Number(property.price));

                          return (
                            <div key={lead.id} className="p-3 bg-muted rounded-2xl flex flex-col gap-2 border border-border/50 hover:border-border transition-colors cursor-pointer" onClick={() => setExpandedLeadId(isExpanded ? null : lead.id)}>
                              <div className="flex justify-between items-start">
                                <div>
                                  <h5 className="font-bold text-sm text-foreground leading-tight flex items-center gap-1">
                                    {lead.name}
                                    <button 
                                      onClick={(e) => { e.stopPropagation(); setShowScoreForLead(showScoreForLead === lead.id ? null : lead.id); }}
                                      className="ml-2 px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-700 text-xs font-black flex items-center gap-1 border border-orange-200 hover:bg-orange-200 transition-all hover:scale-105"
                                    >
                                      🔥 {scoreData.total}%
                                    </button>
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setEditingLeadId(lead.id);
                                        setEditLeadData({
                                          name: lead.name,
                                          phone: lead.phone,
                                          email: lead.email || '',
                                          budget: lead.budget || '',
                                          notes: lead.notes || '',
                                          source: lead.source || '',
                                          requiresMortgage: lead.requiresMortgage || false,
                                        });
                                        setExpandedLeadId(lead.id);
                                      }}
                                      className="ml-1 text-muted-foreground hover:text-primary transition-colors"
                                      title="Editar"
                                    >
                                      <Edit className="w-3.5 h-3.5" />
                                    </button>
                                    {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground ml-1" /> : <ChevronDown className="w-4 h-4 text-muted-foreground ml-1" />}
                                  </h5>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[10px] font-medium text-muted-foreground">
                                      {new Date(lead.createdAt).toLocaleDateString('es-MX', {day: 'numeric', month: 'short', year: 'numeric'})}
                                    </span>
                                    {lead.requiresMortgage && (
                                      <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded-md flex items-center gap-0.5" title="Requiere Crédito">
                                        <Banknote className="w-3 h-3" /> Crédito
                                      </span>
                                    )}
                                    {lead.source && (
                                      <span className="text-[10px] font-semibold bg-secondary/30 text-secondary-foreground px-1.5 py-0.5 rounded-md border border-border/50">
                                        {lead.source}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <select 
                                  className="text-[10px] font-bold uppercase tracking-wider bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded-md border-none outline-none cursor-pointer appearance-none text-center hover:bg-yellow-200 transition-colors"
                                  value={lead.status}
                                  onClick={(e) => e.stopPropagation()}
                                  onChange={(e) => handleLeadStatusChange(lead.id, e.target.value)}
                                >
                                  <option value="NUEVO">NUEVO</option>
                                  <option value="CONTACTADO">CONTACTADO</option>
                                  <option value="VISITA_AGENDADA">VISITA_AGENDADA</option>
                                  <option value="NEGOCIACION">NEGOCIACION</option>
                                  <option value="FIRMA">FIRMA</option>
                                  <option value="CERRADO_GANADO">CERRADO_GANADO</option>
                                </select>
                              </div>

                              {/* Lead Scoring Popover / Panel */}
                              {showScoreForLead === lead.id && (
                                <div className="mt-2 p-3 bg-background border border-orange-200 rounded-xl shadow-sm animate-in slide-in-from-top-2 duration-200" onClick={(e) => e.stopPropagation()}>
                                  <div className="flex justify-between items-center mb-2">
                                    <h6 className="font-bold text-xs text-foreground flex items-center gap-1">
                                      <Activity className="w-3.5 h-3.5 text-orange-500" /> Desglose de Calificación (Scoring)
                                    </h6>
                                    <button onClick={() => setShowScoreForLead(null)} className="text-muted-foreground hover:text-foreground"><X className="w-3.5 h-3.5"/></button>
                                  </div>
                                  <div className="space-y-3 mt-3">
                                    {scoreData.breakdown.map((cat, idx) => (
                                      <div key={idx} className="space-y-1">
                                        <div className="flex justify-between text-[10px] font-semibold">
                                          <span className="flex items-center gap-1">
                                            {cat.name} 
                                            <span title={cat.desc} className="cursor-help text-muted-foreground hover:text-primary transition-colors">
                                              <Info className="w-3 h-3" />
                                            </span>
                                          </span>
                                          <span>{cat.score} / {cat.max}</span>
                                        </div>
                                        <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                                          <div className="bg-orange-500 h-1.5 rounded-full transition-all duration-1000" style={{ width: `${(cat.score / cat.max) * 100}%` }}></div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                  <div className="mt-4 pt-3 border-t border-border/50 bg-orange-50/50 p-2 rounded-lg">
                                    <p className="text-[10px] text-foreground font-medium leading-relaxed">
                                      {scoreData.summary}
                                    </p>
                                  </div>
                                </div>
                              )}
                              
                              <div className="flex gap-2 mt-2" onClick={(e) => e.stopPropagation()}>
                                <div className="flex-1 flex flex-col gap-1">
                                  <a href={`https://wa.me/${lead.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex justify-center items-center gap-1.5 py-1.5 bg-background border border-border rounded-xl text-xs font-semibold hover:border-green-500/50 hover:text-green-600 transition-colors">
                                    <MessageCircle className="w-3.5 h-3.5 text-green-500" /> WhatsApp
                                  </a>
                                  <span className="text-[10px] text-muted-foreground text-center select-all">{lead.phone}</span>
                                </div>
                                <div className="flex-1 flex flex-col gap-1">
                                  <a href={`tel:${lead.phone}`} className="flex justify-center items-center gap-1.5 py-1.5 bg-background border border-border rounded-xl text-xs font-semibold hover:border-primary/50 transition-colors">
                                    <Phone className="w-3.5 h-3.5 text-foreground" /> Llamar
                                  </a>
                                  <span className="text-[10px] text-muted-foreground text-center select-all">{lead.phone}</span>
                                </div>
                                {lead.email && (
                                  <div className="flex-1 flex flex-col gap-1 overflow-hidden">
                                    <a href={`mailto:${lead.email}`} className="flex justify-center items-center gap-1.5 py-1.5 bg-background border border-border rounded-xl text-xs font-semibold hover:border-blue-500/50 hover:text-blue-600 transition-colors">
                                      <Mail className="w-3.5 h-3.5 text-blue-500" /> Correo
                                    </a>
                                    <span className="text-[10px] text-muted-foreground text-center select-all truncate" title={lead.email}>{lead.email}</span>
                                  </div>
                                )}
                              </div>

                              {isExpanded && editingLeadId === lead.id ? (
                                <div className="mt-3 pt-3 border-t border-border space-y-4 animate-in fade-in slide-in-from-top-2 duration-200" onClick={(e) => e.stopPropagation()}>
                                  <div className="space-y-3">
                                    <input type="text" className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm" value={editLeadData.name} onChange={e => setEditLeadData({...editLeadData, name: e.target.value})} placeholder="Nombre" />
                                    <input type="tel" className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm" value={editLeadData.phone} onChange={e => setEditLeadData({...editLeadData, phone: e.target.value})} placeholder="Teléfono" />
                                    <input type="email" className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm" value={editLeadData.email} onChange={e => setEditLeadData({...editLeadData, email: e.target.value})} placeholder="Correo" />
                                    <input type="number" className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm" value={editLeadData.budget} onChange={e => setEditLeadData({...editLeadData, budget: e.target.value ? Number(e.target.value) : ''})} placeholder="Presupuesto" />
                                    <input type="text" className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm" value={editLeadData.source} onChange={e => setEditLeadData({...editLeadData, source: e.target.value})} placeholder="Origen (ej. Facebook Ads)" />
                                    <label className="flex items-center gap-2 text-sm text-foreground">
                                      <input type="checkbox" checked={editLeadData.requiresMortgage} onChange={e => setEditLeadData({...editLeadData, requiresMortgage: e.target.checked})} className="rounded border-border text-primary focus:ring-primary" />
                                      Requiere Crédito Hipotecario
                                    </label>
                                    <textarea className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm h-24 resize-none" value={editLeadData.notes} onChange={e => setEditLeadData({...editLeadData, notes: e.target.value})} placeholder="Notas del Asesor"></textarea>
                                  </div>
                                  <div className="flex justify-end gap-2 mt-4">
                                    <button onClick={() => setEditingLeadId(null)} className="px-4 py-2 text-sm font-semibold bg-muted text-muted-foreground rounded-xl hover:bg-muted/80 transition-colors">Cancelar</button>
                                    <button onClick={() => handleSaveLead(lead.id)} className="px-4 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors flex items-center gap-2">
                                      <Save className="w-4 h-4" /> Guardar
                                    </button>
                                  </div>
                                </div>
                              ) : isExpanded && (
                                <div className="mt-3 pt-3 border-t border-border space-y-4 animate-in fade-in slide-in-from-top-2 duration-200" onClick={(e) => e.stopPropagation()}>
                                  <div className="grid grid-cols-2 gap-3 text-xs">
                                    <div>
                                      <p className="text-muted-foreground font-semibold mb-0.5">Presupuesto</p>
                                      <p className="font-bold text-foreground">{formatBudget(lead.budget)}</p>
                                    </div>
                                    <div>
                                      <p className="text-muted-foreground font-semibold mb-0.5">Plazos</p>
                                      <p className="font-medium text-foreground">{preferences.termLengths || 'No especificado'}</p>
                                    </div>
                                    <div className="col-span-2">
                                      <p className="text-muted-foreground font-semibold mb-0.5">Próxima Reunión</p>
                                      <p className="font-medium text-foreground">
                                        {nextAppointment ? nextAppointment.toLocaleString('es-MX', { dateStyle: 'long', timeStyle: 'short' }) : 'Sin reuniones agendadas'}
                                      </p>
                                    </div>
                                  </div>
                                  
                                  {lead.notes && (
                                    <div className="bg-background rounded-xl p-3 border border-border/50">
                                      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Notas del Asesor</p>
                                      <p className="text-xs text-foreground leading-relaxed">{lead.notes}</p>
                                    </div>
                                  )}

                                  <div className="space-y-2">
                                    <p className="text-xs font-semibold text-foreground flex items-center gap-1.5"><Activity className="w-4 h-4 text-primary"/> Historial de Interacciones</p>
                                    <div className="max-h-48 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                                      {(!lead.calls?.length && !lead.messages?.length) && (
                                        <p className="text-[10px] text-muted-foreground italic">No hay interacciones registradas.</p>
                                      )}
                                      {[...(lead.calls || []).map(c => ({...c, type: 'call'})), ...(lead.messages || []).map(m => ({...m, type: 'message'}))]
                                        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                                        .map((interaction: any, i) => (
                                          <div key={i} className="bg-background rounded-xl p-2.5 border border-border/50 text-[10px]">
                                            <div className="flex justify-between items-center mb-1.5">
                                              <span className="font-bold flex items-center gap-1 text-xs">
                                                {interaction.type === 'call' ? <Phone className="w-3.5 h-3.5 text-blue-500" /> : <MessageSquare className="w-3.5 h-3.5 text-green-500" />}
                                                {interaction.type === 'call' ? 'Llamada' : 'Mensaje'}
                                              </span>
                                              <span className="text-muted-foreground">{new Date(interaction.createdAt).toLocaleString('es-MX', {day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit'})}</span>
                                            </div>
                                            {interaction.type === 'call' ? (
                                              <>
                                                <p className="text-foreground leading-tight mb-2 text-xs">{interaction.summary}</p>
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                  <span className="flex items-center gap-0.5"><Clock className="w-3 h-3"/> {Math.floor(interaction.duration/60)}m {interaction.duration%60}s</span>
                                                  {interaction.sentiment && <span className={`px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider ${interaction.sentiment === 'Positivo' ? 'bg-green-100 text-green-800' : interaction.sentiment === 'Negativo' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>{interaction.sentiment}</span>}
                                                </div>
                                              </>
                                            ) : (
                                              <p className="text-foreground leading-tight text-xs">
                                                {interaction.fromBot && <span className="font-bold text-primary mr-1">[Bot]</span>}
                                                {interaction.content}
                                              </p>
                                            )}
                                          </div>
                                        ))}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-4">No hay prospectos asignados a esta propiedad aún.</p>
                    )}
                  </div>

                  {/* Tasks Card */}
                    <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
                      <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                        <ListTodo className="w-6 h-6 text-primary" />
                      </div>
                      <h4 className="font-bold text-lg mb-4">Tareas Pendientes</h4>
                      {(() => {
                        const tasks = property.leads?.flatMap(l => (l.tasks || []).map(t => ({...t, leadName: l.name}))) || [];
                        const pendingTasks = tasks.filter(t => t.status !== 'COMPLETADO').sort((a, b) => new Date(a.dueDate || 0).getTime() - new Date(b.dueDate || 0).getTime());
                        
                        if (pendingTasks.length === 0) return <p className="text-sm text-muted-foreground">No hay tareas pendientes asociadas a estos prospectos.</p>;
                        
                        return (
                          <div className="space-y-3">
                            {pendingTasks.map((t, i) => (
                              <div key={i} className="bg-muted rounded-2xl p-3 flex items-start gap-3 group border border-transparent hover:border-border transition-colors">
                                <button className="mt-0.5 shrink-0 text-muted-foreground hover:text-green-500 transition-colors">
                                  <CheckCircle2 className="w-5 h-5" />
                                </button>
                                <div>
                                  <p className="text-sm font-semibold text-foreground leading-tight">{t.title}</p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[10px] font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded-md">{t.leadName}</span>
                                    {t.dueDate && (
                                      <span className={`text-[10px] font-medium flex items-center gap-0.5 ${new Date(t.dueDate) < new Date() ? 'text-red-500' : 'text-muted-foreground'}`}>
                                        <Clock className="w-3 h-3" /> {new Date(t.dueDate).toLocaleDateString('es-MX')}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Column 2: Admin y Cierre */}
                  <div className="space-y-8">
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
                      
                      {property.ownerName || property.ownerPhone || property.ownerEmail || property.ownerNotes ? (
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

                    {/* Legal Docs will go here */}
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
                        <button onClick={() => handleSaveSection(['legalDocsList'])} disabled={isSaving} className="px-4 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-xl">Guardar</button>
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
                        <p className="text-sm text-muted-foreground">No hay documentos legales adjuntos.</p>
                      )}
                      </>
                    )}
                    </div>

                    {/* Activity Log Card */}
                    <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
                      <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                        <TrendingUp className="w-6 h-6 text-primary" />
                      </div>
                      <h4 className="font-bold text-lg mb-4">Historial de la Propiedad</h4>
                      <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                        <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                          <div className="flex items-center justify-center w-6 h-6 rounded-full border-4 border-background bg-primary text-primary-foreground shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow"></div>
                          <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] p-3 bg-muted rounded-xl border border-border shadow-sm">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-xs text-foreground">Propiedad Publicada</span>
                              <span className="text-[10px] text-muted-foreground">Hace 2 días</span>
                            </div>
                            <p className="text-xs text-muted-foreground leading-tight">La propiedad fue dada de alta en el sistema exitosamente.</p>
                          </div>
                        </div>
                        <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                          <div className="flex items-center justify-center w-6 h-6 rounded-full border-4 border-background bg-green-500 text-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow"></div>
                          <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] p-3 bg-muted rounded-xl border border-border shadow-sm">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-xs text-foreground">Visita Completada</span>
                              <span className="text-[10px] text-muted-foreground">Hace 5 hrs</span>
                            </div>
                            <p className="text-xs text-muted-foreground leading-tight">Recorrido físico con cliente "Carlos Ruiz".</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <MortgageCalculator price={Number(property.price)} />
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
    </div>
  );
}
