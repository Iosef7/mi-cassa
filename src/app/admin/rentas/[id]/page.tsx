"use client";

import React, { useState, useEffect } from 'react';
import { createProject, generatePropertyDescription, getDisabledPropertyTabs, togglePropertyTabVisibility } from '../actions';
import { useSession } from 'next-auth/react';

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
import { ArrowLeft, Edit, Save, Trash2, MapPin, Building, Image as ImageIcon, FileText, Plus, X, BedDouble, Bath, Maximize, Car, Calendar, Users, Phone, Mail, Briefcase, FolderLock, MessageCircle, ChevronDown, ChevronUp, ListTodo, Activity, CheckCircle2, Clock, Banknote, MessageSquare, BarChart3, Globe, Shield, Dumbbell, Waves, Trees, Link as LinkIcon, Copy, TrendingUp, BadgePercent, BadgeCheck , Info, Upload, Paperclip, GripVertical, Loader2, Cloud, Sparkles, Send, Lock, Unlock, Sun, Compass, PawPrint, Coins, Layers, Home } from 'lucide-react';
import Link from 'next/link';
import { GoogleDrivePicker } from '@/components/GoogleDrivePicker';
import { PresentationRenderer } from '@/components/presentations/PresentationRenderer';
import { PropertyCommissions } from './PropertyCommissions';
import Image from 'next/image';
import { toast } from 'sonner';


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

const MortgageCalculator = React.memo(({ price }: { price: number }) => {
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
    <div className="bg-card border border-border rounded-3xl p-6 shadow-sm mt-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-4 h-4 bg-red-600 rotate-45 rounded-sm"></div>
        <h3 className="text-2xl font-bold text-foreground">Primer paso hacia tu nuevo hogar</h3>
      </div>
      
      <div className="space-y-8">
        <div className="space-y-8 p-5 md:p-7 bg-muted/20 rounded-3xl border border-border/60">
          <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-4 gap-4">
              <div>
                <span className="text-muted-foreground font-medium text-sm block mb-1">¿Cuál es tu capital inicial?</span>
                <span className="font-bold text-2xl md:text-3xl">{formatPrice(downPayment)}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={(e) => { e.preventDefault(); setDownPayment(price * 0.25); }}
                  className="px-3 py-1.5 bg-background hover:bg-muted text-foreground font-medium rounded-full text-xs transition-colors border border-border shadow-sm"
                >
                  25% ({formatPrice(price * 0.25)})
                </button>
                <button 
                  onClick={(e) => { e.preventDefault(); setDownPayment(price * 0.50); }}
                  className="px-3 py-1.5 bg-background hover:bg-muted text-foreground font-medium rounded-full text-xs transition-colors border border-border shadow-sm"
                >
                  50% ({formatPrice(price * 0.50)})
                </button>
              </div>
            </div>
            <input 
              type="range" 
              min={0} max={price} step={10000} 
              value={downPayment} 
              onChange={(e) => setDownPayment(Number(e.target.value))}
              className="w-full accent-red-600 h-2.5 bg-muted rounded-lg appearance-none cursor-pointer" 
            />
          </div>

          <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-4 gap-4">
              <div>
                <span className="text-muted-foreground font-medium text-sm block mb-1">¿A cuántos años quieres pagarlo?</span>
                <span className="font-bold text-2xl md:text-3xl">{years} Años</span>
              </div>
            </div>
            <input 
              type="range" 
              min={5} max={30} step={1} 
              value={years} 
              onChange={(e) => setYears(Number(e.target.value))}
              className="w-full accent-red-600 h-2.5 bg-muted rounded-lg appearance-none cursor-pointer" 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border bg-muted/10 rounded-3xl border border-border overflow-hidden shadow-sm">
          <div className="text-center p-6 flex flex-col justify-center">
            <p className="text-muted-foreground text-xs md:text-sm font-semibold mb-2 uppercase tracking-wider">Pago mensual</p>
            <p className="text-3xl md:text-4xl font-black text-red-600 truncate">{formatPrice(monthlyPayment)}</p>
          </div>
          <div className="text-center p-6 flex flex-col justify-center">
            <p className="text-muted-foreground text-xs md:text-sm font-semibold mb-2 uppercase tracking-wider">Tasa de interés</p>
            <p className="text-3xl md:text-4xl font-black text-foreground truncate">{interestRate}%</p>
          </div>
          <div className="text-center p-6 flex flex-col justify-center bg-muted/20">
            <p className="text-muted-foreground text-xs md:text-sm font-semibold mb-2 uppercase tracking-wider">Préstamo total</p>
            <p className="text-2xl md:text-3xl font-black text-foreground truncate">{formatPrice(principal)}</p>
          </div>
        </div>

        <div className="flex flex-col items-center mt-8 space-y-4">
          <button onClick={(e) => e.preventDefault()} className="bg-red-600 hover:bg-red-700 text-white px-10 py-4 rounded-full text-lg font-bold transition-all hover:scale-105 active:scale-95 shadow-xl shadow-red-600/20 w-full md:w-auto">
            Obtener Propuesta
          </button>
        </div>
        
        <p className="text-xs text-muted-foreground text-center mt-6">
          Los cálculos son estimaciones y se basan en la tasa de interés promedio actual del mercado. Esta herramienta no constituye una oferta vinculante ni aprobación de crédito hipotecario.
        </p>
      </div>
    </div>
  );
});

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

import { DriveImagePreview } from '@/components/DriveImagePreview';

export default function PropertyDetailsPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === 'ADMIN';
  const [disabledTabs, setDisabledTabs] = useState<string[]>([]);

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
  const [activeTab, setActiveTab] = useState<'resumen' | 'multimedia' | 'comercial' | 'presentacion' | 'comisiones'>('resumen');
  
  // Presentation Chat State
  const [chatMessages, setChatMessages] = useState<{ role: string, parts: any[] }[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatAttachments, setChatAttachments] = useState<{name: string, data: string, mimeType: string}[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false);
  const [selectedModel, setSelectedModel] = useState('Gemini 3.5 Flash');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [presentationDataPreview, setPresentationDataPreview] = useState<any>(null);
  const [expandedLeadId, setExpandedLeadId] = useState<string | null>(null);
  const [showScoreForLead, setShowScoreForLead] = useState<string | null>(null);
  const [editingLeadId, setEditingLeadId] = useState<string | null>(null);
  const [editLeadData, setEditLeadData] = useState<any>({});
  const [showAddLead, setShowAddLead] = useState(false);
  const [newLeadData, setNewLeadData] = useState({ name: '', phone: '', email: '', budget: '', notes: '' });
  const [allLeads, setAllLeads] = useState<any[]>([]);
  const [selectedExistingLeadId, setSelectedExistingLeadId] = useState('');
  const [addLeadMode, setAddLeadMode] = useState<'new' | 'existing'>('new');
  const [leadSearch, setLeadSearch] = useState('');
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskData, setNewTaskData] = useState({ title: '', leadId: '', dueDate: '' });
  const [legalDocsList, setLegalDocsList] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLeadDropdownOpen, setIsLeadDropdownOpen] = useState(false);
  
  // Preview scaling state
  const [previewScale, setPreviewScale] = useState(1);
  const previewObserverRef = React.useRef<ResizeObserver | null>(null);
  const previewContainerRef = React.useCallback((node: HTMLDivElement | null) => {
    if (previewObserverRef.current) {
      previewObserverRef.current.disconnect();
      previewObserverRef.current = null;
    }
    if (node !== null) {
      const observer = new ResizeObserver((entries) => {
        const { width } = entries[0].contentRect;
        setPreviewScale(width / 1920);
      });
      observer.observe(node);
      previewObserverRef.current = observer;
    }
  }, []);

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
  const [driveThumbnails, setDriveThumbnails] = useState<Record<string, string>>({});

  const [isUploading, setIsUploading] = useState(false);
  const [agentsList, setAgentsList] = useState<any[]>([]);

  const handleToggleTab = async (tabId: string) => {
    const isCurrentlyDisabled = disabledTabs.includes(tabId);
    setDisabledTabs(prev => isCurrentlyDisabled ? prev.filter(t => t !== tabId) : [...prev, tabId]);
    toast.success(isCurrentlyDisabled ? `Sección habilitada` : `Sección bloqueada por mantenimiento`);
    await togglePropertyTabVisibility(tabId, !isCurrentlyDisabled);
  };

  const renderTab = (id: string, label: React.ReactNode, activeClass: string) => {
    const isDisabled = disabledTabs.includes(id);
    
    if (isDisabled && !isAdmin) return null;

    return (
      <div className="relative group/tab" key={id}>
        <button 
          onClick={() => setActiveTab(id as any)} 
          className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === id ? activeClass : 'text-muted-foreground hover:text-foreground'}`}
        >
          {label}
          {isDisabled && <Lock className="w-4 h-4 text-red-500 ml-1" />}
        </button>
        {isAdmin && (
          <button
            onClick={() => handleToggleTab(id)}
            className={`absolute -top-2 -right-2 p-1 rounded-full bg-background border border-border shadow-sm opacity-0 group-hover/tab:opacity-100 transition-opacity hover:bg-muted z-10`}
            title={isDisabled ? "Habilitar sección para todos" : "Bloquear por mantenimiento"}
          >
            {isDisabled ? <Unlock className="w-3 h-3 text-green-600" /> : <Lock className="w-3 h-3 text-red-500" />}
          </button>
        )}
      </div>
    );
  };

  useEffect(() => {
    fetchProperty();
    fetch('/api/users').then(res => res.json()).then(data => {
      if (Array.isArray(data)) setAgentsList(data.filter((u: any) => u.role !== 'ADMIN'));
    }).catch(console.error);
    getDisabledPropertyTabs().then(tabs => setDisabledTabs(tabs));
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
      if (!res.ok) {
        console.error("API Error Details:", data?.details);
        throw new Error(data?.details || data?.error || "Property not found");
      }
      
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

      let parsedChatHistory = [];
      try { parsedChatHistory = data.dynamicFeatures && data.dynamicFeatures.presentationChatHistory ? data.dynamicFeatures.presentationChatHistory : []; } catch (e) {}
      
      setChatMessages(Array.isArray(parsedChatHistory) ? parsedChatHistory : []);
      if (parsedDynamic && (parsedDynamic as any).aiPresentation) {
        setPresentationDataPreview((parsedDynamic as any).aiPresentation);
      }

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
        independentUnit: data.independentUnit || '',
        driveFolderId: data.driveFolderId || ''
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
      toast.error("Esta propiedad no tiene una carpeta de Drive vinculada. No se pueden subir archivos directamente. Crea una nueva propiedad para que se vincule automáticamente, o usa 'Vincular Carpeta' si se implementa.");
      return;
    }

    setIsUploading(true);
    try {
      const uploadedUrls: string[] = [];
      const token = localStorage.getItem('google_drive_token');
      if (!token) {
        toast.error("Debes iniciar sesión con Google Drive primero para poder subir archivos. Haz clic en el botón 'Desde Drive' en cualquier sección para conectar tu cuenta.");
        setIsUploading(false);
        return;
      }

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('parentId', property.driveFolderId);
        
        const res = await fetch('/api/drive/upload', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + token
          },
          body: formData
        });
        
        if (res.ok) {
          const data = await res.json();
          // Como la API de Node.js no devuelve el ID directo sino un objeto con webViewLink y id, construimos el preview
          uploadedUrls.push(`https://drive.google.com/file/d/${data.id}/preview`);
        } else {
          const errText = await res.text();
          console.error("Error al subir archivo", errText);
          if (res.status === 401 || res.status === 403 || errText.includes('insufficient authentication scopes') || errText.includes('Insufficient Permission')) {
            localStorage.removeItem('google_drive_token');
            localStorage.removeItem('google_drive_token_expiry');
            toast.error("Los permisos de tu sesión de Google han caducado o son insuficientes. Por favor, haz clic nuevamente en 'Desde Drive' y asegúrate de aceptar TODOS los permisos solicitados.");
            setIsUploading(false);
            return;
          } else {
            toast.error(`Error del servidor al subir: ${errText}`);
          }
        }
      }
      
      listSetter(prev => [...prev, ...uploadedUrls]);
    } catch (err) {
      console.error(err);
      toast.error("Error al subir archivos a Drive.");
    } finally {
      setIsUploading(false);
    }
  };

  const syncFromDrive = async () => {
    if (!property?.driveFolderId) {
      toast.error("Esta propiedad no tiene una carpeta de Drive vinculada.");
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
        
        toast.success(`Sincronización completa. Se encontraron ${files.length} archivos en Drive.`);
      }
    } catch (err) {
      console.error(err);
      toast.error("Error al sincronizar con Drive.");
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

  const handleToggleAddLead = async () => {
    const nextState = !showAddLead;
    setShowAddLead(nextState);
    if (nextState) {
      setAddLeadMode('new');
      setSelectedExistingLeadId('');
      if (allLeads.length === 0) {
        try {
          const res = await fetch('/api/leads');
          if (res.ok) {
            const data = await res.json();
            setAllLeads(data);
          }
        } catch (error) {
          console.error(error);
        }
      }
    }
  };

  const handleCreateLead = async () => {
    setIsSaving(true);
    try {
      if (selectedExistingLeadId) {
        const res = await fetch(`/api/leads/${selectedExistingLeadId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ propertyId: property?.id })
        });
        if (res.ok) {
          setShowAddLead(false);
          setSelectedExistingLeadId('');
          fetchProperty();
        }
      } else {
        const res = await fetch('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...newLeadData, budget: newLeadData.budget ? Number(newLeadData.budget) : null, propertyId: property?.id })
        });
        if (res.ok) {
          setShowAddLead(false);
          setNewLeadData({ name: '', phone: '', email: '', budget: '', notes: '' });
          fetchProperty();
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateTask = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newTaskData, propertyId: property?.id })
      });
      if (res.ok) {
        setShowAddTask(false);
        setNewTaskData({ title: '', leadId: '', dueDate: '' });
        fetchProperty();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
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
      if (sectionFields.includes('imagesList')) payload.images = imagesList;
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

  const [isMovingFolder, setIsMovingFolder] = useState(false);

  const handleMoveFolder = async (newParentId: string) => {
    if (!property?.driveFolderId) return;
    const token = localStorage.getItem('google_drive_token');
    if (!token) {
      toast.error("Debes tener la sesión iniciada en Google Drive para mover carpetas. Asegúrate de tener la cuenta vinculada.");
      return;
    }
    
    setIsMovingFolder(true);
    try {
      const res = await fetch('/api/drive/move', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          folderId: property.driveFolderId,
          newParentId
        })
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error al mover la carpeta');
      }
      
      toast.success("¡Carpeta movida exitosamente en Google Drive!");
    } catch (e: any) {
      console.error(e);
      toast.error(`Error al mover la carpeta: ${e.message}`);
    } finally {
      setIsMovingFolder(false);
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

  const scrollRaf = React.useRef<number | null>(null);

  const handleDragScroll = (e: React.DragEvent) => {
    const container = document.getElementById('main-scroll-container');
    if (container && e.clientY > 0) {
      const { clientY } = e;
      const { top, bottom } = container.getBoundingClientRect();
      const scrollThreshold = 100; // pixels from edge to trigger scroll
      
      if (scrollRaf.current) cancelAnimationFrame(scrollRaf.current);
      
      scrollRaf.current = requestAnimationFrame(() => {
        if (clientY < top + scrollThreshold) {
          container.scrollTop -= 20; // Scroll up
        } else if (clientY > bottom - scrollThreshold) {
          container.scrollTop += 20; // Scroll down
        }
      });
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
      <div className="bg-card/80 backdrop-blur-md border-b border-border pt-4 pb-0 sticky top-0 z-20 shadow-sm animate-in flex flex-col gap-4 relative">
        <div className="absolute top-2 right-6 z-30">
          <button onClick={() => setIsHeaderCollapsed(!isHeaderCollapsed)} className="p-2 rounded-full bg-background border border-border hover:bg-muted text-muted-foreground transition-all shadow-sm" title={isHeaderCollapsed ? "Expandir" : "Contraer"}>
            {isHeaderCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
        {!isHeaderCollapsed && (
        <>
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 px-8 mt-2">
          <div className="flex items-start gap-4">
            <Link href="/admin/rentas" className="mt-1 p-2 rounded-full hover:bg-muted text-muted-foreground transition-colors shrink-0">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex flex-col gap-1">
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
                <div className="flex items-baseline gap-3">
                  <p className="text-primary font-bold text-xl">{formatPrice(property.price)}</p>
                  {property.area && property.area > 0 && !isNaN(Number(property.price)) && (
                    <p className="text-muted-foreground text-sm font-medium">
                      {formatPrice((Number(property.price) / property.area).toString())} / m²
                    </p>
                  )}
                </div>
              )}

              {/* Drive Folder */}
              <div className="mt-1">
                {editingSection === 'driveFolder' ? (
                  <div className="flex items-center gap-2">
                    <input 
                      type="text" 
                      placeholder="ID o Link de la carpeta" 
                      className="bg-background border border-border rounded-lg px-2 py-1 text-xs w-48 font-medium"
                      value={formData.driveFolderId}
                      onChange={(e) => {
                        let val = e.target.value;
                        const match = val.match(/folders\/([a-zA-Z0-9_-]+)/);
                        if (match) val = match[1];
                        setFormData({...formData, driveFolderId: val});
                      }}
                    />
                    <button onClick={() => setEditingSection(null)} className="p-1 hover:bg-muted rounded-full" title="Cancelar"><X className="w-4 h-4 text-muted-foreground"/></button>
                    <button onClick={() => handleSaveSection(['driveFolderId'])} disabled={isSaving} className="p-1 hover:bg-primary/20 bg-primary/10 rounded-full" title="Guardar"><Save className="w-4 h-4 text-primary"/></button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 group/drive">
                    {property.driveFolderId ? (
                      <a href={`https://drive.google.com/drive/folders/${property.driveFolderId}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs font-semibold bg-blue-50 text-blue-600 px-2 py-1 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors">
                        <Cloud className="w-3 h-3" /> Ver Carpeta Drive
                      </a>
                    ) : (
                      <span className="text-xs text-muted-foreground italic flex items-center gap-1 bg-muted px-2 py-1 rounded-md border border-border">
                        <Cloud className="w-3 h-3" /> Sin carpeta
                      </span>
                    )}
                    <button onClick={() => setEditingSection('driveFolder')} className="opacity-0 group-hover/drive:opacity-100 p-1 hover:bg-muted rounded-full transition-opacity text-muted-foreground" title="Cambiar Link de Carpeta">
                      <Edit className="w-3 h-3" />
                    </button>
                    {property.driveFolderId && (
                      <GoogleDrivePicker 
                        mimeTypes="application/vnd.google-apps.folder"
                        onFileSelect={(_, __, fileId) => {
                          if (fileId) {
                            toast('¿Mover carpeta?', {
                              description: '¿Seguro que deseas mover la carpeta actual a la nueva ubicación?',
                              action: {
                                label: 'Sí, mover',
                                onClick: () => handleMoveFolder(fileId)
                              },
                              cancel: {
                                label: 'Cancelar',
                                onClick: () => {}
                              }
                            });
                          }
                        }}
                        className={`opacity-0 group-hover/drive:opacity-100 px-2 py-1 bg-muted border border-border hover:bg-muted/80 rounded-md transition-opacity text-muted-foreground ${isMovingFolder ? 'animate-pulse pointer-events-none' : ''}`}
                      >
                        <span className="text-[10px] uppercase font-bold tracking-wider" title="Mover esta carpeta a otro lugar en Drive">
                          {isMovingFolder ? 'Moviendo...' : 'Mover'}
                        </span>
                      </GoogleDrivePicker>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Row */}
        <div className="px-8 mt-2 flex gap-2 border-t border-border/50 pt-3 pb-3 overflow-x-auto">
          <div className="flex gap-2 bg-muted p-1 rounded-2xl w-max">
            {renderTab('resumen', 'Resumen', 'bg-background shadow-sm text-foreground')}
            {renderTab('multimedia', 'Multimedia y Planos', 'bg-background shadow-sm text-foreground')}
            {renderTab('comercial', 'Comercial (CRM)', 'bg-background shadow-sm text-foreground')}
            {renderTab('presentacion', '✨ Presentación IA', 'bg-background shadow-sm text-primary')}
            {renderTab('comisiones', '💰 Comisiones', 'bg-background shadow-sm text-amber-600')}
          </div>
        </div>
        </>
        )}
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
                      {imagesList.map((img, i) => {
                        let slideLabel = "";
                        switch(i) {
                          case 0: slideLabel = "Diapo 2 (Interior)"; break;
                          case 1: slideLabel = "Diapo 3 (Distribución)"; break;
                          case 2: slideLabel = "Diapo 4 (Medida 1)"; break;
                          case 3: slideLabel = "Diapo 4 (Medida 2)"; break;
                          case 4: slideLabel = "Diapo 4 (Medida 3)"; break;
                          case 5: slideLabel = "Diapo 1 (Exterior Portada)"; break;
                          case 6: slideLabel = "Diapo 5 (Terrazas)"; break;
                          case 7: slideLabel = "Diapo 6 (Estilo Vida 1)"; break;
                          case 8: slideLabel = "Diapo 6 (Estilo Vida 2)"; break;
                          default: slideLabel = `Extra ${i + 1}`; break;
                        }
                        return (
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
                          
                          <span className="w-40 shrink-0 text-xs bg-primary/10 text-primary px-2 py-1 rounded-md font-bold text-center border border-primary/20">
                            {slideLabel}
                          </span>

                          {img && (
                            <div className="w-12 h-12 shrink-0 rounded-lg overflow-hidden border border-border bg-muted flex items-center justify-center relative">
                              <DriveImagePreview url={img} thumbnails={driveThumbnails} alt={`Preview ${i}`} className="w-full h-full object-cover pointer-events-none" />
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
                      )})}
                      <div className="flex gap-4">
                        <button onClick={() => setImagesList([...imagesList, ''])} className="text-sm font-semibold text-primary flex items-center gap-1 hover:underline"><Plus className="w-4 h-4"/> Añadir Imagen</button>
                        <GoogleDrivePicker onFileSelect={(url, thumb) => {
                          setImagesList(prev => [...prev, url]);
                          if (thumb) setDriveThumbnails(prev => ({...prev, [url]: thumb}));
                        }} mimeTypes="image/png,image/jpeg,image/jpg" />
                        <label className={`text-sm font-semibold flex items-center gap-1 cursor-pointer ${isUploading ? 'text-gray-400' : 'text-primary hover:underline'}`}>
                          {isUploading ? <Loader2 className="w-4 h-4 animate-spin"/> : <Upload className="w-4 h-4"/>} 
                          {isUploading ? 'Subiendo...' : 'Subir Archivo'}
                          <input 
                            type="file" 
                            accept="image/*" 
                            multiple
                            className="hidden" 
                            onChange={(e) => { handleFileUpload(e.target.files, setImagesList); e.target.value = ''; }} 
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
                      <DriveImagePreview url={imagesList[0]} thumbnails={driveThumbnails} alt="Principal" priority={true} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
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
                            <DriveImagePreview url={img} thumbnails={driveThumbnails} alt={`Img ${idx + 1}`} priority={true} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
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
                                  toast.error('Error al generar la descripción');
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
                            <div>
                              <label className="text-xs font-semibold text-muted-foreground mb-1 block">Piscina</label>
                              <input type="text" placeholder="Ej: Sí, privada" value={dynamicFeatures.pool || ''} onChange={e=>setDynamicFeatures({...dynamicFeatures, pool: e.target.value})} className="w-full p-2 rounded-lg border border-border bg-background outline-none" />
                            </div>
                            <div>
                              <label className="text-xs font-semibold text-muted-foreground mb-1 block">Balcón / Terraza</label>
                              <input type="text" placeholder="Ej: Balcón al frente" value={dynamicFeatures.balcony || ''} onChange={e=>setDynamicFeatures({...dynamicFeatures, balcony: e.target.value})} className="w-full p-2 rounded-lg border border-border bg-background outline-none" />
                            </div>
                            <div>
                              <label className="text-xs font-semibold text-muted-foreground mb-1 block">Patio / Jardín</label>
                              <input type="text" placeholder="Ej: Jardín trasero" value={dynamicFeatures.patio || ''} onChange={e=>setDynamicFeatures({...dynamicFeatures, patio: e.target.value})} className="w-full p-2 rounded-lg border border-border bg-background outline-none" />
                            </div>
                            <div>
                              <label className="text-xs font-semibold text-muted-foreground mb-1 block">Búnker / Mamad</label>
                              <input type="text" placeholder="Ej: Sí, de 10m²" value={dynamicFeatures.bunker || ''} onChange={e=>setDynamicFeatures({...dynamicFeatures, bunker: e.target.value})} className="w-full p-2 rounded-lg border border-border bg-background outline-none" />
                            </div>
                            <div>
                              <label className="text-xs font-semibold text-muted-foreground mb-1 block">Orientación</label>
                              <input type="text" placeholder="Ej: Norte / Sur / Este / Oeste" value={dynamicFeatures.orientation || ''} onChange={e=>setDynamicFeatures({...dynamicFeatures, orientation: e.target.value})} className="w-full p-2 rounded-lg border border-border bg-background outline-none" />
                            </div>
                            <div>
                              <label className="text-xs font-semibold text-muted-foreground mb-1 block">Estado</label>
                              <input type="text" placeholder="Ej: Excelente, A Remodelar" value={dynamicFeatures.condition || ''} onChange={e=>setDynamicFeatures({...dynamicFeatures, condition: e.target.value})} className="w-full p-2 rounded-lg border border-border bg-background outline-none" />
                            </div>
                            <div>
                              <label className="text-xs font-semibold text-muted-foreground mb-1 block">Mascotas Permitidas</label>
                              <input type="text" placeholder="Ej: Sí / No" value={dynamicFeatures.petFriendly || ''} onChange={e=>setDynamicFeatures({...dynamicFeatures, petFriendly: e.target.value})} className="w-full p-2 rounded-lg border border-border bg-background outline-none" />
                            </div>
                            <div>
                              <label className="text-xs font-semibold text-muted-foreground mb-1 block">Gastos Comunes / Expensas</label>
                              <input type="text" placeholder="Ej: ₪ 500 / mes" value={dynamicFeatures.hoaFees || ''} onChange={e=>setDynamicFeatures({...dynamicFeatures, hoaFees: e.target.value})} className="w-full p-2 rounded-lg border border-border bg-background outline-none" />
                            </div>
                            <div>
                              <label className="text-xs font-semibold text-muted-foreground mb-1 block">Niveles / Plantas</label>
                              <input type="text" placeholder="Ej: 2 plantas" value={dynamicFeatures.floors || ''} onChange={e=>setDynamicFeatures({...dynamicFeatures, floors: e.target.value})} className="w-full p-2 rounded-lg border border-border bg-background outline-none" />
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
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 group cursor-pointer" onClick={() => setEditingSection('specs')}>
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

                        {parsedDf.pool && (
                          <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-2xl border border-sky-200/60 bg-sky-50/50">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-sky-100 rounded-xl flex items-center justify-center shrink-0">
                              <Waves className="w-5 h-5 md:w-6 md:h-6 text-sky-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs md:text-sm text-sky-900/60 font-medium truncate" title="Piscina">Piscina</p>
                              <p className="font-bold text-sky-950 text-base md:text-lg truncate" title={parsedDf.pool}>{parsedDf.pool}</p>
                            </div>
                          </div>
                        )}

                        {parsedDf.balcony && (
                          <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-2xl border border-orange-200/60 bg-orange-50/50">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-100 rounded-xl flex items-center justify-center shrink-0">
                              <Sun className="w-5 h-5 md:w-6 md:h-6 text-orange-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs md:text-sm text-orange-900/60 font-medium truncate" title="Balcón / Terraza">Balcón / Terraza</p>
                              <p className="font-bold text-orange-950 text-base md:text-lg truncate" title={parsedDf.balcony}>{parsedDf.balcony}</p>
                            </div>
                          </div>
                        )}

                        {parsedDf.patio && (
                          <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-2xl border border-green-200/60 bg-green-50/50">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-xl flex items-center justify-center shrink-0">
                              <Trees className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs md:text-sm text-green-900/60 font-medium truncate" title="Patio / Jardín">Patio / Jardín</p>
                              <p className="font-bold text-green-950 text-base md:text-lg truncate" title={parsedDf.patio}>{parsedDf.patio}</p>
                            </div>
                          </div>
                        )}

                        {parsedDf.bunker && (
                          <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-2xl border border-zinc-200/60 bg-zinc-50/50">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-zinc-100 rounded-xl flex items-center justify-center shrink-0">
                              <Shield className="w-5 h-5 md:w-6 md:h-6 text-zinc-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs md:text-sm text-zinc-900/60 font-medium truncate" title="Búnker / Mamad">Búnker / Mamad</p>
                              <p className="font-bold text-zinc-950 text-base md:text-lg truncate" title={parsedDf.bunker}>{parsedDf.bunker}</p>
                            </div>
                          </div>
                        )}

                        {parsedDf.orientation && (
                          <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-2xl border border-teal-200/60 bg-teal-50/50">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-teal-100 rounded-xl flex items-center justify-center shrink-0">
                              <Compass className="w-5 h-5 md:w-6 md:h-6 text-teal-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs md:text-sm text-teal-900/60 font-medium truncate" title="Orientación">Orientación</p>
                              <p className="font-bold text-teal-950 text-base md:text-lg truncate" title={parsedDf.orientation}>{parsedDf.orientation}</p>
                            </div>
                          </div>
                        )}

                        {parsedDf.condition && (
                          <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-2xl border border-fuchsia-200/60 bg-fuchsia-50/50">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-fuchsia-100 rounded-xl flex items-center justify-center shrink-0">
                              <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-fuchsia-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs md:text-sm text-fuchsia-900/60 font-medium truncate" title="Estado">Estado</p>
                              <p className="font-bold text-fuchsia-950 text-base md:text-lg truncate" title={parsedDf.condition}>{parsedDf.condition}</p>
                            </div>
                          </div>
                        )}

                        {parsedDf.petFriendly && (
                          <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-2xl border border-yellow-200/60 bg-yellow-50/50">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-yellow-100 rounded-xl flex items-center justify-center shrink-0">
                              <PawPrint className="w-5 h-5 md:w-6 md:h-6 text-yellow-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs md:text-sm text-yellow-900/60 font-medium truncate" title="Mascotas">Mascotas</p>
                              <p className="font-bold text-yellow-950 text-base md:text-lg truncate" title={parsedDf.petFriendly}>{parsedDf.petFriendly}</p>
                            </div>
                          </div>
                        )}

                        {parsedDf.hoaFees && (
                          <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-2xl border border-emerald-200/60 bg-emerald-50/50">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
                              <Coins className="w-5 h-5 md:w-6 md:h-6 text-emerald-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs md:text-sm text-emerald-900/60 font-medium truncate" title="Expensas">Expensas</p>
                              <p className="font-bold text-emerald-950 text-base md:text-lg truncate" title={parsedDf.hoaFees}>{parsedDf.hoaFees}</p>
                            </div>
                          </div>
                        )}

                        {parsedDf.floors && (
                          <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-2xl border border-indigo-200/60 bg-indigo-50/50">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-100 rounded-xl flex items-center justify-center shrink-0">
                              <Layers className="w-5 h-5 md:w-6 md:h-6 text-indigo-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs md:text-sm text-indigo-900/60 font-medium truncate" title="Niveles">Niveles</p>
                              <p className="font-bold text-indigo-950 text-base md:text-lg truncate" title={parsedDf.floors}>{parsedDf.floors}</p>
                            </div>
                          </div>
                        )}
                        
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
                                  toast.error('No se encontraron lugares o falta configurar la API Key de Google.');
                                }
                              } catch (err) {
                                toast.error('Error al buscar lugares.');
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
                    <div className="bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col gap-4 group">
                      <div className="flex justify-between items-start">
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-2">
                          <BadgePercent className="w-6 h-6 text-primary" />
                        </div>
                        {editingSection !== 'financial' && (
                          <button onClick={() => setEditingSection('financial')} className="opacity-0 group-hover:opacity-100 p-2 hover:bg-muted rounded-full transition-opacity"><Edit className="w-4 h-4 text-muted-foreground"/></button>
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-lg mb-4">Detalles Financieros</h4>
                        {editingSection === 'financial' ? (
                          <div className="space-y-4">
                            <div>
                              <label className="text-xs text-muted-foreground font-semibold mb-1 block">Expensas / Mantenimiento</label>
                              <input type="number" value={dynamicFeatures.expenses || ''} onChange={(e) => setDynamicFeatures({...dynamicFeatures, expenses: e.target.value})} className="w-full p-3 rounded-xl border border-border outline-none" placeholder="2500" />
                            </div>
                            <div>
                              <label className="text-xs text-muted-foreground font-semibold mb-1 block">Impuestos Anuales</label>
                              <input type="number" value={dynamicFeatures.taxes || ''} onChange={(e) => setDynamicFeatures({...dynamicFeatures, taxes: e.target.value})} className="w-full p-3 rounded-xl border border-border outline-none" placeholder="12000" />
                            </div>
                            <div className="flex justify-end gap-2 mt-4 border-t border-border pt-4">
                              <button onClick={() => setEditingSection(null)} className="px-4 py-2 text-sm font-semibold hover:bg-muted rounded-xl transition-colors">Cancelar</button>
                              <button onClick={() => handleSaveSection(['dynamicFeatures'])} disabled={isSaving} className="px-4 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-xl">Guardar</button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div className="flex justify-between items-center border-b border-border pb-3">
                              <span className="text-muted-foreground font-medium text-sm">Expensas / Mantenimiento</span>
                              <span className="font-bold">{dynamicFeatures.expenses ? formatPrice(dynamicFeatures.expenses) : '-'}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-border pb-3">
                              <span className="text-muted-foreground font-medium text-sm">Impuestos Anuales</span>
                              <span className="font-bold">{dynamicFeatures.taxes ? formatPrice(dynamicFeatures.taxes) : '-'}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Asesor Asignado Card */}
                    <div className="bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col gap-4 group">
                      <div className="flex justify-end">
                        {editingSection !== 'agent' && (
                          <button onClick={() => setEditingSection('agent')} className="opacity-0 group-hover:opacity-100 p-2 hover:bg-muted rounded-full transition-opacity absolute"><Edit className="w-4 h-4 text-muted-foreground"/></button>
                        )}
                      </div>
                      {editingSection === 'agent' ? (
                        <div className="space-y-4">
                          <div>
                            <label className="text-xs text-muted-foreground font-semibold mb-1 block">Seleccionar Asesor del Equipo</label>
                            <select 
                              className="w-full p-3 rounded-xl border border-border outline-none bg-background"
                              onChange={(e) => {
                                const selected = agentsList.find(a => a.name === e.target.value);
                                if (selected) {
                                  setDynamicFeatures({...dynamicFeatures, agentName: selected.name, agentRole: selected.role === 'AGENT' ? 'Asesor Inmobiliario' : 'Especialista en Ventas'});
                                }
                              }}
                              value={agentsList.find(a => a.name === dynamicFeatures.agentName) ? dynamicFeatures.agentName : ""}
                            >
                              <option value="">Seleccionar un asesor...</option>
                              {agentsList.map((agent, idx) => (
                                <option key={idx} value={agent.name}>{agent.name}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="text-xs text-muted-foreground font-semibold mb-1 block">Nombre del Asesor (Personalizado)</label>
                            <input type="text" value={dynamicFeatures.agentName || ''} onChange={(e) => setDynamicFeatures({...dynamicFeatures, agentName: e.target.value})} className="w-full p-3 rounded-xl border border-border outline-none" placeholder="Juan Pérez" />
                          </div>
                          <div>
                            <label className="text-xs text-muted-foreground font-semibold mb-1 block">Rol / Especialidad</label>
                            <input type="text" value={dynamicFeatures.agentRole || ''} onChange={(e) => setDynamicFeatures({...dynamicFeatures, agentRole: e.target.value})} className="w-full p-3 rounded-xl border border-border outline-none" placeholder="Especialista en Ventas" />
                          </div>
                          <div>
                            <label className="text-xs text-muted-foreground font-semibold mb-1 block">WhatsApp (Número)</label>
                            <input type="text" value={dynamicFeatures.agentWhatsapp || ''} onChange={(e) => setDynamicFeatures({...dynamicFeatures, agentWhatsapp: e.target.value})} className="w-full p-3 rounded-xl border border-border outline-none" placeholder="+972501234567" />
                          </div>
                          <div>
                            <label className="text-xs text-muted-foreground font-semibold mb-1 block">Teléfono (Llamada)</label>
                            <input type="text" value={dynamicFeatures.agentPhone || ''} onChange={(e) => setDynamicFeatures({...dynamicFeatures, agentPhone: e.target.value})} className="w-full p-3 rounded-xl border border-border outline-none" placeholder="+972501234567" />
                          </div>
                          <div className="flex justify-end gap-2 mt-4 border-t border-border pt-4">
                            <button onClick={() => setEditingSection(null)} className="px-4 py-2 text-sm font-semibold hover:bg-muted rounded-xl transition-colors">Cancelar</button>
                            <button onClick={() => handleSaveSection(['dynamicFeatures'])} disabled={isSaving} className="px-4 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-xl">Guardar</button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-muted border-2 border-primary/20 flex items-center justify-center overflow-hidden shrink-0">
                              <Users className="w-8 h-8 text-muted-foreground opacity-50" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1 flex items-center gap-1"><BadgeCheck className="w-3.5 h-3.5" /> Asesor Asignado</p>
                              <h4 className="font-bold text-lg leading-tight">{dynamicFeatures.agentName || 'Sin Asignar'}</h4>
                              <p className="text-sm text-muted-foreground">{dynamicFeatures.agentRole || 'Asesor Inmobiliario'}</p>
                            </div>
                          </div>
                          <div className="flex gap-2 mt-2">
                            <a href={dynamicFeatures.agentWhatsapp ? `https://wa.me/${dynamicFeatures.agentWhatsapp.replace(/[^0-9]/g, '')}` : '#'} target="_blank" rel="noopener noreferrer" className={`flex-1 flex justify-center items-center gap-2 py-2 bg-green-500/10 text-green-600 rounded-xl text-xs font-bold transition-colors ${!dynamicFeatures.agentWhatsapp ? 'opacity-50 pointer-events-none' : 'hover:bg-green-500/20'}`}>
                              <MessageCircle className="w-4 h-4" /> WhatsApp
                            </a>
                            <a href={dynamicFeatures.agentPhone ? `tel:${dynamicFeatures.agentPhone.replace(/[^0-9+]/g, '')}` : '#'} className={`flex-1 flex justify-center items-center gap-2 py-2 bg-muted text-foreground rounded-xl text-xs font-bold transition-colors ${!dynamicFeatures.agentPhone ? 'opacity-50 pointer-events-none' : 'hover:bg-muted/80'}`}>
                              <Phone className="w-4 h-4" /> Llamar
                            </a>
                          </div>
                        </>
                      )}
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
                            <div className="w-12 h-12 shrink-0 rounded-lg overflow-hidden border border-border bg-muted flex items-center justify-center relative">
                              {isVideoData ? (
                                <video src={url} className="w-full h-full object-cover" />
                              ) : isImageData || url.match(/\.(jpeg|jpg|gif|png)$/i) || url.includes('drive.google.com') ? (
                                <DriveImagePreview url={url} thumbnails={driveThumbnails} alt={`Preview ${i}`} className="w-full h-full object-cover pointer-events-none" />
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
                        <GoogleDrivePicker onFileSelect={(url, thumb) => {
                          setVideosList(prev => [...prev, url]);
                          if (thumb) setDriveThumbnails(prev => ({...prev, [url]: thumb}));
                        }} />
                        <label className={`text-sm font-semibold flex items-center gap-1 cursor-pointer ${isUploading ? 'text-gray-400' : 'text-primary hover:underline'}`}>
                          {isUploading ? <Loader2 className="w-4 h-4 animate-spin"/> : <Upload className="w-4 h-4"/>} 
                          {isUploading ? 'Subiendo...' : 'Subir Archivo'}
                          <input 
                            type="file" 
                            accept="video/*,image/*,application/pdf"
                            multiple 
                            className="hidden" 
                            onChange={(e) => { handleFileUpload(e.target.files, setVideosList); e.target.value = ''; }} 
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
                          else if (url.includes('drive.google.com/file/d/')) embedUrl = url.replace(/\/view.*$/, '/preview');
                          
                          const isVideoFile = url.startsWith('data:video/') || url.match(/\.(mp4|webm|ogg)$/i);

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
                                    <button 
                                      onClick={(e) => { e.preventDefault(); window.open(url, '_blank'); }}
                                      className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 bg-primary/10 px-3 py-1.5 rounded-xl transition-colors"
                                    >
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
                        <p>No se han subido recorridos virtuales para esta propiedad.</p>
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
                      {postersList.map((url, i) => (
                        <div key={i} className="flex gap-2 items-center">
                          {url && (
                            <div className="w-12 h-12 shrink-0 rounded-lg overflow-hidden border border-border bg-muted flex items-center justify-center relative">
                              <DriveImagePreview url={url} thumbnails={driveThumbnails} alt={`Preview ${i}`} className="w-full h-full object-cover pointer-events-none" />
                            </div>
                          )}
                          <input value={url} onChange={(e) => {
                            const newList = [...postersList]; newList[i] = e.target.value; setPostersList(newList);
                          }} placeholder="https://..." className="flex-1 p-3 rounded-xl border border-border outline-none" />
                          <button onClick={() => setPostersList(postersList.filter((_, idx) => idx !== i))} className="p-3 bg-destructive/10 text-destructive rounded-xl"><Trash2 className="w-5 h-5"/></button>
                        </div>
                      ))}
                      <div className="flex gap-4">
                        <button onClick={() => setPostersList([...postersList, ''])} className="text-sm font-semibold text-primary flex items-center gap-1 hover:underline"><Plus className="w-4 h-4"/> Añadir URL</button>
                        <GoogleDrivePicker onFileSelect={(url, thumb) => {
                          setPostersList(prev => [...prev, url]);
                          if (thumb) setDriveThumbnails(prev => ({...prev, [url]: thumb}));
                        }} />
                        <label className={`text-sm font-semibold flex items-center gap-1 cursor-pointer ${isUploading ? 'text-gray-400' : 'text-primary hover:underline'}`}>
                          {isUploading ? <Loader2 className="w-4 h-4 animate-spin"/> : <Upload className="w-4 h-4"/>} 
                          {isUploading ? 'Subiendo...' : 'Subir Archivo'}
                          <input 
                            type="file" 
                            accept="image/*,application/pdf" 
                            multiple
                            className="hidden" 
                            onChange={(e) => { handleFileUpload(e.target.files, setPostersList); e.target.value = ''; }} 
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
                          <div key={i} onClick={() => window.open(url, '_blank')} className="w-full aspect-[3/4] rounded-2xl overflow-hidden border border-border shadow-sm block group relative cursor-pointer">
                            <DriveImagePreview url={url} thumbnails={driveThumbnails} alt={`Afiche ${i+1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
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
                <div className={`bg-card border border-border rounded-3xl shadow-sm h-fit max-h-min overflow-hidden ${plansList.length > 0 || editingSection === 'plans' ? 'p-8' : 'px-8 pt-8 pb-6'}`}>
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
                        <div key={i} className="flex gap-2 items-center">
                          {url && (
                            <div className="w-12 h-12 shrink-0 rounded-lg overflow-hidden border border-border bg-muted flex items-center justify-center relative">
                              <DriveImagePreview url={url} thumbnails={driveThumbnails} alt={`Preview ${i}`} className="w-full h-full object-cover pointer-events-none" />
                            </div>
                          )}
                          <input value={url} onChange={(e) => {
                            const newList = [...plansList]; newList[i] = e.target.value; setPlansList(newList);
                          }} placeholder="https://..." className="flex-1 p-3 rounded-xl border border-border outline-none" />
                          <button onClick={() => setPlansList(plansList.filter((_, idx) => idx !== i))} className="p-3 bg-destructive/10 text-destructive rounded-xl"><Trash2 className="w-5 h-5"/></button>
                        </div>
                      ))}
                      <div className="flex gap-4">
                        <button onClick={() => setPlansList([...plansList, ''])} className="text-sm font-semibold text-primary flex items-center gap-1 hover:underline"><Plus className="w-4 h-4"/> Añadir URL</button>
                        <GoogleDrivePicker onFileSelect={(url, thumb) => {
                          setPlansList(prev => [...prev, url]);
                          if (thumb) setDriveThumbnails(prev => ({...prev, [url]: thumb}));
                        }} />
                        <label className={`text-sm font-semibold flex items-center gap-1 cursor-pointer ${isUploading ? 'text-gray-400' : 'text-primary hover:underline'}`}>
                          {isUploading ? <Loader2 className="w-4 h-4 animate-spin"/> : <Upload className="w-4 h-4"/>} 
                          {isUploading ? 'Subiendo...' : 'Subir Archivo'}
                          <input 
                            type="file" 
                            accept="image/*,application/pdf" 
                            multiple
                            className="hidden" 
                            onChange={(e) => { handleFileUpload(e.target.files, setPlansList); e.target.value = ''; }} 
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
                                <DriveImagePreview url={url} thumbnails={driveThumbnails} alt={`Plano ${i+1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
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
                
                  {/* Presentations Card */}
                  <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex justify-between items-center mb-4 group">
                      <div className="flex items-center gap-4">
                        <h4 className="font-bold text-lg">Presentaciones y Brochures</h4>
                        <a href={`/presentacion/${property.id}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-gradient-to-r from-gray-900 to-gray-800 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md hover:shadow-lg hover:from-black hover:to-gray-900 transition-all whitespace-nowrap">
                          <FileText className="w-4 h-4" />
                          Ver Presentación
                        </a>
                      </div>
                      {editingSection !== 'presentations' && (
                        <button onClick={() => setEditingSection('presentations')} className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-muted rounded-full transition-opacity"><Edit className="w-4 h-4 text-muted-foreground"/></button>
                      )}
                    </div>
                    
                    {editingSection === 'presentations' ? (
                    <div className="space-y-4">
                      {presentationsList.map((url, i) => (
                        <div key={i} className="flex gap-2 items-center">
                          {url && (
                            <div className="w-12 h-12 shrink-0 rounded-lg overflow-hidden border border-border bg-muted flex items-center justify-center relative">
                              <DriveImagePreview url={url} thumbnails={driveThumbnails} alt={`Preview ${i}`} className="w-full h-full object-cover pointer-events-none" />
                            </div>
                          )}
                          <input value={url} onChange={(e) => {
                            const newList = [...presentationsList]; newList[i] = e.target.value; setPresentationsList(newList);
                          }} placeholder="https://..." className="flex-1 p-3 rounded-xl border border-border outline-none" />
                          <button onClick={() => setPresentationsList(presentationsList.filter((_, idx) => idx !== i))} className="p-3 bg-destructive/10 text-destructive rounded-xl"><Trash2 className="w-5 h-5"/></button>
                        </div>
                      ))}
                      <div className="flex gap-4">
                        <button onClick={() => setPresentationsList([...presentationsList, ''])} className="text-sm font-semibold text-primary flex items-center gap-1 hover:underline"><Plus className="w-4 h-4"/> Añadir URL</button>
                        <GoogleDrivePicker onFileSelect={(url, thumb) => {
                          setPresentationsList(prev => [...prev, url]);
                          if (thumb) setDriveThumbnails(prev => ({...prev, [url]: thumb}));
                        }} />
                        <label className={`text-sm font-semibold flex items-center gap-1 cursor-pointer ${isUploading ? 'text-gray-400' : 'text-primary hover:underline'}`}>
                          {isUploading ? <Loader2 className="w-4 h-4 animate-spin"/> : <Upload className="w-4 h-4"/>} 
                          {isUploading ? 'Subiendo...' : 'Subir Archivo'}
                          <input 
                            type="file" 
                            accept="image/*,application/pdf" 
                            multiple
                            className="hidden" 
                            onChange={(e) => { handleFileUpload(e.target.files, setPresentationsList); e.target.value = ''; }} 
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
                      <div className="space-y-3">
                        <p className="text-sm font-medium text-muted-foreground mb-2">Presentación Autogenerada</p>
                        <div className="w-full aspect-[16/9] rounded-2xl overflow-hidden border border-border shadow-sm bg-black relative group" ref={previewContainerRef}>
                          <div 
                            className="absolute top-0 left-0 w-[1920px] h-[1080px] origin-top-left pointer-events-none" 
                            style={{ transform: `scale(${previewScale})` }}
                          >
                            {imagesList[5] || imagesList[0] ? (
                              <DriveImagePreview url={imagesList[5] || imagesList[0]} alt="Exterior" thumbnails={driveThumbnails} className="absolute inset-0 w-full h-full object-cover" />
                            ) : (
                              <div className="absolute inset-0 bg-gray-900"></div>
                            )}
                            <Image src="/logo.png" alt="Mi Cassa" width={192} height={48} className="absolute top-12 left-24 object-contain mix-blend-screen invert grayscale opacity-90 z-20" />
                            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent w-[75%] z-0"></div>
                            <div className="absolute inset-0 flex flex-col justify-center px-24 z-10 text-white w-[65%]">
                              <div className="flex items-center gap-6 mb-6 mt-12">
                                <div className="w-16 h-px bg-[#bda871]"></div>
                                <p className="text-[#bda871] font-medium text-sm uppercase tracking-[0.25em]">Dos Residencias a Medida</p>
                              </div>
                              <h1 className="text-[4.5rem] font-serif font-bold leading-[1.1] mb-8">
                                Su próximo hogar en el corazón de la Ciudad Santa
                              </h1>
                              <p className="text-xl text-gray-300 font-light leading-relaxed max-w-xl">
                                Diseñados para la vida familiar, la tradición y el confort en Jerusalén. Encuentre la propiedad ideal adaptada a sus necesidades.
                              </p>
                            </div>
                          </div>
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors pointer-events-none"></div>
                          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 z-10">
                            <a href={`/presentacion/${property.id}`} target="_blank" rel="noopener noreferrer" className="bg-white/90 backdrop-blur text-black text-xs font-bold px-3 py-2 rounded-xl shadow-sm flex items-center gap-2 hover:bg-white transition-colors pointer-events-auto">
                              <Maximize className="w-4 h-4" /> Ver en pantalla completa
                            </a>
                          </div>
                        </div>
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
                      <h4 className="font-bold text-base flex-1 flex items-center gap-2">
                        Clientes Interesados 
                        <span className="bg-primary/10 text-primary px-2.5 py-0.5 rounded-full text-xs">
                          {property.leads?.length || 0}
                        </span>
                      </h4>
                      <button onClick={handleToggleAddLead} className="p-1.5 hover:bg-muted rounded-full transition-colors">
                        {showAddLead ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5 text-primary" />}
                      </button>
                    </div>

                    {showAddLead && (
                      <div className="mb-4 p-4 bg-muted/50 rounded-2xl border border-border space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                        <h5 className="font-bold text-sm text-foreground">Añadir Prospecto a Propiedad</h5>
                        
                        <div className="flex gap-2 p-1 bg-background rounded-xl border border-border">
                          <button 
                            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${addLeadMode === 'new' ? 'bg-primary text-primary-foreground shadow-sm' : 'hover:bg-muted text-muted-foreground'}`}
                            onClick={() => { setAddLeadMode('new'); setSelectedExistingLeadId(''); }}
                          >
                            Crear Nuevo
                          </button>
                          <button 
                            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${addLeadMode === 'existing' ? 'bg-primary text-primary-foreground shadow-sm' : 'hover:bg-muted text-muted-foreground'}`}
                            onClick={() => setAddLeadMode('existing')}
                          >
                            Prospecto Existente
                          </button>
                        </div>

                        {addLeadMode === 'existing' ? (
                          <div className="space-y-3">
                            <input 
                              type="text" 
                              placeholder="Buscar por nombre o teléfono..." 
                              className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm"
                              value={leadSearch}
                              onChange={(e) => setLeadSearch(e.target.value)}
                            />
                            <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
                              {allLeads.filter(l => l.name.toLowerCase().includes(leadSearch.toLowerCase()) || (l.phone && l.phone.includes(leadSearch))).map(l => (
                                <div 
                                  key={l.id} 
                                  onClick={() => setSelectedExistingLeadId(l.id)}
                                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${selectedExistingLeadId === l.id ? 'border-primary bg-primary/5 ring-1 ring-primary/20' : 'border-border bg-background hover:bg-muted/50'}`}
                                >
                                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${selectedExistingLeadId === l.id ? 'border-primary bg-primary' : 'border-muted-foreground/30'}`}>
                                    {selectedExistingLeadId === l.id && <div className="w-1.5 h-1.5 bg-primary-foreground rounded-full" />}
                                  </div>
                                  <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0 text-sm">
                                    {l.name.substring(0, 1).toUpperCase()}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-bold text-sm truncate text-foreground">{l.name}</p>
                                    {l.phone && <p className="text-xs text-muted-foreground truncate">{l.phone}</p>}
                                  </div>
                                  <div className="shrink-0 flex items-center gap-2">
                                    <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                                      {l.status}
                                    </span>
                                    {l.budget && <span className="font-semibold text-xs whitespace-nowrap">${Number(l.budget).toLocaleString()}</span>}
                                  </div>
                                </div>
                              ))}
                              {allLeads.length === 0 && <p className="text-xs text-center text-muted-foreground py-4">Cargando prospectos...</p>}
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <input type="text" className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm" value={newLeadData.name} onChange={e => setNewLeadData({...newLeadData, name: e.target.value})} placeholder="Nombre" />
                            <input type="tel" className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm" value={newLeadData.phone} onChange={e => setNewLeadData({...newLeadData, phone: e.target.value})} placeholder="Teléfono" />
                            <input type="email" className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm" value={newLeadData.email} onChange={e => setNewLeadData({...newLeadData, email: e.target.value})} placeholder="Correo (opcional)" />
                            <input type="number" className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm" value={newLeadData.budget} onChange={e => setNewLeadData({...newLeadData, budget: e.target.value})} placeholder="Presupuesto (opcional)" />
                          </div>
                        )}
                        <div className="flex justify-end gap-2 pt-2">
                          <button onClick={() => setShowAddLead(false)} className="px-4 py-2 text-xs font-semibold hover:bg-background rounded-xl transition-colors">Cancelar</button>
                          <button onClick={handleCreateLead} disabled={isSaving || (addLeadMode === 'existing' && !selectedExistingLeadId) || (addLeadMode === 'new' && (!newLeadData.name || !newLeadData.phone))} className="px-4 py-2 text-xs font-semibold bg-primary text-primary-foreground rounded-xl disabled:opacity-50">Guardar</button>
                        </div>
                      </div>
                    )}
                    
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
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                          <ListTodo className="w-6 h-6 text-primary" />
                        </div>
                        <button onClick={() => setShowAddTask(!showAddTask)} className="p-2 hover:bg-muted rounded-full transition-colors">
                          {showAddTask ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5 text-primary" />}
                        </button>
                      </div>
                      <h4 className="font-bold text-lg mb-4">Tareas Pendientes</h4>

                      {showAddTask && (
                        <div className="mb-4 p-3 bg-muted rounded-2xl border border-border space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                          <h5 className="font-bold text-sm text-foreground">Añadir Nueva Tarea</h5>
                          <input type="text" className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm" value={newTaskData.title} onChange={e => setNewTaskData({...newTaskData, title: e.target.value})} placeholder="Título de la tarea" />
                          <select className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm" value={newTaskData.leadId} onChange={e => setNewTaskData({...newTaskData, leadId: e.target.value})}>
                            <option value="">Seleccionar Prospecto (Opcional)</option>
                            {(property.leads || []).map(lead => (
                              <option key={lead.id} value={lead.id}>{lead.name}</option>
                            ))}
                          </select>
                          <input type="date" className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm" value={newTaskData.dueDate} onChange={e => setNewTaskData({...newTaskData, dueDate: e.target.value})} />
                          <div className="flex justify-end gap-2 pt-2">
                            <button onClick={() => setShowAddTask(false)} className="px-3 py-1.5 text-xs font-semibold hover:bg-background rounded-lg transition-colors">Cancelar</button>
                            <button onClick={handleCreateTask} disabled={isSaving || !newTaskData.title} className="px-3 py-1.5 text-xs font-semibold bg-primary text-primary-foreground rounded-lg disabled:opacity-50">Guardar</button>
                          </div>
                        </div>
                      )}

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
                      
                      {editingSection === 'owner' ? (
                        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                          <div className="bg-muted/30 p-3 rounded-xl border border-border mb-2">
                            <label className="text-xs font-semibold text-muted-foreground block mb-2">Vincular desde Prospectos</label>
                            <div className="relative">
                              <button
                                type="button"
                                onClick={async () => {
                                  if (allLeads.length === 0) {
                                    try {
                                      const res = await fetch('/api/leads');
                                      if (res.ok) setAllLeads(await res.json());
                                    } catch (error) {}
                                  }
                                  setIsLeadDropdownOpen(!isLeadDropdownOpen);
                                }}
                                className="w-full flex items-center justify-between bg-background border border-border rounded-xl px-3 py-2 text-sm text-left focus:outline-none focus:ring-2 focus:ring-primary/20"
                              >
                                <span className="text-muted-foreground">Seleccionar un prospecto...</span>
                                <ChevronDown className={`w-4 h-4 transition-transform ${isLeadDropdownOpen ? 'rotate-180' : ''}`} />
                              </button>
                              
                              {isLeadDropdownOpen && (
                                <div className="absolute z-50 w-full mt-2 bg-background border border-border rounded-xl shadow-lg max-h-64 overflow-y-auto overflow-x-auto">
                                  <table className="w-full text-sm min-w-[300px]">
                                    <thead className="bg-muted/50 text-muted-foreground text-xs sticky top-0 z-10">
                                      <tr>
                                        <th className="px-3 py-2 text-left font-medium">Nombre y Contacto</th>
                                        <th className="px-3 py-2 text-left font-medium">Estado</th>
                                        <th className="px-3 py-2 text-left font-medium">Presupuesto</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                      {allLeads.length === 0 ? (
                                        <tr>
                                          <td colSpan={3} className="px-3 py-4 text-center text-muted-foreground">Cargando prospectos...</td>
                                        </tr>
                                      ) : allLeads.map(lead => (
                                        <tr 
                                          key={lead.id} 
                                          className="hover:bg-muted/50 cursor-pointer transition-colors"
                                          onClick={() => {
                                            setFormData(prev => ({
                                              ...prev,
                                              ownerName: lead.name || '',
                                              ownerPhone: lead.phone || '',
                                              ownerEmail: lead.email || '',
                                              ownerNotes: lead.notes || ''
                                            }));
                                            setIsLeadDropdownOpen(false);
                                          }}
                                        >
                                          <td className="px-3 py-3">
                                            <div className="flex items-center gap-3">
                                              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                                                {lead.name ? lead.name.charAt(0).toUpperCase() : '?'}
                                              </div>
                                              <div>
                                                <p className="font-semibold text-foreground leading-tight">{lead.name}</p>
                                                {lead.phone && <p className="text-xs text-muted-foreground mt-0.5">{lead.phone}</p>}
                                              </div>
                                            </div>
                                          </td>
                                          <td className="px-3 py-3">
                                            <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap">
                                              {lead.status}
                                            </span>
                                          </td>
                                          <td className="px-3 py-3 font-medium whitespace-nowrap">
                                            {lead.budget ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(Number(lead.budget)) : '-'}
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              )}
                            </div>
                          </div>
                          <input id="ownerNameInput" type="text" className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm" value={formData.ownerName || ''} onChange={e => setFormData({...formData, ownerName: e.target.value})} placeholder="Nombre del Propietario" />
                          <div className="flex gap-3">
                            <input type="tel" className="flex-1 bg-background border border-border rounded-xl px-3 py-2 text-sm" value={formData.ownerPhone || ''} onChange={e => setFormData({...formData, ownerPhone: e.target.value})} placeholder="Teléfono" />
                            <input type="email" className="flex-1 bg-background border border-border rounded-xl px-3 py-2 text-sm" value={formData.ownerEmail || ''} onChange={e => setFormData({...formData, ownerEmail: e.target.value})} placeholder="Correo Electrónico" />
                          </div>
                          <textarea className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm h-24 resize-none" value={formData.ownerNotes || ''} onChange={e => setFormData({...formData, ownerNotes: e.target.value})} placeholder="Notas Internas sobre el propietario"></textarea>
                          <div className="flex justify-end gap-2 pt-2">
                            <button onClick={() => setEditingSection(null)} className="px-4 py-2 text-sm font-semibold hover:bg-muted rounded-xl transition-colors">Cancelar</button>
                            <button onClick={() => handleSaveSection(['ownerName', 'ownerPhone', 'ownerEmail', 'ownerNotes'])} disabled={isSaving} className="px-4 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-xl flex items-center gap-2">
                              <Save className="w-4 h-4" /> Guardar
                            </button>
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
                        <div key={i} className="flex gap-2 items-center">
                          {url && (
                            <div className="w-12 h-12 shrink-0 rounded-lg overflow-hidden border border-border bg-muted flex items-center justify-center relative">
                              <DriveImagePreview url={url} thumbnails={driveThumbnails} alt={`Preview ${i}`} className="w-full h-full object-cover pointer-events-none" />
                            </div>
                          )}
                          <input value={url} onChange={(e) => {
                            const newList = [...legalDocsList]; newList[i] = e.target.value; setLegalDocsList(newList);
                          }} placeholder="https://..." className="flex-1 p-3 rounded-xl border border-border outline-none" />
                          <button onClick={() => setLegalDocsList(legalDocsList.filter((_, idx) => idx !== i))} className="p-3 bg-destructive/10 text-destructive rounded-xl"><Trash2 className="w-5 h-5"/></button>
                        </div>
                      ))}
                      <div className="flex gap-4">
                        <button onClick={() => setLegalDocsList([...legalDocsList, ''])} className="text-sm font-semibold text-primary flex items-center gap-1 hover:underline"><Plus className="w-4 h-4"/> Añadir URL</button>
                        <GoogleDrivePicker onFileSelect={(url, thumb) => {
                          setLegalDocsList(prev => [...prev, url]);
                          if (thumb) setDriveThumbnails(prev => ({...prev, [url]: thumb}));
                        }} />
                        <label className={`text-sm font-semibold flex items-center gap-1 cursor-pointer ${isUploading ? 'text-gray-400' : 'text-primary hover:underline'}`}>
                          {isUploading ? <Loader2 className="w-4 h-4 animate-spin"/> : <Upload className="w-4 h-4"/>} 
                          {isUploading ? 'Subiendo...' : 'Subir Archivo'}
                          <input 
                            type="file" 
                            accept="image/*,application/pdf" 
                            multiple
                            className="hidden" 
                            onChange={(e) => { handleFileUpload(e.target.files, setLegalDocsList); e.target.value = ''; }} 
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
                            <p className="text-xs text-muted-foreground leading-tight">Recorrido físico con cliente &quot;Carlos Ruiz&quot;.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <MortgageCalculator price={Number(property.price)} />
              </div>
            )}

            {activeTab === 'presentacion' && (
              <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm flex h-[800px] flex-row animate-in fade-in slide-in-from-bottom-4">
                {/* Chat Column */}
                <div className="w-1/3 border-r border-border bg-muted/10 flex flex-col h-full relative z-10">
                  <div className="p-4 border-b border-border bg-background flex justify-between items-center shrink-0">
                    <div>
                      <h3 className="font-bold flex items-center gap-2"><Sparkles className="w-5 h-5 text-primary"/> Asistente de Diseño</h3>
                      <p className="text-xs text-muted-foreground">Desarrollado con Gemini</p>
                    </div>
                    <select 
                      value={selectedModel} 
                      onChange={(e) => setSelectedModel(e.target.value)}
                      className="text-sm bg-muted rounded-lg px-2 py-1 outline-none border border-border"
                    >
                      <option>Gemini 3.5 Flash</option>
                      <option>Gemini 3.1 Pro (High)</option>
                      <option>Gemini 3.1 Pro</option>
                      <option>Gemini 3.0 Ultra</option>
                    </select>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {chatMessages.length === 0 && (
                      <div className="text-center p-6 bg-muted/50 rounded-2xl">
                        <Sparkles className="w-8 h-8 text-primary mx-auto mb-3" />
                        <h4 className="font-bold text-sm mb-2">¡Hola! Soy tu Asistente de Diseño.</h4>
                        <p className="text-xs text-muted-foreground">Puedo crear una presentación espectacular basada en las características de esta propiedad. ¿Qué enfoque quieres darle? (Ej: &quot;Enfocado en inversionistas&quot;, &quot;Hazlo ideal para familias&quot;).</p>
                      </div>
                    )}
                    {chatMessages.map((msg, i) => (
                      <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] rounded-2xl p-3 text-sm ${msg.role === 'user' ? 'bg-primary text-primary-foreground rounded-tr-sm' : 'bg-muted rounded-tl-sm'}`}>
                          {msg.parts.map((part: any, pIdx: number) => {
                            if (part.text) {
                              return <p key={pIdx} className="mb-1">{part.text}</p>;
                            }
                            if (part.inlineData) {
                              if (part.inlineData.mimeType.startsWith('image/')) {
                                return (
                                  <div key={pIdx} className="mt-2 mb-1">
                                    <img src={`data:${part.inlineData.mimeType};base64,${part.inlineData.data}`} className="w-32 h-32 object-cover rounded-lg border border-primary/20" alt="Adjunto" />
                                  </div>
                                );
                              }
                              return (
                                <div key={pIdx} className="mt-2 mb-1 flex items-center gap-1 bg-background/20 px-2 py-1 rounded text-xs">
                                  <FileText className="w-3 h-3" /> Archivo ({part.inlineData.mimeType})
                                </div>
                              );
                            }
                            return null;
                          })}
                        </div>
                      </div>
                    ))}
                    {isChatLoading && (
                      <div className="flex justify-start">
                        <div className="bg-muted rounded-2xl rounded-tl-sm p-3 text-sm flex items-center gap-2 text-muted-foreground">
                          <Loader2 className="w-4 h-4 animate-spin" /> Escribiendo y diseñando...
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4 bg-background border-t border-border shrink-0">
                    <form onSubmit={async (e) => {
                      e.preventDefault();
                      if (!chatInput.trim() && chatAttachments.length === 0) return;
                      const parts: any[] = [];
                      if (chatInput.trim()) parts.push({ text: chatInput });
                      else parts.push({ text: "Analiza estos archivos." });
                      
                      chatAttachments.forEach(att => {
                        parts.push({ inlineData: { data: att.data, mimeType: att.mimeType } });
                      });

                      const newMessages = [...chatMessages, { role: 'user', parts }];
                      setChatMessages(newMessages);
                      setChatInput('');
                      const currentAtts = [...chatAttachments];
                      setChatAttachments([]);
                      setIsChatLoading(true);
                      
                      try {
                        const res = await fetch(`/api/properties/${property.id}/presentation-chat`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            message: chatInput,
                            attachments: currentAtts,
                            history: chatMessages,
                            model: selectedModel,
                            propertyContext: {
                              title: property.title,
                              location: property.location,
                              price: property.price,
                              area: property.area,
                              bedrooms: property.bedrooms,
                              bathrooms: property.bathrooms,
                              images: imagesList,
                              dynamicFeatures: dynamicFeatures
                            }
                          })
                        });
                        const data = await res.json();
                        const updatedMessages = [...newMessages, { role: 'model', parts: [{ text: data.message }] }];
                        setChatMessages(updatedMessages);
                        
                        if (data.presentationData) {
                          setPresentationDataPreview(data.presentationData);
                          // Auto save dynamicFeatures
                          const updatedDynamic = { 
                            ...dynamicFeatures, 
                            aiPresentation: data.presentationData,
                            presentationChatHistory: updatedMessages
                          };
                          setDynamicFeatures(updatedDynamic);
                          
                          // Optional: call save in background
                          await fetch(`/api/properties/${property.id}`, {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ dynamicFeatures: JSON.stringify(updatedDynamic) })
                          });
                        }
                      } catch (error) {
                        console.error(error);
                        setChatMessages([...newMessages, { role: 'model', parts: [{ text: 'Hubo un error al comunicarme con Gemini.' }] }]);
                      } finally {
                        setIsChatLoading(false);
                      }
                    }} className="flex items-end gap-2 relative">
                      <div className="flex flex-col gap-2 w-full">
                        {chatAttachments.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-2">
                            {chatAttachments.map((att, i) => (
                              <div key={i} className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md text-xs border border-border">
                                <span className="truncate max-w-[100px]">{att.name}</span>
                                <button type="button" onClick={() => setChatAttachments(prev => prev.filter((_, idx) => idx !== i))} className="text-muted-foreground hover:text-foreground"><X className="w-3 h-3"/></button>
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="flex items-end gap-2 relative w-full">
                          <input type="file" ref={fileInputRef} className="hidden" multiple accept="image/*,application/pdf" onChange={(e) => {
                            const files = Array.from(e.target.files || []);
                            if (!files.length) return;
                            Promise.all(files.map(file => new Promise<any>((resolve, reject) => {
                              const reader = new FileReader();
                              reader.onload = () => resolve({ name: file.name, data: (reader.result as string).split(',')[1], mimeType: file.type });
                              reader.onerror = reject;
                              reader.readAsDataURL(file);
                            }))).then(atts => setChatAttachments(prev => [...prev, ...atts]));
                            if (fileInputRef.current) fileInputRef.current.value = '';
                          }} />
                          <button type="button" onClick={() => fileInputRef.current?.click()} className="p-3 text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-colors shrink-0" title="Adjuntar archivos"><Paperclip className="w-5 h-5"/></button>
                      <textarea
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="Pide un diseño, ej. 'Genera una presentación para una familia'..."
                        className="flex-1 bg-muted resize-none rounded-xl border-none outline-none p-3 text-sm focus:ring-2 focus:ring-primary/20 min-h-[50px] max-h-[120px]"
                        rows={1}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            e.currentTarget.form?.requestSubmit();
                          }
                        }}
                      />
                      <button type="submit" disabled={isChatLoading || (!chatInput.trim() && chatAttachments.length === 0)} className="p-3 bg-primary text-primary-foreground rounded-xl disabled:opacity-50 shrink-0">
                        <Send className="w-4 h-4" />
                      </button>
                      </div>
                      </div>
                    </form>
                  </div>
                </div>
                
                {/* Preview Column */}
                <div className="w-2/3 bg-gray-100 overflow-y-auto relative hidden md:block">
                  {presentationDataPreview ? (
                    <div className="origin-top scale-[0.65] md:scale-[0.8] transition-transform w-[150%] xl:w-full xl:scale-100 p-8 flex flex-col gap-8">
                       <PresentationRenderer data={presentationDataPreview} />
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground p-8 text-center bg-[#faf9f6]">
                      <div className="w-32 h-32 opacity-10 mb-6 bg-[url('/logo.png')] bg-contain bg-center bg-no-repeat grayscale"></div>
                      <h3 className="font-bold text-xl mb-2">No hay diseño generado</h3>
                      <p className="max-w-sm">Escríbele al Asistente de Diseño para crear una presentación espectacular basada en esta propiedad.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'comisiones' && (
              <PropertyCommissions property={property} onSave={fetchProperty} />
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

          <div className="w-full max-w-6xl h-[85vh] p-4 flex items-center justify-center relative" onClick={() => setIsLightboxOpen(false)}>
            <DriveImagePreview 
              url={imagesList[currentImageIndex]} 
              thumbnails={driveThumbnails}
              alt={`Imagen ${currentImageIndex + 1}`} 
              className="object-contain rounded-lg shadow-2xl p-4" 
              onClick={(e) => e.stopPropagation()}
            />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-md">
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

